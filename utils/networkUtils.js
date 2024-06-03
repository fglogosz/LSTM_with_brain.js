const QuoteModel = require("../models/quoteModel");
const brain = require("brain.js");
const { normalizeText } = require("./textUtils");
const fs = require("fs");

const trainedNetworkJSONPath = "trainedNetwork.json";

const trainNetwork = async () => { 
	try {
		const allQuotes = await QuoteModel.find();
		const trainingData = allQuotes.map(quote => ({
			input: normalizeText(quote.text),
			output: quote.movie,
		}));

		const net = new brain.recurrent.LSTM({
			hiddenLayers: [20, 10],
			activation: "tanh",
		});
		net.train(trainingData, {
			iterations: 10000,
			errorThresh: 0.0125,
			learningRate: 0.005,
			log: stats => console.log(stats),
		});

		// Zapisanie wytrenowanej sieci do pliku JSON
		const trainedNetwork = net.toJSON();
		const trainedNetworkJSON = JSON.stringify(trainedNetwork);
		fs.writeFileSync(trainedNetworkJSONPath, trainedNetworkJSON);
	} catch (error) {
		console.error("Error training network:", error);
	}
};

module.exports = { trainNetwork };
