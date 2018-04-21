var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator')


var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message:'Name Must be at least 3 characters and no more than 30, no special characters, no numbers, must have space between name'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',

        message:'not valid email '
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator:'isAlphanumeric',
        message:'Username must contain numbers and letters only'
    })
];



var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{5,10000}$/,
        message:'Password Must be at least 5 characters and no more than 35, must contain at lease 1 lowercase, 1 uppercase, 1 special character'
    }),
    validate({
        validator: 'isLength',
        arguments: [5, 10000],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];



var UserSchema = new Schema({
    name:{ type: String, required: true,validate: nameValidator},
    username: { type: String, lowercase: true, required: true, unique: true, validate:usernameValidator },
    password: { type: String, required: true, validate: passwordValidator},
    email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidator},
    // activate: { type: Boolean, required: true, default: false},
    // temporaytoken: { type: String, required: true},
    permission: { type: String, required: true, default: 'user' }

});
UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});
UserSchema.plugin(titlize, {
    paths: [ 'name' ]
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);


