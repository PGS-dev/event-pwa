const functions = require('firebase-functions');
const axios = require('axios');

// https://console.cloud.google.com/functions/list
// Documentation: https://firebase.google.com/preview/functions

exports.sendPushNotification = functions.https.onRequest((req, res) => {
  axios({
    method: 'post',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      Authorization:
        'key=AAAAeWqfyYY:APA91bE0lEe1dBqhSnEc7QiE7wCxhWKaDwSjoAUlU6pW-c4yQ-JXe0z_A1dMc62mCtmvOK8uM8V4Rw3PvwsDcvz5l70hsvv-KqBMnyzGkjb3y3FUpFRmc8J5UBZXT8yQN6zfNChvVgKVk3Mp4j21wEWf7lghJqSYag',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      notification: {
        title: 'PGS Events',
        body: Buffer.from(req.query.content, 'base64').toString(),
        icon: 'img/icons/android-chrome-144x144.png',
        click_action: req.query.action,
      },
      to: req.query.to,
    }),
  })
    .then(() => res.status(200).send('Notification sent!'))
    .catch(error => res.status(400).send(error));
});

exports.topicAssignment = functions.https.onRequest((req, res) => {
  axios({
    method: 'post',
    url: `https://iid.googleapis.com/iid/v1/${req.query.token}/rel/topics/${
      req.query.topic
    }`,
    headers: {
      Authorization:
        'key=AAAAeWqfyYY:APA91bE0lEe1dBqhSnEc7QiE7wCxhWKaDwSjoAUlU6pW-c4yQ-JXe0z_A1dMc62mCtmvOK8uM8V4Rw3PvwsDcvz5l70hsvv-KqBMnyzGkjb3y3FUpFRmc8J5UBZXT8yQN6zfNChvVgKVk3Mp4j21wEWf7lghJqSYag',
      'Content-Type': 'application/json',
    },
  })
    .then(() => res.status(200).send('Topic assigned!'))
    .catch(error => res.status(400).send(error));
});
