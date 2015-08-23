var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    facebook_id: String,
    twitter_id: String,
    google_id: String,
    school_id: String,
    email: String,
    remember_me: Boolean,
    sign_in_count: Number,
    username: String,
    password: String,
    reset_password_token: String,
    reset_password_sent_at: Date,
    confirmation_token: String,
    confirmed_at: Date,
    confirmation_sent_at: Date,
    failed_attempts: Number,
    unlock_token: String,
    locked_at: Date,
    first_name: String,
    last_name: String,
    alias_name: String,
    profile_pic: Buffer,
    alias_pic: Buffer,
    last_logged_on: Date,
    last_logged_off: Date,
    last_logged_on_ip: Number,
    last_logged_off_ip: Number,
    created_at: Date,
    updated_at: Date
});

var User = mongoose.model('User', userSchema);
module.exports = User;
