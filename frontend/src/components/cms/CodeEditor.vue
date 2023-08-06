<template>
  <div>
    <RouterLink :to="{name: 'feeds'}">
      <div v-if="editorAlertMessage" class="alert alert-danger">
        <span class="navbar-text">{{ editorAlertMessage }}</span>
      </div>
    </RouterLink>
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
import toast from '../../functions';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import Api from '../../services/Api';

export default {
    props: {
        templateid: String
    },
    setup(props) {
        const fields = ref();
        const router = useRouter();
        const editorAlertMessage = ref();
        const initAceEditor = async () => {
            const editor = window.ace.edit('editor');
            editor.setTheme('ace/theme/monokai');
            editor.session.setMode('ace/mode/html');
            editor.setOption("showPrintMargin", false);
            const json = await Api.getPageById(props.templateid);
            if (json.error) {
                disableEditor();
                toast(json.error);
            }
            setValue(json.fileContent);
        };
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/ace-builds@1.23.4/src-min-noconflict/ace.min.js';
        script.async = true;
        script.onload = initAceEditor;
        document.body.appendChild(script);
        const editorValue = () => {
            var editor = window.ace.edit("editor");
            return editor.getValue();
        };
        const setValue = (v) => {
            var editor = window.ace.edit("editor");
            editor.setValue(v);
        };
        const disableEditor = () => {
            var editor = window.ace.edit("editor");
            editor.setReadOnly(true);
        };
        const saveFile = async () => {
            const json = await Api.updatePageById(props.templateid, { newContent: editorValue() });
            if (json.error) {
                toast(json.error);
            }
            else {
                toast(json.message);
            }
        };
        const getMappingFields = async () => {
            const json = await Api.getMappings();
            if (json.error) {
                toast(json.error);
            }
            else {
                const mappingsCompleted = json.allMappings.filter(mappingDoc => mappingDoc.requiredMappingComplete);
                const mappingsNotCompleted = json.allMappings.filter(mappingDoc => !mappingDoc.requiredMappingComplete);
                if (mappingsCompleted.length > 0) {
                    fields.value = Object.keys(mappingsCompleted[0].props);
                }
                if (mappingsNotCompleted.length > 0) {
                    if (mappingsNotCompleted.length == 1) {
                        editorAlertMessage.value = `${mappingsNotCompleted.length} feed doesn't have mappings. Click on this alert to fix this.`;
                    }
                    else {
                        editorAlertMessage.value = `${mappingsNotCompleted.length} feeds don't have mappings. Click on this alert to fix this.`;
                    }
                }
            }
        };
        const addField = (field) => {
            var editor = window.ace.edit("editor");
            editor.session.insert(editor.getCursorPosition(), `{{ ${field} }}`);
        };
        const closeFile = async () => {
            saveFile();
            router.push({ name: 'themes-list' });
        };
        getMappingFields();
        return {
            saveFile,
            fields,
            editorAlertMessage,
            addField,
            closeFile
        };
    },
    components: { RouterLink }
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/ace-builds@1.23.4/css/ace.min.css');
a {
  text-decoration: none;
}
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