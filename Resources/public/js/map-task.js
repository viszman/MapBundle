var map = {
    searchButton : document.querySelector('#search'),

    makeMap : function (){
        var loc = this.location.split(","),
            pos = new google.maps.LatLng(loc[0], loc[1]);
        var mapOptions = {
            zoom: 11,
            center: pos,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.mapObj = new google.maps.Map(document.querySelector("#map"), mapOptions);
        var marker = new google.maps.Marker({
            position: pos,
            map: this.mapObj,
            info: {
                name: "Preformance Media",
                address: "Idzikowskiego 19",
                phone: "22 899 03 45"
            },
            animation: google.maps.Animation.BOUNCE,
        });
    },

    geocoder: new google.maps.Geocoder(),

    geocodeLatLng: function (latlng) {
        this.geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
                map.placeMarker(latlng);
                map.ajaxCallAdd(results[1].geometry.location, results[1].formatted_address);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
    },

    getLatLng: function(address){
        this.geocoder.geocode({"address": address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                map.mapObj.setCenter(location);
                map.placeMarker(location);
                map.ajaxCallAdd(location, address);
            } else {
                alert("Geocoder failed due to: " + status);
            }
        })
    },

    clickEvent : function(){
        google.maps.event.addListener(this.mapObj, 'click', function(event){
            //TODO
        });
        google.maps.event.addListener(this.mapObj, 'dblclick', function(event) {
            console.log(event);
            setTimeout(map.geocodeLatLng(event.latLng), 600);
        });
    },

    placeMarker: function(location) {
        new google.maps.Marker({
            position: location,
            map: this.mapObj
        });
    },

    ajaxCallAdd : function(location, address){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", document.querySelector("#ajaxCallAdd").value, true); // true for asynchronous
        xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        var sendString = 'lat='+location.lat()+'&lng='+location.lng()+'&name='+address;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var jsonData = JSON.parse(xmlHttp.responseText);
                if (jsonData.status) {
                    console.log('marker added to Database');
                } else {
                    console.log("Error");
                }
            }
        };
        xmlHttp.send(sendString);
    },

    ajaxCallGet : function(){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", document.querySelector("#ajaxCallGet").value, true); // true for asynchronous
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var jsonData = JSON.parse(xmlHttp.responseText);
                if (jsonData.status) {
                    for (loc of jsonData.data) {
                        pos = new google.maps.LatLng(loc['lat'], loc['lng']);
                        map.placeMarker(pos);
                    }

                } else {
                    console.log("błąd");
                }
            }
        };
        xmlHttp.send();
    },

    setSearching: function(){
        var button =  document.querySelector('#find-button');
        button.onclick = function(e){
            map.getLatLng(map.searchButton.value);
        };
    },

    setAutocomplete: function(){
        this.autocomplete = new google.maps.places.Autocomplete(map.searchButton, {types: ['geocode']});
        this.autocomplete.addListener('place_changed', function(){
            //TODO
        });
    },

    init: function(initData) {
        this.location = initData.location;
        this.makeMap();
        this.clickEvent();
        this.setSearching();
        this.setAutocomplete();
        this.ajaxCallGet();
    }
}

map.init({ location: '52.1883573,21.0287513'});
