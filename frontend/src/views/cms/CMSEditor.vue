<template>
  <div>
    <h1>Vortika<sup>CSM</sup> editor</h1> 
    <nav class="navbar navbar-expand-lg bg-light mt-4">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-asterisk"></i>
                Add field
              </a>
              <ul class="dropdown-menu">
                <li @click="addField(field)" v-for="(field, i) in fields.sort()" :key="i"><a class="dropdown-item" href="#">{{ field }}</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-code"></i>
                Helpers
              </a>
              <ul class="dropdown-menu">
                <li><a href="" class="dropdown-item">If Else</a></li>
                <li><a href="" class="dropdown-item">For In</a></li>
                <li><a href="" class="dropdown-item">Extends Template</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-filter"></i>
                Filter
              </a>
              <ul class="dropdown-menu">
                <li><a href="" class="dropdown-item">Capitalize</a></li>
                <li><a href="" class="dropdown-item">Join</a></li>
                <li><a href="" class="dropdown-item">Length</a></li>
                <li><a href="" class="dropdown-item">Sort</a></li>
                <li><a href="" class="dropdown-item">Lower</a></li>
                <li><a href="" class="dropdown-item">Upper</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-regular fa-file-code"></i>
                Partials
              </a>
              <ul class="dropdown-menu">
                <li><a href="" class="dropdown-item">For Each</a></li>
              </ul>
            </li>
          </ul>
          <span class="navbar-text text-danger">{{ editorAlertMessage }}</span>
        </div>
      </div>
    </nav>
    <CodeEditorVue  :templateid="$route.params.templateid"/>
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
    const fields = ref();
    const editorAlertMessage = ref();

    const publishToPreview = async () => {
      if (confirm('Publish page to preview?')){
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
    } 

    const getMappingFields = async () => {
      const response = await fetch(`http://localhost:3001/api/mappings`, {headers: {authorization: `Bearer ${store.user.token}`}});
      const json = await response.json();
      if(json.error){
        toast(json.error);
      } else {
        const completed = json.allMappings.find(mappingDoc => mappingDoc.requiredMappingComplete);
        if (completed !== null || completed !== undefined) {
          fields.value = Object.keys(completed.props);
        } else {
          editorAlertMessage.value = 'No mappings set. Please complete these first.'
        }
      }
    }
    getMappingFields();


    const addField = (field) => {
      var editor = window.ace.edit("editor");
      editor.session.insert(editor.getCursorPosition(), `{{ ${field} }}`);
    } 

    return {
      publishToPreview,
      fields,
      addField
    }
  },
};
</script>

<style>
</style>