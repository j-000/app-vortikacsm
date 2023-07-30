<template>
  <div>
    <h1>CMS Editor</h1>
    
    <div class="my-4">
      <button class="btn btn-orange" @click="publishToPreview">Publish to preview</button>
    </div>

    <CodeEditorVue  :templateid="$route.params.templateid"/>
  </div>
</template>

<script>
import CodeEditorVue from "../../components/CodeEditor.vue";
import global from "../../stores/global";
import toast from '../../functions';
import { useRoute } from 'vue-router';


export default {
  components: {
    CodeEditorVue,
  },
  setup() {
    
    const store = global();
    const router = useRoute()

    const publishToPreview = async () => {
      const response = await fetch(`http://localhost:3001/api/cms/templates/${router.params.templateid}`, {
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

    return {
      publishToPreview
    }
  },
};
</script>

<style>
</style>