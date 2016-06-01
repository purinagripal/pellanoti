// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
    EventoListItemView.prototype.template = Handlebars.compile($("#eventos-list-tpl").html());
    EventoView.prototype.template = Handlebars.compile($("#evento-tpl").html());
    
    LocalesView.prototype.template = Handlebars.compile($("#locales-tpl").html());
    LocalView.prototype.template = Handlebars.compile($("#local-tpl").html());
    LocalDetailsView.prototype.template = Handlebars.compile($("#local-details-tpl").html());
    
    PreferView.prototype.template = Handlebars.compile($("#prefer-tpl").html());
    FavoritosView.prototype.template = Handlebars.compile($("#favoritos-tpl").html());

    /* ---------------------------------- Local Variables ---------------------------------- */
    var slider = new PageSlider($('body'));
    
    window.historial = [""];

    var homeView;
    var localesView;
    var localDetailsView;
    
    /*this.eventosList = new EventoCollection();
    this.eventosList.fetch({reset: true, 
                      success: function() {
                        console.log( 'fetch terminado, esconde splashscreen' );
                        // ocultar pantalla presentacion 
                        setTimeout(function() {
                            navigator.splashscreen.hide();
                        }, 1500);
                      },
                      wait: true
    });*/
    
    

    var AppRouter = Backbone.Router.extend({

        routes: {
            "":                     "home",
            "preferencias":         "preferencias",
            "favoritos":            "favoritos",
            "categ/:id_cat":        "categoria",
            "zona/:id_ciudad":      "ciudad",
            "eventos/:id":          "eventoDetails",
            "locales":              "locales",
            "zona_loc/:id_ciudad":  "ciudadLocales",
            "local/:id":            "localDetails"
        },
        
        preferencias: function () {
            slider.slidePage(new PreferView().render().$el);
        },

        home: function () {
            // Since the home view never changes, we instantiate it and render it only once
            if (!homeView) {
                this.eventosList = new EventoCollection();
                homeView = new HomeView({model: this.eventosList});
                
            } else {
                console.log('reusing home view');
                homeView.cargarEventos();
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
        
        favoritos: function () {
            // como puede cambiar segun las preferencias cada vez creamos una vista nueva
            //this.favoritosList = new EventoCollection(this.eventosList.where({id_categoria: '1', id_ciudad: '2'}));
            
            /*this.pre_favoritosList = new EventoCollection(this.eventosList.where({id_categoria: '1'}).concat( this.eventosList.where({id_categoria: '3'}) ));
            this.favoritosList = new EventoCollection(this.pre_favoritosList.where({id_ciudad: '1'}));
            this.favoritosList.sort();*/
            
            this.favoritosList = this.eventosList.obtenerFavoritos();

            //console.log(JSON.stringify(this.favoritosList));
            
            $("html,body").scrollTop(0);
            slider.slidePage(new FavoritosView({model: this.favoritosList}).$el);
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
    
    // establecer el localStorage para eventos notificados si no existe
    if( !window.localStorage.getItem('ev_notif') ) {
        window.localStorage.setItem('ev_notif', '[]');
    }
    
    // si no están seleccionadas las preferencias de notificacion nos redirige
    if( !window.localStorage.getItem('pref_categ') ) {
        Backbone.history.navigate('preferencias', {trigger: true});
    }
    
    // para probar el funcionamiento en local
    // eventosNotificados();
    

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
                    "Pella de Ocio", // title
                    'OK'        // buttonName
                );
            };
        }
        
        // Now safe to use device APIs
        document.addEventListener("backbutton", onBackKeyDown, false);
        
        //  --- NOTIFICACIONES PUSH
        var push = PushNotification.init({
            android: {
                senderID: "41817165383"
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        });
        
        push.on('registration', function(data) {            
            // comprobamos si tiene RegistrationId
            if( window.localStorage.getItem('reg_id') ){
                // ya esta guardado
                //alert("RegistrationId guardado en localstorage: "+window.localStorage.getItem('reg_id'));
                console.log("RegistrationId guardado en localstorage: "+window.localStorage.getItem('reg_id'));
                
                if( window.localStorage.getItem('reg_id') != data.registrationId ) {
                    // si ha cambiado lo guardamos DE NUEVO
                    saveRegistrationId(data.registrationId);
                }

            } else {
                //alert("registration id: "+data.registrationId);
                console.log("registration id: "+data.registrationId);
                
                // lo guardamos por PRIMERA vez 
                saveRegistrationId(data.registrationId);
            }
        });

        push.on('notification', function(data) {
            
            eventosNotificados();
            
            
            
            /*console.log('notificacion: '+data.message);
            console.log('id_evento: '+data.additionalData.id_evento);
            console.log(data.additionalData);
            
            alert('notificacion: '+data.message);
            
            var notif_anteriores;
            
            if( window.localStorage.getItem('notificaciones') ) {
                console.log('existe localstorage');
                // tenemos notificaciones guardadas
                notif_anteriores = window.localStorage.getItem('notificaciones');
                notif_anteriores = JSON.parse(notif_anteriores);
                // añadimos la nueva
                notif_anteriores.push(data.additionalData.id_evento);
                
                window.localStorage.setItem('notificaciones', JSON.stringify(notif_anteriores));
                
            } else {
                console.log('crea localstorage con '+data.message);
                // aun no hay ninguna notificacion guardada
                notif_anteriores = [data.additionalData.id_evento];
                // guardamos la primera
                window.localStorage.setItem( 'notificaciones', JSON.stringify(notif_anteriores) );
            }*/
            
        });

        push.on('error', function(e) {
            alert('error');
            // e.message
        });
        
        // oculta splashscreen (mejor ponerlo en config.xml
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 1000);
        
    
    };
    
    
    function eventosNotificados() {
        
        var id_follow = window.localStorage.getItem('id_follow');
        console.log('eventos notificados para id_follow='+id_follow);
        
        $.ajax({
            url: 'http://test.mepwebs.com/app_feventos/'+id_follow,
            //url: 'http://localhost/fuerteagenda_cms/app_feventos/'+id_follow,
            data: '',
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(data){
                console.log('success');
                console.log(data);
                // une los nuevos a los guardados (si hay)
                var eventos_notificados = window.localStorage.getItem('ev_notif');
                eventos_notificados = JSON.parse(eventos_notificados);
                
                // localhost devuelve un json en "data", lo pasamos a array con parse
                //eventos_notificados = eventos_notificados.concat( JSON.parse(data) );
                
                // el servidor devuelve un array en "data"
                eventos_notificados = eventos_notificados.concat(data);
                
                //eventos_notificados = eventos_notificados+JSON.stringify(JSON.parse(data));
                console.log('eventos_notificados');
                console.log(eventos_notificados);
                // y guarda todo en LS
                window.localStorage.setItem('ev_notif', JSON.stringify(eventos_notificados));
                
                // reset historial
                window.historial = ['', 'favoritos'];
                // redirecciona a favoritos
                Backbone.history.navigate('favoritos', {trigger: true});
            },
            error: function(data){
                console.log("error");
                console.log(data);
            }
        });
        
    };
    
     
    
    // guardamos el reg_ig en nuestro servidor
    function saveRegistrationId(registrationId) {
        
        // Guardamos en BBDD y si todo va bien se guarda tbn en localStorage
        
        // sistema operativo del dispositivo
        var sistema_disp;
        if (device.platform == 'android' || device.platform == 'Android') {
            sistema_disp = 'android';
        }
        if (device.platform != 'android' && device.platform != 'Android' && device.platform !='Win32NT') {
            sistema_disp = 'ios';
        }
        if(device.platform == 'Win32NT'){
            sistema_disp = 'wp8';
        }
        
        // modelo 
        var follower = new Follower();
        
        if( window.localStorage.getItem('id_follow') ){
            // si ya existe el follower
            // preparamos el modelo con los datos
            follower.set({id_follow: window.localStorage.getItem('id_follow'),
                        registration_id: registrationId,
                        sistema: sistema_disp});
            
        } else {
            // si no existe el follower
            // preparamos el modelo con los datos
            // sin id_follow se creará una nueva entrada
            follower.set({registration_id: registrationId,
                        sistema: sistema_disp});
        }
        
        // guardamos en el servidor
        // save genera POST /appfollowers
        follower.save(null, {
            success:function(model, response){
                alert(model);
                console.log("succes save");
                console.log("model:");
                console.log(model);
                console.log("response:");
                console.log(response);
        
                // lo guardamos en LocalStorage 
                window.localStorage.setItem('reg_id', registrationId);
                window.localStorage.setItem('id_follow', response.id_follow);
            },
            error: function(model, response) {
                console.log("error save");
            },
            wait: true
        });
    };
    
    
    function onBackKeyDown() {
        console.log("length del historial: "+window.historial.length);
        // si está en home, sale de la app
        if(window.historial.length == 1) {
            console.log("sale de la app");
            navigator.app.exitApp();
            /*navigator.Backbutton.goHome(function() {
              console.log('success background')
            }, function() {
              console.log('fail background')
            });*/
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