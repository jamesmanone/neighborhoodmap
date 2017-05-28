// jshint esversion: 6



// I can't even tell you all the places I got direction on code for
// the wiki api. There are bits from many places smashed together. The
// blame for the regex is all mine though.
function fetchWiki(self) {
  return $.ajax({
    type: "GET",
    contentType: 'application/json; charset=utf-8',
    dataType: 'jsonp',
    data: {
            action: 'parse',
            page: self.title(),
            prop: 'text',
            format: 'json',
            redirects: true
          },
    headers: {
              'Api-User-Agent': 'James\' Frontend Project'
             },
    url: 'http://en.wikipedia.org/w/api.php?',
    success: function(data) {
      try {
        var article = data.parse.text['*'];

        // Remove internal links
        article = article.replace(/<a[^>]+>([^<]+)<\/a>/g, '$1');

        // Killing cite links. Left the </a> tag to preserve some external links
        article = article.replace(/<a href="#cite[^>]+>/g, '');

        // Killing any #ref links my awful regex missed
        article = article.replace(/<a href="#[^>]+>/g, '');

        // Remove spans
        article = article.replace(/<span[^>]+>/g, '');
        article = article.replace(/<\/span>/g, '');

        // Remove [edit/ source]
        article = article.replace(/\[edit[^\]]*\]/g, '');
        self.wikiText(article);
      } catch(x) {
        self.wikiText('<h1>Panic! The impossible happened.</h1><p>There doesnt seem to be a Wikipedia page for this place.<br>I must have weird taste.</p>');
      }
    },
    error: function(data) {
      self.wikiText('<h1>There was an error contacting wikipedia.</h1><p>Maybe try from a land line?</p>');
    }
  });
}

// const fetchFlickrSrc = new Promise((resolve, reject) => {
//
// });
//
// function fetchFlickr(self, page) {
//   $.ajax({
//     url: 'https://api.flickr.com/services/rest/?',
//     type: 'GET',
//     dataType: 'json',
//     data: {
//             method: 'flickr.photos.search',
//             format: 'json',
//             nojsoncallback: 1,
//             api_key: '0e1c35e1a3ae55371b56a4f54befe18e',
//             lat: self.location().lat,
//             lon: self.location().lon,
//             radius: 1,
//             text: self.title().replace(/\s/g, '+'),
//             content_type: 1,
//             per_page: 10,
//             page: page
//           },
//     success: data => {
//       let photos = data.photos.photo;
//       for (let photo of photos) {
//         fetchFlickrUrl(photo, self);
//       }
//     }
//   })
//     .fail( data => console.log(`Failed: ${data}`));
// }
//
// function fetchFlickrUrl(photo) {
//   return new Promise((reject, resolve) => {
//     ;
//   });
// }
//
// function fetchFlickrUrl(photo, self) {
//   let defered = Promise.defer();
//   $.ajax({
//     url: 'https://api.flickr.com/services/rest/?',
//     type: 'GET',
//     dataType: 'json',
//     data: {
//             method: 'flickr.photos.getSizes',
//             format: 'json',
//             nojsoncallback: 1,
//             api_key: '0e1c35e1a3ae55371b56a4f54befe18e',
//             photo_id: photo.id
//           },
//     success: data => {
//       let sizes = data.sizes.size;
//       for (const size of sizes) {
//         if(size.width === '640') {
//           if(!self.flickrUrls().includes(size.source)) {
//             // self.flickrUrls.push(size.source);
//             deferred.resolve(size.source);
//           }
//         }
//       }
//     },
//     timeout: 10000
//   })
//     .fail(function() {
//       console.log('error');
//       if(!self.flickrUrls().length) {
//         console.log('if');
//         self.flickrUrls.push('error');
//       }
//   });
//   return deferred;
// }


// this.moarFlickr = () => {
//   if(!this.loading) {
//     this.loading = true;
//     let page = Math.round(selectedLocation().flickrUrls().length/10) + 1;
//     let loadDiv = document.getElementById('loading');
//     if(!selectedLocation().flickrUrls().length) {
//       loadDiv.innerHTML = 'Loading flickr photos';
//     } else {
//       loadDiv.innerHTML = 'Loading more photos';
//     }
//     selectedLocation().getFlickr(page)
//     .then(data => selectedLocation().getFlickrUrls(data))
//     .then(() => {
//       loadDiv.innerHTML = '';
//     })
//     .catch(errorMessage => {
//       loadDiv.innerHTML = `Error: ${errorMessage}`;
//     })
//     .then(() => {
//       this.loading = false;
//     });
//   }
// };

// this.getFlickr = page => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => reject('Request Timed out'), 5000);
//     fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&api_key=0e1c35e1a3ae55371b56a4f54befe18e&radius=1&content_type=1&per_page=10&page=${page}&text=${this.title().replace(/\s+/g, '+')}&lat=${this.location().lat}&lon=${this.location().lng}`)
//     .then(res => res.json())
//     .then(res => resolve(res));
//   });
// };
//
// this.getFlickrUrls = data => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => reject('Photo requests timed out'), 5000);
//     let promises = [];
//     let photos = data.photos.photo;
//     photos.forEach(photo => this.getFlickrUrl(photo));
//   })
//   .then(() => {
//     Promise.all(promises)
//     .then(resolve);
//   });
// };
//
// this.getFlickrUrl = photo => {
//   return new Promise((resolve, reject) => {
//     fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&api_key=0e1c35e1a3ae55371b56a4f54befe18e&photo_id=${photo.id}`)
//     .then(res => res.json())
//     .catch(() => reject())
//     .then(res => {
//       let sizes = res.sizes.sizes;
//       if(!sizes.length) {
//         reject('No photos returned');
//       }
//       for(const size of sizes) {
//         if(size.width === '640') {
//           this.flickrUrls.push(size.source);
//           resolve(true);
//           break;
//         }
//       }
//     });
//   });
// };
