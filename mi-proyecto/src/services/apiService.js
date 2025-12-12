import axios from 'axios'

// Configuración base de Axios para MockAPI
const apiClient = axios.create({
  baseURL: 'https://6939f534c8d59937aa0970ca.mockapi.io/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// SERVICIO PARA USUARIOS
export const userService = {
  // Obtener todos los usuarios (para login y listado)
  async getUsers() {
    try {
      const response = await apiClient.get('/usuarios')
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Crear nuevo usuario
  async createUser(userData) {
    try {
      const response = await apiClient.post('/usuarios', userData)
      return response.data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  // Actualizar usuario
  async updateUser(id, userData) {
    try {
      const response = await apiClient.put(`/usuarios/${id}`, userData)
      return response.data
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  // Eliminar usuario
  async deleteUser(id) {
    try {
      const response = await apiClient.delete(`/usuarios/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  // Validar credenciales de login
  async validateCredentials(email, password) {
    try {
      const users = await this.getUsers()
      const user = users.find(u => u.email === email && u.password === password)
      return user || null
    } catch (error) {
      console.error('Error validating credentials:', error)
      return null
    }
  }
}

// SERVICIO PARA PRODUCTOS
export const productService = {
  // Obtener todos los productos
  async getProducts() {
    try {
      const response = await apiClient.get('/productos')
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  // Obtener un producto por ID
  async getProduct(id) {
    try {
      const response = await apiClient.get(`/productos/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  // Crear nuevo producto
  async createProduct(productData) {
    try {
      const response = await apiClient.post('/productos', productData)
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  // Actualizar producto
  async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(`/productos/${id}`, productData)
      return response.data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  // Eliminar producto
  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`/productos/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
}