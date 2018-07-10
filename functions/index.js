const functions = require('firebase-functions');
const axios = require('axios');

// https://console.cloud.google.com/functions/list
// Documentation: https://firebase.google.com/preview/functions

exports.sendPushNotification = functions.https.onRequest((req, res) => {
  axios({
    method: 'post',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      Authorization: 'key=AAAArWP9p4E:APA91bFcMYiATl4upR2zmk96m-QXZ6WOgI1PbIZseu2nl5m_kb1ONMcR61sMtmHgEycU2u4JRJkIGh8U3DmVkOjVWIRp4RDGi8PpH9fw0DNMsZTUzOMt4NHGOOZGAj6Ki_9vvt0uoxBiedzQatsNY3YITuNYNea-BA',
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
    url: `https://iid.googleapis.com/iid/v1/${req.query.token}/rel/topics/${req.query.topic}`,
    headers: {
      Authorization: 'key=AAAArWP9p4E:APA91bFcMYiATl4upR2zmk96m-QXZ6WOgI1PbIZseu2nl5m_kb1ONMcR61sMtmHgEycU2u4JRJkIGh8U3DmVkOjVWIRp4RDGi8PpH9fw0DNMsZTUzOMt4NHGOOZGAj6Ki_9vvt0uoxBiedzQatsNY3YITuNYNea-BA',
      'Content-Type': 'application/json',
    },
  })
    .then(() => res.status(200).send('Topic assigned!'))
    .catch(error => res.status(400).send(error));
});
