import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase)

exports.newSubcriberNotification = functions.firestore
    .document('usuarios/{usuarioId}').onCreate( async event=>{
        const user = event.data();
        const userId = event.id;
    }

    )
