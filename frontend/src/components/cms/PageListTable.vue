<template>
  <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Type</th>
          <th>URL</th>
          <th>Created</th>
          <th>Edited</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(file, index) in files" :key="index">
          <td>{{ index + 1}}</td>
          <td>
            <i v-if="file.fileLocked" class="fa-solid fa-lock text-danger"></i>
            {{ file.name }}
          </td>
          <td>{{ file.fileType }}</td>
          <td>/{{ file.urlslug }}</td>
          <td><span class="text-muted">{{ $moment(file.createdAt).fromNow() }} by {{ file.createdUser  }}</span></td>
          <td>
            <span v-if="file.lastEdited.timestamp" class="text-muted">
              {{ $moment(file.lastEdited.timestamp).fromNow() }} by {{ file.lastEdited.byUser }}
            </span>
            <span v-else> - </span>
          </td>
          <td>
            <router-link :to="{name: 'cms-editor', params: {templateid: file._id}}" class="ms-2">              
              Edit page</router-link>
          </td>
        </tr>
      </tbody>
    </table>
</template>

<script>
import { ref, watch } from 'vue';
import global from '../../stores/global';
import Api from '../../services/Api';

export default {
  props:{
    pagetype: {
      type: String,
      required: true
    },
    callGetFiles: {
      type: Boolean
    }
  },
  setup(props){
    const files = ref();
    const store = global();

    const getFiles = async () => {
      
      const json = await Api.getPagesByStatus(props.pagetype);
      files.value = json.pages;
    }
    getFiles();
    
    // Watch callGetFiles prop 
    watch(props, async (n, o) => {
      if (props.callGetFiles){
        getFiles();
      }
    })

    return {
      files,
    }
  }  
}
</script>

<style scoped>
a {
  text-decoration: none;
}

</style>