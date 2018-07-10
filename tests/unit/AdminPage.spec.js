import Vue from 'vue';
import router from '@/router';
import AdminPage from '../../src/components/AdminPage.vue';

describe('AdminPage.vue', () => {
  const events = [
    { title: '1', participants: '11', seoSlug: 'Slug1' },
    { title: '2', participants: '12', seoSlug: 'Slug2' },
    { title: '3', participants: '13', seoSlug: 'Slug3' },
  ];

  const Constructor = Vue.extend(AdminPage);
  const vm = new Constructor({
    router,
    data: {
      events,
    },
  }).$mount();

  it('should render appropriate amount of events', () => {
    expect(vm.$el.querySelectorAll('tbody tr').length).to.equal(3);
  });

  it('should render proper title', () => {
    expect(
      vm.$el.querySelectorAll('tbody tr')[0].querySelectorAll('td')[0]
        .innerText,
    ).to.equal(events[0].title);
  });

  it('should render proper participants amount', () => {
    expect(
      vm.$el.querySelectorAll('tbody tr')[0].querySelectorAll('td')[1]
        .innerText,
    ).to.equal(events[0].participants);
  });

  it('Konkurs - should render <a> tag with proper href ', () => {
    expect(vm.$el.querySelectorAll('a.mdl-button')[0].href).to.contain(
      `/admin/${events[0].seoSlug}/konkurs`,
    );
  });
});
