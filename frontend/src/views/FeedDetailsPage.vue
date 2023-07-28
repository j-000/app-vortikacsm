<template>
  <div>
    <FeedCard :feedid="$route.params.feedid"/>

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
          <div class="card-body" id="sourceFieldsList" style="height: 15em; overflow-y: scroll;">
            
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card mt-4">
          <div class="card-header">
            <div class="col">
              <div class="d-flex justify-content-between">
                <h5 class="mb-1 card-title">Mappings <span id="mappingsCompleted"></span></h5>
                <button class="btn btn-primary btn-sm">Save</button>
              </div>
            </div>
          </div>
          <div class="card-body p-0" style="height: 15em; overflow-y: scroll;">
            <div class="accordion" id="accordionExample">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header">
        <div class="col">
          <div class="d-flex justify-content-between">
            <h5 class="mb-1 card-title">Jobs</h5>
          </div>
        </div>
      </div>
      <div class="card-body">
        Paginated jobs here...
        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-center mb-0">
            <li class="page-item disabled">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
            </li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item">
              <a class="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header">
        <div class="col">
          <div class="d-flex justify-content-between">
            <h5 class="mb-1 card-title">History</h5>
          </div>
        </div>
      </div>
      <div class="card-body">
        Feed import history here...
      </div>
    </div>
  </div>
</template>

<script>
import FeedCard from '../components/FeedCard.vue';

export default {
  components:{
    FeedCard
  },
  setup(){

  }
}
</script>

<style>

</style>