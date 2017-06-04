function ListViewModel(){this.filterText=ko.observable(),this.locationList=ko.observableArray(),locations.forEach(location=>{this.locationList.push(new Location(location))}),this.selectedLocation=ko.observable(),this.loading=!1,this.flickr=ko.observable(!1),this.wiki=ko.observable(!1),this.yelp=ko.observable(!1),this.modalOpen=ko.computed(()=>this.flickr()||this.wiki()||this.yelp()),this.listClick=(location=>{this.selectedLocation()!=location?(this.selectedLocation(location),googleMap.setMarkerFromList(location)):(this.selectedLocation(null),googleMap.setMarkerFromList(null))}),this.openFlickr=(()=>{this.wiki(!1);this.yelp(!1);this.flickr(!0);this.selectedLocation().flickrUrls().length||this.moarFlickr()}),this.openWiki=(()=>{this.flickr(!1);this.yelp(!1);this.wiki(!0);this.selectedLocation().wikiText()||this.selectedLocation().getWiki().catch(msg=>document.getElementById("wiki-message").innerHTML=msg)}),this.openYelp=(()=>{this.flickr(!1);this.wiki(!1);this.yelp(!0);this.selectedLocation().yelpData()||this.selectedLocation().getYelp().catch(msg=>document.getElementsByClassName("yelp-loading")[0].innerHTML=msg)}),this.closeModal=(()=>{this.flickr(!1);this.wiki(!1);this.yelp(!1)}),this.filterText.subscribe(text=>this.filter(text)),this.filter=(text=>{text=text.toLowerCase();text?(googleMap.markers.forEach(marker=>{-1===marker.title.toLowerCase().indexOf(text)?marker.setVisible(!1):marker.setVisible(!0)}),this.locationList().forEach(location=>{-1===location.title().toLowerCase().indexOf(text)?location.visible(!1):location.visible(!0)})):(googleMap.markers.forEach(marker=>marker.setVisible(!0)),this.locationList().forEach(location=>location.visible(!0)));return!0}),this.moarFlickr=(()=>{if(!this.loading){this.loading=!0;let page=Math.round(this.selectedLocation().flickrUrls().length/10)+1,loadDiv=document.getElementById("loading");this.selectedLocation().flickrUrls().length?loadDiv.innerHTML="Loading more photos":loadDiv.innerHTML="Loading flickr photos",this.selectedLocation().getFlickr(page).then(data=>this.selectedLocation().getFlickrUrls(data)).then(()=>{loadDiv.innerHTML=""}).catch(errorMessage=>{loadDiv.innerHTML=`Error: ${errorMessage}`}).then(()=>{this.loading=!1})}}),this.endlessFlickr=((data,event)=>{let modal=event.target;this.flickr()?modal.scrollTop>=modal.scrollHeight-modal.offsetHeight-400&&this.moarFlickr():this.loading}),this.openYelpReview=(review=>{window.open(review.url,"_blank")}),this.toggleList=(()=>{var viewportWidth=window.innerWidth;var mapView=document.getElementById("map");var target=document.getElementsByClassName("list-view")[0];"block"===target.style.display?(target.style.display="none",mapView.style.display="block"):(target.style.display="block",viewportWidth<750&&(mapView.style.display="none"))})}const locations=[{id:1,title:"Jannus Live",location:{lat:27.771671,lng:-82.636063}},{id:2,title:"Demens Landing",location:{lat:27.771407,lng:-82.627915}},{id:3,title:"The Dali Museum",location:{lat:27.765923,lng:-82.63139}},{id:4,title:"Mahaffey Theater",location:{lat:27.767222,lng:-82.631944}},{id:5,title:"Vinoy Park",location:{lat:27.7786,lng:-82.6257}},{id:6,title:"Al Lang Stadium",location:{lat:27.7681,lng:-82.6331}},{id:7,title:"State Theatre St. Petersburg",location:{lat:27.77142,lng:-82.64337}},{id:8,title:"Albert Whitted Airport",location:{lat:27.765,lng:-82.626944}},{id:9,title:"The Birchwood",location:{lat:27.77602,lng:-82.632052}},{id:10,title:"Tropicana Field",location:{lat:27.768333,lng:-82.653333}}];class Location{constructor(data){this.title=ko.observable(data.title),this.location=ko.observable(data.location),this.id=ko.observable(data.id),this.visible=ko.observable(!0),this.wikiText=ko.observable(),this.flickrUrls=ko.observableArray(),this.yelpData=ko.observable(),this.yelpRating=ko.observable(),this.yelpReviews=ko.observableArray()}getFlickr(page){return new Promise((resolve,reject)=>{var clock=setTimeout(()=>reject("Request Timed out"),1e4);fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&api_key=0e1c35e1a3ae55371b56a4f54befe18e&radius=1&content_type=1&per_page=10&page=${page}&text=${this.title().replace(/\s+/g,"+")}&lat=${this.location().lat}&lon=${this.location().lng}`).then(res=>res.json()).catch(()=>reject("There was a problem contancting Flickr")).then(res=>{resolve(res);clearTimeout(clock)})})}getFlickrUrls(data){return new Promise((resolve,reject)=>{setTimeout(()=>reject("No photos were returned"),1e4);let photos=data.photos.photo;photos.forEach(photo=>this.getFlickrUrl(photo))}).then(()=>{Promise.all(promises).then(resolve).catch(e=>reject("Unable to fetch photos"))})}getFlickrUrl(photo){return new Promise((resolve,reject)=>{fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&api_key=0e1c35e1a3ae55371b56a4f54befe18e&photo_id=${photo.id}`).then(res=>res.json()).catch(()=>reject()).then(res=>{let sizes=res.sizes.size;if(sizes){for(const size of sizes)if("640"===size.width){this.flickrUrls.push(size.source),resolve(!0);break}}else reject("No photos returned")})})}getWiki(){return new Promise((resolve,reject)=>{const clock=setTimeout(()=>reject("The request timed out"),7e3);const url=`/wiki?page=${this.title()}`;fetch(url).catch(e=>reject("Could not contact Wikipedia")).then(res=>res.json()).then(res=>{let article=res.parse.text["*"];article?(article=(article=(article=(article=(article=(article=article.replace(/<a[^>]+>([^<]+)<\/a>/g,"$1")).replace(/<a href="#cite[^>]+>/g,"")).replace(/<a href="#[^>]+>/g,"")).replace(/<span[^>]+>/g,"")).replace(/<\/span>/g,"")).replace(/\[edit[^\]]*\]/g,""),this.wikiText(article),clearTimeout(clock),resolve()):reject("<h2>Panic! The impossible happened.<br> <small>No articles? I must have weird taste</small></h2>")}).catch(error=>{console.log(error);reject("<h2>Panic! The impossible happened.<br> <small>No articles? I must have weird taste</small></h2>")})})}getYelp(){return new Promise((resolve,reject)=>{const clock=setTimeout(()=>reject("The request timed out"),1e4);fetch(`/yelp?query=${this.title()}&lat=${this.location().lat}&lng=${this.location().lng}`).then(res=>res.json()).catch(()=>reject("There was a problem comunicating with yelp")).then(res=>{this.yelpRating(this.starsSrc(res.rating));return res}).then(res=>{this.yelpData(res);return res}).then(res=>fetch(`/yelpreviews/${res.id}`)).then(res=>res.json()).catch(()=>reject("There was a problem getting reviews")).then(res=>{res.reviews.forEach(review=>review.ratingImg=this.starsSrc(review.rating));return res}).then(res=>res.reviews.forEach(review=>this.yelpReviews.push(review))).then(()=>{clearTimeout(clock);resolve()})})}starsSrc(rating){let src="/stars/";switch(rating){case 0:src+="yelp0.png";break;case.5:src+="yelp05.png";break;case 1:src+="yelp1.png";break;case 1.5:src+="yelp15.png";break;case 2:src+="yelp2.png";break;case 2.5:src+="yelp25.png";break;case 3:src+="yelp3.png";break;case 3.5:src+="yelp35.png";break;case 4:src+="yelp4.png";break;case 4.5:src+="yelp45.png";break;case 5:src+="yelp5.png"}return src}}class GoogleMap{constructor(){this.map=new google.maps.Map(document.getElementById("map"),{center:new google.maps.LatLng(27.772141,-82.637844),zoom:14}),this.infowindow=new google.maps.InfoWindow,this.bounds=new google.maps.LatLngBounds,this.markers=[];for(let i=0;i<locations.length;i++){let position=locations[i].location,title=locations[i].title,id=locations[i].id,marker=new google.maps.Marker({title:title,position:position,map:this.map,animation:google.maps.Animation.DROP,id:id});this.markers.push(marker),this.ears(marker),this.bounds.extend(position)}this.map.fitBounds(this.bounds)}openInfoWindow(marker){if(this.infowindow.marker!=marker&&(this.infowindow.marker=marker,this.markers.forEach(marker=>marker.setAnimation(null)),null!==this.infowindow.marker)){marker.setAnimation(google.maps.Animation.BOUNCE);var clock=setTimeout(()=>marker.setAnimation(null),2800);this.infowindow.setContent(marker.title),this.infowindow.addListener("closeclick",()=>{this.markers.forEach(marker=>marker.setAnimation(null));this.infowindow.marker=null;clearTimeout(clock);viewModel.selectedLocation(null)}),this.infowindow.open(map,marker)}}ears(marker){marker.addListener("click",()=>{this.syncList(marker);this.openInfoWindow(marker)})}syncList(marker){viewModel.locationList().forEach(location=>{if(location.title()===marker.title)return void viewModel.selectedLocation(location)})}setMarkerFromList(location){if(location&&!this.infowindow.marker)this.markers.forEach(marker=>{marker.title===location.title()&&this.openInfoWindow(marker)});else if(!location&&this.infowindow.marker)this.markers.forEach(marker=>marker.setAnimation(null)),this.infowindow.marker=null,this.infowindow.close();else{if(!location&&!this.infowindow.marker.title)return;location.title()!==this.infowindow.marker.title&&this.markers.forEach(marker=>{marker.title===location.title()&&this.openInfoWindow(marker)})}}}const viewModel=new ListViewModel;let googleMap;$(()=>{let viewportWidth=window.innerWidth;viewportWidth>750&&(document.getElementsByClassName("list-view")[0].style.display="block");ko.applyBindings(viewModel);googleMap=new GoogleMap});