<template>
  <div>
   <RouterLink :to="{name: 'feed-details', params: {feedid: feedid}}" class="card border-left-primary shadow mb-3">
    <div v-if="ready" class="card-body py-2">
      <div class="row no-gutters align-items-center">
        <div class="col mr-2">
          <div class="d-flex justify-content-between">
            <div>
              <h5 class="mb-1 card-title">{{feedData.name}}</h5>
              <span v-if="!mappingsDone" class="badge bg-danger">Missing mappings</span>
            </div>
            
            <small class="text-muted">
              <span class="badge text-bg-light">{{feedData._id}}</span> |
              <span class="badge text-bg-light">orgid: {{feedData.orgid}}</span>
            </small>
          </div>
        </div>
      </div>
      <div class="row no-gutters align-items-center mt-2">
        <div class="col mr-2">
          <p class="card-title">
            <span class="badge text-bg-light">{{feedData.type.toUpperCase()}}</span>
            <span class="badge text-bg-light">{{feedData.dataType.toUpperCase()}}</span>
            <span class="ml-3 text-muted">{{feedData.url}}</span>
          </p>
        </div>
        <div class="col-auto">
          <i class="fa-solid fa-rss fa-2x animate-pulse text-success"></i>
        </div>
      </div>
      <div class="row no-gutters align-items-center">
        <div class="col mr-2 d-flex justify-content-around">
          <span><i class="fas fa-briefcase"></i> {{feedData.totalFeedJobs}} Jobs</span> 
          <span class="text-success"><i class="fas fa-triangle-exclamation"></i> 0 Failures</span> 
          <small class="text-muted"><i class="fas fa-file-import"></i> Last import {{$moment(feedData.lastImport).fromNow()}}</small>
        </div>
      </div>
    </div>
    <div v-else class="spinner-border text-secondary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
   </RouterLink>
  </div>
  
</template>

<script>
import { ref } from 'vue';
import global from '../stores/global';
import { RouterLink } from 'vue-router';


export default {
    props: {
        feedid: String
    },
    setup(props) {
      const ready = ref(false);
      const store = global();
      const feedData = ref({});
      const mappingsDone = ref(true);

      const feed = async () => {
          const response = await fetch(`http://localhost:3001/api/feeds/${props.feedid}`, { headers: { authorization: `Bearer ${store.user.token}` } });
          const json = await response.json();
          feedData.value = json.feed;
          ready.value = true;
      };
      feed();

      const feedMappings = async () => {
        const response = await fetch(`http://localhost:3001/api/mappings/feed/${props.feedid}`, { headers: { authorization: `Bearer ${store.user.token}` } });
        const json = await response.json();
        if (json.success) {
          mappingsDone.value = json.requiredMappingComplete;
        }
      }
      feedMappings();
      return {
          ready,
          feedData,
          mappingsDone
      };
    },
    components: { RouterLink }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>