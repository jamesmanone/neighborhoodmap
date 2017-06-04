
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
