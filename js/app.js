// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
    EventoListItemView.prototype.template = Handlebars.compile($("#eventos-list-tpl").html());
    EventoView.prototype.template = Handlebars.compile($("#evento-tpl").html());
    
    LocalesView.prototype.template = Handlebars.compile($("#locales-tpl").html());
    LocalView.prototype.template = Handlebars.compile($("#local-tpl").html());
    LocalDetailsView.prototype.template = Handlebars.compile($("#local-details-tpl").html());

    /* ---------------------------------- Local Variables ---------------------------------- */
    var slider = new PageSlider($('body'));
    
    window.historial = [""];

    var homeView;
    var localesView;
    var localDetailsView;

    var AppRouter = Backbone.Router.extend({

        routes: {
            "":                     "home",
            "categ/:id_cat":        "categoria",
            "zona/:id_ciudad":      "ciudad",
            "eventos/:id":          "eventoDetails",
            "locales":              "locales",
            "zona_loc/:id_ciudad":  "ciudadLocales",
            "local/:id":            "localDetails"
        },

        home: function () {
            // Since the home view never changes, we instantiate it and render it only once
            if (!homeView) {
                this.eventosList = new EventoCollection();
                homeView = new HomeView({model: this.eventosList});
                //homeView.render();
            } else {
                console.log('reusing home view');
                homeView.delegateEvents(); // delegate events when the view is recycled
            }
            slider.slidePage(homeView.$el);
        },
        
        categoria: function (id_cat) {
            
            homeView.categoria = id_cat;
            
            console.log('categ: '+homeView.categoria);
            console.log('ciudad: '+homeView.ciudad);
            
            if (homeView.categoria == 0) {
                if( homeView.ciudad != 0 ) {
                    // filtra solo x por ciudad
                    this.eventosCateg = new EventoCollection(this.eventosList.where({id_ciudad: homeView.ciudad}));
                } else {
                    // coge todas las categorías, vuelve a mostrar la lista inicial
                    this.eventosCateg = this.eventosList;
                }
            } else {
                if( homeView.ciudad != 0 ) {
                    // filtra x categoria y x ciudad
                    this.eventosCateg = new EventoCollection(this.eventosList.where({id_categoria: homeView.categoria, id_ciudad: homeView.ciudad}));
                } else {
                    // filtra solo x categoria
                    this.eventosCateg = new EventoCollection(this.eventosList.where({id_categoria: homeView.categoria}));
                }
            }
            
            console.log("imprime listacategoria");
            console.log(this.eventosCateg);
            //console.log(JSON.stringify(this.eventosCateg));
            
            homeView.model = this.eventosCateg;
            homeView.render();
        },
        
        ciudad: function (id_ciudad) {
            
            homeView.ciudad = id_ciudad;
            
            console.log('categ: '+homeView.categoria);
            console.log('ciudad: '+homeView.ciudad);
            
            if (homeView.categoria == 0) {
                if( homeView.ciudad != 0 ) {
                    // filtra solo x por ciudad
                    this.eventosCiudad = new EventoCollection(this.eventosList.where({id_ciudad: homeView.ciudad}));
                } else {
                    // coge todas las categorías, vuelve a mostrar la lista inicial
                    this.eventosCiudad = this.eventosList;
                }
            } else {
                if( homeView.ciudad != 0 ) {
                    // filtra x categoria y x ciudad
                    this.eventosCiudad = new EventoCollection(this.eventosList.where({id_categoria: homeView.categoria, id_ciudad: homeView.ciudad}));
                } else {
                    // filtra solo x categoria
                    this.eventosCiudad = new EventoCollection(this.eventosList.where({id_categoria: homeView.categoria}));
                }
            }
            
            console.log("imprime listaciudad");
            console.log(this.eventosCiudad);
            //console.log(JSON.stringify(this.eventosCateg));
            
            homeView.model = this.eventosCiudad;
            homeView.render();
        },

        eventoDetails: function (id) {
            //var employee = new Evento({id: id});
            // coge el evento de la coleccion del HOME
            this.evento = this.eventosList.get(id);

            $("html,body").scrollTop(0);
            slider.slidePage(new EventoView({model: this.evento}).render().$el);
            
            // para que el mapa se vea más de una vez
            google.maps.event.trigger(window.map, 'resize');
            window.map.setOptions(window.mapOptions);
            //window.map.setCenter(window.mapOptions.center);
        },
        
        locales: function () {
            // Since the home view never changes, we instantiate it and render it only once
            if (!localesView) {
                this.localesList = this.eventosList.obtenerLocales();
                //console.log(JSON.stringify(this.localesList));
                
                localesView = new LocalesView({model: this.localesList});
            } else {
                console.log('reusing locales view');
                localesView.delegateEvents(); // delegate events when the view is recycled
            }
            
            $("html,body").scrollTop(0);
            slider.slidePage(localesView.$el);
        },
        
        ciudadLocales: function (id_ciudad) {
            
            localesView.ciudad = id_ciudad;
            
            console.log('ciudad: '+localesView.ciudad);
            
            if( localesView.ciudad != 0 ) {
                // filtra solo x por ciudad
                this.localesCiudad = new Backbone.Collection( this.localesList.where({id_ciudad: localesView.ciudad}) );
            } else {
                // coge todos los locales, vuelve a mostrar la lista inicial
                this.localesCiudad = this.localesList;
            }
            
            
            console.log("imprime listaciudad");
            console.log(this.localesCiudad);
            
            localesView.model = this.localesCiudad;
            localesView.render();
        },
        
        localDetails: function (id) {
            console.log("localDetails link");
            //console.log(JSON.stringify(this.eventosList));
            // lista de eventos del Local
            this.eventosLocal = new EventoCollection( this.eventosList.where({id_user: id}) );
            
            $("html,body").scrollTop(0);
            slider.slidePage(new LocalView({collection: this.eventosLocal}).render().$el);
            
            // para que el mapa se vea más de una vez
            google.maps.event.trigger(window.map, 'resize');
            window.map.setOptions(window.mapOptions);
            //window.map.setCenter(window.mapOptions.center);
        }
        
    });

    
    console.log("window.historial: "+window.historial);
    var router = new AppRouter();
    
    Backbone.history.start();

    /* --------------------------------- Event Registration -------------------------------- */

    $(document).ready( function() { console.log("document ready"); });
    
    document.addEventListener("deviceready", onDeviceReady, false);
    
    // PhoneGap esta listo y ahora ya se pueden hacer llamadas a PhoneGap
    function onDeviceReady() {
        console.log('onDeviceReady se ejecutó');
        console.log(navigator);
        
        // eliminar delay 300ms
        FastClick.attach(document.body);
        
        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Workshop", // title
                    'OK'        // buttonName
                );
            };
        }
        
        // Now safe to use device APIs
        document.addEventListener("backbutton", onBackKeyDown, false);
        
        
        var pushNotification = window.plugins.pushNotification; 
        console.log(":::device.platform:::"); 
        console.log(device.platform); 
        console.log("Register called"); 
        alert(":::device.platform:::"+device.platform);
        //tu Project ID aca!! 
        pushNotification.register(successHandler, errorHandler, {"senderID":"41817165383","ecb":"onNotificationGCM"}); 
        
    };
    
    // result contains any message sent from the plugin call 
    function successHandler(result) { 
        console.log('Callback Success! Result = '+result);
        alert('Callback Success! Result = '+result);
    }; 
    function errorHandler(error) { 
        console.log("error: "+error); 
        alert("error: "+error);
    };
    function onNotificationGCM(e) { 
        switch( e.event ) 
        { 
            case 'registered': 
                if ( e.regid.length > 0 ) 
                { 
                    console.log("Regid " + e.regid); 
                    alert('registration id = '+e.regid); 
                    //Cuando se registre le pasamos el regid al input 
                    //document.getElementById('regId').value = e.regid; 
                } 
            break; 

            case 'message': 
              // NOTIFICACION!!! 
              alert('message = '+e.message+' msgcnt = '+e.msgcnt); 
            break; 

            case 'error': 
              alert('GCM error = '+e.msg); 
            break; 

            default: 
              alert('An unknown GCM event has occurred'); 
              break; 
        } 
    };
    
    
    
    function onBackKeyDown() {
        console.log("length del historial: "+window.historial.length);
        // si está en home, sale de la app
        if(window.historial.length == 1) {
            console.log("sale de la app");
            navigator.app.exitApp();
        } else {
            console.log("boton atras - no sale de la app");
            console.log(window.historial);
        }
        
        // vuelve al home
        // reinicia historial
        window.historial = [""];
        
        Backbone.history.navigate('', {trigger: true});
    };
    

    /* ---------------------------------- Local Functions ---------------------------------- */

}());