import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from './firebase';
import EventsList from './components/EventsList';
import EventDetails from './components/EventDetails';
import EventQuiz from './components/EventQuiz/EventQuiz.vue';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import AdminEventQuestions from './components/AdminEventQuestions';

Vue.use(VueRouter);

const requireAuth = (to, from, next) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user && !user.isAnonymous) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  });
};

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', name: 'events', component: EventsList },
    { path: '/event/:seoSlug', name: 'agenda', component: EventDetails },
    { path: '/event/:seoSlug/konkurs', name: 'quiz', component: EventQuiz },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/admin', name: 'admin', component: AdminPage, beforeEnter: requireAuth },
    { path: '/admin/:seoSlug/konkurs', name: 'adminQuiz', component: AdminEventQuestions },
  ],
});

export default router;
