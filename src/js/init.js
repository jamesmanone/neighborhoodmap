
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
