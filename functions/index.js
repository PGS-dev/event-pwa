const functions = require('firebase-functions');
const axios = require('axios');

// https://console.cloud.google.com/functions/list
// Documentation: https://firebase.google.com/preview/functions

exports.sendPushNotification = functions.https.onRequest((req, res) => {
  axios({
    method: 'post',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      Authorization: 'key=AIzaSyDuQXKoPMYNbPr5QefXS7GM108GuhUmr9g',
      'Content-Type': 'application/json',
    },
    data: {
      notification: {
        title: 'PGS Events',
        body: `Gratulacje! Twoją wygraną jest: ${req.query.reward}`,
        icon: 'icons/android-chrome-144x144.png',
        click_action: req.query.action,
      },
      to: req.query.token,
    },
  })
    .then(() => res.status(200).send('Notification sent!'))
    .catch(error => res.status(400).send(error));
});
