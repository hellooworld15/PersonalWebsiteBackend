import * as dotenv from 'dotenv';
dotenv.config();

import https from 'https';
import fs from 'fs';
 
import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import * as fetch from 'node-fetch';

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

if (process.env.NODE_ENV === 'production') {
    const privateKey  = fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH, 'utf8');
    const certificate = fs.readFileSync(process.env.SSL_SERVER_CERT_PATH, 'utf8');

    const credentials = {key: privateKey, cert: certificate};
    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(port);
} else {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    })
}
