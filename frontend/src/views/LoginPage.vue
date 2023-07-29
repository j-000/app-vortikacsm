<template>
  <div class="container indigo-200">
    <div class="row justify-content-center">
      <div class="col-xl-10 col-lg-12 col-md-9">
        <div class="card border-0 shadow-lg">
          <div class="card-body p-0">
            <div class="row">
              <div class="col-lg-5 d-none d-lg-block bg-login-image"></div>
              <div class="col-lg-6">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                  </div>
                  <div class="user">
                    <div class="form-group">
                      <input
                        v-model="email"
                        type="email"
                        class="form-control form-control-user"
                        id="exampleInputEmail"
                        autocomplete="username"
                        aria-describedby="emailHelp"
                        placeholder="Enter Email Address..."
                      />
                    </div>
                    <div class="form-group">
                      <form action="">
                        <input type="text" autocomplete="username" class="d-none">
                      <input
                        v-model="password"
                        type="password"
                        class="form-control form-control-user"
                        id="exampleInputPassword"
                        autocomplete="current-password"
                        placeholder="Password"
                      /></form>
                    </div>
                    <button
                      @click="login"
                      class="btn btn-primary btn-user btn-block"
                    >
                      Login
                    </button>
                  </div>
                  <div class="text-center mt-3">
                    <RouterLink class="small" :to="{ name: 'forgot-password' }"
                      >Forgot Password?</RouterLink
                    >
                  </div>
                  <div class="text-center mt-1">
                    <RouterLink class="small" :to="{ name: 'register' }">Create an Account!</RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.bg-login-image {
  background: url(https://source.unsplash.com/K4mSJ7kc0As/600x800);
  background-position: center;
  background-size: cover;
}
.user {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>

<script>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';
import toast from '../functions.js';
import globalStore from '../stores/global';
import { useRouter } from 'vue-router';


export default {
  components: {
    RouterLink
  },
  setup(){
    const store = globalStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');

    const login = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/login',{ 
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email.value,
              password: password.value
            })
        });
        const json = await response.json();
        if(json.success){
          store.updateUser({...json.user, token: json.token});
          router.push('/dashboard')
        } else {
          toast(json.error);
        }
      } catch (error) {
        toast(error);
      }
    };

    return {
      login,
      email,
      password
    }
  }
}

</script>