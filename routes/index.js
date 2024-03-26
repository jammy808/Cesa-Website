var express = require('express');
var router = express.Router();
const adminModel = require('./admin');
const studentModel = require('./student');
const eventModel = require('./event');
const teamModel = require('./team');
const pastEventModel = require('./pastEvent');
const studentVerify = require('./studentVerify');
//const upload = require('./multer');

const nodemailer = require('nodemailer');
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');

require("dotenv").config();

let transpoter = nodemailer.createTransport({
  service : "gmail",
  auth : {
    user : process.env.AUTH_EMAIL,
    pass : process.env.AUTH_PASS,
  }
})

transpoter.verify((error,success) => {
  if(error){
    console.log(error);
  } else{
    console.log("Ready for messages");
    console.log(success);
  }
})


//---------------------------------------------------------------------------------------------------------
const passport = require('passport');
const localStratergy = require('passport-local');
passport.use(new localStratergy(studentModel.authenticate()));


const { MongoClient } = require('mongodb'); 
const { GridFSBucket } = require('mongodb');
const { createReadStream } = require('fs');
//const Datauri = require('datauri');
const { Readable } = require('stream');
const { error } = require('console');
const { CLIENT_RENEG_LIMIT } = require('tls');

const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect();
    const database = client.db('mamu');
    const bucket = new GridFSBucket(database);



/* GET home page. */
router.get('/',async function(req, res, next) {
  var arr = null;
  if(req.isAuthenticated()){
    const student = await studentModel.findOne({ username: req.session.passport.user });
    var arr = student.events;
  }
  
  const posts = await eventModel.find().populate('admin');

  const postsWithImages = await Promise.all(posts.map(async (post) => {
    const downloadStream = bucket.openDownloadStreamByName(post.image);
    
    let imageBase64 = '';
    downloadStream.on('data', (chunk) => {
      imageBase64 += chunk.toString('base64');
    });

    await new Promise((resolve) => {
      downloadStream.on('end', () => {
        post.imageBase64 = `data:image/jpeg;base64,${imageBase64}`;
        //console.log(`Image Base64 for ${post.title}: ${post.imageBase64}`);
        resolve();
      });
    });
    
    return post;
  }));

  const teams = await teamModel.find();

  const theTeam = await Promise.all(teams.map(async (post) => {
    const downloadStream = bucket.openDownloadStreamByName(post.image);
    
    let imageBase64 = '';
    downloadStream.on('data', (chunk) => {
      imageBase64 += chunk.toString('base64');
    });

    await new Promise((resolve) => {
      downloadStream.on('end', () => {
        post.imageBase64 = `data:image/jpeg;base64,${imageBase64}`;
        //console.log(`Image Base64 for ${post.title}: ${post.imageBase64}`);
        resolve();
      });
    });
    
    return post;
  }));
  

  const pasts = await pastEventModel.find();

  const pastEvent = await Promise.all(pasts.map(async (post) => {
    const downloadStream = bucket.openDownloadStreamByName(post.image);
    
    let imageBase64 = '';
    downloadStream.on('data', (chunk) => {
      imageBase64 += chunk.toString('base64');
    });

    await new Promise((resolve) => {
      downloadStream.on('end', () => {
        post.imageBase64 = `data:image/jpeg;base64,${imageBase64}`;
        //console.log(`Image Base64 for ${post.title}: ${post.imageBase64}`);
        resolve();
      });
    });
    
    return post;
  }));
  //, arr : student.events
  res.render('index',{event : postsWithImages, nav : true , team : theTeam ,pastEvent :pastEvent ,arr : arr});
});

router.get('/team',async function(req , res, next){
  const teams = await teamModel.find({ post: "Convenor" });

  const team = await Promise.all(teams.map(async (post) => {
    const downloadStream = bucket.openDownloadStreamByName(post.image);
    
    let imageBase64 = '';
    downloadStream.on('data', (chunk) => {
      imageBase64 += chunk.toString('base64');
    });

    await new Promise((resolve) => {
      downloadStream.on('end', () => {
        post.imageBase64 = `data:image/jpeg;base64,${imageBase64}`;
        //console.log(`Image Base64 for ${post.title}: ${post.imageBase64}`);
        resolve();
      });
    });
    
    return post;
  }));
  res.render('team',{team});
})

router.get('/events',async function(req , res, next){
  const events = await pastEventModel.find();

  const event = await Promise.all(events.map(async (post) => {
    const downloadStream = bucket.openDownloadStreamByName(post.image);
    
    let imageBase64 = '';
    downloadStream.on('data', (chunk) => {
      imageBase64 += chunk.toString('base64');
    });

    await new Promise((resolve) => {
      downloadStream.on('end', () => {
        post.imageBase64 = `data:image/jpeg;base64,${imageBase64}`;
        //console.log(`Image Base64 for ${post.title}: ${post.imageBase64}`);
        resolve();
      });
    });
    
    return post;
  }));
  res.render('events',{event});
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
    res.redirect("/login"); 
}

async function isAdminIn(req,res,next){
  if(req.isAuthenticated()){
    const admin =  req.session.passport.user;
    if(admin === "nunuj"){
      return next();
    }
  }
    res.redirect("/"); 
}

router.get('/admin',isAdminIn ,async function(req,res,next){
  res.render('admin')
})
router.get('/cesha', async function(req,res,next){
  const student = await studentModel.findOne({ username: req.session.passport.user });
  const posts = await eventModel.find().populate('admin');

  const postsWithImages = await Promise.all(posts.map(async (post) => {
    const downloadStream = bucket.openDownloadStreamByName(post.image);
    
    let imageBase64 = '';
    downloadStream.on('data', (chunk) => {
      imageBase64 += chunk.toString('base64');
    });

    await new Promise((resolve) => {
      downloadStream.on('end', () => {
        post.imageBase64 = `data:image/jpeg;base64,${imageBase64}`;
        //console.log(`Image Base64 for ${post.title}: ${post.imageBase64}`);
        resolve();
      });
    });
    
    return post;
  }));

  const teams = await teamModel.find();

  const theTeam = await Promise.all(teams.map(async (post) => {
    const downloadStream = bucket.openDownloadStreamByName(post.image);
    
    let imageBase64 = '';
    downloadStream.on('data', (chunk) => {
      imageBase64 += chunk.toString('base64');
    });

    await new Promise((resolve) => {
      downloadStream.on('end', () => {
        post.imageBase64 = `data:image/jpeg;base64,${imageBase64}`;
        //console.log(`Image Base64 for ${post.title}: ${post.imageBase64}`);
        resolve();
      });
    });
    
    return post;
  }));
  

  const pasts = await pastEventModel.find();

  const pastEvent = await Promise.all(pasts.map(async (post) => {
    const downloadStream = bucket.openDownloadStreamByName(post.image);
    
    let imageBase64 = '';
    downloadStream.on('data', (chunk) => {
      imageBase64 += chunk.toString('base64');
    });

    await new Promise((resolve) => {
      downloadStream.on('end', () => {
        post.imageBase64 = `data:image/jpeg;base64,${imageBase64}`;
        //console.log(`Image Base64 for ${post.title}: ${post.imageBase64}`);
        resolve();
      });
    });
    
    return post;
  }));
  
  res.render('cesha',{postsWithImages, nav : true , arr : student.events, team : theTeam ,pastEvent :pastEvent });
})

router.post('/adminReg',async function(req,res,next){

  var adminData = new adminModel({
    username : req.body.username  })
    adminModel.register(adminData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res , function(){
      res.redirect('/admin');
    })
  })
  //adminModel.register(adminData, req.body.password)
})

router.post('/adminLog',passport.authenticate("local" , {
  successRedirect : "/admin",
  failureRedirect : "/"
}) , function(req, res, next){});

router.post('/createEvent', async function(req, res, next) { //
  try {

    //const admin = await adminModel.findOne({ username: 'a' });

    const uploadedFile = req.files.Img;
    

    const fileBuffer = Buffer.from(uploadedFile.data);

    const uploadStream = bucket.openUploadStream(uploadedFile.name);
    const readStream = Readable.from(fileBuffer);
    

    readStream.pipe(uploadStream);

    uploadStream.on('finish', async () => {
      const event = await eventModel.create({
        title: req.body.title,
        description: req.body.description,
        image: uploadedFile.name,
        eventDate : req.body.eventDate
      });

      res.redirect('/');
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  } 

});

router.post('/createTeam', async function(req, res, next) { //
  try {

    //const admin = await adminModel.findOne({ username: 'a' });

    const uploadedFile = req.files.Img;
    

    const fileBuffer = Buffer.from(uploadedFile.data);

    const uploadStream = bucket.openUploadStream(uploadedFile.name);
    const readStream = Readable.from(fileBuffer);
    

    readStream.pipe(uploadStream);

    uploadStream.on('finish', async () => {
      const team = await teamModel.create({
        name: req.body.name,
        post : req.body.post,
        pos : req.body.pos,
        image: uploadedFile.name
      });

      res.redirect('/');
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  } 

});

router.post('/studentReg',async function(req,res,next){

  var studentData = new studentModel({
    username : req.body.username,
    email : req.body.email,
    verified : false
    })
    studentModel.register(studentData, req.body.password)
  .then((result) => {
    passport.authenticate("local")(req, res , function() {})
    sendVerificationEmail(result,res);
  })
  // function(){
  //   passport.authenticate("local")(req, res , function(){
  //   res.redirect('/');
  //   })                                                              
  // }
  //adminModel.register(adminData, req.body.password)
})


async function isVerified(req,res,next){
  const student = await studentModel.findOne({ username: req.body.username });
  if(student.verified){
    return next();
  }
    console.log("not verified");
}

router.post('/studentLog',isVerified, passport.authenticate("local" , {
  successRedirect : "/",
  failureRedirect : "/login"
}) , function(req, res, next){});



router.get('/login', function(req, res){
  res.render('login');
});

router.get('/register',function(req,res,next){
  res.render('register');
})

router.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.post('/go',isLoggedIn,async function(req,res,next){
  const student = await studentModel.findOne({ username: req.session.passport.user });
  const event = await eventModel.findOne({ _id: req.body.id });

  event.public.push( req.session.passport.user);
  await event.save();

  student.events.push(event._id);
  await student.save();

  //send registration mail
  const mailOptions = {
    from : process.env.AUTH_EMAIL,
    to : student.email,
    subject : `${event.title}`,
    html : `<p>${student.username} you are successfully registered for ${event.title}, see you on ${event.eventDate} </p>`
  }

  transpoter
  .sendMail(mailOptions)
  .then(() =>{
    console.log("mail sent");
  })

  let msg = "You are Registered succesfully , a registration mail has been sent to you"
  res.render('verify',{msg});  
  
})

router.post('/shift',async function(req,res,next){
  
  const event = await eventModel.findOne({ _id: req.body.id });
  console.log(event);
  const pastEvent = await pastEventModel.create({
    title: event.title,
    description: event.description,
    image: event.image,
    eventDate : event.eventDate
  });

  if (event) {
    await event.deleteOne();
    console.log("Event deleted successfully.");
} else {
    console.log("Event not found.");
}
    
  res.redirect('/');
})

router.post('/fetchTeam',async function(req, res){
  const post = req.body.post;
  const teams = await teamModel.find({ post: post });

  const team = await Promise.all(teams.map(async (post) => {
    const downloadStream = bucket.openDownloadStreamByName(post.image);
    
    let imageBase64 = '';
    downloadStream.on('data', (chunk) => {
      imageBase64 += chunk.toString('base64');
    });

    await new Promise((resolve) => {
      downloadStream.on('end', () => {
        post.imageBase64 = `data:image/jpeg;base64,${imageBase64}`;
        //console.log(`Image Base64 for ${post.title}: ${post.imageBase64}`);
        resolve();
      });
    });
    
    return post;
  }));
  console.log(team);

  res.render('team',{team});
});

router.get('/adminlog',function(req,res,next){
  res.render('adminlog');
})




//send mail
const sendVerificationEmail = ({_id,email},res) => {

  const currentUrl = "https://cesavit-chi.vercel.app/";

  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from : process.env.AUTH_EMAIL,
    to : email,
    subject : "Verify your Email",
    html : `<p>verify your email in 6 hrs <a href = ${currentUrl + "verify/" + _id + "/" + uniqueString}>here</a></p>`
  }

  //hash the unique string

  const saltrounds = 10;
  bcrypt
    .hash(uniqueString,saltrounds)
    .then((hashedUniqueString) => {

      const newVerification = new studentVerify({
        userId : _id,
        uniqueString : hashedUniqueString,
        createdAt : Date.now(),
        expiresAt : Date.now() + 21600000,
      });

      newVerification
        .save()
        .then(() =>{
          transpoter
            .sendMail(mailOptions)
            .then(() =>{
              let msg = "Verification mail has been sent to the registered email, check your inbox"
              res.render('verify',{msg});
            })
            .catch((error) => {
              console.log(error);
              res.json({
                status : "Failed",
                message : "verification mail failed"
              })
            })
        })
        .catch((error) => {
          console.log(error);
          res.json({
            status : "Failed",
            message : "Couldnt save email"
          })
        })
    })
    .catch(() => {
      res.json({
        status : "Failed",
        message : "Error occured"
      })
    })
}


//verify email
router.get("/verify/:userId/:uniqueString",(req,res)=>{
  let {userId,uniqueString} = req.params;

  studentVerify
    .find({userId : userId})
    .then((result) => {
      if(result.length > 0){

        const {expiresAt} = result[0];
        const hashedUniqueString = result[0].uniqueString;

        if(expiresAt < Date.now()){
          studentVerify.deleteOne({userId})
            .then(result =>{
              studentModel.deleteOne({_id : userId})
                .then(()=>{
                  let msg = "Link has expired please sign up again"
                  res.render('verify',{msg});
                })
            })
        }else{

          bcrypt
            .compare(uniqueString,hashedUniqueString)
            .then(result =>{
              if(result){

                studentModel
                  .updateOne({_id : userId},{verified : true})
                  .then(() => {
                    studentVerify.deleteOne({userId})
                      .then(()=>{
                        let msg = "Verification Successfull"
                        res.render('verify',{msg});
                      })
                  })
              }else{
                let msg = "Invalid verification details passed. Please check your inbox"
                res.render('verify',{msg});
              }
            })
        }
      } else{
        let msg = "Account record doesn't exist or has been verified Already, Please sign up or log in"
        res.render('verify',{msg});
      }
    })
    .catch((error) =>{
      console.log(error);
      let msg = " An Error occured while checking for the existing record"
      res.render('verify',{msg});
    })
})

router.get("/verify",(req,res)=>{
  res.render('verify');
})

module.exports = router;
