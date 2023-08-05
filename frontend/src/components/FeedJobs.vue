<template>
  <div class="card mt-4">
    <div class="card-header">
      <div class="col">
        <div class="d-flex justify-content-between">
          <h5 class="mb-1 card-title">Feed Jobs</h5>
        </div>
      </div>
    </div>
    <div class="card-body">
      
      <table class="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th colspan="2" class="text-center">Links</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job._id">
            <td>{{ job.props.id.toString() }}</td>
            <td>{{ job.props.title.toString() }}</td>
            <td>
              <a :href="`${preview_url}/jobs/${orgid}/${job._id}`" target="_blank">Preview</a>
            </td>
            <td>
              <a :href="`${live_url}/jobs/${orgid}/${job._id}`" target="_blank">Live</a>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-between">
          <ul class="pagination">
            <li class="page-item">
              <a @click.prevent="previousPage" class="page-link" href="#">Previous</a>
            </li>
            <li class="page-item">
              <a @click.prevent="nextPage" class="page-link" href="#">Next</a>
            </li>
          </ul>
          <span class="text-muted">Page {{ currentPage }} of {{ totalPages }}</span>
        </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import global from '../stores/global';
import toast from '../functions';

export default {
  props: {
    feedid: String
  },
  setup(props){
    const store = global();
    const jobs = ref();
    const currentPage = ref(1);
    const totalPages = ref(1);
    const preview_url = store.domains.preview;
    const live_url = store.domains.live;
    const orgid = store.user.orgid;

    const getJobs = async ({page}) => {
      const response = await fetch(`http://localhost:3001/api/jobs/feed/${props.feedid}?page=${page}`, 
      {headers: {authorization: `Bearer ${store.user.token}`}});
      const json = await response.json();
      if (json.error){ 
        toast(json.error);
      } else {
        jobs.value = json.allJobs;
        currentPage.value = json.currentPage;
        totalPages.value = json.totalPages;
      }
    }
    getJobs({page: 1});

    return {
      jobs,
      preview_url,
      live_url,
      orgid,
      currentPage,
      totalPages
    }
  }
};
</script>

<style scoped>

</style>