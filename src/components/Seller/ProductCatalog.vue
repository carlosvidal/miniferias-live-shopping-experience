<!-- src/components/Seller/ProductCatalog.vue -->
<template>
    <div class="product-catalog">
        <div class="actions">
            <button @click="showAddProductModal = true">Añadir Nuevo Producto</button>
        </div>

        <div v-if="loading">Cargando productos...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="products.length === 0">No hay productos en el catálogo.</div>
        <div v-else class="product-grid">
            <div v-for="product in products" :key="product.id" class="product-card">
                <img :src="product.imageUrl" :alt="product.name">
                <h3>{{ product.name }}</h3>
                <p>{{ product.description }}</p>
                <p>Precio: ${{ product.price.toFixed(2) }}</p>
                <p>Stock: {{ product.stock }}</p>
                <div class="product-actions">
                    <button @click="editProduct(product)">Editar</button>
                    <button @click="deleteProduct(product.id)">Eliminar</button>
                </div>
            </div>
        </div>

        <Modal v-model="showAddProductModal">
            <ProductForm @submit="addProduct" @cancel="showAddProductModal = false" />
        </Modal>

        <Modal v-model="showEditProductModal">
            <ProductForm :product="productToEdit" @submit="updateProduct" @cancel="showEditProductModal = false" />
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import Modal from '@/components/Common/Modal.vue';
import ProductForm from '@/components/Seller/ProductForm.vue';

const props = defineProps({
    sellerId: {
        type: String,
        required: true
    }
});

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const showAddProductModal = ref(false);
const showEditProductModal = ref(false);
const productToEdit = ref(null);

const fetchProducts = async () => {
    if (!props.sellerId) {
        console.log('No sellerId provided, skipping product fetch');
        loading.value = false;
        return;
    }

    loading.value = true;
    error.value = null;
    try {
        console.log('Fetching products for sellerId:', props.sellerId);
        const q = query(collection(db, 'products'), where('sellerId', '==', props.sellerId));
        const querySnapshot = await getDocs(q);
        products.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log('Products fetched:', products.value);
    } catch (err) {
        console.error('Error fetching products:', err);
        error.value = 'Error al cargar los productos. Por favor, intenta de nuevo.';
    } finally {
        loading.value = false;
    }
};

const addProduct = async (newProduct) => {
    try {
        const docRef = await addDoc(collection(db, 'products'), {
            ...newProduct,
            sellerId: props.sellerId
        });
        const addedProduct = { id: docRef.id, ...newProduct, sellerId: props.sellerId };
        products.value.push(addedProduct);
        showAddProductModal.value = false;
    } catch (error) {
        console.error('Error adding product:', error);
        // Manejar el error (mostrar un mensaje al usuario, etc.)
    }
};

const editProduct = (product) => {
    productToEdit.value = { ...product };
    showEditProductModal.value = true;
};

const updateProduct = async (updatedProduct) => {
    try {
        await updateDoc(doc(db, 'products', updatedProduct.id), updatedProduct);
        const index = products.value.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
            products.value[index] = updatedProduct;
        }
        showEditProductModal.value = false;
    } catch (error) {
        console.error('Error updating product:', error);
        // Manejar el error
    }
};

const deleteProduct = async (productId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            await deleteDoc(doc(db, 'products', productId));
            products.value = products.value.filter(p => p.id !== productId);
        } catch (error) {
            console.error('Error deleting product:', error);
            // Manejar el error
        }
    }
};

onMounted(fetchProducts);
</script>

<style scoped>
.product-catalog {
    /* ... estilos existentes ... */
}

.actions {
    margin-bottom: 20px;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}

.product-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
}

.product-actions {
    margin-top: 10px;
}

.product-actions button {
    margin-right: 5px;
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.product-actions button:last-child {
    background-color: #f44336;
}
</style>