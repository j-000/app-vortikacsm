<template>
  <div>
    <div class="d-flex align-items-center justify-content-between">
      <h1>Themes</h1>
      <div>
        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#newThemeModal">
          <i class="fas fa-plus"></i> <span class="ml-3">New theme</span>
        </button>
      </div>
    </div>

    <ThemeCard v-for="theme in themes" :theme="theme" :key="theme._id"/>

    <!-- Modal -->
    <div class="modal fade" id="newThemeModal" tabindex="-1" role="dialog" aria-labelledby="newThemeModal" aria-hidden="true" >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a new theme</h5>
            <button type="button" id="newThemeModalCloseBtn" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div class="modal-body">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">Name</span>
              </div>
              <input v-model="name" type="text" class="form-control" aria-describedby="page-name"/>
              <div class="input-group-prepend">
                <span class="input-group-text">.html</span>
              </div>
            </div>
            <p class="mb-3 ms-1"><small class="text-muted">Only characters (a - z, A - Z), numbers (0 - 9) and underscores (_) allowed.</small></p>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary" type="button" @click="addNewTheme">Save</button>
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
import ThemeCard from '../../components/cms/ThemeCard.vue';

export default {
  components: {
    ThemeCard,
  },
  setup(){
    const store = global();
    const name = ref('');
    const themes = ref();

    const getThemes = async () => {
      const response = await fetch(`http://localhost:3001/api/cms/themes`, {
        headers: { authorization: `Bearer ${store.user.token}`},
      });
      const json = await response.json();
      if (json.success) {
        themes.value = json.themes;
      } else {
        toast(json.error);
      }
    }
    getThemes();

    const addNewTheme = async () => { 
      const response = await fetch(`http://localhost:3001/api/cms/themes`, {
        method: 'post',
        headers: { authorization: `Bearer ${store.user.token}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({name: name.value + '.html'})
      });
      const json = await response.json();
      if (json.success) {
        toast(json.message);
        document.querySelector('#newThemeModalCloseBtn').click();
        getThemes();
      } else {
        toast(json.error);
      }
     }
    return {
      name,
      themes,
      addNewTheme
    }
  }
}
</script>

<style>

</style>