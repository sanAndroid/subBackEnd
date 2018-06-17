var admin = require('firebase-admin');
var serviceAccount = require('./helmholtzapp-firebase-adminsdk-ycdfq-4f96b7a433.json');

exports.initializeMessaging = async function (topic) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://HelmholtzApp.firebaseio.com'
    });
    return admin.messaging()
}

exports.pushTopic = async function (messaging,topic,body) {
    // See documentation on defining a message payload.
	if(topic.trim().slice(-1) ==".") return
    var message = {
        notification: {
            title: "Something changed in" + topic,
            body: body
        },
        topic: topic
    }

    // Send a message to devices subscribed to the provided topic.
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
            return
        })
        .catch((error) => {
            console.log('Error sending message:', error);
            return
        });

}
