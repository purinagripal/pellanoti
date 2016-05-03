var PreferView = Backbone.View.extend({

    initialize:function () {
        console.log('initialize de preferView');
        
        this.pref_ciudad = [0,0,0,0,0,0,0,0,0];
        this.pref_categ = [0,0,0,0,0,0,0];
        
        this.$el.html(this.template1());
        /*
        // si hay datos de usuario salta el formulario de login
        if(window.localStorage.getItem('usuario')){
            // oculta formulario
            $('#login-formulario', this.el).hide();
            
            console.log("usuario localStorage: "+window.localStorage.getItem('usuario'));
            console.log("clave localStorage: "+window.localStorage.getItem('passwd'));
            
            // envia datos al servidor para ver si el usuario esta vigente
            var datosActualizados = new FormData();
            datosActualizados.append('usuario', window.localStorage.getItem('usuario'));
            datosActualizados.append('contrasena', window.localStorage.getItem('passwd'));
            console.log("datosActualizados");
            console.log(datosActualizados);
            
            this.autenticar_svr(datosActualizados);
            
        } else {
            console.log("no localstorage");
            $('#login-access', this.el).hide();
        }*/
    },

    render:function () {
        console.log('render de loginView');
        //this.$el.html(this.template()); // en initialize para poder preparar la vista
        return this;
    },

    events: {
        "click #boton_guardar": "guardar_prefes",
        "click .sel_cat": "selec_categoria",
        "click .sel_ciudad": "selec_ciudad"
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
    
    guardar_prefes: function (event) {
        
        console.log("guardar_prefes");
        
       // if( window.localStorage.getItem('id_follow') ){
        
            // muestra imagen cargando...
            $('#cargando').show();
            $('#boton_guardar').hide();
            
            var ls_id_follow = window.localStorage.getItem('id_follow');
            var categorias = [];
            var ciudades = [];
            
            // preparamos el array CATEGORIAS
            for (index = 1; index < this.pref_categ.length; index++) { 
                if( this.pref_categ[index] == 1 ) {
                    categorias.push({id_categoria:index});
                }
            }
            // preparamos el array CIUDADES
            for (index = 1; index < this.pref_ciudad.length; index++) { 
                if( this.pref_ciudad[index] == 1 ) {
                    ciudades.push({id_ciudad:index});
                }
            }
            
            // modelo 
            var follower = new Follower();
            follower.set({
                id_follow: ls_id_follow, //window.localStorage.getItem('id_follow'),
                FollowCategorias: categorias,
                FollowCiudades: ciudades
            });
            
            follower.save(null, {
                success:function(model, response){
                    // guarda las preferencias en localStorage
                    window.localStorage.setItem('pref_categ', JSON.stringify(categorias));
                    window.localStorage.setItem('pref_ciudad', JSON.stringify(ciudades));
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
       // }
            
        
//        console.log("preferencias categorias");
//        console.log(this.pref_categ);
//        console.log("preferencias ciudad");
//        console.log(this.pref_ciudad);
//        alert('categorias: '+this.pref_categ);
//        alert('ciudades: '+this.pref_ciudad);
        
        
    }
    
   
});