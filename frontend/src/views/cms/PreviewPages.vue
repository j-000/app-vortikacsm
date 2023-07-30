<template>
    <div>
      <div class="row">
        <div class="col d-flex justify-content-between">
          <h1 class="h3 text-gray-800">Pages in preview <span id="orangeDot"></span></h1>
        </div>
      </div>
  
      <table class="table mt-4">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">File name</th>
            <th scope="col">Created</th>
            <th scope="col">Edited</th>
            <th scope="col">Published to preview</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in files" :key="index">
            <td>{{ index + 1}}</td>
            <td>
              <router-link :to="{name: 'cms-editor', params: {templateid: file._id}}" class="ms-2">{{ file.name }}</router-link>
            </td>
            <td><span class="text-muted">{{ $moment(file.createdAt).fromNow() }} by {{ file.createdUser }}</span></td>
            <td>
              <span v-if="file.lastEdited.timestamp">
                {{ $moment(file.lastEdited.timestamp).fromNow() }} by {{ file.lastEdited.byUser }}
              </span>
              <span v-else> - </span>
            </td>
            <td>
              <span v-if="file.lastPublished.timestamp">
                {{ $moment(file.lastPublished.timestamp).fromNow() }} by {{ file.lastPublished.byUser }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
  
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import global from '../../stores/global';
  
  export default {
    setup() {
      const store = global();
      const files = ref({});
      const newFileName = ref('');
      const newFileType = ref('');
  
      const getFiles = async () => {
        const response = await fetch(`http://localhost:3001/api/cms/templates/list?status=preview`, {
          headers: { authorization: `Bearer ${store.user.token}`}
        });
        const json = await response.json();
        files.value = json.templates;
      }
      getFiles();
  

      return {
        files,
        newFileName,
        newFileType,
      }
    }
  }
  </script>
  
  <style scoped>
  li {
    list-style: none;
  }
  
  </style>