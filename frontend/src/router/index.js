import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/public/Home.vue'
import RegisterPage from '../views/public/Register.vue'
import LoginPage from '../views/public/Login.vue'
import DashboardPage from '../views/dashboard/Dashboard.vue'
import ForgotPwdPage from '../views/public/ForgotPwd.vue'
import FeedsPage from '../views/feeds/FeedList.vue'
import JobsPage from '../views/jobs/JobList.vue'
import ThemesList from '../views/cms/Themes.vue'
import UsersPage from '../views/users/UsersPage.vue'
import SettingsPage from '../views/settings/Settings.vue'
import LearnCSM from '../views/learn/Main.vue'
import EditPage from '../views/cms/EditPage.vue'
import FeedDetailsPage from '../views/feeds/FeedDetails.vue'
import LogoutPage from '../views/public/Logout.vue'
import globalStore from '../stores/global';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
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
      component: JobsPage
    },
    {
      path: '/feeds',
      name: 'feeds',
      component: FeedsPage
    },
    {
      path: '/users',
      name: 'users',
      component: UsersPage
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage
    },
    {
      path: '/cms/editor/:templateid',
      name: 'cms-editor',
      component: EditPage
    },
    {
      path: '/feeds/:feedid',
      name: 'feed-details',
      component: FeedDetailsPage
    },
    {
      path: '/themes',
      name: 'themes-list',
      component: ThemesList
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
      // clear store from session storage
      sessionStorage.clear();
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
