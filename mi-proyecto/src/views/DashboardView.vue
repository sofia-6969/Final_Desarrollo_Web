<template>
  <div class="dashboard-container">
    <NavbarComponent />
    <div class="container-fluid">
      <div class="row">
        <SidebarComponent />
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
          <router-view />
        </main>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import NavbarComponent from '../components/NavbarComponent.vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'

export default {
  name: 'DashboardView',
  components: {
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  }
}
</script>