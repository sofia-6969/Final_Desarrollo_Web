<template>
  <div class="user-view">
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
      <h2 class="text-primary-custom mb-0">
        <i class="bi bi-people me-2"></i>Gestión de Usuarios
      </h2>
      <button class="btn btn-primary-custom btn-lg" @click="showAddModal = true">
        <i class="bi bi-person-plus me-2"></i><strong>Agregar Usuario</strong>
      </button>
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
      <p class="mt-2 text-muted">Cargando usuarios...</p>
    </div>

    <!-- Tabla de usuarios -->
    <div v-else class="card shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-primary">
              <tr>
                <th><i class="bi bi-hash"></i> ID</th>
                <th><i class="bi bi-person"></i> Nombre</th>
                <th><i class="bi bi-envelope"></i> Email</th>
                <th><i class="bi bi-person-badge"></i> Rol</th>
                <th><i class="bi bi-calendar"></i> Fecha Creación</th>
                <th class="text-center"><i class="bi bi-gear"></i> Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="fw-bold">{{ user.id }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="user-avatar me-2">
                      <i class="bi bi-person-circle text-primary"></i>
                    </div>
                    <span>{{ user.name }}</span>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span :class="`badge ${getRoleBadge(user.role)}`">
                    {{ getRoleName(user.role) }}
                  </span>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" @click="editUser(user)" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger" 
                      @click="confirmDeleteUser(user)"
                      :disabled="isCurrentUser(user)"
                      :title="isCurrentUser(user) ? 'No puedes eliminar tu propio usuario' : 'Eliminar'"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Sin usuarios -->
        <div v-if="users.length === 0" class="text-center py-5">
          <i class="bi bi-people text-muted" style="font-size: 3rem;"></i>
          <h4 class="text-muted mt-3">No hay usuarios registrados</h4>
          <p class="text-muted">Comienza agregando el primer usuario</p>
          <button class="btn btn-primary-custom btn-lg" @click="showAddModal = true">
            <i class="bi bi-person-plus me-2"></i>Agregar Primer Usuario
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar usuario -->
    <div v-if="showAddModal || showEditModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary-custom text-white">
            <h5 class="modal-title">
              <i :class="showEditModal ? 'bi bi-pencil-square' : 'bi bi-person-plus'" class="me-2"></i>
              {{ showEditModal ? 'Editar Usuario' : 'Agregar Usuario' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label fw-bold">Nombre Completo *</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input v-model="currentUser.name" class="form-control" 
                    placeholder="Ej: María González" required>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label fw-bold">Email *</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input v-model="currentUser.email" type="email" class="form-control" 
                    placeholder="ejemplo@email.com" required>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label fw-bold">
                  {{ showEditModal ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña *' }}
                </label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input v-model="currentUser.password" type="password" class="form-control" 
                    :placeholder="showEditModal ? 'Solo llena para cambiar' : 'Ingresa contraseña'"
                    :required="!showEditModal">
                </div>
                <small class="text-muted">Mínimo 6 caracteres</small>
              </div>
              
              <div class="mb-3">
                <label class="form-label fw-bold">Rol *</label>
                <select v-model="currentUser.role" class="form-select" required>
                  <option value="admin">👑 Administrador</option>
                  <option value="vip">🔥 vip</option>
                  <option value="Quality assurance">✂️ Quality assurance</option>
                </select>
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

    <!-- Modal de confirmación para eliminar -->
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
            <p>¿Estás seguro de eliminar al usuario <strong>{{ userToDelete?.name }}</strong>?</p>
            <p class="text-danger">
              <i class="bi bi-info-circle me-1"></i>
              Esta acción no se puede deshacer. El usuario no podrá iniciar sesión nuevamente.
            </p>
            <div v-if="isCurrentUser(userToDelete)" class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i>
              ¡ADVERTENCIA! Estás intentando eliminar tu propio usuario.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="deleteUser" 
              :disabled="deleting || isCurrentUser(userToDelete)"
            >
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
import { userService } from '../services/apiService'

export default {
  name: 'UserView',
  data() {
    return {
      users: [],
      loading: false,
      saving: false,
      deleting: false,
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      userToDelete: null,
      currentUser: {
        name: '',
        email: '',
        password: '',
        role: 'vendedor'
      },
      alert: {
        show: false,
        type: 'success',
        icon: 'bi-check-circle',
        message: ''
      },
      currentUserEmail: ''
    }
  },
  async mounted() {
    await this.loadUsers()
    // Obtener email del usuario actual para validaciones
    const userData = sessionStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      this.currentUserEmail = user.email
    }
  },
  methods: {
    async loadUsers() {
      this.loading = true
      try {
        this.users = await userService.getUsers()
      } catch (error) {
        this.showAlert('danger', 'bi-exclamation-triangle', 'Error cargando usuarios')
        console.error('Error loading users:', error)
      } finally {
        this.loading = false
      }
    },
    
    editUser(user) {
      // No incluir la contraseña por seguridad
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: '', // Dejar vacío, solo se cambia si se ingresa nueva
        role: user.role || 'vendedor'
      }
      this.showEditModal = true
    },
    
    confirmDeleteUser(user) {
      this.userToDelete = user
      this.showDeleteModal = true
    },
    
    async deleteUser() {
      if (!this.userToDelete || this.isCurrentUser(this.userToDelete)) return
      
      this.deleting = true
      try {
        await userService.deleteUser(this.userToDelete.id)
        await this.loadUsers()
        this.showAlert('success', 'bi-trash', 'Usuario eliminado correctamente')
      } catch (error) {
        this.showAlert('danger', 'bi-exclamation-triangle', 'Error eliminando usuario')
        console.error('Error deleting user:', error)
      } finally {
        this.deleting = false
        this.showDeleteModal = false
        this.userToDelete = null
      }
    },
    
    async saveUser() {
      // Validación
      if (!this.currentUser.name || !this.currentUser.email) {
        this.showAlert('warning', 'bi-exclamation-triangle', 'Completa los campos obligatorios')
        return
      }
      
      if (!this.showEditModal && !this.currentUser.password) {
        this.showAlert('warning', 'bi-exclamation-triangle', 'La contraseña es obligatoria para nuevos usuarios')
        return
      }
      
      if (this.currentUser.password && this.currentUser.password.length < 6) {
        this.showAlert('warning', 'bi-exclamation-triangle', 'La contraseña debe tener al menos 6 caracteres')
        return
      }
      
      this.saving = true
      try {
        const userData = {
          name: this.currentUser.name,
          email: this.currentUser.email,
          role: this.currentUser.role,
          createdAt: this.currentUser.createdAt || new Date().toISOString().split('T')[0]
        }
        
        // Solo incluir password si se proporcionó
        if (this.currentUser.password) {
          userData.password = this.currentUser.password
        }
        
        if (this.showEditModal) {
          await userService.updateUser(this.currentUser.id, userData)
          this.showAlert('success', 'bi-check-circle', 'Usuario actualizado correctamente')
        } else {
          await userService.createUser(userData)
          this.showAlert('success', 'bi-plus-circle', 'Usuario creado correctamente')
        }
        
        await this.loadUsers()
        this.closeModal()
      } catch (error) {
        this.showAlert('danger', 'bi-exclamation-triangle', 'Error guardando usuario')
        console.error('Error saving user:', error)
      } finally {
        this.saving = false
      }
    },
    
    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.resetCurrentUser()
    },
    
    resetCurrentUser() {
      this.currentUser = {
        name: '',
        email: '',
        password: '',
        role: 'vendedor'
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
    },
    
    getRoleName(role) {
      const roles = {
        'admin': 'Administrador',
        'vendedor': 'Vendedor',
        'cliente': 'Cliente'
      }
      return roles[role] || role
    },
    
    getRoleBadge(role) {
      const badges = {
        'admin': 'bg-danger',
        'vendedor': 'bg-primary',
        'cliente': 'bg-secondary'
      }
      return badges[role] || 'bg-secondary'
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES')
    },
    
    isCurrentUser(user) {
      return user && user.email === this.currentUserEmail
    }
  }
}
</script>

<style scoped>
.user-view {
  padding: 20px;
  margin-top: 20px;
}

.table th {
  border-top: none;
  font-weight: 600;
}

.user-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.btn-group .btn {
  border-radius: 5px;
}

.table-hover tbody tr:hover {
  background-color: rgba(139, 0, 139, 0.05);
}
</style>