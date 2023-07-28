<template>
  <div class="container">
    <div id="alert"></div>
    <div class="card border-0 shadow-lg my-5">
      <div class="card-body p-0">
        <div class="row">
          <div class="col-lg-5 d-none d-lg-block bg-register-image"></div>
          <div class="col-lg-7">
            <div class="p-5">
              <div class="text-center">
                <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
              </div>
              <form class="user" id="registerForm">
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <input type="text" class="form-control form-control-user" id="FirstName" placeholder="First Name">
                  </div>
                  <div class="col-sm-6">
                    <input type="text" class="form-control form-control-user" id="LastName" placeholder="Last Name">
                  </div>
                </div>
                <div class="form-group">
                  <input type="email" class="form-control form-control-user" id="InputEmail"
                    placeholder="Email Address">
                </div>
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <input type="password" class="form-control form-control-user" id="InputPassword"
                      placeholder="Password">
                  </div>
                  <div class="col-sm-6">
                    <input type="password" class="form-control form-control-user" id="RepeatPassword"
                      placeholder="Repeat Password">
                  </div>
                </div>
                <input type="submit" class="btn btn-primary btn-user btn-block" value="Register Account">
              </form>
              <hr>
              <div class="text-center">
                <RouterLink class="small" :to="{ name: 'forgot-password' }">Forgot Password?</RouterLink>
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

};
</script>

<style>
body {
    align-items: center;
  }
  .bg-register-image {
    background: url(https://source.unsplash.com/Mv9hjnEUHR4/600x800);
    background-position: center;
    background-size: cover
  }
  .user {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
</style>