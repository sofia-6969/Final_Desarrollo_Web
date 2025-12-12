<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
:root {
  --primary-color: #8B008B;
  --secondary-color: #FF69B4;
  --dark-color: #4B0082;
}

.bg-primary-custom {
  background-color: var(--primary-color) !important;
}

.text-primary-custom {
  color: var(--primary-color) !important;
}

.btn-primary-custom {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.btn-primary-custom:hover {
  background-color: var(--dark-color);
  border-color: var(--dark-color);
  color: white;
}

.main-content {
  margin-top: 56px;
  padding-bottom: 60px;
}
:root {
  --primary-color: #8B008B;
  --secondary-color: #FF69B4;
  --dark-color: #4B0082;
}

.bg-primary-custom {
  background-color: var(--primary-color) !important;
}

.text-primary-custom {
  color: var(--primary-color) !important;
}

.btn-primary-custom {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.btn-primary-custom:hover {
  background-color: var(--dark-color);
  border-color: var(--dark-color);
  color: white;
}

/* ARREGLO PARA EL BOTÓN */
.main-content {
  margin-top: 80px; /* Más espacio para el navbar fijo */
  padding: 20px;
  min-height: calc(100vh - 140px); /* Altura mínima */
}

/* Asegurar que el contenido no se oculte */
.dashboard-container {
  padding-top: 20px;
}
</style>