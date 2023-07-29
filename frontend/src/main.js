import './assets/main.css'
import './assets/b.js'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import moment from 'moment';

const app = createApp(App)
const momentPlugin = {
    install(app) {
        // Attach moment to Vue 3 global properties, to make it globally available.
        // https://vuejs.org/guide/reusability/plugins.html#writing-a-plugin
        app.config.globalProperties.$moment = moment
    }
}
app.use(createPinia())
app.use(router)
app.use(momentPlugin)
app.mount('#app')
