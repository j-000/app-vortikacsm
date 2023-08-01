<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"><i class="fas fa-tornado"></i><span class="ms-2">Vortika<sup>CSM</sup></span></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <div 
            v-if="store.user?.token"
            class="navbar-nav"
          >
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{name: 'dashboard'}">Dashboard</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{name: 'feeds'}">Feeds</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{name: 'jobs'}">Jobs</RouterLink>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Career Site Manager
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><h6 class="dropdown-header">View</h6></li>
                <li>
                  <RouterLink class="align-items-center dropdown-item d-flex justify-content-between" :to="{name: 'pages-list'}">
                    <div>
                      <i class="fa-regular fa-file-lines me-2"></i>
                      <span>Pages</span>
                    </div>
                  </RouterLink>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li><h6 class="dropdown-header">Sites</h6></li>
                <li>
                  <a @click="navigate('preview')" class="dropdown-item d-flex justify-content-between" to="">
                    <div>
                      <i class="fas fa-flask me-2"></i>
                      <span>Preview</span>
                    </div>
                    <i class="fa-solid fa-up-right-from-square text-muted"></i>
                  </a>
                </li>
                <li>
                  <a @click="navigate('live')" class="dropdown-item d-flex justify-content-between" to="">
                    <div>
                      <i class="fas fa-globe me-2"></i>
                      <span>Live</span>
                    </div>
                    <i class="fa-solid fa-up-right-from-square text-muted"></i>
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li><h6 class="dropdown-header">Learn</h6></li>
                <li>
                  <RouterLink class="align-items-center dropdown-item d-flex justify-content-between" :to="{name: 'learn'}">
                    <div>
                      <i class="fa-solid fa-book me-2"></i>
                      <span>Vortika<sup>CSM</sup></span>
                    </div>
                  </RouterLink>
                </li>
              </ul>
            </li>
          </div>
          <div 
            v-else
            class="navbar-nav"
          >
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{name: 'home'}">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{name: 'register'}">Register</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{name: 'login'}">Login
                </RouterLink>
            </li>
          </div>
        </ul>
        <div 
          v-if="store.user?.token"
          class="navbar-nav"
        >
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Menu</a>
            <ul class="dropdown-menu">
              <li>
                <RouterLink class="dropdown-item d-flex justify-content-between" :to="{name: 'login'}">
                  <div>
                    <i class="fa-solid fa-user"></i>
                    <span class="ms-2">Profile</span>
                  </div>
                </RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item d-flex justify-content-between" :to="{name: 'login'}">
                  <div>
                    <i class="fa-solid fa-gears"></i>
                    <span class="ms-2">Settings</span>
                  </div>
                </RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item d-flex justify-content-between" :to="{name: 'login'}">
                  <div>
                    <i class="fa-solid fa-users"></i>
                    <span class="ms-2">Users</span>
                  </div>
                </RouterLink>
              </li>
              
              <hr>
              <li>
                <RouterLink class="dropdown-item d-flex justify-content-between text-danger" :to="{name: 'logout'}">
                  <div>
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span class="ms-2">Logout</span>
                  </div>
                </RouterLink>
              </li>
            </ul>
          </li>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import globalStore from '../stores/global';

export default {
  setup(){
    const store = globalStore();

    const navigate = (to) => {
      if (to === 'preview') {
        window.open(store.domains.preview, '_blank');
      } else {
        window.open(store.domains.live, '_blank');
      }
    }

    return {
      navigate,
      store
    }
  }
}


</script>

<style>

</style>