import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import '@/assets/main.css';

/* Import all the font awesome goodness */
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

library.add(fas, faTwitter)

dom.watch()


createApp(App).use(store).use(router).mount('#app');