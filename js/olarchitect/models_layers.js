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
        type: undefined,
        layer_type: 'Google',
        layer_group: 'base_layers',
        isBaseLayer: undefined
        //Blah
    },
    schema: {
        //Type is the Google Maps Layer type
        type: {
            form_type: 'select',
            get_html: function(val){
                return "google.maps.MapTypeId." + val
            },
            options: [ 
                ['HYBRID', 'Hybrid (Streets + Satellite'],
                ['SATELLITE', 'Satellite'],
                ['undefined','Street View'],
                ['TERRAIN', 'Terrain / Physical']
            ]
        },
        isBaseLayer: {
            form_type: 'boolean',
            default_value: 'true'
        }
    },

    generate_html: function(num_tabs){
        //TODO: This should be in the app view
        var that = this;
        var output_html = [];
        for(attr in this.schema){
            if(that.get(attr) !== undefined){
                output_html.push(
                    '\t'.multiply(num_tabs)
                    + attr + ': '
                    + that.schema[attr].get_html(
                        that.get(attr)      
                    )
                );
            }
        }
        return output_html.join(',\n')
    }

});

OLArchitect.models.classes.Layers.OSM = Backbone.Model.extend({
    //Set defaults.  Properties correspond to OpenLayers' Map class
    defaults: {
        //Blah
        name: 'Open Street Map',
        layer_type: 'OSM',
        isBaseLayer: true
    },
    generate_html: OLArchitect.functions.generate_html

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
        switch(attrs.layer_type){
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
