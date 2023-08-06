<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h1>Users</h1>
      <button data-bs-toggle="modal" data-bs-target="#newUserModal" class="btn btn-primary btn-sm">Add user</button>
    </div>
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
      </div>
   </RouterLink>

   <div class="modal fade" id="newUserModal" tabindex="-1"
      role="dialog" aria-labelledby="newUserModal" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">New user</h5>
            <button type="button" class="btn-close" id="closeModalBtn" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>This user will be added to your organisation users list (orgid #{{ store.user.orgid }}).</p>
            <form class="feed">
              <div class="form-group">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Name</span>
                  </div>
                  <input v-model="newUserData.name" autocomplete="username" type="text" class="form-control" id="name" aria-describedby="User name" />
                </div>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Surname</span>
                  </div>
                  <input v-model="newUserData.surname" type="text" class="form-control" id="surname" aria-describedby="User surname" />
                </div>
              </div>
              <div class="form-group">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Email</span>
                  </div>
                  <input v-model="newUserData.email" type="email" class="form-control" id="email" aria-describedby="User email" />
                </div>
              </div>
              <div class="form-group">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Password</span>
                  </div>
                  <input v-model="newUserData.password" autocomplete="current-password" type="password" class="form-control" id="password" aria-describedby="User password" />
                </div>
              </div>
              
              <div class="form-group">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="role">Role</label>
                    </div>
                    <select v-model="newUserData.role" class="form-control" id="role">
                      <option selected>Choose...</option>
                      <option v-for="role in roles" :key="role" :value="role.name">{{role.name}}</option>
                    </select>
                  </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" data-bs-dismiss="modal" >Cancel</button>
            <button class="btn btn-primary" type="button" @click="addNewUser">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import { ref } from 'vue';
import global from '../../stores/global';
import toast from '../../functions';
import Api from '../../services/Api';

export default {
  setup() {
    const users = ref();
    const store = global();
    const roles = ref();
    const newUserData = ref({
      name: '',
      surname: '',
      email: '',
      password: '',
      role: '',
    });

    const addNewUser = async () => {
      const json = await Api.addUser(newUserData.value);
      if (json.success) {
        toast(json.message);
        document.querySelector('#closeModalBtn').click();
        getUsers();
      } else {
        toast(json.error);
      }
    }

    const getRoles = async () => {
      const json = await Api.getRoles();     
      roles.value = json.roles;
    }
    getRoles();

    const getUsers = async () => {
      const json = await Api.getUsers();
      users.value = json.users;
    };
    
    getUsers();
    return {
      users,
      newUserData,
      addNewUser,
      roles,
      store
    }
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>