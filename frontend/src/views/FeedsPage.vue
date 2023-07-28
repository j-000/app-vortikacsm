<template>
  <div>
    <div class="row mb-4">
      <div class="col d-flex justify-content-between">
        <h1 class="h3 text-gray-800">Feeds</h1>
        <div>
          <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#newFeedModal"><i class="fas fa-plus"></i> <span class="ml-3">Add Feed</span></button>
        </div>
      </div>
    </div>
    
    <FeedCard v-for="f in feeds" :key="f._id" :feedid="f._id"/>


    <!-- TODO: component this -->
    <div class="modal fade" id="newFeedModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">New Feed</h5>
            <button type="button" id="newFeedCloseButton" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="feed">
              <div class="form-group">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon3">Name</span>
                  </div>
                  <input type="text" class="form-control" id="name" aria-describedby="basic-addon3">
                </div>
              </div>
              <div class="form-group">
                <div class="col d-flex justify-content-between">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon3">URL</span>
                    </div>
                    <input type="text" class="form-control" id="url" aria-describedby="basic-addon3">
                  </div>
                  <div class="input-group mb-3 ms-2">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="type">Feed Type</label>
                    </div>
                    <select class="form-control" id="type">
                      <option selected>Choose...</option>
                      <option value="sftp">SFTP</option>
                      <option value="api">API</option>
                    </select>
                  </div>
                </div>  
              </div>
              <div class="form-group row mb-0">
                <div class="col d-flex justify-content-between">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon3">First Element Key</span>
                    </div>
                    <input type="text" class="form-control" id="firstElementKey" aria-describedby="basic-addon3">
                  </div>
                  <div class="input-group mb-3 ms-2">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="datatype">Data Type</label>
                    </div>
                    <select class="form-control" id="datatype">
                      <option selected>Choose...</option>
                      <option value="xml">XML</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary" type="button" onclick="addNewFeed()">Save</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import global from '../stores/global';
import { ref } from 'vue';
import FeedCard from '../components/FeedCard.vue';

export default {
  components:{
    FeedCard
  },
  setup(){
    const feeds = ref([]);
    const store = global();
    
    const feedsData = async () => {
      const response = await fetch('http://localhost:3001/api/feeds', { headers: { authorization: `Bearer ${store.user.token}` }});
      const json = await response.json();
      feeds.value = json.feeds;
    }
    
    feedsData();

    return {
      feeds
    }

  }
}
</script>

<style>

</style>