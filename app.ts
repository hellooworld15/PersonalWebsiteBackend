import { ESRCH } from "constants";
import * as express from "express";

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/contact', (req, res) => {
    const name = req.query.name;
    const email = req.query.email;

    if (!name ) {
        res.status(400);
        res.send("Missing name.");
        return;
    }

    console.log(req.query.name);
    console.log(req.query.email);
    res.send('Thank you for your message');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})