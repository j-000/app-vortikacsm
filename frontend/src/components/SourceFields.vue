<template>
  <div class="card mt-4">
    <div class="card-header">
      <div class="col">
        <div class="d-flex justify-content-between">
          <h5 class="mb-1 card-title">Source Fields</h5>
        </div>
      </div>
    </div>
    <div
      class="card-body"
      id="sourceFieldsList"
      style="height: 20em; overflow-y: scroll"
    >
    <ul>
      <li v-for="sf in fields" :key="sf">{{ sf }}</li>
    </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import global from '../stores/global';

export default {
  props:{
    feedid: String
  },
  setup(props){
    const fields = ref({});
    const store = global();
    const sourceFields = async () => {
      const response = await fetch(
        `http://localhost:3001/api/feeds/${props.feedid}/source-fields`,
        { headers: { authorization: `Bearer ${store.user.token}` } }
      );
      const json = await response.json();
      if (json.success) {
        fields.value = json.props;
      } else {
        toast(json.error);
      }
    };
    sourceFields();

    return {
      fields
    }
  }
};
</script>


<style>
</style>