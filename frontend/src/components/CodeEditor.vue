<template>
  <div>
    <a href="#" class="btn btn-primary mb-3">Save</a>
    <div id="editor"></div>
  </div>
</template>

<script>
import global from '../stores/global';

export default {
  props: {
    templateid: String
  },
  setup(props) {
    const store = global();
    
    const editorValue = () => {
      var editor = window.ace.edit("editor");
      return editor.getValue();
    }

    const setValue = (v) => {
        var editor = window.ace.edit("editor");
        editor.setValue(v);
    }

    const setTemplateContent = async () => {
      const response = await fetch(`http://localhost:3001/api/cms/templates/${props.templateid}`, {
        headers: { authorization: `Bearer ${store.user.token}`}
      });
      const json = await response.json();
      setValue(json.templateContent);
    }

    const initAceEditor = () => {
      const editor = window.ace.edit('editor');
      editor.setTheme('ace/theme/monokai');
      editor.session.setMode('ace/mode/html');
      editor.setOption("showPrintMargin", false)
      setTemplateContent();
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/ace-builds@1.23.4/src-min-noconflict/ace.min.js';
    script.async = true;
    script.onload = initAceEditor;
    document.body.appendChild(script);
    

  }
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/ace-builds@1.23.4/css/ace.min.css');
#editor{
    height: 500px;
    width: 100%;
}

</style>