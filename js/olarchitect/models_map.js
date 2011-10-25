/* ========================================================================    
 *
 * models_map.js
 * ----------------------
 *
 *  Contains model definitions for the map.  Collection will just consist
 *      of a single map model object, for now.  Collection is defined at
 *      the bottom
 *
 * ======================================================================== */
//============================================================================
//
//Map model
//
//============================================================================
OLArchitect.models.classes.Map.Map = Backbone.Model.extend({
    //Name of this model (we'll use it when creating form elements,
    //  among other things)
    name: 'map',

    //Set defaults.  Properties correspond to OpenLayers' Map class
    defaults: {
        allOverlays: undefined,
        //TODO: Controls should be a collection of Control model objects
        controls: undefined,

        div: 'map',
        //TODO: Advanced mode: eventListeners
        //eventListeners: blar
        fallThrough: undefined,
        //layers will be set automatically
        projection: undefined, 
        displayProjection: undefined,
        unit: undefined,
    
        tileSize: undefined,

        numZoomLevels: 16,

        maxExtent: undefined,
        minExtent: undefined,
        restrictedExtent: undefined,

        resolutions: undefined,
        maxResolution: undefined,
        minResolution: undefined,

        scales: undefined,
        maxScale: undefined,
        minScale: undefined,

        panMethod: undefined,
        panDuration: undefined,

        //Other properties that aren't explictly part of the Map class
        starting_center: (0,0),
        starting_zoom_level: 0
    },
    //Define properties of each attribute to use for form creation
    schema: {
        // LABEL ONLY example
        header_general: {
            type: 'header',
            default_value: 'General Settings'
        },

        div: {
            help_text: "This is the ID of the element that your map will go into. By default, this value is 'map' - which assumes you will have a div element on your page that contains an ID of 'map'. No spaces are allowed in HTML IDs.",
            type: 'string'
        },
        projection: {
            default_value: 'EPSG:4326',
            get_html: function(val){ return "new OpenLayers.Projection('" + val + "')"; },
            type: 'string'
        },
        displayProjection: {
            default_value: 'EPSG:4326',
            get_html: function(val){ return "new OpenLayers.Projection('" + val + "')"; },
            help_text: "This is a property that is used mainly by controls which show coordinate information. By setting this property on the map object, any control that has a displayProjection property will be set to this value. Controls, such as the MousePosition control, can display coordinates in the displayProjection. So, your map could be in a different projection than what you wish to display the coordinates in. However, to use a displayProjection other than EPSG:4326 or EPSG:900913, Proj4js must be included on your page. This property comes in very handy if, for instance, your map is in a spherical Mercator projection (i.e., EPSG:900913, or the Google Maps projection), but you might wish to display coordinates in another projection, like EPSG:4326 (to display lon/lat coordinates).",
            type: 'string'
        },
        maxExtent: {
            default_value: '-180, -90, 180, 90',
            get_html: function(val){ return "new OpenLayers.Bounds(" + val + ")"; },
            type: 'string'
        },


        // Advanced stuff
        header_advanced: {
            type: 'header',
            default_value: 'Advanced Settings'
        },
        allOverlays: {
            default_value: false,
            help_text: "The allOverlays property specifies whether or not the map can function without any baselayers. By setting this property, all layers will act as overlay layers. There may be times when you wish to use this - just keep in mind, when using this property, users have the ability to disable all layers and they could, in effect, see an empty map. By setting this property to true, third party API layers will also act as overlay layers. So, if you wish, you could use a Google maps layer as an overlay layer and make it semi transparent.",
            type: 'boolean'
        },
        fallThrough: {
            default_value: true,
            type: 'boolean'
        },
        unit: {
            default_value: 'degrees',
            options: [ ['degrees', 'degrees'],
                        ['ft', 'feet'],
                        ['inches', 'inches'],
                        ['km', 'kilometers'],
                        ['m', 'meters'],
                        ['mi', 'miles']
            ],
            type: 'select'
        },
    },

    //========================================================================
    //
    //Functions
    //
    //========================================================================
    //Generate HTML
    //  NOTE: The schema object literal must be defined, as that what we'll use
    //  to generate HTML
    generate_html: function(num_tabs){
        //num_tabs is the number of tabs to prepend to the outputted HTML
        if(num_tabs === undefined){
            var num_tabs = 0;
        }
        //Copy this (current model object) scope)
        var that = this;
        
        //Store an array which we'll join to a string and return
        var output_html = [];
        var output_string = '';
        var temp_key= '';
        var temp_val = '';

        //Loop through all the attributes in the model and generate
        //  HTML for it
        for(var attr in that.schema){
            if(that.schema.hasOwnProperty(attr)){
                //First, let's do some value checking.  If the value is
                //  undefined or the current item is a 'header' element,
                //  we won't use it
                if(that.get(attr) !== undefined 
                    && that.get(attr) !== 'undefined'
                    && that.get(attr).search('header_') === -1){
                    //We're good!
                    //Add to the output_html
                    if(that.schema[attr].get_html !== undefined){
                        //For each item in the schema, set the 
                        //  key as the attribute and the value as the return value
                        //  of the get_html function.  If no get_html function is
                        //  defined, then just use the string value (assume we
                        //  don't have to do anything special, like add
                        //      'new OpenLayers.LonLat(...,...)'
                        output_html.push(
                            '\t'.multiply(num_tabs)
                            + attr + ': '
                            + that.schema[attr].get_html(
                                that.get(attr)      
                            )
                        );
                    }else{
                        //get_html function undefined, so assume we can just output
                        //  the value
                        //We also should do some string cleanup.  For now, just replace
                        //  spaces with '_'
                        temp_key = '\t'.multiply(num_tabs)
                            + attr + ': ';
                        temp_val = "'" + that.get(attr).replace(
                                / /g, '_') + "'"
                        //Check for true / false
                        if(temp_val === "'true'"){
                            temp_val = 'true';
                        }else if(temp_val === "'false'"){
                            temp_val = 'false';
                        }
                        //Append the key and val to the output html
                        output_html.push(
                            temp_key + temp_val
                        );
                    }
                }
            }
        }

        //Done with loop, join the string and return it
        //  Join using a comma and new line
        output_string = output_html.join(',\n');
        return output_string
    },

    //Validation function
    validate: function(attributes){
        //check attributes and make sure everything is valid
    }
});

//============================================================================
//
//Collection of map object
//
//============================================================================
OLArchitect.models.classes.Map.Collection = Backbone.Collection.extend({
    //This collection contains a list of all layer model classes
    model: OLArchitect.models.classes.Map.Map
});
