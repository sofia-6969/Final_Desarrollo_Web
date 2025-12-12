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
.main-content {
  margin-top: 70px; /* Ajustado para navbar fijo */
  padding: 25px;
  min-height: calc(100vh - 140px); /* Altura mínima */
  overflow-y: auto; /* Permite scroll si es necesario */
}

/* Asegurar que los modales sean visibles */
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

/* Mejorar visibilidad de botones */
.btn-primary-custom {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  font-weight: 600;
}

.btn-primary-custom:hover {
  background-color: var(--dark-color);
  border-color: var(--dark-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Espaciado para cards */
.card {
  margin-bottom: 20px;
}
</style>