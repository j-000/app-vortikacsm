<template>
  <div>
   <RouterLink :to="{name: 'feed-details', params: {feedid: feedid}}" class="card border-left-primary shadow mb-3">
    <div v-if="ready" class="card-body py-2">
      <div class="row no-gutters align-items-center">
        <div class="col mr-2">
          <div class="d-flex justify-content-between">
            <div>
              <h5 class="mb-1 card-title">{{feedData.name}}</h5>
              <span v-if="!mappingsDone" class="badge bg-danger me-2">Missing mappings</span>
              <span v-if="!feedData.cron" class="badge bg-danger me-2">Missing cron</span>
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
          <small><i class="fas fa-file-import"></i> Last import {{$moment(feedData.lastImport).fromNow()}}</small>
          <small v-if="nextImport"><i class="fas fa-clock"></i> Next import {{ $moment(nextImport).fromNow() }}</small>
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
import { RouterLink } from 'vue-router';
import parser from 'cron-parser'
import Api from '../services/Api';

export default {
    props: {
        feedid: String
    },
    setup(props) {
      console.log();
      const ready = ref(false);
      const feedData = ref({});
      const mappingsDone = ref(true);
      const nextImport = ref();
      
      const feed = async () => {
          const json = await Api.getFeedById(props.feedid);
          feedData.value = json.feed;
          ready.value = true;
          if(json.feed.cron) {
            nextImport.value = parser.parseExpression(json.feed.cron).next().toDate()
          }
      };
      feed();

      return {
          ready,
          feedData,
          mappingsDone,
          nextImport
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