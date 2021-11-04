import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Search from '@/views/Search.vue';

import NProgress from '@/assets/nprogress.js';
import '@/assets/nprogress.css';

const routes = [
  {
    path: '/',
    name: 'Search and Explore Twitter Spaces',
    component: Home,
  },
  // {
  //   path: '/search',
  //   name: 'Search and Explore Twitter Spaces',
  //   component: Search,
  // },
  // {
  //   path: '/space/:id',
  //   name: 'Space',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
  {
    path: '/about',
    name: 'All About It',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes,
});


/* Adding the progress loading bar */

// https://github.com/egoist/vue-content-loader?ref=madewithvuejs.com

// https://www.digitalocean.com/community/tutorials/add-loading-indicators-to-your-vuejs-application

/* Updating the page titles for routes */
router.beforeEach((to, from, next) => {
  if ( to.name )
    document.title = `${process.env.VUE_APP_TITLE} - ${to.name}`;
  
  next();
});

NProgress.configure({ showSpinner: false });
router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    //document.title = `${process.env.VUE_APP_TITLE} - ${to.name}`;
    // Start the route progress bar.
    NProgress.start();
  }
  next();
});

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});



export default router;
