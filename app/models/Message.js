var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    user_id: { type: Schema.ObjectId },
    course_id: { type: Schema.ObjectId },
    school_id: { type: Schema.ObjectId },
    is_anonymous: { type: Boolean },
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
