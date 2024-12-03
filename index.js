import express from 'express'
import cors from 'cors'
import { Expo } from 'expo-server-sdk';

const PORT = process.env.PORT || 8083
const app = express()

const expo = new Expo()

app.use(express.json({ extended: false }))
app.use(cors())

app.get("/health", (req, res) => {
    res.send("ok")
})

app.post("/api/v1/notification/push", async (req, res) => {

    const messages = req.body.notification_tokens.map(pushToken => ({
        to: pushToken,
        title: req.body.title,
        body: req.body.content,
        data: req.body.data
      }
    ))


    // TODO: Handle if google or apple is unable to send notification
    try {
        const resp = await expo.sendPushNotificationsAsync(messages);
     
        res.status(200).json({
            message: "push notification sent successfully",
            success: true
        });

        return
    } catch (error) {
        console.log("SEND PUSH NOTIFICATION ERROR: ", error);

        res.status(500).json({
            message: "unable to send push notification",
            success: false
        });
    }

})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})
