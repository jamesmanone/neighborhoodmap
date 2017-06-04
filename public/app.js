
$('body').hide();


function ListViewModel() {
  this.markers = [];

  // Brings input text into viewmodel
  this.filterText = ko.observable();

  // Observable array for POI's
  this.locationList = ko.observableArray();

  // Populate locationList
  locations.forEach(location => {
    this.locationList.push(new Location(location));
  });

  this.selectedLocation = ko.observable();

  // Switches for API modal and features
  this.loading = false;
  this.flickr = ko.observable(false);
  this.wiki = ko.observable(false);
  this.yelp = ko.observable(false);
  this.modalOpen = ko.computed( () => this.flickr() || this.wiki() || this.yelp());


  // Opens InfoWindow and info-slide on click of list item
  // also closes API modal. Handles a click on already selected
  // location to close info-slide.
  this.listClick = (location) => {
    if(this.selectedLocation() != location) {
      this.selectedLocation(location);
    } else {
      this.selectedLocation(null);
    }
  };

  // Sets selectedLocation based on calls from maps
  this.setSelectedLocation = (marker) => {
    const title = marker.title;
    for (let i = 0; i < this.locationList().length; i++) {
      if(this.locationList()[i].title() == title) {
        this.selectedLocation(this.locationList()[i]);
      }
    }
  };

  this.openFlickr = () => {
    this.wiki(false);
    this.yelp(false);
    this.flickr(true);
    if(!this.selectedLocation().flickrUrls().length) {
      this.moarFlickr();
    }
  };

  this.openWiki = () => {
    this.flickr(false);
    this.yelp(false);
    this.wiki(true);
    if(!this.selectedLocation().wikiText()) {
      this.selectedLocation().getWiki()
      .catch(msg => document.getElementById('wiki-message').innerHTML = msg);
    }
  };

  this.openYelp = () => {
    this.flickr(false);
    this.wiki(false);
    this.yelp(true);
    if(!this.selectedLocation().yelpData()) {
      this.selectedLocation().getYelp();
    }
  };

  this.closeModal = () => {
    this.flickr(false);
    this.wiki(false);
    this.yelp(false);
  };

  // Triggers filter when text in input box changes
  this.filterText.subscribe(text => this.filter(text));

  // Filters POI's
  this.filter = (text) => {
    text = text.toLowerCase();
    if(text) {
      this.markers.forEach(marker => {
        if(marker.title.toLowerCase().indexOf(text) === -1) {
          marker.setVisible(false);

        } else {
          marker.setVisible(true);
        }
      });
      this.locationList().forEach(location => {
        if(location.title().toLowerCase().indexOf(text) === -1) {
          location.visible(false);
        } else {
          location.visible(true);
        }
      });
    } else {
      this.markers.forEach(marker => marker.setVisible(true));
      this.locationList().forEach(location => location.visible(true));
    }
    return true;
  };

  // Handles loading [additional] photos from flickr
  this.moarFlickr = () => {
    if(!this.loading) {
      // this.loading is a stop to prevent additional requests from firing before the current one resolves
      this.loading = true;
      let page = Math.round(this.selectedLocation().flickrUrls().length/10) + 1;
      let loadDiv = document.getElementById('loading');
      if(!this.selectedLocation().flickrUrls().length) {
        loadDiv.innerHTML = 'Loading flickr photos';
      } else {
        loadDiv.innerHTML = 'Loading more photos';
      }
      this.selectedLocation().getFlickr(page)
      .then(data => this.selectedLocation().getFlickrUrls(data))
      .then(() => {
        loadDiv.innerHTML = '';
      })
      .catch(errorMessage => {
        loadDiv.innerHTML = `Error: ${errorMessage}`;
      })
      .then(() => {
        this.loading = false;
      });
    }
  };

  // Endless scroll made simple
  this.endlessFlickr = (data, event) => {
    let modal = event.target;
    if(this.flickr()) {
      if(modal.scrollTop >= (modal.scrollHeight - modal.offsetHeight - 400)) {
        this.moarFlickr();
      }
    } else if(this.loading){
    }
  };

  this.openYelpReview = review => {
    window.open(review.url, '_blank');
  };

  // Updates infowindow when selectedLocation changes
  this.selectedLocation.subscribe(location => {
    if(!infowindow.marker && location) {
      this.markers.forEach(marker => {
        if(marker.title === location.title()) {
          openInfoWindow(marker);
        }
      });
    } else if(location === null) {
      infowindow.close();
      infowindow.marker.setAnimation(null);
      infowindow.marker = null;
    } else if(location.title() === infowindow.marker.title) {
      return;
    } else {
      this.markers.forEach(marker => {
        if(marker.title === location.title()) {
          openInfoWindow(marker);
        }
      });
    }
  });

  // Toggle list view on menu button click
  this.toggleList = () => {
    var viewportWidth = window.innerWidth;
    var mapView = document.getElementById('map');
    var target = document.getElementsByClassName('list-view')[0];
    if(target.style.display === 'block') {
      target.style.display = 'none';
      mapView.style.display = 'block';
    } else {
      target.style.display = 'block';
      if(viewportWidth < 750) {
        mapView.style.display = 'none';
      }
    }
  };

}



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

class Location {
  constructor(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
  this.id = ko.observable(data.id);
  this.visible = ko.observable(true);
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
      .catch(e => reject('Could not contact Wikipedia'))
      .then(res => res.json())
      .then(res => {
        let article = res.parse.text['*'];
        if(!article) {
          reject('<h2>Panic! The impossible happened.<br> <small>No articles? I must have weird taste</small></h2>');
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
      .catch(error => {
        console.log(error);
        reject('<h2>Panic! The impossible happened.<br> <small>No articles? I must have weird taste</small></h2>');
      });
    });
  }

  getYelp() {
    fetch(`/yelp?query=${this.title()}&lat=${this.location().lat}&lng=${this.location().lng}`)
    .then(res => res.json())
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


var infowindow = new google.maps.InfoWindow();

// Builds map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(27.772141, -82.637844),
    zoom: 14
  });
}

// Makes map markers and pushes them to markers array
function makeMarkers() {
  var bounds = new google.maps.LatLngBounds();
  for(let i=0; i<locations.length; i++) {
    let position = locations[i].location;
    let title = locations[i].title;
    let id = locations[i].id;
    let marker = new google.maps.Marker({
      title: title,
      position: position,
      map: map,
      animation: google.maps.Animation.DROP,
      id: id
    });
    viewModel.markers.push(marker);
    ears(marker);
    bounds.extend(position);
  }
  map.fitBounds(bounds);
}

// Adds event listener to map markers. Taken from makeMarkers to clean up the code.
function ears(marker) {
  marker.addListener('click', () => {
    syncList(marker);
    openInfoWindow(marker);
  });
}


// Opens infowindow, sets marker
function openInfoWindow(marker) {
  if(infowindow.marker != marker) {
    infowindow.marker = marker;
    viewModel.markers.forEach(marker => marker.setAnimation(null));
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marker.setAnimation(null), 4950);
    infowindow.setContent(marker.title);
    infowindow.addListener('closeclick', () => {
      infowindow.marker.setAnimation(null);
      infowindow.marker = null;
      viewModel.selectedLocation(null);
    });
    infowindow.open(map, marker);
  }
}


// Pushes updates to viewModel for a change in selected location
function syncList(marker) {
  viewModel.locationList().forEach(location => {
    if(location.title() === marker.title) {
      viewModel.selectedLocation(location);
    }
  });
}

// viewmodel built outside binding call to maintain a reference to it
const viewModel = new ListViewModel();

// Set everything in motion
$(() => {
  let viewportWidth = window.innerWidth;
  if(viewportWidth > 750) {
    document.getElementsByClassName('list-view')[0].style.display = 'block';
  }
  ko.applyBindings(viewModel);
  initMap();
  makeMarkers();
});
