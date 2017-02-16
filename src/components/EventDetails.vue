<template>
  <div v-if="event">
    <div class="header">
      <h1 class="heading">Agenda</h1>
      <h2 class="title">{{ event.title }}</h2>
    </div>
    <div class="agenda" v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
import marked from 'marked';
import { db } from '../firebase';

export default {
  name: 'EventDetails',
  data() {
    return {
      event: null,
    };
  },
  computed: {
    compiledMarkdown() {
      return marked(this.event.agenda, { gfm: true, tables: true, breaks: true });
    },
  },
  created() {
    const selectedSeoSlug = this.$route.params.seoSlug;
    const self = this;
    const eventRef = db.ref('events').orderByChild('seoSlug').equalTo(selectedSeoSlug);

    eventRef.on('child_added', (snapshot) => {
      self.event = snapshot.val();
    });
  },
};

</script>

<style lang="scss">

  .header {
    background-color: #f9f9f9;
    margin: -15px -15px 0 -15px;
    padding: 15px;
    border-bottom: 1px solid #dcdcdc;
  }

  .heading {
    font-size: 20px;
    margin: 0;
    color: rgba(0, 0, 0, .26);
  }

  .title {
    font-size: 24px;
    line-height: 24px;
    margin: 0;
  }

  .agenda {
    ul {
      list-style-type: none;
      margin: 0;
      padding: 20px 0 0 0;
      font-size: 16px;

      li {
        border-bottom: 1px solid #dcdcdc;
        padding: 8px 0;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

</style>
