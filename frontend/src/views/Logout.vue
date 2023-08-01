<template>
  <div class="container">
    <div class="row shadow-lg">
      <div class="col-lg-5 d-none d-lg-block bg-image"></div>
      <div class="col card border-0 d-grid justify-content-center align-content-center">
        <h1 class="h4 text-gray-900 mb-4">See you soon!</h1>
        <div class="text-center mt-3">
          <RouterLink class="small" :to="{ name: 'login' }">Login Again</RouterLink>
        </div>
        <div class="text-center mt-1">
          <RouterLink class="small" :to="{ name: 'register' }">Create an Account!</RouterLink>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
export default {

}
</script>

<style scoped>
.bg-image {
  background: url(https://source.unsplash.com/K5pLGYJMHKk/600x800);
  background-position: center;
  background-size: cover;
}

.row {
  height: 450px;
}
</style>