<template>
  <div class="mb-5">
    <a @click="runImporter" class="btn btn-primary mb-3" href="#">Run Importer</a>
    <FeedCard :feedid="$route.params.feedid" />
    <div class="row">
      <div class="col">
        <SourceFields :feedid="$route.params.feedid" />
      </div>
      <div class="col">
        <MappingFields :feedid="$route.params.feedid" />
      </div>
    </div>
    <FeedJobs :feedid="$route.params.feedid" />
    <ImportHistory :feedid="$route.params.feedid" />
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import toast from "../functions";
import global from "../stores/global";
import FeedCard from "../components/FeedCard.vue";
import SourceFields from "../components/SourceFields.vue";
import MappingFields from "../components/MappingFields.vue";
import FeedJobs from "../components/FeedJobs.vue";
import ImportHistory from "../components/ImportHistory.vue";

export default {
  components: {
    FeedCard,
    MappingFields,
    SourceFields,
    FeedJobs,
    ImportHistory
  },
  setup() {
    const store = global();
    const router = useRoute();
    

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
      runImporter
    };
  },
};
</script>

<style>
</style>