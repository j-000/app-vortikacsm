<template>
  <div class="card mt-4">
    <div class="card-header">
      <div class="col">
        <div class="d-flex justify-content-between">
          <h5 class="mb-1 card-title">
            Mapping Fields <span id="mappingsCompleted"></span>
          </h5>
          <button @click="saveNewMappings" class="btn btn-primary btn-sm">Save</button>
        </div>
      </div>
    </div>
    <div class="card-body p-0" style="height: 20em; overflow-y: scroll">
      <div class="accordion accordion-flush" id="accordionone">
        <div
          v-for="[p, v] in Object.entries(mappingFields)"
          :key="p"
          class="accordion-item"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#flush-collapse${p}`"
              aria-expanded="false"
              aria-controls="flush-collapseTwo"
            >
              <strong> 
                <i v-if="v.mappedTo.sourceField" class="fa-solid fa-check text-success"></i> 
                @{{ p }}</strong>
              <small v-if="v.isRequired" class="ms-2 text-danger">Required</small>
            </button>
          </h2>
          <div
            :id="`flush-collapse${p}`"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionone"
          >
            <div class="accordion-body">

              <div class="input-group mb-3">
                <label class="input-group-text" :for="`inputGroupSelect01${p}`"
                  >Map to source field</label
                >
                <select
                  v-model="newMappings[p].mappedTo.sourceField"
                  class="form-select"
                  :id="`inputGroupSelect01${p}`"
                >
                  <option value="none">** None **</option>
                  <option v-for="sf in sourceFields" :key="sf" :value="sf">
                    {{ sf }}
                  </option>
                </select>
              </div>

              <!-- TODO:  https://github.com/j-000/vortikacsm/issues/16 -->
              <!-- <div class="form-floating">
                <textarea
                  :disabled="newMappings[p] != `none`"
                  v-model="newMappings.jsfunction"
                  @keyup="highlightCode"
                  rows="5"
                  class="form-control"
                  id="floatingTextarea">
                </textarea>
                <label for="floatingTextarea" class=""
                  >Map to JavaScript function
                </label>
              </div>
              <pre class="hljs mt-3 p-4" v-html="hl"></pre> -->

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import global from "../stores/global";
import hljs from '../hljs';
import toast from '../functions';

export default {
  props: {
    feedObj: Object,
  },
  setup(props) {
    const mappingFields = ref({});
    const sourceFields = ref(props.feedObj.sourceFields);
    const store = global();
    const newMappings = ref({});
    
    const getFeedMappings = async () => {
      const response = await fetch(
        `http://localhost:3001/api/mappings/feed/${props.feedObj._id}`,
        { headers: { authorization: `Bearer ${store.user.token}` } }
      );
      const json = await response.json();
      if (json.success) {
        mappingFields.value = json.mappings.props;
        // Add placeholders for newMappings
        Object.keys(json.mappings.props).forEach(k => {
          newMappings.value[k] = json.mappings.props[k];
        })
      } else {
        toast(json.error);
      }
    };
    getFeedMappings();

    const saveNewMappings = async () => {
      const response = await fetch(`http://localhost:3001/api/mappings/feed/${props.feedObj._id}`, {
        method: 'post',
        headers: {
          authorization: `Bearer ${store.user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ props: newMappings.value })
      });
      const json = await response.json();
      if (json.success) {
        toast('Success! Mappings updated.');
        getFeedMappings();
      } else {
        toast(json.error);
      }
    }




    // Highlight code
    const hl = ref('');
    const highlightCode = () => {
      hl.value = hljs.highlight(newMappings.value.jsfunction, {language: 'javascript'}).value;
    }

    return {
      mappingFields,
      sourceFields,
      newMappings,
      saveNewMappings,

      hl,
      highlightCode
    };
  },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/monokai.min.css');
#floatingTextarea {
  height: unset;
}
</style>