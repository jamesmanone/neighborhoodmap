
$('body').hide();
// flickr api key 0e1c35e1a3ae55371b56a4f54befe18e
//flickr secret 82d18bbda2328dac


function ListViewModel() {
  this.markers = [];
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
  this.listClick = (loc) => {
    var index = loc.id() - 1;
    this.closeModal();
    if(this.selectedLocation() != loc) {
      this.selectedLocation(loc);
      openInfoWindow(self.markers[index]);
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
    if(!selectedLocation().flickrUrls().length) {
      moarFlickr();
    }
  };

  this.openWiki = () => {
    this.flickr(false);
    this.yelp(false);
    this.wiki(true);
    if(!selectedLocation().wikiText()) {
      selectedLocation().getWiki();
    }
  };

  this.openYelp = () => {
    this.flickr(false);
    this.wiki(false);
    this.yelp(true);
    if(!selectedLocation().yelpData()) {
      selectedLocation().getYelp();
    }
  };

  this.closeModal = () => {
    this.flickr(false);
    this.wiki(false);
    this.yelp(false);
  };

  this.filterText.subscribe(text => this.filter(text));

  this.filter = (text) => {
    text = text.toLowerCase();
    console.log('change');
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
      let page = Math.round(selectedLocation().flickrUrls().length/10) + 1;
      let loadDiv = document.getElementById('loading');
      if(!selectedLocation().flickrUrls().length) {
        loadDiv.innerHTML = 'Loading flickr photos';
      } else {
        loadDiv.innerHTML = 'Loading more photos';
      }
      selectedLocation().getFlickr(page)
      .then(data => selectedLocation().getFlickrUrls(data))
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
        moarFlickr();
      }
    } else if(this.loading){
    }
  };

  this.openYelpReview = review => {
    window.open(review.url, '_blank');
  };

}
