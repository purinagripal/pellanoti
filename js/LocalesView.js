var LocalesView = Backbone.View.extend({

    initialize:function () {
        console.log('initialize de localesView');
        this.ciudad = 0;
        this.render();
    },

    render:function () {
        console.log('render de localesView');
                
        this.$el.html(this.template(this.model.toJSON()));
        
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
                
        return this;
    },

    events: {
        "click .boton_inicio": "volver_inicio",
        "click .link_eventos": "volver_inicio",
        "click .link_favoritos": "ver_favoritos",
        "click .link_prefer": "ver_prefer",
        "click .menu_salir": "salir",
        
        "click .row.cuadro": "ver_local",
        "click .filt_zona": "filtra_ciudad"
    },
    
    ver_local: function (event) {
        var id_local = $(event.currentTarget).attr('data-id'); 
        console.log("ver local "+id_local);
        
        // añade entrada al historial
        window.historial.push('local/'+id_local);
        console.log("window.historial: "+window.historial);
        
        //console.log(event);
        Backbone.history.navigate('local/'+id_local, {trigger: true});
    },
    
    filtra_ciudad: function (event) {
        var id_ciudad = $(event.currentTarget).attr('data-id'); 
        console.log('id de ciudad: '+id_ciudad);
        
        //window.historial = "home";
        console.log("window.historial: "+window.historial);
        // borra del historial
        Backbone.history.navigate('zona_loc/'+id_ciudad, {trigger: true});
        Backbone.history.navigate('locales', {replace: true});
    },
    
   
    ///////////////////////////////////////
    //
    //    ENLACES DEL MENU SUPERIOR
    //
    
    volver_inicio: function (event) {
        // resetea el historial
        window.historial = [""];
        console.log("window.historial: "+window.historial);
        Backbone.history.navigate('', {trigger: true});
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

    salir: function (event) {
        console.log("SALIR");
        navigator.app.exitApp();
    }

});