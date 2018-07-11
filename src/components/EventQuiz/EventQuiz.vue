<template>
  <div v-if="event">
    <div class="header">
      <h1 class="heading">{{ event.title }}</h1>
      <h2 class="title">Konkurs</h2>
    </div>
    <template v-if="activeQuestion && !activeQuestion.drawing && !activeQuestion.winner">
      <div class="success" v-if="successMessage">{{successMessage}}</div>
      <div class="error" v-if="errorMessage">{{errorMessage}}</div>

      <h2 class="question" v-if="!alreadySubmitted">{{activeQuestion.question}}</h2>

      <form v-on:submit.prevent="onSubmit" v-if="!alreadySubmitted">
        <label
          v-for="option in activeQuestion.answers"
          v-bind:key="activeQuestion.id + option.id"
          v-bind:class="[{ 'is-checked': form.answer === option.id }, 'mdl-radio mdl-js-radio is-upgraded answer']">
          <input
            type="radio"
            v-model="form.answer"
            class="mdl-radio__button"
            :value="option.id"
          >
          <span class="mdl-radio__label">{{option.answer}}</span>
          <span class="mdl-radio__outer-circle"></span>
          <span class="mdl-radio__inner-circle"></span>
        </label>
        <mdl-button class="mdl-js-ripple-effect submit-btn" colored raised :disabled="!form.answer">Wyślij</mdl-button>
      </form>
    </template>

    <template v-if="activeQuestion && activeQuestion.drawing">
      <div class="info">
        <p>Trwa losowanie!</p>
        <mdl-progress indeterminate></mdl-progress>
      </div>
    </template>

    <template v-if="activeQuestion && !activeQuestion.drawing && activeQuestionSubmissionKey && activeQuestionSubmission && activeQuestion.winner && activeQuestion.winner !== activeQuestionSubmissionKey">
      <div class="info" v-if="activeQuestion.correctAnswer === activeQuestionSubmission.answer">
        <p>Byłeś blisko, ale tym razem się nie udało. Dziękujemy za udział w konkursie!</p>
      </div>
      <div class="info" v-else>
        <p>Niestety Twoja odpowiedź nie była prawidłowa. Dziękujemy za udział w konkursie!</p>
      </div>
    </template>
  
    <template v-if="activeQuestion && !activeQuestion.drawing && activeQuestionSubmissionKey && activeQuestion.winner === activeQuestionSubmissionKey">
      <div class="info">
        <i class="win-icon material-icons">grade</i>
        <p>Gratulacje! Twoją wygraną jest:</p>
        <div class="reward">
          <p>{{activeQuestion.reward}}</p>
        </div>
      </div>
    </template>

    <template v-if="!activeQuestion || (activeQuestion.winner && !activeQuestionSubmissionKey)">
      <div class="info">
        <p>Wkrótce pojawi się tutaj pytanie konkursowe!</p>
      </div>
    </template>
  </div>
</template>

<script src="./EventQuiz.js">
</script>
<style scoped lang="scss" src="./EventQuiz.scss">
</style>
