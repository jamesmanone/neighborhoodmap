
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
  this.modalTitle = ko.observable();
  this.modalStatus = ko.observable();
  this.flickrMessage = ko.observable();
  this.modalOpen = ko.computed( () => this.flickr() || this.wiki() || this.yelp());
  this.listOpen = ko.observable(false);
  this.mapOpen = ko.computed( () => {
    let viewportWidth = window.innerWidth;
    if(viewportWidth > 750) {
      return true;
    } else {
      return !this.listOpen();
    }
  });


  // Opens InfoWindow and info-slide on click of list item
  // also closes API modal. Handles a click on already selected
  // location to close info-slide.
  this.listClick = location => {
    if(this.selectedLocation() != location) {
      this.selectedLocation(location);
      if(googleMap && googleMap.markers) {
        googleMap.setMarkerFromList(location);
      }
    } else {
      this.selectedLocation(null);
      if(googleMap && googleMap.markers) {
        googleMap.setMarkerFromList(null);
      }
    }
  };

  // Fit map to markers on list open/close
  this.listOpen.subscribe(() => {
    if(window.innerWidth > 750 && googleMap) {
      googleMap.resize();
    }
  });

  this.openFlickr = () => {
    this.wiki(false);
    this.yelp(false);
    this.flickr(true);
    this.modalTitle('Flickr Images');
    this.modalStatus('');
    if(!this.selectedLocation().flickrUrls().length) {
      this.modalStatus('Loading...');
      this.moarFlickr();
    }
  };

  this.openWiki = () => {
    this.flickr(false);
    this.yelp(false);
    this.wiki(true);
    this.modalTitle('Wikipedia');
    this.modalStatus('');
    if(!this.selectedLocation().wikiText()) {
      this.modalStatus('Loading...');
      this.selectedLocation().getWiki()
      .then(() => this.modalStatus(''))
      .catch(msg => this.modalStatus(msg));
    }
  };

  this.openYelp = () => {
    this.flickr(false);
    this.wiki(false);
    this.yelp(true);
    this.modalTitle('');
    this.modalStatus('');
    if(!this.selectedLocation().yelpData()) {
      this.modalStatus('Loading...');
      this.selectedLocation().getYelp()
      .then(() => this.modalStatus(''))
      .catch(msg => this.modalStatus(msg));
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
      if(googleMap && googleMap.markers) {
        googleMap.markers.forEach(marker => {
          if(marker.title.toLowerCase().indexOf(text) === -1) {
            marker.setVisible(false);

          } else {
            marker.setVisible(true);
          }
        });
      }
      this.locationList().forEach(location => {
        if(location.title().toLowerCase().indexOf(text) === -1) {
          location.visible(false);
        } else {
          location.visible(true);
        }
      });
    } else {
      if(googleMap && googleMap.markers) {
        googleMap.markers.forEach(marker => marker.setVisible(true));
      }
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
      let preExistingFlickr = this.selectedLocation().flickrUrls().length;
      if(!preExistingFlickr) {
        this.modalStatus('Loading...');
      } else {
        this.flickrMessage('Loading more photos');
      }
      this.selectedLocation().getFlickr(page)
      .then(data => this.selectedLocation().getFlickrUrls(data))
      .then(() => {
        this.flickrMessage('');
        this.modalStatus('');
      })
      .catch(errorMessage => {
        console.error(errorMessage);
        this.flickrMessage(`Error: ${errorMessage}`);
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

  // Toggle list view on menu button click
  this.toggleList = () => {
    this.listOpen(!this.listOpen());
  };

}
