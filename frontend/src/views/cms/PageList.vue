<template>
  <div>
    <div class="row">
      <div class="col d-flex justify-content-between align-items-center">
        <h1 class="h3 text-gray-800">Pages</h1>
        <div>
          <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#newpagemodal">
            <i class="fas fa-plus"></i> <span class="ml-3">New page</span>
          </button>
        </div>
      </div>
    </div>

    <div class="modal fade" id="newpagemodal" tabindex="-1" role="dialog" aria-labelledby="newpagemodal" aria-hidden="true" >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a new page</h5>
            <button type="button" id="newpagemodalCloseBtn" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div class="modal-body">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">Name</span>
              </div>
              <input v-model="newPage.name" type="text" class="form-control" aria-describedby="page-name"/>
              <div class="input-group-prepend">
                <span class="input-group-text">.html</span>
              </div>
            </div>
            <p class="mb-3 ms-1"><small class="text-muted">Only characters (a - z, A - Z), numbers (0 - 9) and underscores (_) allowed.</small></p>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" for="type">Page type</span>
              </div>
              <select v-model="newPage.pageType" class="form-control" aria-describedby="page-type">
                <option selected>Choose...</option>
                <option value="content">Content</option>
                <option value="template">Template</option>
                <option value="jobdetails">Job details</option>
                <option value="searchresults">Search results</option>
              </select> 
            </div>
            <div v-if="newPage.pageType == 'content'" class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">{{ store.domains.live }}/</span>
              </div>
              <input v-model="newPage.urlslug" type="text" class="form-control" aria-describedby="page-slug"/>
            </div>
            <p class="mb-3 ms-1"><small class="text-muted">Only lowercase characters (a - z), numbers (0 - 9) and dashes (-) allowed.</small></p>

          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary" type="button" @click="addNewPage">Save</button>
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

export default {
  setup() {
    const store = global();
    const activeTab = ref('draft');
    const newPage = ref({
      name: '',
      pageType: '',
      urlslug: '',
      status: 'draft'
    })
    const callGetFiles = ref(false)
  
    const addNewPage = async () => {
      const response = await fetch('http://localhost:3001/api/cms/pages/list', {
        method: 'post', 
        headers: {
          authorization: `Bearer ${store.user.token}`,
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(newPage.value)});
      const json = await response.json();

      if (json.success) {
        callGetFiles.value = true;
        toast(json.message);
        document.querySelector('#newpagemodalCloseBtn').click();
      } else {
        toast(json.error);
      }
    }

    const activateTab = (tab) => {
      activeTab.value = tab;
      callGetFiles.value = true;
      ['#draft', '#preview', '#live'].forEach(id => {
        document.querySelector(id).classList.remove('active');
      });
      document.querySelector(`#${tab}`).classList.add('active');
    }

    return {
      activeTab,
      activateTab,
      store,
      newPage,
      addNewPage,
      callGetFiles
    }
  }
}
</script>

<style scoped>
li {
  list-style: none;
}

span.input-group-text {
  width: max-content;
}

</style>