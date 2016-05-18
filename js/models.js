var Evento = Backbone.Model.extend({
    idAttribute: 'id_evento'
});

var EventoCollection = Backbone.Collection.extend({

    model: Evento,

    //url: "http://localhost/fuerteagenda_cms/agenda_app",
    //url: "http://test.mepwebs.com/agenda_app",
    url: "http://test.mepwebs.com/appeventos",
    
    comparator: 'date',
    
    obtenerLocales: function(){
        
        var locales = [];
        
        console.log("::: antes del each ::: ");
        // recorro la lista de eventos (this)
        _.each( this.models, 
                function(element) {
                    //console.log("evento dentro de each");
                    //console.log(element.attributes.Eventor);
            
                    var esta_incluido = _.some(this, function(local) {return local.id_user === element.attributes.Eventor.id_user;});
                    if(!esta_incluido){
                        //console.log("::: incluye 1 local ::: id_user: "+element.attributes.Eventor.id_user);
                        locales.push(element.attributes.Eventor);
                    }  
                    //console.log("::: locales ::: ")
                    //console.log(this);
                }, 
                locales);
        
        //console.log("::: despues del each ::: ");
        //console.log(":::locales al terminar::: ");
        //console.log(locales);

        var localesList = new Backbone.Collection(locales);
        
        return localesList;
    
    },
    
    obtenerFavoritos: function() {
        var ls_pref_categ = window.localStorage.getItem('pref_categ');
        ls_pref_categ = JSON.parse(ls_pref_categ);
        
        var ls_pref_ciudad = window.localStorage.getItem('pref_ciudad');
        ls_pref_ciudad = JSON.parse(ls_pref_ciudad);
        
        var cat_favoritosList = [];
        var ciu_favoritosList = [];
        
        // seleccionamos los eventos q corresponden a las categorias favoritas de la lista total de eventos
        for (index = 0; index < ls_pref_categ.length; index++) {
            console.log('id_categoria: '+ls_pref_categ[index].id_categoria);
            //cat_favoritosList.concat( this.where({id_categoria: String(ls_pref_categ[index].id_categoria)}) );
            cat_favoritosList = cat_favoritosList.concat( this.where({id_categoria: String(ls_pref_categ[index].id_categoria)}) );
        }
        var cat_favoritosColec = new EventoCollection(cat_favoritosList);
        
        // seleccionamos los eventos q corresponden a las ciudades favoritas de la lista obtenida
        for (index = 0; index < ls_pref_ciudad.length; index++) {
            console.log('id_ciudad: '+ls_pref_ciudad[index].id_ciudad);
            ciu_favoritosList = ciu_favoritosList.concat( cat_favoritosColec.where({id_ciudad: String(ls_pref_ciudad[index].id_ciudad)}) );
        }
        var result_favoritosColec = new EventoCollection(ciu_favoritosList);
        
        
        /* prueba
        var pre_favoritosList = new EventoCollection( this.where({id_categoria: '1'}).concat(this.where({id_categoria: '2'})).concat(this.where({id_categoria: '3'})) );
        var favoritosList = new EventoCollection(pre_favoritosList.where({id_ciudad: '2'}));
        favoritosList.sort();*/
        
        // ordenamos por fecha
        result_favoritosColec.sort();        
        return result_favoritosColec;
    }

});

var Follower = Backbone.Model.extend({
    idAttribute: 'id_follow',
    
    //urlRoot: "http://localhost/fuerteagenda_cms/appfollowers", 
    urlRoot: "http://test.mepwebs.com/appfollowers", 
    
    
});
