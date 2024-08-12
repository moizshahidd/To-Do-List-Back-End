const sql = require('mssql');

class Db {

    constructor() {

        this.config = {
            user: 'UserName',
            password: 'Password',
            server: 'ServerName',
            database: 'DBname',
            options: {
                encrypt: false,
                trustServerCertificate: true
            },
            port: 1433
        };
    }

    async connect() {
        try {
            await sql.connect(this.config);
            console.log('Connection Successful');
        }
        catch (err) {
            console.error('Error while conneting Database: ', err);
        }
    }

    GetQuery() {
        return sql.query;
    }
}

module.exports = new Db();