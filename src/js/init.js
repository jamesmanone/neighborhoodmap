// viewmodel built outside binding call to maintain a reference to it
const viewModel = new ListViewModel();
let googleMap;

// Set everything in motion
$(() => {
  let viewportWidth = window.innerWidth;
  if(viewportWidth > 750) {
    document.getElementsByClassName('list-view')[0].style.display = 'block';
  }
  ko.applyBindings(viewModel);
  googleMap = new GoogleMap();
  // makeMarkers();
});
