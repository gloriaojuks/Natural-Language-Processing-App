var path = require('path');
const express = require('express');
const cors = require('cors');
const mockAPIResponse = require('./mockAPI.js');
const { config } = require('dotenv');
const Aylien = require('aylien_textapi');

// env configuration
config();

const app = express();

// adding cors middleware
app.use(cors());

// initializing instance of the Aylien class
const textapi = new Aylien({
	application_id: process.env.APP_ID,
	application_key: process.env.API_KEY
});

app.use(express.static('dist'));

// express body-perser for json data setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// endpoint to handle app request
app.post('/nlp', (req, res) => {
	const { text } = req.body;
	const payload = { text, mode: 'tweet' };

	if (req.body.url) payload.url = req.body.url;

	textapi.sentiment(payload, (err, response) => {
		if (err) {
			console.log(err);
			return res.status(500).json('Api request error');
		}
		return res.status(200).json(response);
	});
});

// endpoint for serving page
app.get('/', (req, res) => {
	res.sendFile('dist/index.html');
});

// endpoint testing
app.get('/test', function(req, res) {
	res.send(mockAPIResponse);
});

// server port, using 5000 or env during production
const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
