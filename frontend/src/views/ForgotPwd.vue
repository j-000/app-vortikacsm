<template>
<div class="container">
    <div class="card border-0 shadow-lg my-5">
      <div class="card-body p-0">
        <!-- Nested Row within Card Body -->
        <div class="row firstRow">
          <div class="col-lg-5 d-none d-lg-block bg-register-image"></div>
          <div class="col-lg-7">
            <div class="p-5">
              <div class="text-center">
                <h1 class="h4 text-gray-900 mb-4">Recover your password</h1>
              </div>
              <form class="user" id="recoverForm">
                <div class="form-group">
                  <input type="email" class="form-control form-control-user" id="InputEmail"
                    placeholder="Email Address">
                </div>
                <input type="submit" class="btn btn-primary btn-user btn-block" value="Email reset link">
              </form>
              <hr>
              <div class="text-center mt-1">
                <RouterLink class="small" :to="{ name: 'register' }">Create an Account!</RouterLink>
              </div>
              <div class="text-center">
                <RouterLink class="small" :to="{ name: 'login' }">Already have an account? Login!</RouterLink>
              </div>
              
            </div>
          </div>
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
body {
    display: flex;
  }
  .bg-register-image {
    background: url(https://source.unsplash.com/DziZIYOGAHc/600x800);
    background-position: center;
    background-size: cover
  }
  .user {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
  .card-body .row{
    min-height: 475px;
  }

  .col-lg-7 {
    display: flex;
    align-items:center;
  }
  .p-5 {
    width: 100%;
  }

  .firstRow{
    height: 450px;
  }
</style>