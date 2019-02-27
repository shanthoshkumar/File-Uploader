const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const bodyParser=require('body-parser')
const fs=require('fs')
const request=require('request')
// Storage engine
let n='sriram'
const storage = multer.diskStorage({
    destination : function(req,file,cb){
      cb(null, './uploads');
    },
    filename : function(req,file,cb){
      cb(null, n + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
  storage : storage
  
}).single('File');

// View Engine
app.set('view engine','ejs');

// Middleware
app.use(express.static('./public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
   });
 
 app.use(bodyParser.json({limit: '100mb', extended: true}),
 bodyParser.urlencoded({limit: '100mb', extended: true})
  );

// Server Init
app.listen(3000, function(req,res){
    console.log('server->on');
});

app.get('/', function(req,res){
   res.render('index');
});

app.use(express.static('uploads'))


app.get('/getFiles',function(req,res){

    fs.readdir('./uploads', function(err, items) {
    console.log(items);
    
        // for (var i=0; i<items.length; i++) {
                var requestSettings = {
                    url: './uploads/'+items[0],
                    method: 'GET',
                    encoding: null
                };
            
                request(requestSettings, function(error, response, body) {
                    res.write('Content-Type', 'image/png');
                    res.send(items[0]);
                });
            
        
        // }
    });
    
})

app.get('/index',function(req,res){
  res.render('index');
});

app.post('/uploads',function(req,res){
    upload(req,res,function(err){
        if(err) {
           res.render('errorpage',{ msg : err});
        }
        else if (req.file === undefined) {
            res.render('errorpage',{ msg : 'No file uploaded'});
        }
        else {
           res.render('file_info',{ info : req.file });
        }
    });
});



app.get("/getlogo", function(req, res) {
    var requestSettings = {
        url: 'https://www.google.com/images/srpr/logo11w.png',
        method: 'GET',
        encoding: null
    };

    request(requestSettings, function(error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });
});


