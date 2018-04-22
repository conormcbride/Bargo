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
                    }, secret, {expiresIn: '24h'});
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
                    }, secret, {expiresIn: '15m'})
                    res.json({
                        success: true,
                        token : newToken
                    })

            }
            
        })
    });

    router.get('/permission', function (req,res) {
        User.findOne({username: req.decoded.username}, function (err, user) {
            if(err) throw err;
            if(!user){
                res.json({ success: false, message:'No user found'});
            }else{
                res.json({ success: true, permission: user.permission});
            }
        })
    })

    router.get('/management', function(req, res){

        User.find({}, function (err, users) {
            if(err) throw err;
            User.findOne({username: req.decoded.username}, function (err, mainUser) {
                if(err) throw err;
                if(!mainUser){
                    res.json({ success: false, message:'No user found'});
                }else{
                    if(mainUser.permission === 'admin'){
                        if(!users){
                            res.json({ success: false, message:'No users found'});
                        }else{
                            res.json({ success: true, users: users, permission: mainUser.permission});
                        }

                    }else{
                        res.json({ success: false, message:'Not proper permissions'});
                }
                }
            })
        })
    });

    router.delete('/management/:username', function (req, res){
        var deletedUser = req.params.username;
        User.findOne({ username: req.decoded.username},function (err, mainUser) {
            if(err) throw err;
            if(!mainUser){
                res.json({ success: false, message:'No user found'});
            }else{
                if(mainUser.permission != 'admin'){
                    res.json({ success: false, message:'Not proper permissions'});
                }else{
                    User.findOneAndRemove({username: deletedUser}, function (err, mainUser){
                        if(err) throw err;
                        res.json({ success: true})
                    })
                }
            }
            
        })
    });

    router.get('/edit/:id', function (req, res) {
        var editUser = req.params.id;

        User.findOne({ username: req.decoded.username},function (err, mainUser) {
            if(err) throw err;
            if(!mainUser){
                res.json({ success: false, message:'No user found'});
            }else {
                if (mainUser.permission === 'admin') {
                    User.findOne({_id: editUser}, function (err, user) {
                        if (err) throw err;
                        if (!user) {
                            res.json({ success: false, message:'No user found'});
                        }else{
                            res.json({ success: true, user: user});
                        }
                    })

                } else {
                    res.json({success: false, message: 'Not proper permissions'});
                }
            }
        })
    });
    
    router.put('/edit', function (req, res) {
        var editUser = req.body._id;
        if(req.body.name) var newName = req.body.name;
        if(req.body.username) var newUsername = req.body.username;
        if(req.body.email) var newEmail = req.body.email;
        if(req.body.permission) var newPermission = req.body.permission;

        User.findOne({ username: req.decoded.username},function (err, mainUser) {
            if(err) throw err;
            if(!mainUser){
                res.json({ success: false, message:'No user found'});
            }else {

                if(newName){
                    if(mainUser.permission === 'admin'){
                        User.findOne({_id: editUser}, function (err, user) {
                            if(err) throw err;
                            if(!user){
                                res.json({ success: false, message:'No user found'});
                            }else{
                                user.name = newName;
                                user.save(function (err) {
                                    if(err){
                                        console.log(err);
                                    }else{
                                        res.json({ success: true, message:'Name updated!'});
                                    }
                                })
                            }
                        })
                    }else {
                        res.json({success: false, message: 'Not proper permissions'});
                    }
                }
                if(newUsername){
                    if(mainUser.permission === 'admin'){
                        User.findOne({_id: editUser}, function (err, user) {
                            if(err) throw err;
                            if(!user){
                                res.json({ success: false, message:'No user found'});
                            }else{
                                user.username = newUsername;
                                user.save(function (err) {
                                    if(err){
                                        console.log(err);
                                    }else{
                                        res.json({ success: true, message:'username updated!'});
                                    }
                                })
                            }
                        })
                    }else{
                        res.json({success: false, message: 'Not proper permissions'});
                    }
                }
                if(newEmail){
                    if(mainUser.permission === 'admin'){
                        User.findOne({_id: editUser}, function (err, user) {
                            if(err) throw err;
                            if(!user){
                                res.json({ success: false, message:'No user found'});
                            }else{
                                user.email = newEmail;
                                user.save(function (err) {
                                    if(err){
                                        console.log(err);
                                    }else{
                                        res.json({ success: true, message:'Email updated!'});
                                    }
                                })
                            }
                        })
                    }else{
                        res.json({success: false, message: 'Not proper permissions'});
                    }
                }
                if(newPermission){
                    if(mainUser.permission === 'admin'){
                        User.findOne({_id: editUser}, function (err, user) {
                            if(err) throw err;
                            if(!user){
                                res.json({ success: false, message:'No user found'});
                            }else{
                                user.permission = newPermission;
                                user.save(function (err) {
                                    if(err){
                                        console.log(err);
                                    }else{
                                        res.json({ success: true, message:'Permission updated!'});
                                    }
                                })
                            }
                        })
                    }else{
                        res.json({success: false, message: 'Not proper permissions'});
                    }
                }
            }
        })
    });
    return router; //returns route to the server when accessed

};
