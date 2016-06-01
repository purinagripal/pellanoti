var LocalView = Backbone.View.extend({

    initialize:function () {
        
    },

    render:function () {
        console.log('render de local');
                
        var primerEvento = this.collection.at(0);
        
        this.$el.html(this.template(primerEvento.toJSON()));
        
        $('.localDetails', this.el).html(new LocalDetailsView({model: primerEvento}).render().el);
                
        _.each(this.collection.models, 
               function (evento) {$('.guiaeventos', this.el).append(new EventoListItemView({model: evento}).render().el);}, 
               this);
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
        
        "click .guiaeventos.eventoslocal .cuadro": "l_ver_evento"
    },
    
    l_ver_evento: function (event) {
        console.log("ver evento dsd local, antes de data-id");
        var id_evento = $(event.currentTarget).attr('data-id'); 
        console.log("ver evento dsd local "+id_evento);
        //console.log(event);
        
        // añade entrada al historial
        window.historial.push('eventos/'+id_evento);
        console.log("window.historial: "+window.historial);

        Backbone.history.navigate('eventos/'+id_evento, {trigger: true});
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
        
        //Backbone.history.history.back();
        // es lo mismo que:
        //window.history.back();
    },
    
    salir: function (event) {
        console.log("SALIR");
        navigator.app.exitApp();
    }

});