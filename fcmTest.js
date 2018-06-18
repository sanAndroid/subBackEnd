var fcm = require('./sendMessages')


const message = async () => {
    var messaging = fcm.initializeMessaging()
    topic = "com.PiQuadrat.NewsTableViewTest.HhsFra.5a"
    topic = "/topics/de.HhsFra.5a"
    await fcm.pushTopic(messaging,topic, topic)
    await fcm.shutdown()
}

message()