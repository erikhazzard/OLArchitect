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
        model_type: 'OverviewMap',
    },

    schema: {
        autoPan: {
            form_type: 'boolean',
            default_value: 'false'
        },
        displayClass: {
            default_value: 'my_css_class',
            form_type: 'string'
        },
        div: {
            default_value: 'my_div',
            form_type: 'string'
        },
        minRatio: {
            default_value: '8',
            form_type: 'int'
        },
        maxRatio: {
            default_value: '32',
            form_type: 'int'
        },
        minRectSize: {
            default_value: '15',
            form_type: 'int'
        },
        size: {
            get_html: function(val){
                return 'new OpenLayers.Size(' + val + ')';
            },
            default_value: '180,90',
            form_type: 'string'
        },
        title: {
            form_type: 'string'
        }
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
