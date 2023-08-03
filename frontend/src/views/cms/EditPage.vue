<template>
  <div>
    <h1>Vortika<sup>CSM</sup> editor</h1> 
    <CodeEditorVue  :templateid="$route.params.templateid"/>
    <button @click="publishToPreview" class="btn btn-orange">Publish to preview</button>
  </div>
</template>

<script>
import CodeEditorVue from "../../components/CodeEditor.vue";
import global from "../../stores/global";
import toast from '../../functions';
import { useRoute } from 'vue-router';
import { ref } from "vue";


export default {
  components: {
    CodeEditorVue,
  },
  setup() {
    
    const store = global();
    const router = useRoute();

    const publishToPreview = async () => {
      if (confirm('Publish page to preview?')){
        const response = await fetch(`http://localhost:3001/api/cms/pages/${router.params.templateid}`, {
          method: 'post',
          headers: { authorization: `Bearer ${store.user.token}`, 'Content-Type': 'application/json'},
          body: JSON.stringify({ publish: 'preview' })
        });
        const json = await response.json();
        if (json.error){
          toast(json.error);
        } else {
          toast(json.message);
        }
      }
    } 

     

    return {
      publishToPreview
    }
  },
};
</script>

<style>
</style>