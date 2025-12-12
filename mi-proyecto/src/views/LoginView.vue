<template>
  <div class="login-container min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="card shadow-lg" style="width: 400px;">
      <div class="card-body p-5">
        <div class="text-center mb-4">
          <h2 class="text-primary-custom fw-bold">
            <i class="bi bi-fire me-2"></i>Intimacy Shop
          </h2>
          <p class="text-muted">Ingresa a tu cuenta</p>
        </div>
        
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">
              <i class="bi bi-envelope me-1"></i>Email
            </label>
            <input 
              type="email" 
              class="form-control" 
              id="email" 
              v-model="credentials.email"
              required
              placeholder="admin@intimacyshop.com"
              :disabled="loading"
            >
          </div>
          
          <div class="mb-4">
            <label for="password" class="form-label">
              <i class="bi bi-lock me-1"></i>Contraseña
            </label>
            <input 
              type="password" 
              class="form-control" 
              id="password" 
              v-model="credentials.password"
              required
              placeholder="admin123"
              :disabled="loading"
            >
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary-custom w-100 py-2"
            :disabled="loading"
          >
            <span v-if="loading">
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              Verificando...
            </span>
            <span v-else>
              <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
            </span>
          </button>
        </form>

        <div class="mt-3 text-center">
          <small class="text-muted">
            <i class="bi bi-info-circle me-1"></i>
            Demo: admin@intimacyshop.com / admin123
          </small>
        </div>

        <!-- Alerta Bootstrap (no alert nativo) -->
        <div v-if="error" class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" @click="error = ''"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from '../services/apiService'

export default {
  name: 'LoginView',
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      loading: false,
      error: ''
    }
  },
  methods: {
    async login() {
      // Validación básica
      if (!this.credentials.email || !this.credentials.password) {
        this.error = 'Por favor ingresa email y contraseña'
        return
      }

      this.loading = true
      this.error = ''

      try {
        // Validar credenciales contra MockAPI
        const user = await userService.validateCredentials(
          this.credentials.email, 
          this.credentials.password
        )
        
        if (user) {
          // Guardar token simulado y datos de usuario
          const authToken = `mock-token-${Date.now()}`
          
          // Usar sessionStorage como pide el examen
          sessionStorage.setItem('authToken', authToken)
          sessionStorage.setItem('user', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }))
          
          // Redirigir al dashboard
          this.$router.push('/dashboard/productos')
        } else {
          this.error = 'Credenciales incorrectas. Usa: admin@intimacyshop.com / admin123'
        }
      } catch (error) {
        console.error('Login error:', error)
        this.error = 'Error de conexión con el servidor. Intenta nuevamente.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.card {
  border: none;
  border-radius: 15px;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.25rem rgba(139, 0, 139, 0.25);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert {
  border-radius: 10px;
}
</style>