<template>
  <div class="client-view">
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
      <h2 class="text-primary-custom mb-0">👥 Gestión de Clientes</h2>
      <button class="btn btn-primary-custom btn-lg" @click="showAddModal = true">
        <strong>+ Agregar Cliente</strong>
      </button>
    </div>

    <!-- Clientes existentes -->
    <div class="row">
      <div class="col-12" v-for="client in clients" :key="client.id">
        <div class="card mb-3 shadow-sm">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h5 class="card-title">{{ client.name }}</h5>
                <p class="card-text mb-1">
                  <strong>Email:</strong> {{ client.email }}
                </p>
                <p class="card-text mb-1">
                  <strong>Teléfono:</strong> {{ client.phone }}
                </p>
                <p class="card-text mb-1" v-if="client.address">
                  <strong>Dirección:</strong> {{ client.address }}
                </p>
              </div>
              <div class="col-md-6">
                <p class="card-text mb-1">
                  <strong>Compras totales:</strong> ${{ client.totalPurchases }}
                </p>
                <p class="card-text mb-1">
                  <strong>Estado:</strong> 
                  <span :class="`badge ${getStatusBadge(client.status)} ms-2`">
                    {{ getStatusName(client.status) }}
                  </span>
                </p>
                <p class="card-text mb-3">
                  <strong>Preferencias:</strong>
                  <span v-for="pref in client.preferences" :key="pref" class="badge bg-secondary me-1 ms-2">
                    {{ getPreferenceName(pref) }}
                  </span>
                </p>
                <div class="btn-group">
                  <button class="btn btn-outline-primary btn-sm" @click="editClient(client)">
                    ✏️ Editar
                  </button>
                  <button class="btn btn-outline-danger btn-sm" @click="deleteClient(client.id)">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sin clientes -->
    <div v-if="clients.length === 0" class="text-center py-5 bg-light rounded">
      <h4 class="text-muted">No hay clientes registrados</h4>
      <p class="text-muted">Comienza agregando tu primer cliente</p>
      <button class="btn btn-primary-custom btn-lg" @click="showAddModal = true">
        + Agregar Primer Cliente
      </button>
    </div>

    <!-- Modal simple para agregar/editar -->
    <div v-if="showAddModal || showEditModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary-custom text-white">
            <h5 class="modal-title">
              {{ showEditModal ? 'Editar Cliente' : 'Agregar Cliente' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nombre Completo *</label>
              <input v-model="currentClient.name" class="form-control" placeholder="Ej: María González" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email *</label>
              <input v-model="currentClient.email" type="email" class="form-control" placeholder="ejemplo@email.com" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Teléfono *</label>
              <input v-model="currentClient.phone" class="form-control" placeholder="+57 300 123 4567" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Dirección</label>
              <input v-model="currentClient.address" class="form-control" placeholder="Dirección del cliente">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
            <button type="button" class="btn btn-primary-custom" @click="saveClient">
              {{ showEditModal ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientView',
  data() {
    return {
      clients: [
        {
          id: 1,
          name: "María González",
          email: "maria.gonzalez@email.com",
          phone: "+57 300 123 4567",
          address: "Calle 123 #45-67, Bogotá",
          totalPurchases: 1250.50,
          status: "active",
          preferences: ["lenceria", "cosmetica"]
        },
        {
          id: 2,
          name: "Carlos Rodríguez", 
          email: "carlos.rodriguez@email.com",
          phone: "+57 310 987 6543",
          address: "Av. Principal #89-12, Medellín",
          totalPurchases: 890.75,
          status: "active",
          preferences: ["juguetes"]
        },
        {
          id: 3,
          name: "Ana Martínez",
          email: "ana.martinez@email.com",
          phone: "+57 320 555 7890", 
          address: "Carrera 56 #78-90, Cali",
          totalPurchases: 2100.25,
          status: "vip",
          preferences: ["lenceria", "cuidado"]
        }
      ],
      showAddModal: false,
      showEditModal: false,
      currentClient: {
        id: null,
        name: '',
        email: '',
        phone: '',
        address: '',
        totalPurchases: 0,
        status: 'active',
        preferences: []
      }
    }
  },
  methods: {
    editClient(client) {
      this.currentClient = { ...client }
      this.showEditModal = true
    },
    deleteClient(clientId) {
      if (confirm('¿Estás seguro de eliminar este cliente?')) {
        this.clients = this.clients.filter(c => c.id !== clientId)
        alert('Cliente eliminado correctamente')
      }
    },
    saveClient() {
      // Validación simple
      if (!this.currentClient.name || !this.currentClient.email || !this.currentClient.phone) {
        alert('Por favor completa los campos obligatorios')
        return
      }

      if (this.showEditModal) {
        // Actualizar cliente existente
        const index = this.clients.findIndex(c => c.id === this.currentClient.id)
        if (index !== -1) {
          this.clients[index] = { ...this.currentClient }
        }
        alert('Cliente actualizado correctamente')
      } else {
        // Crear nuevo cliente
        const newClient = {
          ...this.currentClient,
          id: Math.max(...this.clients.map(c => c.id)) + 1,
          totalPurchases: 0,
          status: 'active',
          preferences: []
        }
        this.clients.push(newClient)
        alert('Cliente creado correctamente')
      }
      
      this.closeModal()
    },
    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.resetCurrentClient()
    },
    resetCurrentClient() {
      this.currentClient = {
        id: null,
        name: '',
        email: '',
        phone: '',
        address: '',
        totalPurchases: 0,
        status: 'active',
        preferences: []
      }
    },
    getStatusName(status) {
      const statusMap = {
        'active': 'Activo',
        'vip': 'VIP', 
        'inactive': 'Inactivo'
      }
      return statusMap[status] || status
    },
    getStatusBadge(status) {
      const badgeMap = {
        'active': 'bg-success',
        'vip': 'bg-warning text-dark',
        'inactive': 'bg-secondary'
      }
      return badgeMap[status] || 'bg-secondary'
    },
    getPreferenceName(pref) {
      const preferenceMap = {
        'juguetes': 'Juguetes',
        'lenceria': 'Lencería',
        'cosmetica': 'Cosmética', 
        'cuidado': 'Cuidado'
      }
      return preferenceMap[pref] || pref
    }
  }
}
</script>

<style scoped>
.client-view {
  padding: 20px;
  margin-top: 20px;
}

.card {
  border: none;
  border-left: 4px solid var(--primary-color);
}

.btn-group .btn {
  margin-right: 5px;
}
</style>
