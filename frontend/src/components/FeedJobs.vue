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
      Paginated jobs here...
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center mb-0">
          <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1" aria-disabled="true"
              >Previous</a
            >
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
</template>

<script>
export default {
  props: {
    feedid: String
  }
};
</script>

<style>
</style>