const Db = require('./Database.js');
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const SecretKey = 'TodoList';

class Event {
    constructor() {
        Db.connect();
    }

    async AddEvents(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            } else {
                const ID = uuidv4();
                const UserId = req.params.ID;
                const EventName = req.body.EventName;
                try {
                    await Db.GetQuery()`insert into Event(ID,EventName,UserId)
                                        values (${ID},${EventName}, ${UserId})`;
                    res.status(201).send('Event created!');

                }
                catch (err) {
                    console.error('Error while Creating Event.', err);
                    res.status(500).send('Error while Creating Event.');
                }
            }
        })
    }

    async getData(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            } else {
                const ID = req.params.ID;
                try {
                    const result = await Db.GetQuery()`select * from Event where UserId = ${ID}`;
                    const Data = result.recordset.map(record => record);
                    res.status(201).json(Data);
                }
                catch (err) {
                    console.error('Error while Getting Event.', err);
                    res.status(500).send('Error while Getting Event.');
                }
            }
        })
    }

    async DeleteEvent(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            } else {
                const Id = req.params.ID;
                const ids = req.body.selectedEvent;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return res.status(400).send({ err: 'Please provide an array of IDs' });
                }
                try {
                    const arr = [];
                    for (let i = 0; i < ids.length; i++) {
                        Db.GetQuery()`Delete from TodoList where EventId = ${ids[i]}`;
                        Db.GetQuery()`Delete from Event where Id = ${ids[i]} and UserId = ${Id}`;
                        arr.push(ids[i]);
                    }
                    res.status(200).send(`${arr.length} records deleted successfully`);
                }
                catch (err) {
                    console.error('Error while Deleting EventData.', err);
                    res.status(500).send('Error while Deleting EventData.');
                }
            }
        })

    }

    async UpdateEvent(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            } else {
                const Id = req.params.ID;
                const EventName = req.body.EventName;

                try {
                    await Db.GetQuery()`update Event set Eventname = ${EventName} where Id = ${Id}`;

                    res.status(201).send('Event Updated!');

                }
                catch {
                    console.error('Error while Updating EventData.', err);
                    res.status(500).send('Error while Updating EventData.');
                }
            }
        })
    }
}
module.exports = Event;