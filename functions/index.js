const functions = require('firebase-functions');
const axios = require('axios');

// https://console.cloud.google.com/functions/list
// Documentation: https://firebase.google.com/preview/functions

exports.sendPushNotification = functions.https.onRequest((req, res) => {
  axios({
    method: 'post',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      Authorization: 'key=AAAAopeh0As:APA91bERg9sohkj3qYbCPrLa_CD4pTG7XEoPTBjEptJCUMarmanYXkeyV3kVb9a5nWEgyQ74Y_oEeQ-TOEDT0IibDvqgyJMoP1YNk66OTbGTR-fSJ9j8yamGApRPNSNdcryPc5Pcp32SeT4OhSIew5-pzR7bRE6MYg',
      'Content-Type': 'application/json',
    },
    data: {
      notification: {
        title: 'PGS Events',
        body: Buffer.from(req.query.content, 'base64').toString(),
        icon: 'icons/android-chrome-144x144.png',
        click_action: req.query.action,
      },
      to: req.query.to,
    },
  })
    .then(() => res.status(200).send('Notification sent!'))
    .catch(error => res.status(400).send(error));
});

exports.topicAssignment = functions.https.onRequest((req, res) => {
  axios({
    method: 'post',
    url: `https://iid.googleapis.com/iid/v1/${req.query.token}/rel/topics/${req.query.topic}`,
    headers: {
      Authorization: 'key=AAAAopeh0As:APA91bERg9sohkj3qYbCPrLa_CD4pTG7XEoPTBjEptJCUMarmanYXkeyV3kVb9a5nWEgyQ74Y_oEeQ-TOEDT0IibDvqgyJMoP1YNk66OTbGTR-fSJ9j8yamGApRPNSNdcryPc5Pcp32SeT4OhSIew5-pzR7bRE6MYg',
      'Content-Type': 'application/json',
    },
  })
    .then(() => res.status(200).send('Topic assigned!'))
    .catch(error => res.status(400).send(error));
});
