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
        'key=AAAAzbXh_ek:APA91bF-Z071ktmlekqG_eKs0R0FmcN_8773OL3ii8kC6awvgrrYlzgUYA9bEuz6hd7IYW9PDype4lnM5lwO8YDL24T5pUPHrcn-xfX0gxWmwC9P4qMoJcYZz08OzEXqtp5S7At4plxQ_rtmWaX2k2u_HtwKtfezyw',
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
        'key=AAAAzbXh_ek:APA91bF-Z071ktmlekqG_eKs0R0FmcN_8773OL3ii8kC6awvgrrYlzgUYA9bEuz6hd7IYW9PDype4lnM5lwO8YDL24T5pUPHrcn-xfX0gxWmwC9P4qMoJcYZz08OzEXqtp5S7At4plxQ_rtmWaX2k2u_HtwKtfezyw',
      'Content-Type': 'application/json',
    },
  })
    .then(() => res.status(200).send('Topic assigned!'))
    .catch(error => res.status(400).send(error));
});
