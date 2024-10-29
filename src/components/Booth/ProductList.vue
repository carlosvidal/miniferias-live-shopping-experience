<!-- src/components/Booth/ProductList.vue -->
<template>
    <div class="product-list">
        <h2>Productos en venta</h2>
        <div v-if="loading">Cargando productos...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="products.length === 0">No se encontraron productos.</div>
        <div v-else class="products-grid">
            <div v-for="product in products" :key="product.id" class="product-card">
                <img :src="product.imageUrl" :alt="product.name" class="product-image">
                <h3>{{ product.name }}</h3>
                <p>{{ product.description }}</p>
                <p class="price">Precio: ${{ product.price.toFixed(2) }}</p>
                <p>Stock: {{ product.stock }}</p>
                <!-- Aquí puedes agregar botones de acción, como "Añadir al carrito" -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';

const props = defineProps({
    sellerId: {
        type: String,
        required: true
    }
});

const products = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchProducts = async () => {
    try {
        const q = query(collection(db, 'products'), where('sellerId', '==', props.sellerId));
        const querySnapshot = await getDocs(q);
        products.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(`Productos recuperados para el vendedor ${props.sellerId}:`, products.value);
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        error.value = 'Error al cargar los productos. Por favor, intente de nuevo más tarde.';
    } finally {
        loading.value = false;
    }
};

onMounted(fetchProducts);
</script>

<style scoped>
.product-list {
    margin-top: 20px;
}

.products-grid {
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

.product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
}

.price {
    font-weight: bold;
    color: #4CAF50;
}
</style>