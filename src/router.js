import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from './firebase';
import EventsList from './components/EventsList';
import EventDetails from './components/EventDetails';
import EventQuiz from './components/EventQuiz/EventQuiz.vue';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import AdminEventQuestions from './components/AdminEventQuestions';
import AdminEditEvent from './components/AdminEditEvent';
import AdminAddEvent from './components/AdminAddEvent';
import AdminEditQuestion from './components/AdminEditQuestion';
import AdminAddQuestion from './components/AdminAddQuestion';

Vue.use(VueRouter);

const requireAuth = (to, from, next) => {
  firebase.auth().onAuthStateChanged(user => {
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
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
      beforeEnter: requireAuth,
    },
    {
      path: '/admin/:seoSlug/konkurs',
      name: 'adminQuestions',
      component: AdminEventQuestions,
      beforeEnter: requireAuth,
    },
    {
      path: '/admin/:seoSlug/konkurs/:questionId/edycja',
      name: 'adminEditQuestion',
      component: AdminEditQuestion,
      beforeEnter: requireAuth,
    },
    {
      path: '/admin/:seoSlug/konkurs/nowe-pytanie',
      name: 'adminAddQuestion',
      component: AdminAddQuestion,
      beforeEnter: requireAuth,
    },
    {
      path: '/admin/:seoSlug/edycja',
      name: 'adminEditEvent',
      component: AdminEditEvent,
      beforeEnter: requireAuth,
    },
    {
      path: '/admin/nowe-wydarzenie',
      name: 'adminAddEvent',
      component: AdminAddEvent,
      beforeEnter: requireAuth,
    },
  ],
});

export default router;
