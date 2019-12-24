var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passporLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
     firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passporLocalMongoose);

module.exports = mongoose.model('User', User);