# PGS Events

> A Progressive Web App based on Vue.js & Firebase

## Installation

```
# install dependencies
npm install

# install Firebase tools
npm install -g firebase-tools
```

---

## Build Setup

```bash
# serve with hot reload
npm run serve

# build for production
npm run build

# run unit tests
npm test
```

---

## Moving to another account

- Create new Firebase project
- Copy firebase config to src/firebase.js
- Copy messagingSenderId to firebase service worker (public/firebaseServiceWorker.js)
- Copy Cloud Messaging Server Key (Project settings > Cloud Messaging tab) to Cloud functions Authorization headers
- Import database backup file (JSON) to Realtime Database
- Create admin account (Authentication tab)
- Add database rules:

```
{
  "rules": {
	"participants": {
      ".read": "true",
      ".write": "true"
    },
    "events": {
      ".read": "true",
      ".write": "auth.uid === 'YOUR_ADMIN_AUTH_ID' || auth.uid === 'YOUR_ANOTHER_ADMIN_AUTH_ID'",
      ".indexOn": "seoSlug",
      "$event": {
        "quizUsers": {
          ".write": "true"
        },
        "agendaUsers": {
          ".write": "true"
        },
      }
    }
  }
}
```

- Change Firebase active project:

```bash
# Print a list of all of your Firebase projects.
firebase list

# Set active Firebase project, manage project aliases.
firebase use YOUR_PROJECT_ID
```

---

## Deployment

```bash
# login (first time only)
firebase login

# deploy everything
firebase deploy

#deploy all functions
firebase deploy --only functions

#deploy one function
firebase deploy --only functions:funcName
```

---

For detailed explanation on how things work, checkout [docs for vue-cli](https://cli.vuejs.org/).
