<script setup>
import globalStore from '../stores/global';

const store = globalStore();
</script>
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
                        CMS
                      </a>
                      <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><h6 class="dropdown-header">View Templates</h6></li>
                        <li>
                          <RouterLink class="dropdown-item d-flex justify-content-between" :to="{name: 'cms-edit-bdp'}">
                            <div>
                              <i class="fa-regular fa-file-lines me-2"></i>
                              <span>Basic Details Page</span>
                            </div>
                          </RouterLink>
                        </li>
                        <li>
                          <RouterLink class="dropdown-item d-flex justify-content-between" :to="{name: 'cms-edit-adp'}">
                            <div>
                              <i class="fa-regular fa-file-lines me-2"></i>
                              <span>Advanced Details Page</span>
                            </div>
                          </RouterLink>
                        </li>
                        <li>
                          <RouterLink class="dropdown-item d-flex justify-content-between" :to="{name: 'cms-edit-srp'}">
                            <div>
                              <i class="fa-regular fa-file-lines me-2"></i>
                              <span>Search Results Page</span>
                            </div>
                          </RouterLink>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li><h6 class="dropdown-header">View Sites</h6></li>
                        <li>
                          <RouterLink class="dropdown-item d-flex justify-content-between" :to="{name: 'cms-publish-preview'}">
                            <div>
                              <i class="fas fa-flask me-2"></i>
                              <span>Preview</span>
                            </div>
                          </RouterLink>
                        </li>
                        <li>
                          <RouterLink class="dropdown-item d-flex justify-content-between" :to="{name: 'cms-publish-live'}">
                            <div>
                              <i class="fas fa-globe me-2"></i>
                              <span>Live</span>
                            </div>
                            <div>
                            </div>
                          </RouterLink>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li><h6 class="dropdown-header">Publish Templates</h6></li>
                        <li>
                          <RouterLink class="dropdown-item d-flex justify-content-between" :to="{name: 'cms-publish-preview'}">
                            <div>
                              <i class="fas fa-flask me-2"></i>
                              <span>Preview</span>
                            </div>
                            <div>
                              <span id="orangeDot"></span>
                            </div>
                          </RouterLink>
                        </li>
                        <li>
                          <RouterLink class="dropdown-item d-flex justify-content-between" :to="{name: 'cms-publish-live'}">
                            <div>
                              <i class="fas fa-globe me-2"></i>
                              <span>Live</span>
                            </div>
                            <div>
                              <span id="greenPulseDot"></span>
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

export default {
    setup(){

    }
}
</script>

<style>

</style>