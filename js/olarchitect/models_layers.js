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
        model_type: 'Google',
        isBaseLayer: undefined,
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
    }

});

OLArchitect.models.classes.Layers.OSM = Backbone.Model.extend({
    //Set defaults.  Properties correspond to OpenLayers' Map class
    defaults: {
        //Blah
        name: 'Open Street Map',
        model_type: 'OSM',
        isBaseLayer: true
    },

    schema: {
        //Type is the Google Maps Layer type
        isBaseLayer: {
            form_type: 'boolean',
            default_value: 'true'
        }
    }
});


OLArchitect.models.classes.Layers.Vector = Backbone.Model.extend({
    //Set defaults.  Properties correspond to OpenLayers' Map class
    defaults: {
        //Blah
        name: 'Vector',
        model_type: 'Vector',
        protocol: undefined,
        url: undefined,
        isBaseLayer:false 
    },

    //TODO: Figure out how to put objects inside of layer objects
    schema: {
        isBaseLayer: {
            form_type: 'boolean',
            default_value: 'true'
        },
        //Protocol is the protocol to use
        protocol: {
            form_type: 'select',
            get_html: function(val){
                return "new OpenLayers.Protocol." + val;
            },
            options: [ 
                ['HTTP', 'HTTP'],
                ['WMS', 'WFS (Web Feature Service)']
            ]
        },
        url: {
            form_type: 'string',
            default_value: ''
        }
    }
});
//============================================================================
//
//Collection of layer objects
//
//============================================================================
OLArchitect.models.classes.Layers.Collection = Backbone.Collection.extend({
    //types is used to keep track of the possible object types the user can 
    //  add to their map
    types: ['Google','OSM',
            'Vector'],

    //This collection contains a list of all layer model classes
    model: function(attr, options){
        //Depending on the type of model the user wants to add, add it
        switch(attrs.model_type){
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
