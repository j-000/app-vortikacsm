<template>
  <div>
    <Toast />
    <div id="wrapper">
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <Nav/>
          <div class="container mt-5">
            <RouterView />
          </div>
        </div>
    </div>
    <footer class="footer d-flex mt-auto py-3 bg-light align-items-center">
      <div class="container">
        <div class="row d-flex text-center text-muted">
          <div class="col">
          </div>
          <div class="col align-conten-center">
            <p class="mb-0">
              &copy; Vortika<sup>CSM</sup> 2023
            </p>
          </div>
          <div class="col">
            <a class="text-muted" href="https://github.com/j-000/vortikacsm/issues/new/choose" target="_blank">
              <i class="fa-brands fa-github me-2"></i>
              <span>Raise an issue</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</div>

</template>

<script>
import { RouterLink, RouterView } from 'vue-router';
import Nav from './components/general/Nav.vue';
import Toast from './components/general/Toast.vue';
import global from './stores/global';

export default {
  setup() {
    const store = global()
    // Check store is in sessionStorage
    const storeInSessionStorage = JSON.parse(sessionStorage.getItem('store'));
    const domainsInSessionStorage = JSON.parse(sessionStorage.getItem('domains'));
    if (storeInSessionStorage){
      // Update store
      store.updateUser(storeInSessionStorage.user);
      store.updateDomains(domainsInSessionStorage);
    }
  },
  components:{
    RouterLink,
    RouterView,
    Nav,
    Toast
  }
}
</script>
<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin: 0!important;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
