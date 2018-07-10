<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-container">

        <div class="modal-header">
          <h3>Jesteś pewien?</h3>
        </div>

        <div class="modal-body">
          <slot name="body">
            default body
          </slot>
        </div>

        <div class="modal-footer">
          <button
            class="mdl-button mdl-button--accent mdl-button--raised mdl-js-button mdl-js-ripple-effect"
            @click="$emit('delete')"
          >
            Tak
          </button>
          <button
            class="mdl-button mdl-button--raised mdl-js-button mdl-js-ripple-effect"
            @click="$emit('close')"
          >
            Nie
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DeleteModal',
};
</script>

<style scoped lang="scss">
$tablet: 767px;
$mobile: 380px;

.modal {
  &-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s ease;
  }

  &-container {
    text-align: center;
    width: 300px;
    margin: 0 auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;

    @media (max-width: $mobile) {
      box-sizing: border-box;
      width: 100vw;
    }
  }

  &-header h3 {
    margin-top: 0;
  }

  &-body {
    margin: 20px 0;
  }

  &-footer {
    display: flex;
    justify-content: space-around;
  }
  /*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     */
  &-enter,
  &-leave-active {
    opacity: 0;
  }

  &-enter &-container,
  &-leave-active &-container {
    transform: scale(1.05);
  }
}

.mdl-button {
  padding-right: 50px;
  padding-left: 50px;
}
</style>
