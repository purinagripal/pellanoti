var LocalDetailsView = Backbone.View.extend({

    initialize: function () {

    },

    render: function () {
        console.log("render de local details view");
        
        this.$el.html(this.template(this.model.toJSON()));
        
        //console.log("con this.el");
        //console.log($('#map-canvas', this.el)[0]);
        
        var datosModelo = this.model.attributes;
        console.log(datosModelo);
        
        var div_canvas = $('#local-map-canvas', this.el)[0];
        
        var myLatlng = new google.maps.LatLng(datosModelo.Eventor.lat, datosModelo.Eventor.long); 
        window.mapOptions = { 
            zoom: 17, 
            center: myLatlng,
            streetViewControl: false,
            styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }]}],
            draggable: false
        }; 
        window.map = new google.maps.Map(div_canvas, window.mapOptions);
        window.marker = new google.maps.Marker({ 
            position: myLatlng, 
            map: window.map, 
            title: 'titulo'
        });
        
        
        
        //console.log(window.map);

        //console.log(this.model);
        
        return this;
    },
    
    events: {
    }
    
});