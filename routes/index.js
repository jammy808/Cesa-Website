var express = require('express');
var router = express.Router();
const adminModel = require('./admin');
const studentModel = require('./student');
const eventModel = require('./event');
const teamModel = require('./team');
const pastEventModel = require('./pastEvent');
//const upload = require('./multer');


const passport = require('passport');
const localStratergy = require('passport-local');
passport.use(new localStratergy(studentModel.authenticate()));


const { MongoClient } = require('mongodb'); 
const { GridFSBucket } = require('mongodb');
const { createReadStream } = require('fs');
//const Datauri = require('datauri');
const { Readable } = require('stream');

const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect();
    const database = client.db('mamu');
    const bucket = new GridFSBucket(database);



/* GET home page. */
router.get('/',async function(req, res, next) {
  //const student = await studentModel.findOne({ username: req.session.passport.user });
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
  res.render('index',{event : postsWithImages, nav : true , team : theTeam ,pastEvent :pastEvent });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
    res.redirect("/"); 
}

async function isAdminIn(req,res,next){
  if(req.isAuthenticated()){
    const admin =  req.session.passport.user;
    if(admin === "k"){
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
    username : req.body.username  })
    studentModel.register(studentData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res , function(){
      res.redirect('/');
    })
  })
  //adminModel.register(adminData, req.body.password)
})

router.post('/studentLog', passport.authenticate("local" , {
  successRedirect : "/",
  failureRedirect : "/login"
}) , function(req, res, next){});


router.get('/login', function(req, res){
  res.render('login');
});

router.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
router.post('/go',async function(req,res,next){
  const student = await studentModel.findOne({ username: req.session.passport.user });
  const event = await eventModel.findOne({ _id: req.body.id });

  event.public.push( req.session.passport.user);
  await event.save();

  student.events.push(event._id);
  await student.save();
    
  res.redirect('/cesha');
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
    
  res.redirect('/cesha');
})


module.exports = router;
