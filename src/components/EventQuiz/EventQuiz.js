import { mapState } from 'vuex';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import axios from 'axios';

import { actionTypes as eventAction } from '../../store/modules/events';
import { actionTypes as userActions } from '../../store/modules/user';
import lf from '../../localforage';

export default {
  name: 'EventQuiz',
  data() {
    return {
      errorMessage: null,
      successMessage: null,
      formSent: false,
      alreadySubmitted: null,
      activeQuestionSubmission: null,
      activeQuestionSubmissionKey: null,
      savedSubmissions: [],
      form: {
        answer: '',
      },
    };
  },
  computed: {
    ...mapState({
      activeQuestion: state => {
        // convert to array
        const selectedEventQuestions = state.events.selectedEvent
          ? map(state.events.selectedEvent.questions, v => v)
          : [];
        return find(selectedEventQuestions, 'active');
      },
      event: state => state.events.selectedEvent,
      token: state => state.user.token,
      assignedTopics: state => state.user.assignedTopics,
    }),
  },
  methods: {
    onSubmit() {
      const data = {
        ...this.form,
        questionId: this.activeQuestion.id,
        eventKey: this.event.id,
        fcmToken: this.token,
      };

      if (!this.alreadySubmitted) {
        this.$store
          .dispatch(eventAction.SAVE_PARTICIPANT, data)
          .then(() => {
            this.alreadySubmitted = true;
            this.successMessage =
              'Dziękujemy za udział w konkursie! Obserwuj naszą aplikację – losowanie już wkrótce.';

            this.savedSubmissions.push(data);
          })
          .catch(error => {
            this.errorMessage = error.code;
          });
      }
    },
    checkSubmission() {
      this.form.answer = '';
      lf.getItem('submissions').then(values => {
        this.savedSubmissions = values || [];
      });
    },
    assignTopic(token) {
      const topic = this.$route.params.seoSlug;
      if (this.assignedTopics.indexOf(topic) === -1) {
        axios.get('/topicAssignment', {
          params: {
            token,
            topic,
          },
        });
        this.$store.dispatch(userActions.TOPIC_ASSIGNED, topic);
      }
    },
  },
  watch: {
    activeQuestion(newActiveQuestion) {
      const self = this;
      lf.getItem('submissions').then(values => {
        self.savedSubmissions = values || [];
        self.activeQuestionSubmission = newActiveQuestion
          ? find(
              self.savedSubmissions,
              s =>
                s.eventKey === self.event.id &&
                s.questionId === newActiveQuestion.id,
            )
          : null;
        self.activeQuestionSubmissionKey = get(
          self.activeQuestionSubmission,
          'id',
        );
        self.alreadySubmitted = !!self.activeQuestionSubmission;

        if (self.alreadySubmitted) {
          self.successMessage = 'Dziękujemy za udział w konkursie!';
        } else {
          self.successMessage = null;
        }
      });
    },
    token(token) {
      this.assignTopic(token);
    },
  },
  created() {
    if (this.token && typeof this.token === 'string') {
      this.assignTopic(this.token);
    }
    this.$store
      .dispatch(eventAction.GET_EVENT_DETAILS)
      .then(() => this.checkSubmission());
  },
};
