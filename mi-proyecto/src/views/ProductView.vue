<template>
  <div class="product-view">
    <!-- Encabezado con filtros -->
    <div class="row mb-4">
      <div class="col-md-8">
        <div class="d-flex align-items-center p-3 bg-white rounded shadow-sm">
          <h2 class="text-primary-custom mb-0 me-4">
            <i class="bi bi-bag me-2"></i>Gestión de Productos
          </h2>
          
          <!-- Filtro por categoría -->
          <div class="dropdown">
            <button class="btn btn-outline-primary dropdown-toggle" type="button" 
              data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-filter me-2"></i>
              {{ selectedCategory === 'all' ? 'Todas las categorías' : getCategoryName(selectedCategory) }}
            </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="#" @click.prevent="selectCategory('all')">
                  <i class="bi bi-grid-3x3-gap me-2"></i>Todas las categorías
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li v-for="category in categories" :key="category.value">
                <a class="dropdown-item" href="#" @click.prevent="selectCategory(category.value)">
                  <i :class="category.icon" class="me-2"></i>{{ category.label }}
                </a>
              </li>
            </ul>
          </div>
          
          <!-- Contador de productos -->
          <div class="ms-4">
            <span class="badge bg-primary-custom">
              {{ filteredProducts.length }} producto{{ filteredProducts.length !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="d-flex justify-content-end">
          <button class="btn btn-primary-custom btn-lg" @click="showAddModal = true">
            <i class="bi bi-plus-circle me-2"></i><strong>Agregar Producto</strong>
          </button>
        </div>
      </div>
    </div>

    <!-- Alertas Bootstrap -->
    <div v-if="alert.show" :class="`alert alert-${alert.type} alert-dismissible fade show`" role="alert">
      <i :class="alert.icon" class="me-2"></i>
      {{ alert.message }}
      <button type="button" class="btn-close" @click="alert.show = false"></button>
    </div>

    <!-- Estados de carga -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary-custom" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">Cargando productos...</p>
    </div>

    <!-- Sin productos -->
    <div v-else-if="products.length === 0" class="text-center py-5 bg-light rounded">
      <i class="bi bi-bag-x text-muted" style="font-size: 3rem;"></i>
      <h4 class="text-muted mt-3">No hay productos</h4>
      <p class="text-muted">Comienza agregando tu primer producto al catálogo</p>
      <button class="btn btn-primary-custom btn-lg" @click="showAddModal = true">
        <i class="bi bi-plus-circle me-2"></i>Agregar Primer Producto
      </button>
    </div>

    <!-- Mensaje cuando no hay productos en la categoría seleccionada -->
    <div v-else-if="filteredProducts.length === 0 && selectedCategory !== 'all'" 
      class="text-center py-5 bg-light rounded">
      <i class="bi bi-emoji-frown text-muted" style="font-size: 3rem;"></i>
      <h4 class="text-muted mt-3">No hay productos en esta categoría</h4>
      <p class="text-muted">No se encontraron productos en "{{ getCategoryName(selectedCategory) }}"</p>
      <button class="btn btn-primary-custom" @click="selectCategory('all')">
        <i class="bi bi-eye me-2"></i>Ver todos los productos
      </button>
    </div>

    <!-- Lista de productos filtrados -->
    <div v-else class="row">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="col-md-6 col-lg-4 mb-4"
      >
        <ProductCardComponent 
          :product="product" 
          @edit="editProduct"
          @delete="confirmDeleteProduct"
        />
      </div>
    </div>

    <!-- Modal para agregar/editar producto  -->
    <div v-if="showAddModal || showEditModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary-custom text-white">
            <h5 class="modal-title">
              <i :class="showEditModal ? 'bi bi-pencil-square' : 'bi bi-plus-circle'" class="me-2"></i>
              {{ showEditModal ? 'Editar Producto' : 'Agregar Producto' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-bold">Nombre del Producto *</label>
                    <input v-model="currentProduct.title" class="form-control" 
                      placeholder="Ej: Vibrador Rabbit" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label fw-bold">Precio ($) *</label>
                    <input v-model="currentProduct.price" type="number" step="0.01" 
                      class="form-control" placeholder="0.00" min="0" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label fw-bold">Categoría *</label>
                    <select v-model="currentProduct.category" class="form-select" required>
                      <option v-for="category in categories" :key="category.value" :value="category.value">
                        {{ category.label }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-bold">URL de Imagen *</label>
                    <input v-model="currentProduct.image" class="form-control" 
                      placeholder="https://..." required>
                    <small class="text-muted">
                      Usa un servicio como imgbb.com o placehold.co
                    </small>
                    <div v-if="currentProduct.image" class="mt-2">
                      <img :src="currentProduct.image" alt="Vista previa" 
                        class="img-thumbnail" style="max-height: 100px;">
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label fw-bold">Descripción *</label>
                    <textarea v-model="currentProduct.description" class="form-control" 
                      rows="4" placeholder="Describe el producto..." required></textarea>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">
                  <i class="bi bi-x-circle me-1"></i>Cancelar
                </button>
                <button type="submit" class="btn btn-primary-custom" :disabled="saving">
                  <span v-if="saving">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </span>
                  <span v-else>
                    <i class="bi bi-check-circle me-1"></i>
                    {{ showEditModal ? 'Actualizar' : 'Guardar' }}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar  -->
    <div v-if="showDeleteModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>Confirmar Eliminación
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de eliminar el producto <strong>{{ productToDelete?.title }}</strong>?</p>
            <p class="text-danger">
              <i class="bi bi-info-circle me-1"></i>
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteProduct" :disabled="deleting">
              <span v-if="deleting">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Eliminando...
              </span>
              <span v-else>
                <i class="bi bi-trash me-1"></i>Eliminar
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productService } from '../services/apiService'
import ProductCardComponent from '../components/ProductCardComponent.vue'

export default {
  name: 'ProductView',
  components: {
    ProductCardComponent
  },
  data() {
    return {
      products: [],
      filteredProducts: [],
      loading: false,
      saving: false,
      deleting: false,
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      productToDelete: null,
      selectedCategory: 'all',
      currentProduct: {
        title: '',
        price: 0,
        description: '',
        image: '',
        category: 'juguetes'
      },
      categories: [
        { value: 'juguetes', label: '🎮 Juguetes Íntimos', icon: 'bi-controller' },
        { value: 'lenceria', label: '👙 Lencería', icon: 'bi-heart' },
        { value: 'cosmetica', label: '💄 Cosmética Íntima', icon: 'bi-droplet' },
        { value: 'cuidado', label: '🧴 Cuidado Personal', icon: 'bi-bandaid' }
      ],
      alert: {
        show: false,
        type: 'success',
        icon: 'bi-check-circle',
        message: ''
      }
    }
  },
  computed: {
    // Contador por categoría para el dropdown
    categoryCounts() {
      const counts = { all: this.products.length }
      this.categories.forEach(cat => {
        counts[cat.value] = this.products.filter(p => p.category === cat.value).length
      })
      return counts
    }
  },
  async mounted() {
    await this.loadProducts()
  },
  watch: {
    // Actualizar productos filtrados cuando cambia la categoría seleccionada
    selectedCategory() {
      this.filterProducts()
    },
    // Actualizar productos filtrados cuando cambia la lista de productos
    products() {
      this.filterProducts()
    }
  },
  methods: {
    async loadProducts() {
      this.loading = true
      try {
        this.products = await productService.getProducts()
        this.filterProducts()
      } catch (error) {
        this.showAlert('danger', 'bi-exclamation-triangle', 'Error cargando productos')
        console.error('Error loading products:', error)
      } finally {
        this.loading = false
      }
    },
    
    filterProducts() {
      if (this.selectedCategory === 'all') {
        this.filteredProducts = [...this.products]
      } else {
        this.filteredProducts = this.products.filter(
          product => product.category === this.selectedCategory
        )
      }
    },
    
    selectCategory(category) {
      this.selectedCategory = category
    },
    
    getCategoryName(category) {
      const cat = this.categories.find(c => c.value === category)
      return cat ? cat.label.replace(/[^\w\s]/gi, '') : category
    },
    
    editProduct(product) {
      this.currentProduct = { ...product }
      this.showEditModal = true
    },
    
    confirmDeleteProduct(product) {
      this.productToDelete = product
      this.showDeleteModal = true
    },
    
    async deleteProduct() {
      if (!this.productToDelete) return
      
      this.deleting = true
      try {
        await productService.deleteProduct(this.productToDelete.id)
        await this.loadProducts()
        this.showAlert('success', 'bi-trash', 'Producto eliminado correctamente')
      } catch (error) {
        this.showAlert('danger', 'bi-exclamation-triangle', 'Error eliminando producto')
        console.error('Error deleting product:', error)
      } finally {
        this.deleting = false
        this.showDeleteModal = false
        this.productToDelete = null
      }
    },
    
    async saveProduct() {
      // Validación
      if (!this.currentProduct.title || !this.currentProduct.description || !this.currentProduct.image) {
        this.showAlert('warning', 'bi-exclamation-triangle', 'Completa todos los campos')
        return
      }
      
      if (this.currentProduct.price <= 0) {
        this.showAlert('warning', 'bi-exclamation-triangle', 'El precio debe ser mayor a 0')
        return
      }
      
      this.saving = true
      try {
        if (this.showEditModal) {
          await productService.updateProduct(this.currentProduct.id, this.currentProduct)
          this.showAlert('success', 'bi-check-circle', 'Producto actualizado correctamente')
        } else {
          await productService.createProduct(this.currentProduct)
          this.showAlert('success', 'bi-plus-circle', 'Producto creado correctamente')
        }
        await this.loadProducts()
        this.closeModal()
      } catch (error) {
        this.showAlert('danger', 'bi-exclamation-triangle', 'Error guardando producto')
        console.error('Error saving product:', error)
      } finally {
        this.saving = false
      }
    },
    
    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.resetCurrentProduct()
    },
    
    resetCurrentProduct() {
      this.currentProduct = {
        title: '',
        price: 0,
        description: '',
        image: '',
        category: 'juguetes'
      }
    },
    
    showAlert(type, icon, message) {
      this.alert = {
        show: true,
        type,
        icon,
        message
      }
      setTimeout(() => {
        this.alert.show = false
      }, 5000)
    }
  }
}
</script>

<style scoped>
.product-view {
  padding: 20px;
  margin-top: 20px;
}

.dropdown-toggle {
  padding: 8px 16px;
  font-weight: 500;
}

.dropdown-menu {
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 10px 15px;
  border-radius: 5px;
  margin: 2px 5px;
}

.dropdown-item:hover {
  background-color: rgba(139, 0, 139, 0.1);
}

.dropdown-item.active {
  background-color: var(--primary-color);
  color: white;
}

.badge {
  font-size: 0.9rem;
  padding: 8px 12px;
  border-radius: 20px;
}

</style>