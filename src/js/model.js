// jshint esversion: 6
// yelp cid: hmmm-ZMgM4TH_YkPPnRJtg
// yelp secret: ZBFQ80sXYXaq997caeHbmF6ELHoPN7YCLgr6kfOIEwdMM15I0WA1v4oIB276nQBP


const locations = [
  {
    id: 1,
    title: 'Jannus Live',
    location: {lat: 27.771671, lng: -82.636063}
  },
  {
    id: 2,
    title: 'Demens Landing',
    location: {lat: 27.771407, lng: -82.627915}
  },
  {
    id: 3,
    title: 'The Dali Museum',
    location: {lat: 27.765923, lng: -82.631390}
  },
  {
    id: 4,
    title: 'Mahaffey Theater',
    location: {lat: 27.767222, lng: -82.631944}
  },
  {
    id: 5,
    title: 'Vinoy Park',
    location: {lat: 27.7786, lng: -82.6257}
  },
  {
    id: 6,
    title: 'Al Lang Stadium',
    location: {lat: 27.7681, lng:-82.6331}
  },
  {
    id: 7,
    title: 'State Theatre St. Petersburg',
    location: {lat: 27.77142, lng:-82.64337}
  },
  {
    id: 8,
    title: 'Albert Whitted Airport',
    location: {lat: 27.765, lng: -82.626944}
  },
  {
    id: 9,
    title: 'The Birchwood',
    location: {lat: 27.776020, lng: -82.632052}
  },
  {
    id: 10,
    title: 'Tropicana Field',
    location: {lat: 27.768333, lng: -82.653333}
  }
];

// function Location(data) {
//   var self = this;
//   this.title = ko.observable(data.title);
//   this.location = ko.observable(data.location);
//   this.id = ko.observable(data.id);
//   this.wikiText = ko.observable('');
//   this.flickrUrls = ko.observableArray();

// }

class Location {
  constructor(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
  this.id = ko.observable(data.id);
  this.wikiText = ko.observable();
  this.flickrUrls = ko.observableArray();
  this.yelpData = ko.observable();
  this.yelpRating = ko.observable();
  this.yelpReviews = ko.observableArray();
  }

  getFlickr(page) {
    return new Promise((resolve, reject) => {
      var clock = setTimeout(() => reject('Request Timed out'), 10000);
      fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&api_key=0e1c35e1a3ae55371b56a4f54befe18e&radius=1&content_type=1&per_page=10&page=${page}&text=${this.title().replace(/\s+/g, '+')}&lat=${this.location().lat}&lon=${this.location().lng}`)
      .then(res => res.json())
      .then(res => {
        resolve(res);
        clearTimeout(clock);
      });
    });
  }

  getFlickrUrls(data) {
    return new Promise((resolve, reject) => {
      let clock = setTimeout(() => reject('No photos were returned'), 10000);
      let promises = [];
      let photos = data.photos.photo;
      photos.forEach(photo => this.getFlickrUrl(photo));
    })
    .then(() => {
      Promise.all(promises)
      .then(resolve);
    });
  }

  getFlickrUrl(photo) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&api_key=0e1c35e1a3ae55371b56a4f54befe18e&photo_id=${photo.id}`)
      .then(res => res.json())
      .catch(() => reject())
      .then(res => {
        let sizes = res.sizes.size;
        if(!sizes) {
          reject('No photos returned');
        } else {
          for(const size of sizes) {
            if(size.width === '640') {
              this.flickrUrls.push(size.source);
              resolve(true);
              break;
            }
          }
        }
      });
    });
  }

  getWiki() {
    return new Promise((resolve, reject) => {
      const clock = setTimeout(() => reject('The request timed out'), 7000);
      const url = `/wiki?page=${this.title()}`;
      fetch(url)
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(e => console.log(e))
      .then(res => res.json())
      .then(res => {
        console.log(res);
        let article = res.parse.text['*'];
        if(!article) {
          reject('No wikipedia article');
        } else {
          // Remove internal links
          article = article.replace(/<a[^>]+>([^<]+)<\/a>/g, '$1');

          // Killing cite links. Left the </a> tag to preserve some external links
          article = article.replace(/<a href="#cite[^>]+>/g, '');

          // Killing any #ref links my awful regex missed
          article = article.replace(/<a href="#[^>]+>/g, '');

          // Remove spans
          article = article.replace(/<span[^>]+>/g, '');
          article = article.replace(/<\/span>/g, '');

          // Remove [edit/ source]
          article = article.replace(/\[edit[^\]]*\]/g, '');
          this.wikiText(article);

          clearTimeout(clock);
          resolve();
        }
      })
      .catch(error => console.log(error));
    });
  }

  getYelp() {
    fetch(`/yelp?query=${this.title()}&lat=${this.location().lat}&lng=${this.location().lng}`)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      return res;
    })
    .then(res => {
      this.yelpRating(this.starsSrc(res.rating));
      return res;
    })
    .then(res => {
      this.yelpData(res);
      return res;
    })
    .catch(e => console.log(e))
    .then(res => fetch(`/yelpreviews/${res.id}`))
    .then(res => res.json())
    .then(res => {
      res.reviews.forEach(review => review.ratingImg = this.starsSrc(review.rating));
      return res;
    })
    .then(res => res.reviews.forEach(review => this.yelpReviews.push(review)))
    .catch(e => console.log(e));
  }

  starsSrc(rating) {
    let src = '/stars/';
    switch (rating) {
      case 0:
        src += 'yelp0.png';
        break;
      case 0.5:
        src += 'yelp05.png';
        break;
      case 1:
        src += 'yelp1.png';
        break;
      case 1.5:
        src += 'yelp15.png';
        break;
      case 2:
        src += 'yelp2.png';
        break;
      case 2.5:
        src += 'yelp25.png';
        break;
      case 3:
        src += 'yelp3.png';
        break;
      case 3.5:
        src += 'yelp35.png';
        break;
      case 4:
        src += 'yelp4.png';
        break;
      case 4.5:
        src += 'yelp45.png';
        break;
      case 5:
        src += 'yelp5.png';
        break;
      default:
        break;
    }
    return src;
  }
}
