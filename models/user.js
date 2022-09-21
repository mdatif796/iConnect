const mongoose = require('mongoose');

const multer = require('multer');   // require multer for storing the files
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');   // contains the storage folder where the avatar will be stored

// creating schema for user

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String, 
        required: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });

// static method which belongs to userSchema
userSchema.statics.uploadAvatar = multer({ storage: storage }).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

// creating a model of userSchema

const User = new mongoose.model('User', userSchema);

module.exports = User;