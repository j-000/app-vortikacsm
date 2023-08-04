<template>
  <div>
    <RouterLink :to="{name: 'themes-list'}" class="card p-3 border-left-primary shadow mb-3">
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
                <button class="ms-4 btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#newThemeModal">
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
   </RouterLink>
  </div>
</template>

<script>
import { ref } from 'vue';
import global from '../../stores/global';
import PageListTable from './PageListTable.vue';

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
    const activateTab = (tab) => {
      activeTab.value = tab;
      callGetFiles.value = true;
      ['#draft', '#preview', '#live'].forEach(id => {
        document.querySelector(id).classList.remove('active');
      });
      document.querySelector(`#${tab}`).classList.add('active');
    }
    return {
      activateTab,
      activeTab,
      callGetFiles
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>