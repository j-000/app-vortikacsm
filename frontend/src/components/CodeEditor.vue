<template>
  <div>
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
              <ul v-if="fields" class="dropdown-menu">
                <li @click="addField(field)" v-for="(field, i) in fields.sort()" :key="i"><a class="dropdown-item" href="#">{{ field }}</a></li>
              </ul>
            </li>
            <!-- <li class="nav-item dropdown">
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
            </li> -->
          </ul>
          <span class="navbar-text text-danger">{{ editorAlertMessage }}</span>
        </div>
      </div>
    </nav>
    <div id="editor"></div>
    <div class="mt-3 d-flex justify-content-between">
      <p></p>
      <div>
        <button class="btn-primary btn me-4" @click="closeFile">Close</button>
        <button class="btn-primary btn" @click="saveFile">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import global from '../stores/global';
import toast from '../functions';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  props: {
    templateid: String
  },
  setup(props) {
    const store = global();
    const fields = ref();
    const router = useRouter();
    const editorAlertMessage = ref();

    const initAceEditor = async () => {
      const editor = window.ace.edit('editor');
      editor.setTheme('ace/theme/monokai');
      editor.session.setMode('ace/mode/html');
      editor.setOption("showPrintMargin", false);
      const response = await fetch(`http://localhost:3001/api/cms/pages/${props.templateid}`, {
        headers: { authorization: `Bearer ${store.user.token}`}
      });
      const json = await response.json();
      if (json.error){
        disableEditor();
        toast(json.error);
      }
      setValue(json.fileContent);
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/ace-builds@1.23.4/src-min-noconflict/ace.min.js';
    script.async = true;
    script.onload = initAceEditor;
    document.body.appendChild(script);
    
     
    const editorValue = () => {
      var editor = window.ace.edit("editor");
      return editor.getValue();
    }

    const setValue = (v) => {
      var editor = window.ace.edit("editor");
      editor.setValue(v);
    }

    const disableEditor = () => {
      var editor = window.ace.edit("editor");
      editor.setReadOnly(true);
    }
    
    const saveFile = async () => {
      const response = await fetch(`http://localhost:3001/api/cms/pages/${props.templateid}`, {
        method: 'put',
        headers: { authorization: `Bearer ${store.user.token}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({
          newContent: editorValue()
        })
      });
      const json = await response.json();
      if (json.error){
        toast(json.error);
      } else {
        toast(json.message);
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

    const addField = (field) => {
      var editor = window.ace.edit("editor");
      editor.session.insert(editor.getCursorPosition(), `{{ ${field} }}`);
    }

    const closeFile = async() => {
      saveFile();
      router.push({name: 'draft-pages'})
    }

    getMappingFields();
    return {
      saveFile,
      fields,
      editorAlertMessage,
      addField,
      closeFile
    }
  }
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/ace-builds@1.23.4/css/ace.min.css');
#editor{
    height: 500px;
    width: 100%;
}
.ace_editor {
  font-size: 15px!important;
}

.btn {
  width: 7em;
}
</style>