<template>
  <div class="card h-100 shadow-sm product-card">
    <!-- Contenedor de imagen con relación de aspecto fija -->
    <div class="image-container">
      <img :src="product.image" 
           :alt="product.title"
           class="card-img-top product-image"
           @error="handleImageError"
           loading="lazy">
      <!-- Badge de categoría superpuesto -->
      <span :class="`category-badge ${getCategoryBadge(product.category)}`">
        {{ getCategoryName(product.category) }}
      </span>
    </div>
    
    <div class="card-body d-flex flex-column p-3">
      <!-- Título truncado -->
      <h5 class="card-title text-truncate mb-2" :title="product.title">
        {{ product.title }}
      </h5>
      
      <!-- Descripción truncada -->
      <p class="card-text description-text flex-grow-1 mb-3">
        {{ truncateDescription(product.description) }}
      </p>
      
      <!-- Precio y acciones -->
      <div class="mt-auto">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span class="text-muted small">Precio:</span>
            <p class="h4 text-primary-custom fw-bold mb-0">
              ${{ product.price.toFixed(2) }}
            </p>
          </div>
          <div v-if="product.stock !== undefined" class="text-end">
            <span class="text-muted small">Stock:</span>
            <p :class="`mb-0 fw-bold ${getStockClass(product.stock)}`">
              {{ product.stock }} unidades
            </p>
          </div>
        </div>
        
        <!-- Botones de acción -->
        <div class="btn-group w-100" role="group">
          <button class="btn btn-outline-primary btn-action" 
                  @click="$emit('edit', product)"
                  title="Editar producto">
            <i class="bi bi-pencil-square me-1"></i>
            <span class="d-none d-md-inline">Editar</span>
          </button>
          <button class="btn btn-outline-danger btn-action" 
                  @click="$emit('delete', product)"
                  title="Eliminar producto">
            <i class="bi bi-trash me-1"></i>
            <span class="d-none d-md-inline">Eliminar</span>
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
      if (!description) return 'Sin descripción disponible';
      const maxLength = 80;
      return description.length > maxLength 
        ? description.substring(0, maxLength) + '...' 
        : description;
    },
    
    getCategoryName(category) {
      const categories = {
        'juguetes': 'Juguetes',
        'lenceria': 'Lencería',
        'cosmetica': 'Cosmética',
        'cuidado': 'Cuidado'
      };
      return categories[category] || category;
    },
    
    getCategoryBadge(category) {
      const badges = {
        'juguetes': 'badge-juguetes',
        'lenceria': 'badge-lenceria',
        'cosmetica': 'badge-cosmetica',
        'cuidado': 'badge-cuidado'
      };
      return badges[category] || 'badge-default';
    },
    
    getStockClass(stock) {
      if (stock === 0) return 'text-danger';
      if (stock < 5) return 'text-warning';
      return 'text-success';
    },
    
    handleImageError(event) {
      console.log('Error cargando imagen para:', this.product.title);
      
      const defaultImages = {
        'juguetes': 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd61e?w=400&h=300&fit=crop',
        'lenceria': 'https://images.unsplash.com/photo-1585487000160-6eb9ce6b5a73?w=400&h=300&fit=crop',
        'cosmetica': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
        'cuidado': 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400&h=300&fit=crop'
      };
      
      const category = this.product.category;
      const defaultImage = defaultImages[category] || 
        `https://via.placeholder.com/400x300/8B008B/FFFFFF?text=${encodeURIComponent(this.product.title.substring(0, 15))}`;
      
      event.target.src = defaultImage;
      event.target.onerror = null;
    }
  }
}
</script>

<style scoped>
.product-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(139, 0, 139, 0.15);
  border-color: var(--primary-color);
}

/* Contenedor de imagen con relación de aspecto 4:3 */
.image-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
  background-color: #f8f9fa;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Badge de categoría */
.category-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  z-index: 10;
}

.badge-juguetes {
  background-color: #FF6B6B;
}

.badge-lenceria {
  background-color: #4ECDC4;
}

.badge-cosmetica {
  background-color: #FFD166;
  color: #333;
}

.badge-cuidado {
  background-color: #06D6A0;
}

.badge-default {
  background-color: var(--primary-color);
}

/* Títulos y texto */
.card-title {
  color: #333;
  font-weight: 700;
  font-size: 1.1rem;
  min-height: 2.5rem;
  line-height: 1.3;
}

.description-text {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  min-height: 4rem;
}

/* Botones de acción */
.btn-action {
  padding: 8px 12px;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-action:hover {
  transform: translateY(-2px);
}

.btn-group .btn {
  flex: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .card-title {
    font-size: 1rem;
  }
  
  .btn-action {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
  
  .category-badge {
    font-size: 0.7rem;
    padding: 4px 8px;
  }
}
</style>