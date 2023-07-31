import { defineStore } from 'pinia'
import { ref } from 'vue';

export default defineStore('globalStore', () => {
  
  const user = ref(false);
  const domains = ref({});

  function updateUser(userData){
    user.value = userData
  }

  function updateDomains(newdomains) {
    domains.value.live = newdomains.live;
    domains.value.preview = newdomains.preview;
  }

  return {
    updateUser, 
    user,
    updateDomains,
    domains
  }
  
});
