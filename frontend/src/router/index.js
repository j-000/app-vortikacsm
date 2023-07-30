import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import RegisterPage from '../views/RegisterPage.vue'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import ForgotPwdPage from '../views/ForgotPwdPage.vue'
import FeedsPage from '../views/FeedsPage.vue'

import DraftPages from '../views/cms/DraftPages.vue'
import PreviewPages from '../views/cms/PreviewPages.vue'
import LivePages from '../views/cms/LivePages.vue'

import LearnCSM from '../views/learn/Main.vue'
import CMSEditorPage from '../views/cms/CMSEditor.vue'
import FeedDetailsPage from '../views/FeedDetailsPage.vue'
import LogoutPage from '../views/LogoutPage.vue'
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
      path: '/cms/editor/:templateid',
      name: 'cms-editor',
      component: CMSEditorPage
    },
    {
      path: '/feeds/:feedid',
      name: 'feed-details',
      component: FeedDetailsPage
    },
    {
      path: '/draft-pages',
      name: 'draft-pages',
      component: DraftPages
    },
    {
      path: '/preview-pages',
      name: 'preview-pages',
      component: PreviewPages
    },
    {
      path: '/live-pages',
      name: 'live-pages',
      component: LivePages
    },
    {
      path: '/learn',
      name: 'learn',
      component: LearnCSM
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutPage,
    }
  ]
})

router.beforeEach((to, from, next) => {
  const store = globalStore();
  const allowedRoutes = ['home', 'register', 'login', 'forgot-password', 'logout'];
  if (allowedRoutes.includes(to.name)){
    if (to.name == 'logout') {
      // delete user data from store. This forces logout;
      // Do not set this to empty {} as that evaluates to true.
      store.updateUser(false);
    }
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
