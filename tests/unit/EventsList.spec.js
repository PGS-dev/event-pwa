import Vue from 'vue';
import EventsList from '@/components/EventsList';
import router from '@/router';

describe('EventsList.vue', () => {
  const events = [
    {
      title: '1',
      desc: 'Title1',
      open: true,
      seoSlug: 'Slug1',
    },
    {
      title: '2',
      desc: 'Title2',
      open: true,
      seoSlug: 'Slug2',
    },
    {
      title: '3',
      desc: 'Title3',
      open: false,
      seoSlug: 'Slug3',
    },
  ];

  const Constructor = Vue.extend(EventsList);
  const vm = new Constructor({
    router,
    data: {
      events,
    },
  }).$mount();

  it('should render appropriate amount of events', () => {
    expect(vm.$el.querySelectorAll('.card').length).to.equal(3);
  });

  it('should render proper title', () => {
    expect(
      vm.$el.querySelectorAll('.mdl-card__title-text')[0].innerText,
    ).to.equal(events[0].title);
  });

  it('should render proper description', () => {
    expect(
      vm.$el.querySelectorAll('.mdl-card__supporting-text')[0].innerText.trim(),
    ).to.equal(events[0].desc);
  });

  it('should render appropriate amount of event cards', () => {
    expect(vm.$el.querySelectorAll('.mdl-card__actions').length).to.equal(2);
  });

  it('Konkurs - should render <a> tag with proper href ', () => {
    expect(vm.$el.querySelectorAll('.mdl-button')[0].href).to.contain(
      `/${events[0].seoSlug}/konkurs`,
    );
  });

  it('Agenda - should render <a> tag with proper href ', () => {
    expect(vm.$el.querySelectorAll('.mdl-button')[1].href).to.contain(
      `/event/${events[0].seoSlug}`,
    );
  });
});
