<template>
  <div class="mb-5">
    <div class="d-flex justify-content-between">
      <button @click="runImporter" class="btn btn-primary mb-3">Run Importer</button>
      <a href="#" type="button" data-bs-toggle="modal" data-bs-target="#settingsModal">Edit feed settings</a>
    </div>
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

    <!-- Modal -->
    <div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Settings</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col">
                <h5>Cron</h5>
                <p>Start typying your cron expression and a helper description will show once the expression is valid.</p>
                <p>A valid expression must include 5 elements with a space in between. Example: 0 12 * * *.</p>
                <div class="input-group">
                  <input v-model="cronInput" type="text" class="form-control" placeholder="* * * * *" aria-label="Cron" aria-describedby="basic-addon2">
                </div>
                <div v-if="cronInputReadable" class="bg-light p-2 mt-4">
                  <p class="mt-2 mb-0">With this expression</p>
                  <ul>
                    <li>Runs <strong>{{ cronInputReadable.toLowerCase() }}</strong></li>
                    <li>Next run on <strong>{{ nextRun }}</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="closeSettingsModal">Close</button>
            <button @click="saveFeedSettings" type="button" class="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import toast from "../../functions";
import FeedCard from "../../components/FeedCard.vue";
import MappingFields from "../../components/MappingFields.vue";
import FeedJobs from "../../components/FeedJobs.vue";
import { ref, watch } from "vue";
import parser from 'cron-parser';
import cronstrue from 'cronstrue';
import Api from '../../services/Api';


export default {
  components: {
    FeedCard,
    MappingFields,
    FeedJobs
  },
  setup() {
    const router = useRoute();
    const feed = ref();
    const route = useRoute()
    const cronInput = ref('')
    const cronInputReadable = ref()
    const nextRun = ref()
    
    const getFeed = async () => {
      const json = await Api.getFeedById(route.params.feedid);
      if (json.feed) {
        feed.value = json.feed;
      } else {
        toast(json.error);
      }
    }
    getFeed();

    const saveFeedSettings = async () => {
      const json = await Api.updateFeed(route.params.feedid, { 
        cron: cronInput.value
      })
      if(json.success){
        toast(json.success);
        document.querySelector('#closeSettingsModal').click();
      } else {
        toast(json.error);
      }
    }

    const runImporter = async () => {
      const json = await Api.runImporter(router.params.feedid)
      if(json.success){
        toast(json.success);
      } else {
        toast(json.error);
      }
    }

    watch(cronInput, async (newValue, oldValue) => {
      let value = '';
      let nextValue = '';
      try {
        value = cronstrue.toString(newValue);
        nextValue = parser.parseExpression(newValue).next().toString();
      } catch (error) {
        // Do nothing. Invalid string can't be parsed.
      }
      nextRun.value = nextValue;
      cronInputReadable.value = value;
    })

    return {
      runImporter,
      feed,
      cronInputReadable,
      cronInput,
      nextRun,
      saveFeedSettings
    };
  },
};
</script>

<style>
</style>