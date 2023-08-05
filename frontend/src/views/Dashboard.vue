<template>
  <div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h2 class="mb-0 text-gray-800">Dashboard</h2>
    </div>
    <div class="row">
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-primary shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Feeds</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800" id="feedsCount">
                  <span v-if="totalFeeds !== false">{{ totalFeeds }}</span>
                  <div v-else class="spinner-border text-secondary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-rss fa-2x text-muted"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-primary shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Users</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800" id="usersCount">
                  <span v-if="totalUsers !== false">{{ totalUsers }}</span>
                  <div v-else class="spinner-border text-secondary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-user fa-2x text-muted"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-primary shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Jobs</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800" id="jobsCount">
                  <span v-if="totalJobs !== false">{{ totalJobs }}</span>
                  <div v-else class="spinner-border text-secondary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-briefcase fa-2x text-muted"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-primary shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Themes</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800" id="themesCount">
                  <span v-if="totalThemes !== false">{{ totalThemes }}</span>
                  <div v-else class="spinner-border text-secondary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-file-lines fa-2x text-muted"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globalStore from '../stores/global';
import toast from '../functions.js';
import { ref } from 'vue';

export default {
  setup(){
    const store = globalStore();
    const totalFeeds = ref(false);
    const totalJobs = ref(false);
    const totalUsers = ref(false);
    const totalThemes = ref(false);

    const dbinfo = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dashboard-info', 
          { headers: { authorization: `Bearer ${store.user.token}` } });
        const json = await response.json();
        if (json.error) {
          toast(json.error);
        } else {
          totalFeeds.value = json.totalFeeds;
          totalJobs.value = json.totalJobs;
          totalUsers.value = json.totalUsers;
          totalThemes.value = json.totalThemes;
        }
      } catch (error) {
        toast(error);
      }

    };

    dbinfo();

    return {
      totalFeeds,
      totalJobs,
      totalUsers,
      totalThemes
    }
  }
}
</script>

<style>

</style>