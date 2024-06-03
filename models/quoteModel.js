const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
	text: String,
	movie: String,
});

module.exports = mongoose.model("Quote", quoteSchema);
