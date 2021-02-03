var fs = require('fs')
var path = require('path')
var express = require('express')
var promise = require('bluebird')
var bodyparser = require('body-parser')
var router = express.Router()
var option = {
    promiseLib: promise
};
var pgp = require('pg-promise')(option)

router.use(bodyparser.urlencoded({ extended: true }))
router.use(bodyparser.json())
var cs = 'postgres://postgres:root@localhost:5432/employee'
var db = pgp(cs);


router.get('/', (req, res, next) => {
    
    db.query('SELECT * FROM public.employee').then((data) => {
        res.send(data)
    })
    
})

router.post('/', (req, res, next) => {
    var fn = req.body.Fname;
    var ln = req.body.Lname;
    var e = req.body.Email;
    var im = req.body.Image;
   
    var dt = new Date()
    fName = dt.getFullYear() + '_' + dt.getMonth() + '_' + dt.getDate() + '_' + dt.getHours() + '_' + dt.getMinutes() + '_' + dt.getMilliseconds() + '.png'
    fNameW = path.join(__dirname, 'pics/' + fName)
    fs.writeFile(fNameW, im, 'base64', (err) => {
        if (err)
            console.log("Unable to upload file")
        else
            console.log("file uploaded")
    })
    var dbimgPath = 'http://localhost:4500/' + fName
    
    db.any('insert into employee1(Fname,Lname,Email,Image) values($1,$2,$3,$4)',
        [fn,ln,e, dbimgPath]).then((data) => {
            res.send({ message: " inserted succesfully...." })
        })
    
})

router.delete('/:empid', (req, res, next) => {
    var i =parseInt(req.params.email);

    db.none('delete from employee1 where empid =$1', i).then((data) => {
        console.log(data)
        res.send({ message: "deleted successfully...." })
    })
    
})



router.put('/:empid', (req, res, next) => {
    console.log(req.body)
  
    var dt = new Date()
    fName = dt.getFullYear() + '_' + dt.getMonth() + '_' + dt.getDate() + '_' + dt.getHours() + '_' + dt.getMinutes() + '_' + dt.getMilliseconds() + '.png'
    fNameW = path.join(__dirname, 'pics/' + fName)
    var im=req.body.Image
    fs.writeFile(fNameW, im, 'base64', (err) => {
        if (err)
            console.log("Unable to upload file")
        else
            console.log("file uploaded")
    })
    var dbimgPath = 'http://localhost:4500/' + fName
    
    var i = parseInt(req.params.empid)
    var fn = req.body.Fname;
    var ln = req.body.Lname;
    var e = req.body.Email;


    db.any('update employee set Fname=$1,Lname=$2,Email=$3,Image=$4 where empid=$5',
        [fn,ln,e,dbimgPath,i]).then((data) => {
            console.log(data)
            res.send('updated...')
        })
    
})
router.get('/:empid', (req, res, next) => {
    var i =req.params.empid;
    db.any('select * from employee where empid=$1', i).then((data) => {console.log(data)
        res.send(data)
    })
    
})

module.exports = router