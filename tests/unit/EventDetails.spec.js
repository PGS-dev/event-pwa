import Vue from 'vue';
import EventDetails from '@/components/EventDetails';
import router from '@/router';

describe('EventDetails.vue', () => {
  const event = { title: '1', agenda: 'Title1' };

  const Constructor = Vue.extend(EventDetails);
  const vm = new Constructor({
    router,
    data: {
      event,
      $route: {
        params: {
          seoSlug: 'Abcd',
        },
      },
    },
  }).$mount();

  it('should render proper title', () => {
    expect(vm.$el.querySelector('.title').innerText).to.equal(event.title);
  });
});
