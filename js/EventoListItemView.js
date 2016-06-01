var EventoListItemView = Backbone.View.extend({

    render:function () {
        /*console.log('evento-model');
        console.log(JSON.stringify(this.model));*/
        $(this.el).html(this.template(this.model.toJSON()));
        
        console.log('id_evento de model en evento list: '+this.model.attributes.id_evento);
        
        this.mostrarNotificacion(this.model.attributes.id_evento);
        
        return this; // enable chained calls
    },
    
    mostrarNotificacion: function (id_evento) {
        var eventos_notificados = window.localStorage.getItem('ev_notif');
        eventos_notificados = JSON.parse(eventos_notificados);
        
        esNotif = 0;
        for (index = 0; index < eventos_notificados.length; index++) { 
            if( id_evento == eventos_notificados[index]['id_evento'] ) {
                esNotif = 1;
            }
        }
        // si es un evento notificado muestra la campana
        if( esNotif == 1 ) {
            $('.notif.fa-bell', this.el).show();
        }
    }
    
    /*events: {
        "click .cuadro": "ver_evento"
    },
    
    ver_evento: function (event) {
        var id_evento = $(event.currentTarget).attr('data-id'); 
        console.log("ver evento "+id_evento);
        //console.log(event);
        Backbone.history.navigate('eventos/'+id_evento, {trigger: true});
    }*/

    
});