var FavoritosView = Backbone.View.extend({

    initialize:function () {
        console.log('initialize de favoritosView');
        this.render();
    },

    render:function () {
        console.log('render de favoritosView');
        console.log(JSON.stringify(this.model));
                
        //this.$el.html(this.template(this.model.toJSON()));
        this.$el.html(this.template());
        
        _.each(this.model.models, 
               function (evento) {$('.guiaeventos', this.el).append(new EventoListItemView({model: evento}).render().el);}, 
               this);
        return this;
    },

    events: {
        "click .boton_inicio": "volver_inicio",
        "click .link_eventos": "volver_inicio",
        "click .link_locales": "ver_locales",
        "click .link_prefer": "ver_prefer",
        "click .menu_salir": "salir",
        
        "click .row.cuadro": "ver_evento"
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
    
    ver_locales: function (event) {        
        // reset historial
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

    salir: function (event) {
        console.log("SALIR");
        navigator.app.exitApp();
    }
});