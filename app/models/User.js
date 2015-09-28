var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    school_id: { type: Schema.ObjectId, ref: 'School', required: true },
    avatar_url: { type: String, required: true },
    current_course_id: { type: Schema.ObjectId, ref: 'Course', required: true },
    saved_course_ids: [{ type: Schema.ObjectId, ref: 'Course', required: true }],
    liked_message_ids: [{ type: Schema.ObjectId, ref: 'Message'}],
    username: { type: String, required: true },
    last_logged_on: { type: Date, default: Date.now },
    last_logged_off: { type: Date, default: Date.parse('Thu, 01 Jan 2170 00:00:00 GMT') },
    last_ping_from_user: { type: Date, default: Date.now },
    last_logged_on_ip: { type: String },
    last_logged_off_ip: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

userSchema.pre('save', function(done) {
    this.updated_at = new Date();
    done();
});



var User = mongoose.model('User', userSchema);
module.exports = User;
