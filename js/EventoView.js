var EventoView = Backbone.View.extend({

    initialize: function () {

    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        
        var datosModelo = this.model.attributes;
        console.log(datosModelo);
        
        var div_canvas = $('#eve-map-canvas', this.el)[0];
        
        var myLatlng = new google.maps.LatLng(datosModelo.lat, datosModelo.long); 
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
        
        return this;
    },
    
    
    events: {
        "click .local_link": "ver_local",
        "click .link_locales": "ver_locales",
        "click .link_notif": "ver_prefer",
        "click .link_eventos": "volver_inicio",
        "click .boton_inicio": "volver_inicio",
        "click .boton_atras": "volver_atras",
        "click .menu_salir": "salir"
    },
    
    ver_local: function (event) {
        var id_local = $(event.currentTarget).attr('data-id'); 
        
        // añade entrada al historial
        window.historial.push('local/'+id_local);
        console.log("window.historial: "+window.historial);
        
        Backbone.history.navigate('local/'+id_local, {trigger: true});
    },
    
    ver_locales: function (event) {        
        // resetea el historial
        window.historial = ['', 'locales'];
        console.log("window.historial: "+window.historial);
        
        //console.log(event);
        Backbone.history.navigate('locales', {trigger: true});
    },
    
    ver_prefer: function (event) {        
        // reset historial
        window.historial = ['', 'preferencias'];
        console.log("window.historial: "+window.historial);
        
        //console.log(event);
        Backbone.history.navigate('preferencias', {trigger: true});
    },
    
    volver_inicio: function (event) {
        // resetea el historial
        window.historial = [""];
        console.log("window.historial: "+window.historial);
        Backbone.history.navigate( "", {trigger: true} );
    },
    
    volver_atras: function (event) {
        console.log("volver");
        
        // saca elemento del historial y vuelve al anterior
        window.historial.pop();
        console.log("window.historial: "+window.historial);
        Backbone.history.navigate( window.historial[window.historial.length-1], {trigger: true} );
        
        //console.log(Backbone.history.location);
        //Backbone.history.history.back();
        // es lo mismo que:
        //window.history.back();
    },

    salir: function (event) {
        console.log("SALIR");
        navigator.app.exitApp();
    }

});