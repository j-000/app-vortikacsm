<template>
  <div class="container">
    <div></div>
    <div class="card border-0 shadow-lg my-5">
      <div class="card-body p-0">
        <div class="row firstRow">
          <div class="col-lg-5 d-none d-lg-block bg-register-image"></div>
          <div class="col-lg-7">
            <div class="p-5">
              <div class="text-center">
                <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
              </div>
              <form class="user">
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <input
                      v-model="userData.name"
                      type="text"
                      class="form-control form-control-user"
                      placeholder="First Name"
                    />
                  </div>
                  <div class="col-sm-6">
                    <input
                      v-model="userData.surname"
                      type="text"
                      class="form-control form-control-user"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <input
                    v-model="userData.email"
                    type="email"
                    autocomplete="username"
                    class="form-control form-control-user"
                    placeholder="Email Address"
                  />
                </div>
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <input
                      v-model="userData.password"
                      type="password"
                      autocomplete="new-password"
                      class="form-control form-control-user"
                      placeholder="Password"
                    />
                  </div>
                  <div class="col-sm-6">
                    <input
                      type="password"
                      autocomplete="new-password"
                      class="form-control form-control-user"
                      placeholder="Repeat Password"
                    />
                  </div>
                </div>
                <a @click="register" class="btn btn-primary btn-user btn-block"
                  >Register Account</a
                >
              </form>
              <hr />
              <div class="text-center">
                <RouterLink class="small" :to="{ name: 'forgot-password' }"
                  >Forgot Password?</RouterLink
                >
              </div>
              <div class="text-center">
                <RouterLink class="small" :to="{ name: 'login' }"
                  >Already have an account? Login!</RouterLink
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import global from '../../stores/global';
import toast from '../../functions';
import router from "../../router";

export default {
  setup() {
    const store = global();
    const userData = ref({
      name: "",
      surname: "",
      email: "",
      password: "",
    });

    const register = async () => {
      const json = await Api.register(userData.value);
      if(json.success) {
        toast('Success! Redirecting you to login...');
        setTimeout(() => { router.push('/login') }, 1500);
      } else {
        toast(json.error);
      }
    }

    return {
      userData,
      register
    };
  },
};
</script>

<style>
body {
  align-items: center;
}
.bg-register-image {
  background: url("../assets/dog1.jpg");
  background-position: center;
  background-size: cover;
}
.user {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.firstRow {
  height: 450px;
}
</style>