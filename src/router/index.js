import { createRouter, createWebHistory } from 'vue-router'
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Editprofile from '../views/Editprofile.vue';
import store from '../store/index.js';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // { path: '/', redirect: '/login' },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {requiresAuth: false}
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {requiresAuth: false}
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {requiresAuth: true}
    },
    {
      path: '/dashboard/edit-profile',
      name: 'edit-profile',
      component: Editprofile,
      meta: {requiresAuth: true}
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn;

  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    next('/login');
  } else if (isLoggedIn && (to.path === '/login' || to.path === '/signup')) {
    // Logged-in user trying to access login/signup, redirect to dashboard
    next('/dashboard');
  } else {
    next();
  }
});


export default router
