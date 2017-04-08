Barba.Dispatcher.on("transitionCompleted", function() {
 if (document.querySelector(".mapGoogleInstalators")) {
 var mapInstalator = mapInstalator || {

   makeMap: function(){
     var loc = this.location.split(","),
         pos = new google.maps.LatLng(loc[0], loc[1]);
     var polandCenter = new google.maps.LatLng(51.9882184, 19.2516778);
     var mapOptions = {
       zoom: 6,
       center: polandCenter,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };

     this.mapObj = new google.maps.Map(document.querySelector(".mapGoogleInstalators"), mapOptions);

     this.destination = pos;
     var marker = new google.maps.Marker({
       // map: this.mapObj,
       position: pos,
       icon: "/bundles/galmetmap/images/galmet_sygnet.svg",
       info: {
         name: "Galmet",
         address: "Raciborska 36",
         phone: "77 4034510"
       }
       // animation: google.maps.Animation.BOUNCE,
     })
     this.markers.push(marker);
   },
   handleRoute: function(result, status) {
     if (status != google.maps.DirectionsStatus.OK || !result.routes[0]) {
       alert("Wprowadziłeś złe dane!");
       return false;
     }
     this.pathRender.setDirections(result);
     this.formInput.value = result.routes[0].legs[0].start_address;

   },

   prepareRoute: function(coords) {
     var renderOptions = {
       map: this.mapObj,
       polylineOptions: {
         strokeColor: "#ff0000",
         strokeWeight: 4,
         strokeOpacity: 0.8
       },
       suppressMarkers: true
     }
     this.pathRender.setOptions(renderOptions);

     var pathData = {
       origin: coords ? coords : this.formInput.value,
       destination: this.destination,
       travelMode: google.maps.DirectionsTravelMode.DRIVING,
     }
     this.path.route(pathData, this.handleRoute.bind(this))
   },

   geocoder: new google.maps.Geocoder(),

   getLatLng: function(address, markersToReturn){

     mapInstalator.geocoder.geocode({"address": address}, function(results, status) {
       if (status === google.maps.GeocoderStatus.OK) {
         mapInstalator.findClosest(results[0].geometry.location, markersToReturn);
       } else {
         alert("Rozpoznanie położenia nie udalo się z nastepujących przyczyn: " + status);
       }
     })
   },

   getGeoData: function() {
     navigator.geolocation.getCurrentPosition(
       function(position) {
         this.prepareRoute(position.coords.latitude + "," + position.coords.longitude);
       }.bind(this),
       function(errorObj) {
         alert("Wystapił błąd!");
       }, {
         enableHighAccuracy: true
       }
     );
   },

   checkGeoSupport: function() {
     if (navigator.geolocation) {
       var findPositionButton = document.querySelector("#findButton");
       findPositionButton.classList.remove("hidden");
       findPositionButton.onclick = function(e) {
         e.preventDefault();
         this.getGeoData();
       }.bind(this);
     }
   },

   init: function(options) {
     if (!options.location) return;
     this.options = options;
     this.location = this.options.location;
     this.form = document.querySelector(".mapForm");
     this.makeMap(this);
     this.markersLocation(this);
     this.formInput = document.querySelector("#search");
     this.path = new google.maps.DirectionsService();
     this.pathRender = new google.maps.DirectionsRenderer();

     this.form.onsubmit = function(e) {
       e.preventDefault();
       var address = document.querySelector("#search").value;

       this.getLatLng(address, 6);
     }.bind(this);
     this.checkGeoSupport();

   },
   // markers
   placeMarker: function(instalators) {
     for (var i = 0; i < instalators.length; i++) {
       var instalator = instalators[i];
       var latlng = new google.maps.LatLng(instalator.latLng[0], instalator.latLng[1]);
       var marker = new google.maps.Marker({
         // map: this.mapObj,
         position: latlng,
         icon: "/bundles/galmetmap/images/galmet_sygnet.svg",
         info: {
           name: instalator.name,
           address: instalator.address,
           phone: instalator.phone,
           caldurion: instalator.caldurion,
           waterHeater: instalator.waterHeater,
           solar: instalator.solar,
           pomp: instalator.pomp,
         }
       });
       this.addInfo(marker);
       this.markers.push(marker);
     }
   },

   markers: [],

   addInfo: function(marker) {
     marker.addListener("click", function() {

       var infowindow = new google.maps.InfoWindow({
         content: mapInstalator.htmlInfo(marker.info),
       });
       infowindow.open(mapInstalator.mapObj, marker);
     })
   },
   markersLocation: function() {

     var xmlHttp = new XMLHttpRequest();

     xmlHttp.onreadystatechange = function() {
       if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
         var jsonData = JSON.parse(xmlHttp.responseText);
         if (jsonData.status) {
           this.placeMarker(jsonData.instalators);
         } else {
           console.log("błąd");
         }
       }
     }.bind(this)
     xmlHttp.open("GET", document.querySelector("#urlAdress").value, true); // true for asynchronous
     xmlHttp.send();
   },
 }
   mapInstalator.init({
     location: "50.1943227,17.8434933"
   });
 }
});
