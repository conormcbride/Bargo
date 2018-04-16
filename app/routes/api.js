var User = require('../models/user')
var jwt = require('jsonwebtoken')
var secret = 'password';




module.exports =  function(router){
    var app = this;
    app.token = jwt;

    router.post('/users', function (req, res) {
    var user = new User();
    user.username = req.body.username
    user.password = req.body.password
    user.email = req.body.email
    user.name = req.body.name;
   // user.temporarytoken = req.body.token || req.body.query || req.headers['x-access-token'];
    if (req.body.username == null || req.body.username =='' || req.body.password == null ||
        req.body.password =='' || req.body.email == null || req.body.email ==''|| req.body.name == null || req.body.name ==''){
        res.json({
            success:false,
            message:'Ensure nothing is left empty'
        })
    }else user.save(function (err) {
        if( err){



           if(err.errors != null){
               if (err.errors.name) {
                   res.json({message: err.errors.name.message});
               }else if(err.errors.email){
                   res.json({message: err.errors.email.message});

               }else if(err.errors.username){
                   res.json({message: err.errors.username.message});

               }else if(err.errors.password){
                   res.json({message: err.errors.password.message});

               } else{
                   res.json({success:false, message: err})
               }

           }else if (err){
              if(err.code == 11000){
                  res.json({ success:false, message:'Username or Email already taken'})
              }else{
                  res.json({success:false, message: err})
              }
           }

        }  else{
            res.json({
                success:true, message:'Account created!'})
    }
    });


    })


    router.post('/authenticate', function (req, res) {
        // res.send('testing new route')
        User.findOne({username: req.body.username}).select('email username password').exec(function (err, user) {
            if(err) throw err;

            if(!user){
                res.json({
                    success: false,
                    message:'Could not authenticate user'
                })
            }else if (user){
                if(req.body.password){
                var validPassword = user.comparePassword(req.body.password)
                }else {
                    res.json({
                        success: false,
                        message:'No password provided'
                    })
                }
                if(!validPassword){
                    res.json({
                        success: false,
                        message:'Could not authenticate password'
                    })
                }else {
                    var token = jwt.sign({
                        username:user.username,
                        email:user.email
                    }, secret, {expiresIn: '45s'})
                    res.json({
                        success: true,
                        message:'User authenticated',
                        token : token
                    })
                }
            }
        })
    })
    router.post('/checkusername', function (req, res) {
        // res.send('testing new route')
        User.findOne({username: req.body.username}).select('username').exec(function (err, user) {
            if(err) throw err;

            if(user){
                res.json({success: false, message: 'That username is already taken'})

            }else{
                res.json({ success: true, message:'Valid username'})
            }

        })
    })
    router.post('/checkemail', function (req, res) {
        // res.send('testing new route')
        User.findOne({email: req.body.email}).select(' email ').exec(function (err, user) {
            if(err) throw err;

            if(user){
                res.json({success: false, message: 'That email is already taken'})

            }else{
                res.json({ success: true, message:'Valid email'})
            }

        })
    })



    router.use(function (req, res, next) {
       var token = req.body.token || req.body.query || req.headers['x-access-token']

        if (token){
            jwt.verify(token, secret, function (err, decoded) {
                if (err){
                    res.json({
                        success: false,
                        message: 'Token invalid'
                    })
                }else {
                    req.decoded = decoded
                    next()
                }
            })
        } else {
            res.json({
                success: false,
                message: 'No token provided'
            })
        }
    })


    router.post('/me', function (req, res) {
        res.send(req.decoded)
    })



    router.get('/renewToken/:username', function (req, res) {
        User.findOne({ username: req.params.username }).select().exec(function (err, user) {
            if(err)throw err;
            if(!user){
                res.json({ success: false, message: 'no user found' });
            }else{

                    var newToken = jwt.sign({
                        username:user.username,
                        email:user.email
                    }, secret, {expiresIn: '24h'})
                    res.json({
                        success: true,
                        token : newToken
                    })

            }
            
        })
    })
    return router; //returns route to the server when accessed

}