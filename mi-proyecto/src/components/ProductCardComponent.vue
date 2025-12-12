<template>
  <div class="card h-100 shadow-sm product-card">
    <img :src="product.image" class="card-img-top product-image" :alt="product.title"
      @error="handleImageError">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title text-truncate">{{ product.title }}</h5>
      <p class="card-text flex-grow-1">{{ truncateDescription(product.description) }}</p>
      <div class="mt-auto">
        <p class="h5 text-primary-custom mb-2">${{ product.price.toFixed(2) }}</p>
        <span class="badge bg-primary mb-3">{{ getCategoryName(product.category) }}</span>
        <div class="btn-group w-100">
          <button class="btn btn-outline-primary btn-sm" @click="$emit('edit', product)">
            <i class="bi bi-pencil me-1"></i>Editar
          </button>
          <button class="btn btn-outline-danger btn-sm" @click="$emit('delete', product)">
            <i class="bi bi-trash me-1"></i>Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCardComponent',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    truncateDescription(description) {
      if (!description) return 'Sin descripción'
      return description.length > 100 
        ? description.substring(0, 100) + '...' 
        : description
    },
    getCategoryName(category) {
      const categories = {
        'juguetes': 'Juguetes',
        'lenceria': 'Lencería',
        'cosmetica': 'Cosmética',
        'cuidado': 'Cuidado'
      }
      return categories[category] || category
    },
    handleImageError(event) {
      // Imagen por defecto si falla
      event.target.src = 'https://via.placeholder.com/300x300/8B008B/FFFFFF?text=Sin+Imagen'
    }
  }
}
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e0e0e0;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(139, 0, 139, 0.15);
}

.product-image {
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
  background-color: #f8f9fa;
}

.card-title {
  color: var(--primary-color);
  font-weight: 600;
  min-height: 3rem;
}

.btn-group .btn {
  flex: 1;
}
</style>