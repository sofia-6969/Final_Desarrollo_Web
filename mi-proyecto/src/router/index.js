import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductView from '../views/ProductView.vue'
import ClientView from '../views/ClientView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'productos',
        name: 'Productos',
        component: ProductView,
        meta: { requiresAuth: true }
      },
      {
        path: 'clientes',
        name: 'Clientes',
        component: ClientView,
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// GUARDIA DE NAVEGACIÓN (Navigation Guard)
router.beforeEach((to, from, next) => {
  // Verificar si la ruta requiere autenticación
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Verificar si hay sesión activa
  const isAuthenticated = !!sessionStorage.getItem('authToken')
  
  if (requiresAuth && !isAuthenticated) {
    // Redirigir a login si no está autenticado
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Si ya está autenticado y trata de ir a login, redirigir al dashboard
    next('/dashboard/productos')
  } else {
    // Continuar normalmente
    next()
  }
})

export default router