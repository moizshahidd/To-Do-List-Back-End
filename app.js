const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const User = require('./User');
const Event = require('./Event');
const List = require('./List');


const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const port = 9000;

app.use(cors());
app.use(bodyParser.json());

const user = new User();
const event = new Event();
const list = new List();


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


function verifytoken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        console.log("Authorization header missing");
        return res.status(401).send("Token Invalid!");
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received:", token);

    if (!token) {
        console.log("Token missing");
        return res.status(401).send("Token Invalid!");
    }
    else {
        req.token = token;
        next();
    }
}

app.post('/SignUP', user.SignUP.bind(user));
app.get('/CheckEmail', user.CheckEmail.bind(user));
app.get('/DatabyID/:ID', verifytoken, user.DatabyID.bind(user));
app.post('/ImageUpload', upload.single('image'), verifytoken, user.ImageUpload.bind(user));
app.get('/Login', user.Login.bind(user));
app.delete('/DeleteAccount/:ID', verifytoken, user.DeleteAccountParmanent.bind(user));
app.delete('/DeleteImage/:ID', verifytoken, user.DeleteImage.bind(user));
app.put('/UpdateUser/:ID', verifytoken, user.UpdateUser.bind(user));
app.post('/AddEvents/:ID', verifytoken, event.AddEvents.bind(event));
app.get('/getData/:ID', verifytoken, event.getData.bind(event));
app.delete('/DeleteEvent/:ID', verifytoken, event.DeleteEvent.bind(event));
app.put('/UpdateEvent/:ID', verifytoken, event.UpdateEvent.bind(event));
app.post('/AddTask/:ID', verifytoken, list.AddTask.bind(list));
app.get('/getTaskData/:ID', verifytoken, list.getTaskData.bind(list));
app.delete('/DeleteTask/:ID', verifytoken, list.DeleteTask.bind(list));
app.put('/UpdateTask/:ID', verifytoken, list.UpdateTask.bind(list));
app.put('/UpdateTaskDone/:ID', verifytoken, list.UpdateTaskDone.bind(list));

