var admin = require('firebase-admin');
var serviceAccount = require('./helmholtzapp-firebase-adminsdk-ycdfq-4f96b7a433.json');
var app
exports.initializeMessaging = async function () {
    app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://HelmholtzApp.firebaseio.com'
    });
    return admin.messaging()
}

exports.shutdown = async function () 
    app.delete().then(function () {
        console.log("App deleted successfully")
    })
    //delete
}

exports.pushTopic = async function (messaging, topic, body) {
    // See documentation on defining a message payload.
    if (topic.trim().slice(-1) == ".") return
    var topicArray = topic.split(".")
    var message = {
        notification: {
            title: "Update im Vetretungsplan",
            body: "Änderung bei der " + topicArray[topicArray.length -1]
        },
        topic: topic
    }

    // Send a message to devices subscribed to the provided topic.
    await admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);

        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}
