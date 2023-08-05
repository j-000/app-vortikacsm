<template>
  <div>
    <div class="card p-3 border-left-primary shadow mb-3">
      <div class="card-body py-2">
        <div class="row">
          <div class="col d-flex justify-content-between">
            <h5 class="mb-0 card-title">{{theme.name}}</h5>
            <div class="mb-1">
              <span class="badge text-bg-light">{{theme._id}}</span> |
              <span class="badge text-bg-light">orgid: {{theme.orgid}}</span>
            </div>
          </div>
        </div>
        <div class="row no-gutters align-items-center">
          <div class="col mr-2">
            <div class="d-flex justify-content-between">
              <div>
                <small class="text-muted">Created {{ $moment(theme.createdAt).fromNow() }} by {{ theme.createdUser }}</small>
              </div>  
              <div class="mt-2">
                <RouterLink :to="{name: 'cms-editor', params: {templateid: theme._id}}">Edit theme</RouterLink>
                <button class="ms-4 btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#newpagemodal">
                  <i class="fas fa-plus"></i> <span class="ml-3">New page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="row no-gutters align-items-center mt-4">
          <div class="col mr-2">
            <ul class="nav nav-tabs">
              <li @click="activateTab('draft')" class="nav-item">
                <a class="nav-link active" id="draft" href="#">Draft
                  <span id="grayDot"></span>
                </a>
              </li>
              <li @click="activateTab('preview')" class="nav-item">
                <a class="nav-link" id="preview" href="#">Preview
                  <span id="orangeDot"></span>
                </a>
              </li>
              <li @click="activateTab('live')" class="nav-item">
                <a class="nav-link" id="live" href="#">Live
                  <span id="greenDot"></span>
                </a>
              </li>
            </ul>
            <PageListTable v-if="activeTab" :callGetFiles="callGetFiles" :pagetype="activeTab"/>
          </div>
        </div>
      </div>
    </div>

    <!-- New Page Modal -->
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
                <option value="homepage">Homepage</option>
                <option value="content">Content</option>
                <option value="job-details">Job details</option>
                <option value="search-results">Search results</option>
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
import PageListTable from './PageListTable.vue';
import toast from '../../functions';

export default {
  props: {
    theme: {
      type: Object
    }
  },
  components: {
    PageListTable
  },
  setup(props){
    const activeTab = ref('draft');
    const callGetFiles = ref(false);
    const store = global();
    const newPage = ref({
      pageType: '',
      name: '',
      urlslug: '',
      themeId: props.theme._id
    })
    const activateTab = (tab) => {
      activeTab.value = tab;
      callGetFiles.value = true;
      ['#draft', '#preview', '#live'].forEach(id => {
        document.querySelector(id).classList.remove('active');
      });
      document.querySelector(`#${tab}`).classList.add('active');
    }

    const addNewPage = async () => {
      const response = await fetch('http://localhost:3001/api/cms/pages', {
        method: 'post', 
        headers: {
          authorization: `Bearer ${store.user.token}`,
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
          name: newPage.value.name + '.html',
          fileType: newPage.value.pageType,
          urlslug: newPage.value.urlslug,
          themeId: newPage.value.themeId
        })});
      const json = await response.json();
      if (json.success) {
        callGetFiles.value = true;
        toast(json.message);
        document.querySelector('#newpagemodalCloseBtn').click();
      } else {
        toast(json.error);
      }
    }

    return {
      store,
      activateTab,
      activeTab,
      callGetFiles,
      newPage,
      addNewPage
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  /* cursor: unset; */
}
</style>