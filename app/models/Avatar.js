var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var avatarSchema = new Schema({
    url: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

avatarSchema.pre('save', function(done) {
    this.updated_at = new Date();
    done();
});

var Avatar = mongoose.model('Avatar', avatarSchema);
module.exports = Avatar;
