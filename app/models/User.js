var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    facebook_id: { type: String },
    twitter_id: { type: String },
    google_id: { type: String },
    school_id: { type: String },
    email: { type: String },
    remember_me: { type: Boolean },
    sign_in_count: { type: Number },
    username: { type: String, required: true },
    password: { type: String },
    reset_password_token: { type: String },
    reset_password_sent_at: Date,
    confirmation_token: { type: String },
    confirmed_at: { type: Date },
    confirmation_sent_at: { type: Date },
    failed_attempts: { type: Number },
    unlock_token: { type: String },
    locked_at: { type: Date },
    first_name: { type: String },
    last_name: { type: String },
    alias_name: { type: String },
    profile_pic: { type: Buffer },
    alias_pic: { type: Buffer },
    last_logged_on: { type: Date, default: Date.now },
    last_logged_off: { type: Date, default: Date.parse('Thu, 01 Jan 2170 00:00:00 GMT') },
    last_logged_on_ip: { type: Number },
    last_logged_off_ip: { type: Number },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

userSchema.pre('save', function(done) {
    this.updated_at = new Date();
    done();
});

var User = mongoose.model('User', userSchema);
module.exports = User;
