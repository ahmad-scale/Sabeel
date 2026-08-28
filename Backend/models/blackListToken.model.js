const mongoose = require('mongoose');

const blackListTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 24 * 60 * 60,
	},
});

module.exports = mongoose.model('BlackListToken', blackListTokenSchema);
