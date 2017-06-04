
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const Yelp = require('node-yelp-fusion');
const yelp = new Yelp({id:'hmmm-ZMgM4TH_YkPPnRJtg', secret: 'ZBFQ80sXYXaq997caeHbmF6ELHoPN7YCLgr6kfOIEwdMM15I0WA1v4oIB276nQBP'});

const app = express();

// Set static dir
app.use(express.static('public'));


app.get('/', (req, res) => {
  console.log(req);
  res.send('<h1>Public Folder Error</h1>');
  console.log('Error reaching static path');
});

app.get('/yelp', (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;
  const query = req.query.query;
  yelp.search(`term=${query}&latitude=${lat}&longitude=${lng}&radius=500`)
  .then(result => result.businesses[0].id)
  .catch(e => console.log(e))
  .then(biz => yelp.business(biz))
  .catch(e => console.log(e))
  .then(data => {
    return {
      id: data.id,
      name: data.name,
      rating: data.rating,
      reviews: data.review_count,
      phone: data.display_phone,
      img: data.image_url,
      url: data.url
    };
  })
  .then(obj => res.send(obj));
});

app.get('/yelpreviews/:bizid', (req, res) => {
  yelp.reviews(req.params.bizid)
  .then(response => {
    res.send(response);
  })
  .catch(e => console.error(e));
});

// Server side relay to avoid JSONP and cors
app.get('/wiki', (req, res) => {
  fetch(`http://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&redirects=true&page=${req.query.page}`)
  .then(response => response.json())
  .then(response => res.json(response))
  .catch(e => res.send(`<h1>error</h1><br><br>${e}`));
});

// Start server
app.listen(3000, () => {
  let timestamp = new Date();
  console.log(`Server started at ${timestamp}`);
  console.log('Listning on http://localhost:3000');
});
