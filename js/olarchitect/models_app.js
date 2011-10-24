/* ========================================================================    
 *
 * models_app.js
 * ----------------------
 *
 *  Contains the model for the app, which contains all sub models
 *
 * ======================================================================== */
//============================================================================
//Make sure the models object exist
//============================================================================
try{
    OLArchitect.models.App= {};
}catch(err){ OLArchitect.models.App= {}; }

//============================================================================
//
//Collection of layer objects
//
//============================================================================
OLArchitect.models.App = Backbone.Model.extend({
    //This collection contains a list of all layer models.  By default,
    //  we'll assume a single Google Maps layer
    defaults: {
        map: undefined,
        layers: undefined,
        controls: undefined
    }
});
