var map = {
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

    getLatLng: function(address){
        map.geocoder.geocode({"address": address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                map.mapObj.setCenter(results[0].geometry.location);
            } else {
                alert("Rozpoznanie położenia nie udalo się z nastepujących przyczyn: " + status);
            }
        })
    },

    clickEvent : function(){
        google.maps.event.addListener(this.mapObj, 'click', function(event){
            console.log('dupa');
        });
        google.maps.event.addListener(this.mapObj, 'dblclick', function(event) {
            console.log(event.latLng);
            setTimeout(map.placeMarker(event.latLng), 600);
        });
    },

    placeMarker: function(location) {
        new google.maps.Marker({
            position: location,
            map: this.mapObj
        });
    },

    init: function(initData) {
        this.location = initData.location;
        this.makeMap();
        this.clickEvent();
    }
}

map.init({ location: '52.1883573,21.0287513'});
