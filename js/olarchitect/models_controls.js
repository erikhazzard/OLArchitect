/* ========================================================================    
 *
 * models_controls.js
 * ----------------------
 *
 *  Contains layer models and collections.  The collection is defined at
 *  the bottom
 *
 * ======================================================================== */
//============================================================================
//
//Controls
//
//============================================================================
OLArchitect.models.classes.Controls.OverviewMap= Backbone.Model.extend({
    defaults: {
        name: 'OverviewMap',
        type: undefined,
        model_type: 'OverviewMap',
        isBaseLayer: undefined
    }

});

//Etc.

//============================================================================
//
//Collection of layer objects
//
//============================================================================
OLArchitect.models.classes.Controls.Collection = Backbone.Collection.extend({
    //This collection contains a list of all layer model classes
    model: function(attr, options){
        //Depending on the type of model the user wants to add, add it
        switch(attrs.model_type){
        case 'OverviewMap':
            //do some stuff
            return new OLArchitect.models.classes.Controls.OverviewMap(
                attr, options);
        default:
            return false;
        }
    }
});
