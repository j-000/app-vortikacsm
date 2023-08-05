<template>
  <div class="mb-5">
    <a @click="runImporter" class="btn btn-primary mb-3" href="#">Run Importer</a>
    <FeedCard :feedid="$route.params.feedid" />
    <div class="row">
      <div class="col">
        <div class="card mt-4">
          <div class="card-header">
            <div class="col">
              <div class="d-flex justify-content-between">
                <h5 class="mb-1 card-title">Source Fields</h5>
              </div>
            </div>
          </div> 
          <div class="card-body" id="sourceFieldsList" style="height: 20em; overflow-y: scroll">
          <ul v-if="feed">
            <li v-for="sf in feed.sourceFields" :key="sf">{{ sf }}</li>
          </ul>
          </div>
        </div>
      </div>
      <div class="col">
        <MappingFields v-if="feed" :feedObj="feed" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <FeedJobs v-if="feed" :feedid="feed._id" />
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import toast from "../functions";
import global from "../stores/global";
import FeedCard from "../components/FeedCard.vue";
import MappingFields from "../components/MappingFields.vue";
import FeedJobs from "../components/FeedJobs.vue";
import { ref } from "vue";

export default {
  components: {
    FeedCard,
    MappingFields,
    FeedJobs
  },
  setup() {
    const store = global();
    const router = useRoute();
    const feed = ref();
    const route = useRoute()
    
    const getFeed = async () => {
      const response = await fetch(
        `http://localhost:3001/api/feeds/${route.params.feedid}`,
        { headers: { authorization: `Bearer ${store.user.token}` } }
      );
      const json = await response.json();
      if (json.feed) {
        feed.value = json.feed;
      } else {
        toast(json.error);
      }
    }
    getFeed();

    const runImporter = async () => {
      const response = await fetch(`http://localhost:3001/api/feeds/${router.params.feedid}/run-import`, { 
        method: 'post',
        headers: { authorization: `Bearer ${store.user.token}`}});
      const json = await response.json()
      if(json.success){
        toast(json.success);
      } else {
        toast(json.error);
      }
    }

    return {
      runImporter,
      feed
    };
  },
};
</script>

<style>
</style>