var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schoolSchema = new Schema({
    name: { type: String, required: true, unique: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

schoolSchema.pre('save', function(done) {
    this.updated_at = new Date();
    done();
});

var School = mongoose.model('School', schoolSchema);

module.exports = School;
