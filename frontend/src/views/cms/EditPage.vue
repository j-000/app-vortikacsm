<template>
  <div>
    <h1>Vortika<sup>CSM</sup> editor</h1> 
    <CodeEditorVue  :templateid="$route.params.templateid"/>
    <button @click="publishToPreview" class="btn btn-orange">Publish to preview</button>
  </div>
</template>

<script>
import CodeEditorVue from "../../components/cms/CodeEditor.vue";
import toast from '../../functions';
import { useRoute } from 'vue-router';
import Api from '../../services/Api';


export default {
  components: {
    CodeEditorVue,
  },
  setup() {
    const router = useRoute();

    const publishToPreview = async () => {
      if (confirm('Publish page to preview?')){
        const json = await Api.publishPage(router.params.templateid, { publish: 'preview' });
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

<style scoped>
a {
  text-decoration: none;
}
</style>