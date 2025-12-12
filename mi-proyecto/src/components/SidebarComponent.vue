<template>
  <div class="sidebar col-md-3 col-lg-2 d-md-block bg-light sidebar">
    <div class="position-sticky pt-5">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link 
            to="/dashboard/productos" 
            class="nav-link"
            :class="{ 'active': $route.name === 'Productos' }"
          >
            🛍️ Productos
          </router-link>
        </li>
        <li class="nav-item">
          <router-link 
            to="/dashboard/clientes" 
            class="nav-link"
            :class="{ 'active': $route.name === 'Clientes' }"
          >
            👥 Clientes
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarComponent'
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 56px;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 48px 0 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
  width: 280px;
}

.nav-link {
  color: #333;
  padding: 12px 20px;
  border-radius: 0;
  transition: all 0.3s ease;
}

.nav-link.active {
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
}

.nav-link:hover:not(.active) {
  background-color: #e9ecef;
  color: var(--primary-color);
}
</style>