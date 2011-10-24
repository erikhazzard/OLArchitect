/* ========================================================================    
 *
 * models_layers.js
 * ----------------------
 *
 *  Contains layer models 
 *
 * ======================================================================== */
//============================================================================
//Make sure the models object exist
//============================================================================
try{
    OLArchitect.models.Layers = {};
}catch(err){ OLArchitect.models.Layers = {}; }

//============================================================================
//
//Collection of layer objects
//
//============================================================================
OLArchitect.models.Layers.Collection = Backbone.Collection.extend({
    //This collection contains a list of all layer models.  By default,
    //  we'll assume a single Google Maps layer
});

//============================================================================
//
//Layers
//
//============================================================================
OLArchitect.models.Layers.Google = Backbone.Model.extend({
    name: 'layers',

    //Set defaults.  Properties correspond to OpenLayers' Map class
    defaults: {
        //Blah
    }

});

OLArchitect.models.Layers.OSM = Backbone.Model.extend({
    //Set defaults.  Properties correspond to OpenLayers' Map class
    defaults: {
        //Blah
    }

});
