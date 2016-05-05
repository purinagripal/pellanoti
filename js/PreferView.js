var PreferView = Backbone.View.extend({

    initialize: function () {
        console.log('initialize de preferView');
        
        this.pref_ciudad = [0,0,0,0,0,0,0,0,0];
        this.pref_categ = [0,0,0,0,0,0,0];
        this.categorias = [];
        this.ciudades = [];
        
        this.$el.html(this.template());
        
        // comprueba si ya tenemos preferencias guardadas
        if(window.localStorage.getItem('pref_categ')) {
            
            // si hay preferencias guardadas las carga
            
            // paso lo guardado en localStorage a arrays
            var ls_pref_categ = window.localStorage.getItem('pref_categ');
            ls_pref_categ = JSON.parse(ls_pref_categ);
            //console.log(ls_pref_categ);
            var ls_pref_ciudad = window.localStorage.getItem('pref_ciudad');
            ls_pref_ciudad = JSON.parse(ls_pref_ciudad);
            //console.log(ls_pref_ciudad);
            
            
            // CATEGORIAS: cargamos ls en this.pref_categ 
            var id_categoria;
            for (index = 0; index < ls_pref_categ.length; index++) { 
                id_categoria = ls_pref_categ[index].id_categoria;
                this.pref_categ[id_categoria] = 1;
                $('#cat'+id_categoria+' i', this.el).show();
            }
            console.log('pref_categ');
            console.log(this.pref_categ);
            
            // CIUDADES: cargamos ls en this.pref_ciudad
            var id_ciudad;
            for (index = 0; index < ls_pref_ciudad.length; index++) { 
                id_ciudad = ls_pref_ciudad[index].id_ciudad;
                this.pref_ciudad[id_ciudad] = 1;
                $('#ciudad'+id_ciudad+' i', this.el).show();
            }
            console.log('pref_ciudad');
            console.log(this.pref_ciudad);
            
        } else {
            // no hay preferencias guardadas
            
            // oculto el menú de navegación superior
            $('.boton_inicio', this.el).hide();
            $('.menu_drop', this.el).hide();
            
            // selecciono todo por defecto
            this.pref_ciudad = [0,1,1,1,1,1,1,1,1];
            this.pref_categ = [0,1,1,1,1,1,1];
            $('.sel_ciudad i', this.el).show();
            $('.sel_cat i', this.el).show();
            
        }
    },

    render: function () {
        console.log('render de PreferView');
        //this.$el.html(this.template()); // en initialize para poder preparar la vista
        return this;
    },

    events: {
        "click #boton_guardar": "click_guardar",
        "click .sel_cat": "selec_categoria",
        "click .sel_ciudad": "selec_ciudad",
        
        "click .link_locales": "ver_locales",
        "click .link_eventos": "volver_inicio",
        "click .boton_inicio": "volver_inicio"
    },
    
    selec_categoria: function (event) {
        var index_cat = $(event.currentTarget).attr('data-id'); 
        if(this.pref_categ[index_cat]==0) {
            this.pref_categ[index_cat]=1;
            $('#cat'+index_cat+' i').show();
        } else {
            this.pref_categ[index_cat]=0;
            $('#cat'+index_cat+' i').hide();
        }
        console.log(this.pref_categ);
    },
    
    selec_ciudad: function (event) {
        var index_ciu = $(event.currentTarget).attr('data-id'); 
        if(this.pref_ciudad[index_ciu]==0) {
            this.pref_ciudad[index_ciu]=1;
            $('#ciudad'+index_ciu+' i').show();
        } else {
            this.pref_ciudad[index_ciu]=0;
            $('#ciudad'+index_ciu+' i').hide();
        }
        console.log(this.pref_ciudad);
    },
    
    guardarPreferencias: function () {
        // TO_DO: habría que COMPROBAR si ya tenemos el id_follow guardado
        var ls_id_follow = window.localStorage.getItem('id_follow');
        var contexto_this = this;
        
        // muestra imagen cargando...
        $('#cargando').show();
        $('#boton_guardar').hide();
        
        // modelo 
        var follower = new Follower();
        follower.set({
            id_follow: ls_id_follow, //window.localStorage.getItem('id_follow'),
            FollowCategorias: contexto_this.categorias,
            FollowCiudades: contexto_this.ciudades
        });

        follower.save(null, {
            success:function(model, response){
                // guarda las preferencias en localStorage
                window.localStorage.setItem('pref_categ', JSON.stringify(contexto_this.categorias));
                window.localStorage.setItem('pref_ciudad', JSON.stringify(contexto_this.ciudades));
                // redirecciona a INICIO
                Backbone.history.navigate('', {trigger: true, replace: true});
            },
            error: function(model, response) {
                $('#boton_guardar').show();
                $('#cargando').hide();
                // redirecciona a INICIO (para que no se quede bloqueado en esta pantalla
                Backbone.history.navigate('', {trigger: true, replace: true});
            },
            wait: true
        });
        
    },
    
    confirmGuardar: function (buttonIndex) {
        if(buttonIndex==1) {
            this.guardarPreferencias();
        }
    },
    
    click_guardar: function (event) {
        
        console.log("guardar_prefes");
        
        this.categorias = [];
        this.ciudades = [];

        // preparamos el array CATEGORIAS
        for (index = 1; index < this.pref_categ.length; index++) { 
            if( this.pref_categ[index] == 1 ) {
                this.categorias.push({id_categoria:index});
            }
        }
        // preparamos el array CIUDADES
        for (index = 1; index < this.pref_ciudad.length; index++) { 
            if( this.pref_ciudad[index] == 1 ) {
                this.ciudades.push({id_ciudad:index});
            }
        }
        
        
        if( this.categorias.length==0 || this.ciudades.length==0 ) {
            // si no hay NINGUNA categoria o NINGUNA zona seleccionada
            console.log('categorias o zonas no seleccionadas');
            var mensaje;
            if( this.categorias.length==0 ) {
                mensaje = 'No has seleccionado ninguna categoría.';
            }
            if( this.ciudades.length==0 ) {
                mensaje = 'No has seleccionado ninguna zona.';
            }
            mensaje += ' Para recibir notificaciones debes elegir al menos una categoría y una zona.';
            
            var contexto = this;
            navigator.notification.confirm(
                mensaje, // message
                contexto.confirmGuardar,            // callback to invoke with index of button pressed
                'Pella de Ocio',           // title
                ['No quiero notificaciones','Elegir de nuevo']     // buttonLabels
            );
        } else {
            // categoria y zona seleccionada
            // guardamos en servidor y localStorage
            this.guardarPreferencias();
        }
        
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
    
    volver_inicio: function (event) {
        // resetea el historial
        window.historial = [""];
        console.log("window.historial: "+window.historial);
        Backbone.history.navigate( "", {trigger: true} );
    }
    
    //
    //   ENLACES DEL MENU SUPERIOR
    //
    //////////////////////////////////////////
    
   
});