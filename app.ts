import { ESRCH } from "constants";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";


const app = express();
const port = 3001;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/contact', (req, res) => {
    console.log(req.body);
    const { name, email, note } = req.body;

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

    res.send('Thank you for your message.');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})


