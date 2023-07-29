<template>
  <div>
    <div class="row">
      <div class="col d-flex justify-content-between">
        <h1 class="h3 text-gray-800">Basic Jobs Details Page Templates</h1>
        <div>
          <button
            class="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#newTemplateModal"
          >
            <i class="fas fa-plus"></i> <span class="ml-3">New Template</span>
          </button>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <ul class="ps-0 d-flex">
        <li><span id="grayDot"></span> Draft</li>
        <li class="mx-3"><span id="orangeDot"></span> Preview</li>
        <li><span id="greenDot"></span> Live</li>
      </ul>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">File name</th>
          <th scope="col">Type</th>
          <th scope="col">Created</th>
          <th scope="col">Edited</th>
          <th scope="col">Published</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(file, index) in files" :key="index">
          <td>{{ index + 1}}</td>
          <td>
            <span v-if="file.status == 'new'" id="grayDot"></span>
            <span v-if="file.status == 'preview' " id="orangeDot"></span>
            <span v-if="file.status == 'live'" id="greenDot"></span>
            <router-link :to="{name: 'cms-editor', params: {templateid: file._id}}" class="ms-2">{{ file.name }}</router-link>
          </td>
          <td>{{ file.type.toUpperCase() }}</td>
          <td>
            <span class="text-muted">{{ $moment(file.createdAt).fromNow() }}</span>
          </td>
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
            <span v-else> - </span>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="modal fade"
      id="newTemplateModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="newTemplateModal"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="newTemplateModal">New Template Page</h5>
            <button
              type="button"
              id="newFeedCloseButton"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form class="feed">
              <div class="form-group">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon3">Name</span>
                  </div>
                  <input
                    v-model="newFileName"
                    type="text"
                    class="form-control"
                    id="name"
                    aria-describedby="basic-addon3"
                  />
                </div>
                <div class="input-group mb-3">
                  <label class="input-group-text" for="inputGroupSelect01">Template type</label>
                  <select v-model="newFileType" class="form-select" id="inputGroupSelect01">
                    <option selected>Choose...</option>
                    <option value="bjdp">Basic Job Details Page Template</option>
                    <option value="ajdp">Advanced Job Details Page Template</option>
                    <option value="srp">Search Results Page Template</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary" type="button" @click="addNewTemplate">Save</button>
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
    const files = ref({});
    const newFileName = ref('');
    const newFileType = ref('');

    const getFiles = async () => {
      const response = await fetch(`http://localhost:3001/api/cms/templates/list?type=bjdp`, {
        headers: { authorization: `Bearer ${store.user.token}`}
      });
      const json = await response.json();
      files.value = json.templates;
    }
    getFiles();

    const addNewTemplate = async () => {
      const response = await fetch('http://localhost:3001/api/cms/templates/list', {
        method: 'post', 
        headers: {
          authorization: `Bearer ${store.user.token}`,
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({filename: newFileName.value, type: newFileType.value})});
      const json = await response.json();
      if (json.success) {
        getFiles();
        toast(json.message);
        document.querySelector('#newFeedCloseButton').click();
      } else {
        toast(json.error);
      }
    }


    return {
      files,
      newFileName,
      newFileType,
      addNewTemplate
    }
  }
}
</script>

<style scoped>
li {
  list-style: none;
}

</style>