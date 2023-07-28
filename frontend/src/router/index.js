import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterPage from '../views/RegisterPage.vue'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import ForgotPwdPage from '../views/ForgotPwdPage.vue'
import FeedsPage from '../views/FeedsPage.vue'
import FeedDetailsPage from '../views/FeedDetailsPage.vue'
import globalStore from '../stores/global';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPwdPage
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: HomeView
    },
    {
      path: '/feeds',
      name: 'feeds',
      component: FeedsPage
    },
    {
      path: '/feeds/:feedid',
      name: 'feed-details',
      component: FeedDetailsPage
    },
    {
      path: '/cms-edit-bdp',
      name: 'cms-edit-bdp',
      component: HomeView
    },
    {
      path: '/cms-edit-adp',
      name: 'cms-edit-adp',
      component: HomeView
    },
    {
      path: '/cms-edit-srp',
      name: 'cms-edit-srp',
      component: HomeView
    },
    {
      path: '/cms-publish-preview',
      name: 'cms-publish-preview',
      component: HomeView
    },
    {
      path: '/cms-publish-live',
      name: 'cms-publish-live',
      component: HomeView
    },
    {
      path: '/logout',
      name: 'logout',
      component: HomeView,
    }
  ]
})

router.beforeEach((to, from, next) => {
  const store = globalStore();
  const allowedRoutes = ['home', 'register', 'login', 'forgot-password', 'logout'];
  if (allowedRoutes.includes(to.name)){
    // Allowed routes;
    next();
  } else {
    // Check user object is in store. No need to validate token as that is done in the server.
    if (store.user){
      next()
    } else {
      return next({name: 'login'});
    }
  }
})

export default router
