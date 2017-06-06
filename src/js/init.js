// viewmodel built outside binding call to maintain a reference to it
const viewModel = new ListViewModel();
let googleMap;

// Set everything in motion
function mapsLoaded() {
  $(init);
}
function init() {
  let viewportWidth = window.innerWidth;
  if(viewportWidth > 750) {
    viewModel.listOpen(true);
  }
  ko.applyBindings(viewModel);
  googleMap = new GoogleMap();
}

// Error handlers for failure to retrieve google maps API
function ifNoGoogle() {
  $(noGoogle);
}

function noGoogle() {
  let viewportWidth = window.innerWidth;
  if(viewportWidth > 750) {
    viewModel.listOpen(true);
  }
  ko.applyBindings(viewModel);
  const mapdiv = document.getElementById('map');
  mapdiv.style.padding = '10px';
  mapdiv.style['background-color'] = '#999';
  mapdiv.innerHTML = `
    <h1>Google Maps failed to load</h1>
    <p>
      This webapp is all about the map. If google is broken, so am I.
    </p>
    <p>
      Feel free to check out Flickr images, Yelp reviews, and Wikipedia
      articles on the right if the rest of the internet is somehow working, else
      try refreshing the page.
    </p>
  `;
}
