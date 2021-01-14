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
var cs = 'postgres://postgres:root@localhost:5432/mahi'
var db = pgp(cs);


router.get('/', (req, res, next) => {
    
    db.query('SELECT * FROM public.imgdetails').then((data) => {
        res.send(data)
    })
    
})

router.post('/', (req, res, next) => {
    var i = req.body.Imgid
    var vn = req.body.Imgname;
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
    
    db.any('insert into imgdetails(Imgid,Imgname,Image) values($1,$2,$3)',
        [i, vn, dbimgPath]).then((data) => {
            res.send({ message: " inserted succesfully...." })
        })
    
})

router.delete('/:Imgid', (req, res, next) => {
    var i = parseInt(req.params.Imgid)
    
    db.none('delete from imgdetails where Imgid=$1', i).then((data) => {
        res.send({ message: "deleted successfully...." })
    })
    
})


router.put('/:Imgid', (req, res, next) => {
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
    
    var i = parseInt(req.params.Imgid)
    var vn = req.body.Imgname;
   
    
    db.any('update imgdetails set Imgname=$1,Image=$2 where Imgid=$3',
        [vn,dbimgPath,i]).then((data) => {
            console.log(data)
            res.send('updated...')
        })
    
})

module.exports = router