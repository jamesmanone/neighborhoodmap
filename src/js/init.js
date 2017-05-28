
  const viewModel = new ListViewModel(locations);
// Set everything in motion
$(function() {
  ko.applyBindings(viewModel);
  initMap();
  makeMarkers();
});
