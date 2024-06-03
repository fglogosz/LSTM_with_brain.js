const express = require("express");
const router = express.Router();
const { addQuote, predictQuote } = require("../controllers/quoteController");

router.get("/", (req, res) => {
	res.render("index", { errorMessage: null });
});

router.get("/add", (req, res) => {
	res.render("add-quote", { errorMessage: null});
});

router.post("/add", addQuote);

router.post("/predict", predictQuote);

module.exports = router;
