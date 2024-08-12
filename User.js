const Db = require('./Database.js');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const SecretKey = 'TodoList';

class User {
    constructor() {
        Db.connect();
    }

    async CheckEmail(req, res) {
        const Email = req.query.Email
        console.log(Email);
        try {
            const check = await Db.GetQuery()`Select * from UserData where Email = ${Email}`;

            if (check.recordset.length > 0) {
                res.status(201).send('Email already taken');
            } else {
                res.status(201).send('Email Available!');
            }
        }
        catch (err) {
            console.error('Error while checking an emial', err);
            res.status(500).send('Error while checking an email.');
        }
    }

    async SignUP(req, res) {
        const ID = uuidv4();
        const { FirstName, LastName, Email, Password, DOB, Gender, PhoneNo } = req.body;
        try {
            await Db.GetQuery()`insert into UserData(ID,FirstName, LastName, Email, Password, DOB, Gender,PhoneNo)
                                values (${ID},${FirstName}, ${LastName}, ${Email}, ${Password}, ${DOB}, ${Gender},
                                ${PhoneNo})`;
            const Data = await Db.GetQuery()`select * from UserData where ID = ${ID}`;
            if (Data.recordset.length > 0) {
                const userID = Data.recordset[0].ID;
                jwt.sign({ userID }, SecretKey, { expiresIn: '3600s' }, (err, token) => {
                    if (err) {
                        console.error('Error while generating token:', err)
                        return res.status(500).json({ err: 'Token generation failed' });
                    }
                    else {
                        res.status(201).json({ token: token, ID: userID });
                    }
                })
            }
            else {
                res.status(401).send('Account Creation Failed');
            }

        }
        catch (err) {
            console.error('Error while signing you up.', err);
            res.status(500).send('Error while signing you up.');
        }
    }


    async DatabyID(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            } else {
                const ID = req.params.ID;
                const result = await Db.GetQuery()`select * from UserData where ID = ${ID}`;
                const image = await Db.GetQuery()`select top 1 * from Images where userId = ${ID} order by CreatedAt desc `;
                try {
                    if (result.recordset.length > 0) {
                        const userData = result.recordset[0];
                        const imageData = image.recordset.length > 0 ? image.recordset[0] : null;
                        const response = { userData };

                        if (imageData) {
                            response.imageData = Buffer.from(imageData.Data).toString('base64');
                        }
                        res.status(200).json(response);
                    } else {
                        res.status(401).send('Invalid to load further.');
                    }
                }
                catch (err) {
                    console.error('Error while loading.', err);
                    res.status(500).send('Error while loading.');
                }
            }
        })
    }

    async Login(req, res) {
        const Email = req.query.Email;
        const Password = req.query.Password;

        try {
            const result = await Db.GetQuery()`select * from UserData where Email = ${Email} and Password = ${Password}`;
            if (result.recordset.length > 0) {
                const userData = result.recordset[0];
                jwt.sign({ userData }, SecretKey, { expiresIn: '3600s' }, (err, token) => {
                    if (err) {
                        console.error('Error while generating token:', err)
                        return res.status(500).json({ err: 'Token generation failed' });
                    }
                    else {
                        res.status(200).json({ token: token, userData: userData });
                    }
                });

            } else {
                res.status(401).send('Invalid email or password.');
            }
        } catch (err) {
            console.error('Error while logging in!', err);
            res.status(500).send('Error while logging in!');
        }
    }


    async DeleteAccountParmanent(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            } else {
                const Id = req.params.ID;
                try {
                    await Db.GetQuery()`DELETE Todolist FROM Todolist
                                INNER JOIN Event ON Todolist.EventId = Event.Id
                                WHERE Event.UserId = ${Id};`;

                    await Db.GetQuery()`DELETE FROM Event
                                WHERE UserId = ${Id};`;

                    await Db.GetQuery()`DELETE FROM Images
                                WHERE UserId = ${Id};`;

                    await Db.GetQuery()`DELETE FROM UserData
                                WHERE Id = ${Id};`;


                    res.status(201).send('Account Deleted!');
                }
                catch (err) {
                    console.error('Error while deleting account.', err);
                    res.status(500).send('Error while deleting account.');
                }
            }
        })
    }

    async UpdateUser(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            } else {
                const ID = req.params.ID;
                const { FirstName, LastName, Email, Password, DOB, Gender, PhoneNo } = req.body;
                try {
                    await Db.GetQuery()`UPDATE UserData
                                SET FirstName = ${FirstName}, LastName = ${LastName}, Email = ${Email},
                                Password = ${Password}, DOB = ${DOB}, Gender = ${Gender}, PhoneNo = ${PhoneNo}
                                where ID = ${ID}`;
                    res.status(201).send('Account Updated!');
                }

                catch (err) {
                    console.error('Error while updating an account.', err);
                    res.status(500).send('Error while updating an account.');
                }

            }
        })
    }

    async ImageUpload(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            } else {
                const Id = uuidv4();
                if (!req.file) {
                    return res.status(400).send('No file uploaded.');
                }
                const userId = req.body.user;
                const { originalname: Name, buffer: Data } = req.file;
                try {
                    await Db.GetQuery()`Insert into Images(Id,Name,Data,UserId)
                                Values(${Id},${Name},${Data},${userId})`
                    res.send('File uploaded successfully.');
                } catch (err) {
                    console.error('Error while uploading Image:', err)
                    res.status(500).send(err.message);
                }
            }
        })
    }

    async DeleteImage(req, res) {
        jwt.verify(req.token, SecretKey, async (err) => {
            if (err) {
                res.status(401).send('Invalid')
                console.log(err);
            } else {
                const Id = req.params.ID;
                try {

                    await Db.GetQuery()`DELETE FROM Images
                                        WHERE UserId = ${Id};`;
                    res.status(201).send('Image Delete!');
                }
                catch (err) {
                    console.error('Error while deleting an Image.', err);
                    res.status(500).send('Error while deleting an Image.');
                }
            }
        })
    }
}


module.exports = User;