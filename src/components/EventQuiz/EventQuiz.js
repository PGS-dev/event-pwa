import find from 'lodash/find';
import get from 'lodash/get';
import { db } from '../../firebase';
import lf from '../../localforage';

export default {
  name: 'EventQuiz',
  data() {
    return {
      event: null,
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
  },
  methods: {
    onSubmit() {
      const self = this;
      const data = { ...this.form, questionId: this.activeQuestion.id };

      if (!this.alreadySubmitted) {
        data.key = db.ref('participants').push(data, (error) => {
          if (error) {
            self.errorMessage = error.code;
            return;
          }

          this.alreadySubmitted = true;
          self.successMessage = 'Dziękujemy za udział w konkursie!';
        }).key;
        this.savedSubmissions.push(data);
        lf.setItem('submissions', this.savedSubmissions);
      }
    },
  },
  created() {
    const selectedSeoSlug = this.$route.params.seoSlug;
    const self = this;
    const eventRef = db.ref('events').orderByChild('seoSlug').equalTo(selectedSeoSlug);

    eventRef.on('child_added', (snapshot) => {
      self.form.eventKey = snapshot.key;
    });

    eventRef.on('value', (snapshot) => {
      self.event = find(snapshot.val(), e => e);
      this.form.answer = '';

      lf.getItem('submissions').then((values) => {
        this.savedSubmissions = values || [];
        this.activeQuestionSubmission = this.activeQuestion ? find(this.savedSubmissions,
          s => s.eventKey === this.form.eventKey && s.questionId === this.activeQuestion.id) : null;
        this.activeQuestionSubmissionKey = get(this.activeQuestionSubmission, 'key');
        this.alreadySubmitted = !!this.activeQuestionSubmission;
        if (this.alreadySubmitted) {
          self.successMessage = 'Dziękujemy za udział w konkursie!';
        } else {
          self.successMessage = null;
        }
      });
    });
  },
};
