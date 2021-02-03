var path = require('path');
var fs = require('fs');
var express = require('express');

var e=require('./employee');

var bluebird = require('bluebird');
var bodyparser = require('body-parser');
var promise = require('bluebird');
var options = { promiseLib: promise }
var pgp = require('pg-promise')(options)

var app = express();
var cs = 'postgres://postgres:root@localhost:5432/employee'

var db = pgp(cs)

app.all('*', function (req, res, next) {

    res.header("Access-Control-Allow-Origin", '*');

    res.header("Access-Control-Allow-Headers", "Cache-Control,Pragma, Origin, Authorization, Content-Type, X-Requested-With");

    res.header("Access-Control-Allow-Methods", "*");

    return next();
});

app.set('port', process.env.PORT || 4500)

app.use(bodyparser.urlencoded({ limit: '20mb', extended: true }))
app.use(bodyparser.json({ limit: '20mb', extended: true }))

app.use(express.static(path.join(__dirname, "pics")))
app.use('/employee',e)

// app.post('/', (req, res, next) => {
//     var fn = req.body.Fname;
//     var ln = req.body.Lname;
//     var a = req.body.Age;
//     var d = req.body.DOB
//     var e = req.body.Email;

//     db.query("insert into udetails values($1,$2,$3,$4,$5)", [fn, ln, a, d, e]).then((data) => {
//         res.send({ "message": "insert succesfully" })
//     })
// })


app.listen(app.get('port'), (err) => {
    if (err) {
        console.log('server not yet started')
    }
    else {
        console.log('server started at http://localhost:' + app.get('port'))
    }
})