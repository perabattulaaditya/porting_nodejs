// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var md5 = require("md5")
var path = require('path');
const redis = require("redis");
var utils = require("./utils.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Server port 
var HTTP_PORT = 5555 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("__dirname : ",__dirname)
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
res.sendFile('index_page.html',{root:__dirname} );
});

app.post("/api/add",(req,res,next)=>{
    let host =req.body.host;
    let port = req.body.port;
    let password = req.body.password;
    var rst = redis.createClient({host:host,port:port,password:password})
    if(rst){
    let md5 = utils.md5(host+port)
    console.log(rst)
    var insert = 'INSERT INTO redist6 (host, port, password,md5,add_time) VALUES (?,?,?,?,?)'
    var param = [host,port,password,md5,Date.now()]
        db.run(insert,param,(err,result)=>{
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({
                "success":1,
                "data": rst
            })

        })
    }
});

app.get("/api/redis_monitor",(req,res,next)=>{
    try{
        var sql = 'select * from redist6 where md5 = ?'
        var params = [req.query.md5]
        db.get(sql, params, (err, row) => {
            if (err) {
            res.status(400).json({"error":err.message});
            return;
            }
            if(row){
                const client = redis.createClient({host:row.host,port:row.port,password:row.password});
                client.monitor((err, result)=> {
                console.log("Entering monitoring mode.");
                res.json({
                     "success":1,
                     "data": client.server_info
                 })
             });
            }else{
                res.json({
                    "success":0,
                    "data": "Enter valid Id!"
                })
            }
        });
    }catch(err){

    }
});

app.get("/api/ping",(req,res,next)=>{   
    try{
        let host =req.query.host;
        let port = req.query.port;
        let password = req.query.password;
        const client = redis.createClient({host:host,port:port,password:password});
        client.ping((err,rply)=>{
            if(rply=="PONG"){
                res.json({
                    "success":1,
                    "data": 'Ping success!'
                })
            }else{
                res.json({
                    "success":0,
                    "data": 'Ping error!'
                })
            }
            
        })            
    }catch(err){

    }
});

app.get("/api/redis_list", (req, res, next) => {
    var sql = "select * from redist6"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});


app.get("/api/redis_info",(req,res,next)=>{
    try{
        var sql = 'select * from redist6 where md5 = ?'
        var params = [req.query.md5]
        // console.log(req)
        db.get(sql, params, (err, row) => {
            if (err) {
            res.status(400).json({"error":err.message});
            return;
            } 
            res.json({
                "success":1,
                "data": row
            })
        });
    }catch(err){

    }
});

app.post("/api/del", (req, res, next) => {
    db.run(
        'DELETE FROM redist6 WHERE md5 = ?',
        req.body.md5,
         (err, result) =>{
            console.log(err,result)
            if (err){
                res.status(400).json({success:0, data: "Not Found!"})
                return;
            }else{
                res.json({success:1, data: "Success!"})
            }
            
    });
})

app.get("/api/redis/flushall", (req, res, next) => {
    
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

app.use(express.static(path.join(__dirname, 'public')));


