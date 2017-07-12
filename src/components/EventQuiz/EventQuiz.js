import { mapState } from 'vuex';
import find from 'lodash/find';
import get from 'lodash/get';
import { actionTypes as eventAction } from '../../store/modules/events';
import lf from '../../localforage';

export default {
  name: 'EventQuiz',
  data() {
    return {
      errorMessage: null,
      successMessage: null,
      formSent: false,
      alreadySubmitted: null,
      activeQuestionSubmissionKey: null,
      savedSubmissions: [],
      form: {
        answer: '',
      },
    };
  },
  computed: {
    activeQuestion() {
      return find(this.event.questions, { active: true });
    },
    ...mapState({
      event: state => state.events.selectedEvent,
    }),
  },
  methods: {
    onSubmit() {
      const data = { ...this.form, questionId: this.activeQuestion.id };

      if (!this.alreadySubmitted) {
        this.$store.dispatch(eventAction.SAVE_PARTICIPANT, data)
        .then(() => {
          this.alreadySubmitted = true;
          this.successMessage = 'Dziękujemy za udział w konkursie!';

          this.savedSubmissions.push(data);
          lf.setItem('submissions', this.savedSubmissions);
        }).catch((error) => {
          this.errorMessage = error.code;
        });
      }
    },
  },
  created() {
    this.$store.dispatch(eventAction.GET_EVENT_DETAILS).then(() => {
      this.form.answer = '';
      lf.getItem('submissions').then((values) => {
        this.savedSubmissions = values || [];
        this.activeQuestionSubmission = this.activeQuestion ? find(this.savedSubmissions,
          s => s.eventKey === this.form.eventKey && s.questionId === this.activeQuestion.id) : null;
        this.activeQuestionSubmissionKey = get(this.activeQuestionSubmission, 'key');
        this.alreadySubmitted = !!this.activeQuestionSubmission;
        if (this.alreadySubmitted) {
          this.successMessage = 'Dziękujemy za udział w konkursie!';
        } else {
          this.successMessage = null;
        }
      });
    });
  },
};
