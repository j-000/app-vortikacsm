<template>
  <div>
    <div id="editor"></div>
    <div class="mt-3 d-flex justify-content-between">
      <p></p>
      <button class="btn-primary btn" @click="saveFile">Save</button>
    </div>
  </div>
</template>

<script>
import global from '../stores/global';
import toast from '../functions';

export default {
  props: {
    templateid: String
  },
  setup(props) {
    const store = global();

    const initAceEditor = async () => {
      const editor = window.ace.edit('editor');
      editor.setTheme('ace/theme/monokai');
      editor.session.setMode('ace/mode/html');
      editor.setOption("showPrintMargin", false);
      const response = await fetch(`http://localhost:3001/api/cms/templates/${props.templateid}`, {
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
      const response = await fetch(`http://localhost:3001/api/cms/templates/${props.templateid}`, {
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
    
    return {
      saveFile
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