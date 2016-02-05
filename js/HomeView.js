var HomeView = Backbone.View.extend({

    initialize:function () {
        console.log('initialize de homeView');
        this.categoria = 0;
        this.ciudad = 0;
        // this.model.bind("reset", this.render, this);
        this.model.on("reset", this.render, this);
        this.model.fetch({reset: true, 
                          success: function() {
                            console.log( 'fetch terminado, esconde splashscreen' );
                            // ocultar pantalla presentacion 
                            setTimeout(function() {
                                navigator.splashscreen.hide();
                            }, 1500);
                          }
        });
    },

    render:function () {
        console.log('render de homeView');
                
        this.$el.html(this.template());
           
        // boton categoria
        var categ_txt;
        switch(this.categoria) {
            case '1':
                categ_txt = 'Música';
                break;
            case '2':
                categ_txt = 'Espectáculos';
                break;
            case '3':
                categ_txt = 'Talleres';
                break;
            case '4':
                categ_txt = 'Charlas';
                break;
            case '5':
                categ_txt = 'Deportes';
                break;
            case '6':
                categ_txt = 'Para niños';
                break;
            default:
                categ_txt = 'Categoría';
        }
        this.$('#dropdownMenuCateg').html(categ_txt+' <span class="caret"></span>');
        
        // boton ciudad
        var ciudad_txt;
        switch(this.ciudad) {
            case '1':
                ciudad_txt = 'Lajares';
                break;
            case '2':
                ciudad_txt = 'Corralejo';
                break;
            case '3':
                ciudad_txt = 'Cotillo';
                break;
            case '4':
                ciudad_txt = 'La Oliva';
                break;
            case '5':
                ciudad_txt = 'Tindaya';
                break;
            case '6':
                ciudad_txt = 'Puerto';
                break;
            case '7':
                ciudad_txt = 'P. Lajas';
                break;
            default:
                ciudad_txt = 'Lugar';
        }
        this.$('#dropdownMenuCiudad').html(ciudad_txt+' <span class="caret"></span>');
                
        _.each(this.model.models, 
               function (evento) {$('.guiaeventos', this.el).append(new EventoListItemView({model: evento}).render().el);}, 
               this);
        return this;
    },

    events: {
        "click .link_locales": "ver_locales",
        //"click .link_eventos": "salir",
        "click .menu_salir": "salir",
        "click .row.cuadro": "ver_evento",
        "click .filt_categ": "filtra_categoria",
        "click .filt_zona": "filtra_ciudad"
    },
    
    filtra_categoria: function (event) {
        var id_cat = $(event.currentTarget).attr('data-id'); 
        console.log('id de categoria'+id_cat);
        
        //window.historial = "home";
        console.log("window.historial: "+window.historial);
        
        Backbone.history.navigate('categ/'+id_cat, {trigger: true});
        // borra del historial
        Backbone.history.navigate('', {replace: true});
    },
    
    filtra_ciudad: function (event) {
        var id_ciudad = $(event.currentTarget).attr('data-id'); 
        console.log('id de ciudad: '+id_ciudad);
        
        //window.historial = "home";
        console.log("window.historial: "+window.historial);
        // borra del historial
        Backbone.history.navigate('zona/'+id_ciudad, {trigger: true});
        Backbone.history.navigate('', {replace: true});
    },
    
    ver_evento: function (event) {
        var id_evento = $(event.currentTarget).attr('data-id'); 
        console.log("ver evento "+id_evento);
        
        // añade entrada al historial
        window.historial.push('eventos/'+id_evento);
        console.log("window.historial: "+window.historial);
        
        //console.log(event);
        Backbone.history.navigate('eventos/'+id_evento, {trigger: true});
    },
    
    ver_locales: function (event) {        
        // reset historial
        window.historial = ['', 'locales'];
        console.log("window.historial: "+window.historial);
        
        //console.log(event);
        Backbone.history.navigate('locales', {trigger: true});
    },


    salir: function (event) {
        console.log("SALIR");
        navigator.app.exitApp();
    }
});