require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
var admin = require('firebase-admin');
var firebase=require('firebase');
const { response } = require('express');
// const { reset } = require('nodemon');

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use API routes from the api folder
// const apis = require("./api");
// app.use("/api", apis);
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post('/status',(req,res)=>{
    var emails=req.body.email
    var pass=req.body.password
    firebase.auth()
      .signInWithEmailAndPassword(emails, pass)
      .then((userCredential) => {
        uid=userCredential.user.uid
        var db = firebase.database();
    
        var ref = db.ref(uid)

        ref.once("value")
        .then(function(snapshot) {

          user_pres=snapshot.exists()
          child_pres=snapshot.child('start_date').exists()
        if(user_pres && child_pres){
            res.status(200).json({
                start_date:snapshot.child('start_date').val(),
                end_date:snapshot.child('end_date').val(),
                member_id:snapshot.key
            })
        }
        else{
                res.status(200).json({
                active:"true",
                member_id:userCredential.user.uid,
                // member_id:userCredential.user.member_id
            })
        }
        })

      }).catch((err) => {
          if(err.code=="auth/wrong-password"){
              res.status(400).json({
                  error:"incorrect email/password"
              })
          }
          else if(err.code=="auth/user-not-found"){
            res.status(404).json({
                error:"email not found"
            })
     
          }
      })
})

app.post('/register',(req,res)=>{
    var emails=req.body.email
    var pass=req.body.password
    firebase.auth().createUserWithEmailAndPassword(emails, pass)
  .then((userCredential) => {
    // Signed in 
    // var users = userCredential.user.member_id;
    res.status(200).json({
        success:'true',
        member_id:userCredential.user.uid,
        // check:userCredential.user,
        // hhh:userCredential
  })
})
  .catch((error) => {
    res.status(400).json({
        success:'false',
        error:'user already exists'
    })
    // ..
  });

})



app.post('/update',(req,res)=>{
    var emails=req.body.email
    var pass=req.body.password
    firebase.auth().signInWithEmailAndPassword(emails, pass)
  .then((userCredential) => {

    var users = userCredential.user.uid;
    var db = firebase.database();
    var ref = db.ref(users);

    ref.once("value")
        .then(function(snapshot) {

          user_pres=snapshot.exists()
          child_pres=snapshot.child('start_date').exists()
        if(user_pres && child_pres){

            ref.update({
                start_date:req.body.starts_at,
                end_date:req.body.ends_at
          }).then(()=>{
            res.status(200).json({
                success:'true',

          })
          })
          .catch((err)=>{
            res.status(400).json({
                success:'false',

          })
          })

        }
        else{
            ref.set({
                start_date:req.body.starts_at,
                end_date:req.body.ends_at
          }).then(()=>{
            res.status(200).json({
                success:'true',

          })
          })
          .catch((err)=>{
            res.status(400).json({
                success:'false',

          })
          })
        }
    
    })




})
.catch((err)=>{
    res.status(400).json({
        success:'false',

  })
})


})




app.post('/reset',(req,res)=>{
    var emails=req.body.email
    firebase.auth().sendPasswordResetEmail(emails).then(function() {
        res.status(200).json({success:'true'})
      }).catch(function(error) {
        res.status(400).json({
            error:"email not found"
        })
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