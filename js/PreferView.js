var PreferView = Backbone.View.extend({

    initialize:function () {
        console.log('initialize de preferView');
        
        this.pref_ciudad = [0,0,0,0,0,0,0];
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
        "click .sel_cat": "selec_categoria"
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
    
    guardar_prefes: function (event) {
        // al enviar el formulario muestra conectando
        var registr_id = window.localStorage.getItem('reg_id');
        alert('registration_id: '+registr_id);
        
        //var datosForm = $("#prefer-form").serializeObject();
        console.log("preferencias categorias");
        console.log(this.pref_categ);
        alert(this.pref_categ);
        
        
    }
    
   
});