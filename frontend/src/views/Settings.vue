<template>
  <div>
    <h1>Settings</h1>
    <h2>System</h2>
    
    <hr>
    <div class="d-flex justify-content-between align-items-center">
      <h2>Roles</h2>
      <button @click="savePermissions" class="btn-primary btn btn-sm">Save</button>
    </div>
    <div class="alert alert-warning">
      If permissions for a given role are removed, users of that role MUST logout of the app before saving.
    </div>
    <table class="table">
      <thead >
        <tr>
          <th v-for="role in roles" :key="role">{{ role.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="perm in permissions" :key="perm">
          <td v-for="r in roles" :key="r + '2'">
            <div class="form-check">
              <input 
                @change="updateNewPermissions(`${r.name}0${perm.name}`)"
                :checked="r.permissions.includes(perm.name)"
                :id="`${r.name}0${perm.name}`"
                class="form-check-input" type="checkbox">
              <label class="form-check-label" for="">
                {{ perm.name }}
              </label> 
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref } from 'vue';
import global from '../stores/global';
import toast from '../functions';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = global();
    const roles = ref();
    const permissions = ref();
    const newPermissions = ref({});
    const route = useRouter();

    const getRoles = async () => {
      const response = await fetch(`http://localhost:3001/api/roles`, {
        headers: {authorization: `Bearer ${store.user.token}`}
      });
      const json = await response.json();     
      roles.value = json.roles;
      
      json.roles.forEach(r => {
        newPermissions.value[r.name] = r.permissions; 
      })
    }
    getRoles();

    const getPermissions = async () => {
      const response = await fetch(`http://localhost:3001/api/permissions`, {
        headers: {authorization: `Bearer ${store.user.token}`}
      });
      const json = await response.json();
      permissions.value = json.permissions;
    }
    getPermissions();

    const updateNewPermissions = (v) => {
      const [r, p] = v.split('0'); 
      const addPermission = document.querySelector(`#${v}`).checked;
      if (addPermission) {
        newPermissions.value[r].push(p);
      } else {
        let i = newPermissions.value[r].indexOf(p);
        console.log(i);
        newPermissions.value[r].splice(i, 1);
      }
    } 

    const savePermissions = async () => {
      const response = await fetch(`http://localhost:3001/api/roles`, {
        method: 'post',
        headers: {authorization: `Bearer ${store.user.token}`, 'Content-Type': 'application/json'},
        body: JSON.stringify(newPermissions.value)
      })
      const json = await response.json();
      if(json.success){
        toast(json.message);
        getPermissions();
        route.push('/logout');
      } else {
        toast(json.error);
      }
    }

    return {
      roles, 
      permissions,
      updateNewPermissions,
      savePermissions
    }

  },
};
</script>

<style>
</style>