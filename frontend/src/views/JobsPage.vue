<template>
  <div>
    <h1 class="mb-2">Imported Jobs</h1>
    <p class="mb-0">These fields represent a key in the imported data from the ATS.</p>
    <p>These cannot be reference directly in templates. Instead, these must be first mapped to reserved fields within the Vortika<sup>CSM</sup> app.</p>
    <div class="row my-2">
      <div class="col-lg-3">
        <h2>Available fields</h2>
        <form v-if="jobs" action="#">
          <div v-for="(prop, index) in Object.keys(jobs[0].props).sort()" :key="index" class="form-check">
            <input v-model="propsToDisplay" class="form-check-input" type="checkbox" :value="prop" :id="`p${index}`">
            <label class="form-check-label" :for="`p${index}`">{{ prop }}</label>
          </div>
        </form>
      </div>
      <div class="col">
        <h2>Jobs</h2>
        <table class="table">
          <thead>
            <tr>
              <th v-for="(prop, i) in propsToDisplay" :key="i">{{ prop }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobs" :key="job._id">
              <td v-for="(prop, i) in propsToDisplay" :key="i">
                {{ job.props[prop] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ul>
      
      <!-- <li v-for="job in jobs" :key="job._id">
        {{ Object.keys(job.props) }}
      </li> -->
    </ul>
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
    const propsToDisplay = ref([]);
    const importedJobs = async () => {
      const response = await fetch(`http://localhost:3001/api/jobs`, {headers: {authorization: `Bearer ${store.user.token}`}});
      const json = await response.json();
      if (json.error){ 
        toast(json.error);
      } else {
        jobs.value = json.allJobs;
      }
    }
    importedJobs();
    return {
      jobs,
      propsToDisplay
    }
  }
}
</script>

<style>

</style>