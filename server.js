// jshint esversion: 6

const express = require('express');
const path = require('path');

const app = express();

// Set static dir
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Error: invalid path');
  console.log('Error reaching static path');
});

app.get('/yelper', (req, res) => {
  
});

// Start server
app.listen(3000, () => {
  console.log('Listning on http://localhost:3000');
});
