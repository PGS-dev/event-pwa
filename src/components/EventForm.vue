<template>
  <form class="input-container mdl-shadow--3dp" v-on:submit.prevent="onSubmit">
    <mdl-textfield floating-label="Tytuł" v-model="event.title" required></mdl-textfield>
    <mdl-textfield floating-label="Opis" v-model="event.desc"></mdl-textfield>
    <mdl-textfield floating-label="Adres obrazka" v-model="event.imageUrl" required></mdl-textfield>
    <mdl-textfield floating-label="SEO Slug" v-model="event.seoSlug" required></mdl-textfield>
    <mdl-textfield floating-label="Agenda" textarea rows="8" v-model="event.agenda"></mdl-textfield>
    <div @click="showPreview" class="agenda-preview">
      <p class="agenda-preview-title">Podgląd agendy</p>
      <i v-bind:class="{ 'is-rotated': showAgenda }" class="material-icons">chevron_right</i>
    </div>
    <div class="agenda" v-if="showAgenda" v-html="compiledMarkdown"></div>
    <mdl-checkbox v-model="event.active">Wydarzenie aktywne</mdl-checkbox>
    <mdl-checkbox v-model="event.open">Konkurs aktywny</mdl-checkbox>
    <button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
      Zapisz
    </button>
  </form>
</template>

<script>
  import marked from 'marked';

  export default {
    name: 'EventForm',
    data() {
      return {
        showAgenda: false,
      };
    },
    props: {
      event: {
        default() {
          return {
            title: '',
            desc: '',
            agenda: '',
            imageUrl: '',
            active: false,
            open: false,
            id: '',
            seoSlug: '',
          };
        },
      },
    },
    computed: {
      compiledMarkdown: props => marked(
        props.event.agenda,
        { gfm: true, tables: true, breaks: true },
      ),
    },
    methods: {
      onSubmit() {
        const thisEvent = this.event;
        const formPayload = {
          active: thisEvent.active,
          agenda: thisEvent.agenda,
          desc: thisEvent.desc,
          imageUrl: thisEvent.imageUrl,
          open: thisEvent.open,
          seoSlug: thisEvent.seoSlug,
          title: thisEvent.title,
        };
        this.$emit('submitted', formPayload);
      },
      showPreview() {
        this.showAgenda = !this.showAgenda ? this.showAgenda = true : this.showAgenda = false;
      },
    },
  };

</script>

<style scoped lang="scss">

  .input-container {
    padding: 10px;
    background: #f9f9f9;
    max-width: 800px;
    margin: 0 auto 0 auto;

    .mdl-textfield {
      width: 800px;
      display: inline-block;
    }

    .mdl-textarea {
      margin-right: 20px;
    }

    .mdl-checkbox {
      margin-bottom: 10px;
    }

    .agenda-preview {
      display: flex;
      align-items: center;
      cursor: pointer;
      width: 140px;
      transition: 0.3s color;
      padding-bottom: 15px;

      &-title {
        font-size: 16px;
        margin: 0;
      }

      &:hover {
        color: #ff7626;
      }
    }

    .agenda {
      background-color: white;
      padding: 0 15px;
    }
  }

  .mdl-button {
    margin-right: 0;
    margin-left: 0;
  }

  .material-icons {
    transition: 0.3s transform;
  }

  .is-rotated {
    transform: rotate(90deg);
  }

</style>
