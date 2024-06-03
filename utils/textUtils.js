const normalizeText = text => {
	text = text.toLowerCase();
	text = text.replace(/[.,?!]/g, "");
	text = text.trim();
	return text;
};

module.exports = { normalizeText };
