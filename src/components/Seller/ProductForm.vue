<!-- src/components/Seller/ProductForm.vue -->
<template>
    <form @submit.prevent="handleSubmit" class="product-form">
        <div>
            <label for="name">Nombre del Producto:</label>
            <input id="name" v-model="formData.name" required>
        </div>
        <div>
            <label for="description">Descripción:</label>
            <textarea id="description" v-model="formData.description" required></textarea>
        </div>
        <div>
            <label for="price">Precio:</label>
            <input id="price" v-model.number="formData.price" type="number" step="0.01" required>
        </div>
        <div>
            <label for="stock">Stock:</label>
            <input id="stock" v-model.number="formData.stock" type="number" required>
        </div>
        <div>
            <label for="imageUrl">URL de la Imagen:</label>
            <input id="imageUrl" v-model="formData.imageUrl" required>
        </div>
        <div class="form-actions">
            <button type="submit">{{ product ? 'Actualizar' : 'Crear' }} Producto</button>
            <button type="button" @click="$emit('cancel')">Cancelar</button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    product: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: ''
});

onMounted(() => {
    if (props.product) {
        formData.value = { ...props.product };
    }
});

const handleSubmit = () => {
    emit('submit', formData.value);
};
</script>

<style scoped>
.product-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.product-form div {
    display: flex;
    flex-direction: column;
}

.product-form label {
    margin-bottom: 5px;
}

.product-form input,
.product-form textarea {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.form-actions button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.form-actions button[type="submit"] {
    background-color: #4CAF50;
    color: white;
}

.form-actions button[type="button"] {
    background-color: #f44336;
    color: white;
}
</style>