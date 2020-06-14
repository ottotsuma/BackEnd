const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt.js');
const {registerValidation, loginValidation} = require('../Validation');

router.post('/register', async (req, res) => {

//LETS VALIDATE THE DATA BEFORE WE ADD A User
const {error} = registerValidation(req.body);
if (error) return res.status(400).send(error.details[0].message);

//checklog if the user is already in the database
const emailExist = await User.findOne({email: req.body.email});
if (emailExist) return res.status(400).send('Email already exists');

// hash the password
const salt = await bcrypt.gentSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);


//Create a new user
   const user = new User({
       name: req.body.name,
       email: req.body.email,
       password: req.body.password
   });
   try {
       const savedUser = await user.save();
       res.send(savedUser);
   } catch (err) {
       res.status(400).send(err);
   }
});

// login
router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email or Password is Wrong')
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Email or Password is Wrong');

    // reate and asign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

// user pays , 
router.post('/paid', async (req, res) => {
    (console.log('paid route'))
 });

//reset password 
// router.post('/reset', async (req, res) => {
//     const {error} = loginValidation(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     const user = await User.findOne({email: req.body.email});
//     if (!user) return res.status(400).send('User by this email is not found')
//     // replace password? 
//  });

 // reset password 

 app.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        console.log(user);
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {
       User: req.user
      });
    });
  });
  
  app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user, next) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
  
  
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          console.log('password' + user.password  + 'and the user is' + user)
  
  user.save(function(err) {
    if (err) {
        console.log('here')
         return res.redirect('back');
    } else { 
        console.log('here2')
      req.logIn(user, function(err) {
        done(err, user);
      });
  
    }
          });
        });
      },
  
      function(user, done) {
          // console.log('got this far 4')
        var smtpTrans = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'myemail',
            pass: 'mypass'
            // put email and password into here maybe use dotenv for both
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'myemail',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            ' - This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTrans.sendMail(mailOptions, function(err) {
          // req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });

 // forgot password
 app.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
          //   console.log('error', 'No account with that email address exists.');
          req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  console.log('step 1')
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
          console.log('step 2')
  
  
        var smtpTrans = nodemailer.createTransport({
           service: 'Gmail', 
           auth: {
            user: 'myemail',
            pass: 'mypassword'
          }
        });
        var mailOptions = {
  
          to: user.email,
          from: 'myemail',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  
        };
        console.log('step 3')
  
          smtpTrans.sendMail(mailOptions, function(err) {
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          console.log('sent')
          res.redirect('/forgot');
  });
  }
    ], function(err) {
      console.log('this err' + ' ' + err)
      res.redirect('/');
    });
  });
  
  app.get('/forgot', function(req, res) {
    res.render('forgot', {
      User: req.user
    });
  });
  

module.exports = router;