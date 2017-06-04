
function ListViewModel() {

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
  this.listClick = location => {
    if(this.selectedLocation() != location) {
      this.selectedLocation(location);
      googleMap.setMarkerFromList(location);
    } else {
      this.selectedLocation(null);
      googleMap.setMarkerFromList(null);
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
      this.selectedLocation().getYelp()
      .catch(msg => document.getElementsByClassName('yelp-loading')[0].innerHTML = msg);
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
      googleMap.markers.forEach(marker => {
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
      googleMap.markers.forEach(marker => marker.setVisible(true));
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

  // Opens yelp review on click in new tab
  this.openYelpReview = review => {
    window.open(review.url, '_blank');
  };

  // // Updates infowindow when selectedLocation changes
  // this.selectedLocation.subscribe(location => {
  //   if(location.title() === googleMap.infowindow.marker.title) {
  //     return;
  //   } else {
  //     googleMap.setMarkerFromList(location);
  //   }
  // });

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
