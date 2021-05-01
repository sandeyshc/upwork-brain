require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
var admin = require('firebase-admin');
var firebase=require('firebase');
const { reset } = require('nodemon');

var firebaseConfig = {
    apiKey: "AIzaSyAXhTF7539rUBLSqVvbW3oqxQn8-TrmqG8",
    authDomain: "upwork-app-brain.firebaseapp.com",
    projectId: "upwork-app-brain",
    storageBucket: "upwork-app-brain.appspot.com",
    messagingSenderId: "659392458603",
    appId: "1:659392458603:web:587de3521392b7bf4fe62e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


const app = express();
const port = process.env.PORT || 5000;

// use body parser to get data from POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use API routes from the api folder
// const apis = require("./api");
// app.use("/api", apis);
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post('/login',(req,res)=>{
    var emails=req.body.email
    var pass=req.body.password
    firebase.auth()
      .signInWithEmailAndPassword(emails, pass)
      .then(() => {
        res.send('authorized')
      }).catch((err) => {
        res.send(err)
      })
})

app.post('/register',(req,res)=>{
    var emails=req.body.email
    var pass=req.body.password
    firebase.auth().createUserWithEmailAndPassword(emails, pass)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user.uid;
    res.json({
        user,
        message:"registered user"
    })
    // ...
  })
  .catch((error) => {
    res.json({
        message:error
    })
    // ..
  });
})

app.post('/reset',(req,res)=>{
    var emails=req.body.email
    firebase.auth().sendPasswordResetEmail(emails).then(function() {
        res.send('email verification sent')
      }).catch(function(error) {
        res.send(error)
      });
})

// firebase.auth()
//       .signInWithEmailAndPassword("dummy@gmail.com", "pass123!")
//       .then(() => {
//         this.authStatus = 'Authorized'
//       }).catch((err) => {
//         this.authStatus = err
//       })


app.listen(port, () => console.log(`Listening on port ${port}`));




// const express = require('express')
// const bodyParser = require('body-parser')
// const cors = require('cors')
// const app = express()
// const { cloudinary } = require('./cloudinary');
// const apiPort = process.env.PORT || 3001
// const {upload}=require('./upload')
// require('dotenv').config()

//     // app.use(express.json());
// // app.use(express.urlencoded({
// //     extended: true
// // }));

// // app.use(express.static('public'));
// // app.use(express.json({ limit: '50mb' }));
// // app.use(express.urlencoded({ limit: '50mb', extended: true }));

// const VideoRouter = require('./routes/api/routes')
// const db = require('./config_files/db')
//     // const movieRouter = require('./routes/video-router')
// app.use(bodyParser.json({limit: '50mb'}))
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
// app.use(cors())

// db.on('error', console.error.bind(console, 'MongoDB connection error:'))


// app.get('/', (req, res) => {
//         res.send('Hello World!')
//     })
//     // app.use('/api', movieRouter)
//     // app.use ((req, res, next) => {
//     //     res.locals.url = req.originalUrl;
//     //     res.locals.host = req.get('host');
//     //     res.locals.protocol = req.protocol;
//     //     next();
//     // });
//     // console.log(url)
//     app.post('/upload/image', async (req, res) => {
//         try {
//             // console.log("entered",req,req.body,req.body['data'])
//             const fileStr = req.body.data;
//             // console.log(fileStr)
//             const uploadResponse = await cloudinary.uploader.upload(fileStr, {
//                 width: 800, height: 500, crop: "scale",
//                 folder:'photos',
//                 timeout:120000,
//                 upload_preset: 'photos',
//                 fetch_format:'auto',
//                 quality:'auto'
//             });
//             console.log(uploadResponse);
//             res.json({ msg: uploadResponse.secure_url });
//         } catch (err) {
//             console.error(err);
//             res.status(500).json({ err: 'Something went wrong' });
//         }
//     });
//     app.post('/upload/video',async(req,res)=>{
//         try{
//             // console.log("yes video",req,req.body)
//             // console.log(req.body.data)
//             // var ks;
//             // for (var key of formData.entries()) {
//             //     ks=key[1]
//             //     console.log(key[1] + ', ' + key[1])
//             // }
//             const uploadreesp=await cloudinary.uploader.upload_large(req.body.data, {
//                 width: 800, height: 500, crop: "scale",
//                 resource_type: "auto", 
//                 public_id: "videos",
//                 chunk_size: 6000000,
//                 timeout:120000,
//                 folder:'videos',
//                 upload_preset: 'photos',
//                 fetch_format:'auto',
//                 quality:'auto'
//             })
//             console.log(uploadreesp)
//             res.json({ msg: uploadreesp.secure_url });
//             console.log("uploaded video")
//         }catch(err){
//             console.log(err,"yes")
//         }
//     })
    

// app.use('/api', VideoRouter)


// app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))