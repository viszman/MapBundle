var map = {
    searchButton : document.querySelector('#search'),
    formInputs: {
        name:'mapbundle_location_name',
        lat: 'mapbundle_location_lat',
        lng: 'mapbundle_location_lng',
    },

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

    getAddress: function(latlng, callbacks){
        this.geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var data = {
                    location: results[0].geometry.location,
                    address: results[0].formatted_address
                };
                for (var i = 0; i < callbacks.length; i++) {
                    var func = callbacks[i];
                    func(data);
                }
                return data;
            } else {
                window.alert('No results found');
            }
          } else {
              window.alert('Geocoder failed due to: ' + status);
          }
        });
    },

    setAddressFromLatLng: function (data) {
        map.placeMarker(data.location);
        map.ajaxCallAdd(data.location, data.address);
    },

    setLocationFromAddress: function (data) {
        map.placeMarker(data.location);
        map.ajaxCallAdd(data.location, data.address);
    },

    getLatLng: function(address, callbacks){
        this.geocoder.geocode({"address": address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                var data = {
                    location: location,
                    address: address
                };
                for (var i = 0; i < callbacks.length; i++) {
                    var func = callbacks[i];
                    func(data);
                }
                return data;
            } else {
                alert("Geocoder failed due to: " + status);
            }
        })
    },

    clickEvent : function(){
        var map = this;
        google.maps.event.addListener(this.mapObj, 'click', function(event){
            map.getAddress(event.latLng, [map.placeMarker, map.populateForm]);
        });
        google.maps.event.addListener(this.mapObj, 'dblclick', function(event) {
            setTimeout(map.getAddress(event.latLng, [map.setAddressFromLatLng, map.placeMarker]), 600);
        });
    },

    placeMarker: function(data) {
        new google.maps.Marker({
            position: data.location,
            map: map.mapObj
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
                        var pos = new google.maps.LatLng(loc['lat'], loc['lng']);
                        var data = {location: pos}

                        map.placeMarker(data);
                    }
                } else {
                    console.log("error");
                }
            }
        };
        xmlHttp.send();
    },

    setSearching: function(){
        var button =  document.querySelector('#find-button');
        button.onclick = function(e){
            map.setLocationFromAddress(map.searchButton.value);
        };
    },

    populateForm: function(data){
        document.querySelector('#'+map.formInputs.lat).value = data.location.lat();
        document.querySelector('#'+map.formInputs.lng).value = data.location.lng();
        document.querySelector('#'+map.formInputs.name).value = data.address;
    },

    setAutocomplete: function(){
        this.autocomplete = new google.maps.places.Autocomplete(map.searchButton, {types: ['geocode']});
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
