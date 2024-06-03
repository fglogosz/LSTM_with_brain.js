const QuoteModel = require("../models/quoteModel");
const fs = require("fs");
const { normalizeText } = require("../utils/textUtils");
const { trainNetwork } = require("../utils/networkUtils");
const brain = require("brain.js");

const trainedNetworkJSONPath = "trainedNetwork.json";
let loadedNetwork;

// Wczytanie sieci przed użyciem
const loadNetwork = () => {
  if (fs.existsSync(trainedNetworkJSONPath)) {
    const trainedNetworkJSON = fs.readFileSync(trainedNetworkJSONPath, "utf-8");
    loadedNetwork = new brain.recurrent.LSTM();
    loadedNetwork.fromJSON(JSON.parse(trainedNetworkJSON));
  } else {
    loadedNetwork = new brain.recurrent.LSTM();
  }
};

loadNetwork();

const addQuote = async (req, res) => {
	let { text, movie } = req.body;

	// Usunięcie białych znaków z początku i końca tekstu
	text = text.trim();
	movie = movie.trim();

	// Walidacja pól "text" i "movie"
	if (!text || !movie) {
		// Renderowanie widoku z komunikatem o błędzie
		return res.render("add-quote", {
			errorMessage: "Text and movie fields are required",
		});
	}

	try {
		// Normalizacja tekstu cytatu przed zapisaniem do bazy danych
		const normalizedText = normalizeText(text);
		const newQuote = new QuoteModel({ text: normalizedText, movie });
		await newQuote.save();

		// Po zapisaniu nowego cytatu, ponownie trenujemy sieć
		await trainNetwork();

		loadNetwork();

		res.redirect("/");
	} catch (error) {
		console.error("Error saving quote:", error);
		res.status(500).send("Error saving quote");
	}
};

const predictQuote = async (req, res) => {
    const quote = req.body.quote;

    // Walidacja pola "quote"
    if (!quote) {
        // Renderowanie widoku z komunikatem o błędzie
        return res.render("index", {
            errorMessage: "Empty quote. Please provide a quote to predict.",
        });
    }

    // Użycie wczytanej sieci do przewidywania filmu dla cytatu
    const predictedMovie = loadedNetwork.run(quote);

    if (!predictedMovie) {
        // Renderowanie widoku z komunikatem o błędzie
        return res.render("index", { errorMessage: "Movie prediction failed" });
    }

    // Znalezienie dokładnego cytatu dla przewidywanego filmu
    try {
        const exactQuote = await QuoteModel.findOne({ movie: predictedMovie });
        if (!exactQuote) {
            return res.render("index", { errorMessage: "Exact quote not found" });
        }

        // Wyrenderowanie widoku z wynikiem
        res.render("result", { quote: exactQuote.text, predictedMovie, errorMessage: null });
    } catch (error) {
        console.error("Error finding exact quote:", error);
        res.status(500).send("Error finding exact quote");
    }
};


module.exports = { addQuote, predictQuote };
