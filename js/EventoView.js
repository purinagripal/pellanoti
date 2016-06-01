var EventoView = Backbone.View.extend({

    initialize: function () {

    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        
        var datosModelo = this.model.attributes;
        console.log(datosModelo);
        
        // si el evento era una notificacion, lo saca de la lista xq ya esta visto
        this.borrarNotificacion(datosModelo.id_evento);
        
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
        "click .boton_inicio": "volver_inicio",
        "click .link_eventos": "volver_inicio",
        "click .link_locales": "ver_locales",
        "click .link_favoritos": "ver_favoritos",
        "click .link_prefer": "ver_prefer",
        
        "click .boton_atras": "volver_atras",
        "click .menu_salir": "salir",
        
        "click .local_link": "ver_local"
    },
    
    ver_local: function (event) {
        var id_local = $(event.currentTarget).attr('data-id'); 
        
        // añade entrada al historial
        window.historial.push('local/'+id_local);
        console.log("window.historial: "+window.historial);
        
        Backbone.history.navigate('local/'+id_local, {trigger: true});
    },
    
    // si el evento era una notificacion, lo saca de la lista xq ya esta visto
    borrarNotificacion: function (id_evento) {
        var eventos_notificados = window.localStorage.getItem('ev_notif');
        eventos_notificados = JSON.parse(eventos_notificados);
        
        esNotif = -1;
        for (index = 0; index < eventos_notificados.length; index++) { 
            if( id_evento == eventos_notificados[index]['id_evento'] ) {
                esNotif = index;
            }
        }
        
        // si es un evento notificado lo saca de la lista
        // y actualiza LS
        if( esNotif != -1 ) {
            eventos_notificados.splice(esNotif,1);
            window.localStorage.setItem('ev_notif', JSON.stringify(eventos_notificados));
        }
        /*función splice() , dos parámetros: el primero será el índice a partir del cual queremos borrar elementos y, el                    segundo, el número de elementos que queremos borrar a partir de la posición dada.*/
    },
    
    ///////////////////////////////////////
    //
    //    ENLACES DEL MENU SUPERIOR
    //
    
    ver_locales: function (event) {        
        // resetea el historial
        window.historial = ['', 'locales'];
        console.log("window.historial: "+window.historial);
        
        //console.log(event);
        Backbone.history.navigate('locales', {trigger: true});
    },
    
    ver_favoritos: function (event) {        
        // reset historial
        window.historial = ['', 'favoritos'];
        console.log("window.historial: "+window.historial);
        
        //console.log(event);
        Backbone.history.navigate('favoritos', {trigger: true});
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