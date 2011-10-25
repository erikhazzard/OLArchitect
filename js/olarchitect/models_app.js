/* ========================================================================    
 *
 * models_app.js
 * ----------------------
 *
 *  Contains the model for the app, which contains all sub models
 *
 * ======================================================================== */
//============================================================================
//
//The App model is really only a single model, but we'll use a collection for
//  it for consistency
//
//============================================================================
//============================================================================
//Define the App model
//============================================================================
OLArchitect.models.classes.App.App = Backbone.Model.extend({
    //This collection contains a list of all layer models.  By default,
    //  we'll assume a single Google Maps layer
    defaults: {
        controls: undefined,
        layers: undefined,
        map: undefined
    }
});


//============================================================================
//Define the App Collection
//============================================================================
OLArchitect.models.classes.App.Collection = Backbone.Collection.extend({
    model: OLArchitect.models.classes.App.App
});
