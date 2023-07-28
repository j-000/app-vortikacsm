import { defineStore } from 'pinia'
import { ref } from 'vue';

export default defineStore('globalStore', () => {
  
  const user = ref(false);

  function updateUser(userData){
    user.value = userData
  }

  return {updateUser, user}
  
});
