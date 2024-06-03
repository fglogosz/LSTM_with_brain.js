const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./routes/index");

const app = express();

// Połączenie z bazą danych MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/MoviesQuotes");
const db = mongoose.connection;

// Ustawienie silnika szablonów na EJS i ścieżki do widoków
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Ustawienie ścieżki do statycznych plików
app.use(express.static(path.join(__dirname, "public")));

// Parser dla danych z formularzy
app.use(bodyParser.urlencoded({ extended: false }));

// Dodanie tras
app.use("/", routes);

// Port, na którym serwer będzie działał
const PORT = process.env.PORT || 3000;

// Start serwera
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
