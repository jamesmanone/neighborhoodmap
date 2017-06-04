
class GoogleMap {
  constructor() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(27.772141, -82.637844),
      zoom: 14
    });
    this.infowindow = new google.maps.InfoWindow();
    this.bounds = new google.maps.LatLngBounds();
    this.markers = [];

    // Making markers
    for(let i=0; i<locations.length; i++) {
      let position = locations[i].location;
      let title = locations[i].title;
      let id = locations[i].id;
      let marker = new google.maps.Marker({
        title: title,
        position: position,
        map: this.map,
        animation: google.maps.Animation.DROP,
        id: id
      });
      this.markers.push(marker);
      this.ears(marker);
      this.bounds.extend(position);
    }
    this.map.fitBounds(this.bounds);
  }

  // methods

  // Opens infowindow, sets marker
  openInfoWindow(marker) {
    if(this.infowindow.marker != marker) {
      this.infowindow.marker = marker;
      this.markers.forEach(marker => marker.setAnimation(null));
      if(this.infowindow.marker !== null) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        var clock = setTimeout(() => marker.setAnimation(null), 2800);
        this.infowindow.setContent(marker.title);
        this.infowindow.addListener('closeclick', () => {
          this.markers.forEach(marker => marker.setAnimation(null));
          this.infowindow.marker = null;
          clearTimeout(clock);
          viewModel.selectedLocation(null);
        });
        this.infowindow.open(map, marker);
      }
    }
  }

  // Adds event listener to map markers. Taken from makeMarkers to clean up the code.
  ears(marker) {
    marker.addListener('click', () => {
      this.syncList(marker);
      this.openInfoWindow(marker);
    });
  }

  // Sets selectedLocation when marker is clicked
  syncList(marker) {
    viewModel.locationList().forEach(location => {
      if(location.title() === marker.title) {
        viewModel.selectedLocation(location);
        return;
      }
    });
  }

  // Syncs from list
  setMarkerFromList(location) {
    if(location && !this.infowindow.marker) {
      this.markers.forEach(marker => {
        if(marker.title === location.title()) {
          this.openInfoWindow(marker);
        }
      });
    } else if(!location && this.infowindow.marker) {
      this.markers.forEach(marker => marker.setAnimation(null));
      this.infowindow.marker = null;
      this.infowindow.close();
    } else if (!location && !this.infowindow.marker.title) {
      return;
    } else if(location.title() !== this.infowindow.marker.title) {
      this.markers.forEach(marker => {
        if(marker.title === location.title()) {
          this.openInfoWindow(marker);
        }
      });
    }
  }

}
