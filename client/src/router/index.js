import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Conference from '../views/Conference.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/About.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/conference',
    name: 'Conference',
    component: Conference,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/Chat.vue'),
  },
  {
    path: '/chat/:id',
    name: 'ChatId',
    props: true,
    component: () => import('../views/Chat.vue'),
  },
  {
    path: '/private/:id',
    name: 'privateId',
    props: true,
    component: () => import('../views/privateChat.vue'),
  },
  {
    path: '/private',
    name: 'private',
    component: () => import('../views/privateChat.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
