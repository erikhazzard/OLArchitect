/* ========================================================================    
 *
 * models_layers.js
 * ----------------------
 *
 *  Contains layer models and collections.  The collection is defined at
 *  the bottom
 *
 * ======================================================================== */
//============================================================================
//
//Layers
//
//============================================================================
OLArchitect.models.classes.Layers.Google = Backbone.Model.extend({

    //Set defaults.  Properties correspond to OpenLayers' Map class
    defaults: {
        name: 'Google Layer',
        type: 'Google',
        //Blah
    }

});

OLArchitect.models.classes.Layers.OSM = Backbone.Model.extend({
    //Set defaults.  Properties correspond to OpenLayers' Map class
    defaults: {
        //Blah
        name: 'Open Street Map',
        type: 'OSM',
    }

});

//============================================================================
//
//Collection of layer objects
//
//============================================================================
OLArchitect.models.classes.Layers.Collection = Backbone.Collection.extend({
    //This collection contains a list of all layer model classes
    model: function(attr, options){
        //Depending on the type of model the user wants to add, add it
        switch(attrs.type){
        case 'Google':
            //do some stuff
            return new OLArchitect.models.classes.Layers.Google(
                attr, options);
        case 'OSM':
            return new OLArchitect.models.classes.Layers.OSM(
                attr, options);
        default:
            return false;
        }
    }
});
