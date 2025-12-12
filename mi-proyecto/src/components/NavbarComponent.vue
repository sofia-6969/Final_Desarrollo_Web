<template>
  <nav class="navbar navbar-dark bg-primary-custom fixed-top">
    <div class="container-fluid">
      <span class="navbar-brand mb-0 h1">
        <i class="bi bi-fire me-2"></i>Intimacy Shop - Panel Admin
      </span>
      <div class="d-flex align-items-center">
        <span class="text-light me-3">
          <i class="bi bi-person-circle me-1"></i>
          {{ userName }}
        </span>
        <button class="btn btn-outline-light btn-sm" @click="logout">
          <i class="bi bi-box-arrow-right me-1"></i>Cerrar Sesión
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavbarComponent',
  data() {
    return {
      userName: ''
    }
  },
  mounted() {
    // Obtener nombre de usuario del sessionStorage
    const userData = sessionStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      this.userName = user.name || 'Usuario'
    }
  },
  methods: {
    logout() {
      // Limpiar sessionStorage
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('user')
      
      // Redirigir al login
      this.$router.push('/login')
      
      // Mostrar alerta de éxito (opcional)
      if (this.$route.path !== '/login') {
        // Podrías usar un sistema de alertas globales aquí
        console.log('Sesión cerrada exitosamente')
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  z-index: 1030;
  padding: 10px 0;
}
</style>