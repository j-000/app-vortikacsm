<template>
  <div>
    <h1>Users</h1>
    <RouterLink v-for="user in users" :key="user._id" :to="{name: 'users'}" class="card border-left-primary shadow mb-3">
      <div class="card-body py-2">
        <div class="row no-gutters align-items-center">
          <div class="col mr-2">
            <div class="d-flex justify-content-between">
              <div>
                <h5 class="mb-1 card-title">{{ user.name }}</h5>
                <p class="text-muted">Joined {{ $moment(user.createdAt).fromNow() }}</p>
              </div>
              <small class="text-muted">
                <span class="badge text-bg-light">{{ user.role }}</span>
              </small>
            </div>
          </div>
        </div>
        <div class="row no-gutters align-items-center mt-2">
          <div class="col mr-2">
            
          </div>
        </div>
      </div>
   </RouterLink>
  </div>
  
</template>

<script>
import { ref } from 'vue';
import global from '../stores/global';

export default {
  setup() {
    const users = ref();
    const store = global();
    const getUsers = async () => {
      const response = await fetch(`http://localhost:3001/api/users`, {
        headers: {authorization: `Bearer ${store.user.token}`}
      });
      const json = await response.json();
      users.value = json.users;
    };
    getUsers();
    return {
      users
    }
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>