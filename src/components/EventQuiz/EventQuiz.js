import { mapState } from 'vuex';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
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
    ...mapState({
      activeQuestion: (state) => {
        // convert to array
        const selectedEventQuestions = state.events.selectedEvent ? map(state.events.selectedEvent.questions, v => v) : [];
        return find(selectedEventQuestions, 'active');
      },
      event: state => state.events.selectedEvent,
    }),
  },
  methods: {
    onSubmit() {
      const data = {
        ...this.form,
        questionId: this.activeQuestion.id,
        eventKey: this.event.id,
        fcmToken: get(this.$store, 'state.user.data.token', null),
      };

      if (!this.alreadySubmitted) {
        this.$store.dispatch(eventAction.SAVE_PARTICIPANT, data)
        .then(() => {
          this.alreadySubmitted = true;
          this.successMessage = 'Dziękujemy za udział w konkursie!';

          this.savedSubmissions.push(data);
        }).catch((error) => {
          this.errorMessage = error.code;
        });
      }
    },
    checkSubmission() {
      this.form.answer = '';
      lf.getItem('submissions').then((values) => {
        this.savedSubmissions = values || [];
      });
    },
  },
  watch: {
    activeQuestion(newActiveQuestion) {
      const self = this;
      lf.getItem('submissions').then((values) => {
        self.savedSubmissions = values || [];
        self.activeQuestionSubmission = newActiveQuestion ? find(self.savedSubmissions,
          s => s.eventKey === self.event.id && s.questionId === newActiveQuestion.id) : null;
        self.activeQuestionSubmissionKey = get(self.activeQuestionSubmission, 'id');
        self.alreadySubmitted = !!self.activeQuestionSubmission;

        if (self.alreadySubmitted) {
          self.successMessage = 'Dziękujemy za udział w konkursie!';
        } else {
          self.successMessage = null;
        }
      });
    },
  },
  created() {
    this.$store.dispatch(eventAction.GET_EVENT_DETAILS).then(() => this.checkSubmission());
  },
};
