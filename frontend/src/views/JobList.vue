<template>
  <div>
    <h2 class="mb-2">Imported Jobs</h2>
    <p class="mb-0">These fields represent a key in the imported data from the ATS.</p>
    <p>These cannot be reference directly in templates. Instead, these must be first mapped to reserved fields within the Vortika<sup>CSM</sup> app.</p>
    <div class="mt-4">
      <h3>Available fields</h3>
    </div>
    <div class="row">
      <div class="col-lg-3">
        <p>Pages of 25 jobs.</p>
        <form v-if="jobs.length > 0" action="#">
          <div v-for="(prop, index) in allProps" :key="index" class="form-check">
            <input v-model="propsToDisplay" class="form-check-input" type="checkbox" :value="prop" :id="`p${index}`">
            <label class="form-check-label" :for="`p${index}`">{{ prop }} ({{ jobs.filter( j => j.props[prop] !== undefined).length }})</label>
          </div>
        </form>
      </div>
      <div class="col">
        <table v-if="propsToDisplay.length > 0" class="table">
          <thead>
            <tr>
              <th v-for="(prop, i) in propsToDisplay" :key="i">{{ prop }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobs" :key="job._id">
              <td v-for="(prop, i) in propsToDisplay" :key="i">
                <span v-if="job.props[prop] !== undefined">
                  {{ job.props[prop].toString() }}
                </span>
                <span v-else class="text-muted">
                  "{{ prop }}" is not available as a field for job {{ job._id }}. This job is likely from a different source file.
                </span>
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
  </div>
</template>

<script>
import global from '../stores/global';
import toast from '../functions';
import { ref } from 'vue';

export default {
  setup(){
    const store = global();
    const jobs = ref([]);
    const allProps = ref([]);
    const propsToDisplay = ref(['id','title', 'apply_url']);
    const currentPage = ref(1);
    const totalPages = ref(1)

    const importedJobs = async ({page}) => {
      const response = await fetch(`http://localhost:3001/api/jobs?page=${page}`, 
      {headers: {authorization: `Bearer ${store.user.token}`}});
      const json = await response.json();
      if (json.error){ 
        toast(json.error);
      } else {
        jobs.value = json.allJobs;
        currentPage.value = json.currentPage;
        totalPages.value = json.totalPages;
        allProps.value = new Set(Object.keys(json.allJobs[0].props));
      }
    }
    importedJobs({page: 1});

    const nextPage = () => {
      if (currentPage.value > 0 && currentPage.value < totalPages.value) {
        importedJobs({page: currentPage.value + 1});
      }
    } 
    const previousPage = () => {
      if (currentPage.value > 1 && currentPage.value <= totalPages.value) {
        importedJobs({page: currentPage.value - 1});
      }
    }

    return {
      jobs,
      propsToDisplay,
      nextPage,
      previousPage,
      currentPage,
      totalPages,
      allProps
    }
  }
}
</script>

<style>

</style>