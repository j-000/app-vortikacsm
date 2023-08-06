<template>
  <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3 mt-3">
      <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <i class="fas fa-tornado"></i>
          <strong class="me-auto ml-2">Vortika<sup>CSM</sup></strong>
          <small id="toastTime"></small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body"></div>
      </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>