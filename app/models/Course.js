var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new Schema({
    school_id: { type: Schema.ObjectId, required: true },
    code: { type: Number, required: true },
    name: { type: String, required: true },
    name_2: { type: String },
    description: { type: String },
    time_hours: { type: String },
    time_days: { type: String },
    prof: { type: String },
    dept: { type: String },
    distr_area: { type: String },
    num_enrolled: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

courseSchema.pre('save', function(done) {
    this.updated_at = new Date();
    done();
});

var Course = mongoose.model('Course', courseSchema);

module.exports = Course;
