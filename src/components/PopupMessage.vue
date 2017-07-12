<template>
  <div class="snackbars-container">
    <!--<transition-group name="list" tag="p">-->
    <div v-for="item in messagesToShow" class="list-item">
      <div class="snackbar">
        <div class="text">{{ item.text }}</div>
        <div class="btn" @click="removeSnackbar(item.id)">Close</div>
      </div>
    </div>
    <!--</transition-group>-->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import findIndex from 'lodash/findIndex';
import { actionTypes as eventAction } from '../store/modules/events';

const maxMessagesShown = 5;
const snackbarTimeout = 5000000000;

export default {
  name: 'PopupMessage',
  data() {
    return {
      messageQueue: [],
      messagesToShow: [],
    };
  },
  computed: {
    ...mapState({
      message: state => state.events.popupMessage,
    }),
  },
  methods: {
    insertWithTimeout(array, element) {
      const index = `id-${(new Date()).getTime()}`;
      array.push({
        id: index,
        text: element,
      });

      setTimeout(() => {
        const foundIndex = findIndex(this.messagesToShow, item => item.id === index);
        this.messagesToShow.splice(foundIndex, 1);
      }, snackbarTimeout);
    },
    removeSnackbar(id) {
      const index = findIndex(this.messagesToShow, item => item.id === id);
      this.messagesToShow.splice(index, 1);
    },
  },
  watch: {
    message(val) {
      if (val) {
        this.$store.dispatch(eventAction.CLEAR_POPUP_MESSAGE);

        if (this.messagesToShow.length < maxMessagesShown) {
          this.insertWithTimeout(this.messagesToShow, val);
        } else {
          this.messageQueue.push(val);
        }
      }
    },
    messagesToShow(val) {
      if (val.length < maxMessagesShown && this.messageQueue.length > 0) {
        this.insertWithTimeout(this.messagesToShow, this.messageQueue.shift());
      }
    },
  },
};
</script>

<style scoped lang="scss">
.snackbars-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: -2px;
  transform: translate(-50%, 0);
  left: 50%;
  z-index: 3;

  .snackbar {
    color: white;
    padding: 15px 20px 17px;
    border-radius: 2px;
    margin-top: 2px;
    cursor: default;
    background-color: #323232;
    display: flex;
    justify-content: space-between;
    min-width: 300px;
    max-width: 520px;

    .text {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .btn {
      margin-left: 20px;
      text-transform: uppercase;
      color: #ff7626;
      cursor: pointer;
    }
  }
}

//TODO: enable animations
// .list-enter-active,
// .list-leave-active {
//   transition: all 1s;
// }
// .list-enter,
// .list-leave-to {
//   opacity: 0;
//   transform: translateY(20px);
// }
</style>
