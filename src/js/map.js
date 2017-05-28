

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(27.7714125, -82.6459125),
    zoom: 14
  });
}


function makeMarkers() {
  for(var i=0; i<locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var id = locations[i].id;
    var marker = new google.maps.Marker({
      title: title,
      position: position,
      map: map,
      animation: google.maps.Animation.DROP,
      id: id
    });
    markers.push(marker);
    ears(marker);
  }
}

function ears(marker) {
  marker.addListener('click', function() {
    openInfoWindow(this);
    setSelectedLocation(this);
  });
}

var infowindow = new google.maps.InfoWindow();

function openInfoWindow(marker) {
  if(infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent(infowindow.marker.title);
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
      selectedLocation(null);
    });
    infowindow.open(map, marker);
  }
}
