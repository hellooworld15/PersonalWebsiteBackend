import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;
const discordWebhookURL = process.env.DISCORD_WEBHOOK;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/contact', async (req, res) => {
    console.log(req.body);
    const { name, email, note } = req.body;

    // Validation
    if (!name) {
        res.status(400);
        res.send("Missing name.");
        return;
    }
    if (!email) {
        res.status(400);
        res.send("Missing email.");
        return;
    }
    if (!note) {
        res.status(400);
        res.send("Missing note.");
        return;
    }
    
    // Send to discord
    let rawPayloadString = `-----\nname: ${name}\nemail: ${email}\nnote: ${note}\n-----`

    const payloadStrings = [];

    while (rawPayloadString.length > 0) {
        payloadStrings.push(rawPayloadString.slice(0, 2000))
        rawPayloadString = rawPayloadString.slice(2000)
    }
    
    for (const payload of payloadStrings) {
        await fetch(discordWebhookURL, {
            method: "POST", 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({content: payload})
        }).then(async (res) => {console.log(await res.text())});
    }

    res.send('Thank you for your message.');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})


