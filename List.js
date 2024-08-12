const Db = require('./Database.js');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const SecretKey = 'TodoList';

class List {
    constructor() {
        Db.connect();
    }

    async AddTask(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            } else {
                const ID = uuidv4();
                const EventId = req.params.ID;
                const { TaskName, Date, Time, TaskDone } = req.body;
                try {
                    await Db.GetQuery()`insert into TodoList(ID, TaskName, TaskDone, Date, EventId, Time)
                                        values (${ID},${TaskName},${TaskDone},${Date},${EventId},${Time})`;
                    res.status(201).send('List Task created!');
                }
                catch (err) {
                    console.error('Error while Creating Task.', err);
                    res.status(500).send('Error while Creating Task.');
                }
            }
        })
    }

    async getTaskData(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            }
            else {
                const ID = req.params.ID;
                try {
                    const result = await Db.GetQuery()`select * from Todolist where EventId = ${ID}`;
                    const Data = result.recordset.map(record => record);
                    res.status(201).json(Data);
                }
                catch (err) {
                    console.error('Error while Getting Tasks.', err);
                    res.status(500).send('Error while Getting Tasks.');
                }
            }
        })
    }

    async DeleteTask(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            }
            else {
                const Id = req.params.ID;
                console.log('param:', req.params.ID);
                const ids = req.body.selectedList;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return res.status(400).send({ err: 'Please provide an array of IDs' });
                }
                try {
                    const arr = [];
                    for (let i = 0; i < ids.length; i++) {
                        arr[i] = Db.GetQuery()`Delete from TodoList where Id = ${ids[i]} and EventId = ${Id}`;
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

    async UpdateTask(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            } else {
                const Id = req.params.ID;
                const { TaskName, Date, Time, TaskDone } = req.body;
                try {
                    await Db.GetQuery()`update TodoList 
                                        set TaskName = ${TaskName}, Date = ${Date},
                                        Time = ${Time},TaskDone = ${TaskDone}
                                        where Id = ${Id}`;
                    res.status(201).send('Task Updated!');

                }
                catch {
                    console.error('Error while Updating TaskData.', err);
                    res.status(500).send('Error while Updating TaskData.');
                }
            }
        })
    }

    async UpdateTaskDone(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            }
            else {
                const Id = req.params.ID;
                const ids = req.body.selectedList;
                const TaskDone = req.body.TaskDone;
                console.log(req.body.TaskDone);
                if (!Array.isArray(ids) || ids.length === 0) {
                    return res.status(400).send({ err: 'Please provide an array of IDs' });
                }
                try {
                    const arr = [];
                    for (let i = 0; i < ids.length; i++) {
                        arr[i] = Db.GetQuery()`Update TodoList set TaskDone = ${TaskDone} where Id = ${ids[i]} and EventId = ${Id}`;
                    }
                    res.status(200).send(`${arr.length} records Updated successfully`);
                }
                catch {
                    console.error('Error while Updating TaskValue.', err);
                    res.status(500).send('Error while Updating TaskValue.');
                }
            }
        })
    }
}
module.exports = List;