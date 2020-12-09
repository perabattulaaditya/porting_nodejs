var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE redist6 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            host text, 
            port INTEGER UNIQUE, 
            password text, 
            md5 text,
            add_time TIMESTAMP
            )`,
        (err) => {
            if (err) {
                // Table already created
                console.log("Table already created")
            }else{
                // Table just created, creating some rows
                // var insert = 'INSERT INTO redist4 (host, port, password,md5) VALUES (?,?,?,?)'
                // db.run(insert, ["redistemp","2222",md5("admin123456"),md5("123456")])
                // db.run(insert, ["redistemp2","3333",md5("user123456"),md5("12356")])
            }
        });  
    }
});


module.exports = db