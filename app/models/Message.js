var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    user_id: { type: Schema.ObjectId, ref: 'User' },
    course_id: { type: Schema.ObjectId, ref: 'Course' },
    school_id: { type: Schema.ObjectId, ref: 'School' },
    is_anonymous: { type: Boolean, default: true },
    content: { type: String, required: true },
    score: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

messageSchema.pre('save', function(done) {
    this.updated_at = new Date();
    done();
});

var Message = mongoose.model('Message', messageSchema);
module.exports = Message;
