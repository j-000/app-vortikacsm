<template>
  <div>
    <h1>CMS Editor</h1>
    <CodeEditorVue  :templateid="$route.params.templateid"/>
  </div>
</template>

<script>
import CodeEditorVue from "../../components/CodeEditor.vue";

export default {
  components: {
    CodeEditorVue,
  },
  setup() {
  },
};
</script>

<style>
</style>