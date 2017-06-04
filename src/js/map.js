
var infowindow = new google.maps.InfoWindow();

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(27.772141, -82.637844),
    zoom: 14
  });
}


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

function ears(marker) {
  marker.addListener('click', () => {
    syncList(marker);
    openInfoWindow(marker);
  });
}



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



function syncList(marker) {
  viewModel.locationList().forEach(location => {
    if(location.title() === marker.title) {
      viewModel.selectedLocation(location);
    }
  });
}
