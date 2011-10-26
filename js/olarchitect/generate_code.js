/* ========================================================================    
 *
 * generate_code.js
 * ----------------------
 *
 *  This handles generating actual JS code based on the user's configuration
 *
 * ======================================================================== */
//============================================================================
//Make sure the function
//============================================================================
try{
    OLArchitect.functions.generate_code = undefined; 
}catch(err){ OLArchitect.functions.generate_code = undefined}

//============================================================================
//
//Generate Code Function
//
//============================================================================
OLArchitect.functions.generate_code = function(app_object){
    //This will generate code based on the Map, Layers, and Controls models 
    //  and collections.  It will output the code to the $('#code') element
    //NOTE: All <'s and >'s must be escaped for the code to properly output.
    
    //-----------------------------------
    //Define variables we'll use throughout this function
    //-----------------------------------
    //Final output is an array that will be joined and turned into a string.
    //  Each line of code is an item in the array
    var final_output = [
        "<script src='openlayers.js'></script>"
        ];
    
    //This will be the string we get from joining the final output 
    var final_output_string = '';

    var map_models = app_object.collection.models[0].get('map').models;
    var layer_models = app_object.collection.models[0].get('layers').models;
    var control_models = app_object.collection.models[0].get('controls').models;

    var scripts_loaded = {};
    var cur_type = undefined;
    var item = undefined;

    //Layer vars
    var cur_layer_var_name = '';
    var layer_var_names = [];

    //-----------------------------------
    //
    //Check for Third Party API requirements
    //
    //-----------------------------------
    //We need to first check if user has requested a google, osm, bing, etc.
    //  map so we can add the third party API script here
    //Check for GOOGLE MAPS
    //  Store variables to determine if we've added the third party script 
    //  for each third party...this could be done more cleverly, but
    //  this keeps it simple enough for now...optimize later
    scripts_loaded['Google'] = false; 
    scripts_loaded['OSM'] = false; 
    scripts_loaded['Bing'] = false; 
    //Loop through each model in the layer_models object (the collection of
    //  layer objects).  This loop will determine if we need to add the 
    //  third party API script tag
    for(item in layer_models){
        cur_type = layer_models[item].get('layer_type');
        if(cur_type === 'Google' && scripts_loaded[cur_type] !== true){
            final_output.push("<script src='http://maps.google.com/maps/api/js?sensor=false'></script>");
            scripts_loaded[cur_type] = true;
        }
    }

    //-----------------------------------
    //
    //Start building our map code string
    //
    //-----------------------------------
    final_output.push("<script>");


    //-----------------------------------
    //
    //First, build the MAP object
    //
    //-----------------------------------
    final_output.push('//---------------------------------------');
    final_output.push('//Define a global object so we can access the map state outside the init function');
    final_output.push('//---------------------------------------');
    final_output.push('var MAP_APP = { ');
    final_output.push('\tmap: undefined, ');
    final_output.push('\tinit_function: undefined');
    final_output.push('};');
    final_output.push('');
    final_output.push('//---------------------------------------');
    final_output.push('//Setup our map code');
    final_output.push('//---------------------------------------');
    final_output.push('//Create a function that will setup the map.  Call this function to create your map');
    final_output.push('//\te.x.: MAP_APP.init_function();');
    final_output.push('');
    final_output.push('MAP_FUNCTION.init_function = function(){');
    final_output.push('\t//Create a local map object');
    final_output.push('\tvar map_object = new OpenLayers.Map({');
    final_output.push('\t\t//Define map options');
    //Get MAP config string
    //This may look a little intimidating, but it's not too complex:
    //  -app_object is the passed in app view
    //      -collection is the collection of models that the app view owns (for now,
    //      only one model will exist within it)
    //          -models[0] is accessing the first (and for now only) model of
    //          the app collection
    //              -get('map') is getting the map collection object
    //                  -models[0] is getting the first (and only) model object
    //                  of the map collection
    //                      -generate_html(2) calls the generate_html() function
    //                      of the model object and passes in 2, which is the
    //                      number of tabs we want to prepend to the generated
    //                      HTML
    final_output.push(app_object.collection.models[0].get('map').models[0].generate_html(2));
    
    //Finish off the options
    final_output.push('\t});');

    final_output.push("\t//We just created a local map object, so now we will create a reference to it in our");
    final_output.push("\t//\tgloabl MAP_APP object so we can access it outside of this function");
    final_output.push('\tMAP_APP.map = map_object;');
    final_output.push('');
    

    //-----------------------------------
    //
    //Add LAYERS
    //
    //-----------------------------------
    final_output.push('\t//---------------------------------------');
    final_output.push('\t//Set up layers');
    final_output.push('\t//---------------------------------------');

    //Create an array which will consist of every layer variable name
    //  which we'll use to add layers to the map after looping through
    //  all the layers
    //Note: this is already defined above, but define it here
    //  for clarity
    layer_var_names = [];

    //Create layer objects HTML
    for(item in layer_models){
        //Push a comment
        final_output.push('\t//Create a ' + layer_models[item].get('layer_type')
            + ' layer ');
        var cur_layer_var_name = 'layer_'
            + layer_models[item].get('layer_type').toLowerCase()
            + '_' + layer_models[item].cid
        //And then the layer creation string
        final_output.push('\tvar '
            + cur_layer_var_name 
            +' = new OpenLayers.Layer.'
            + layer_models[item].get('layer_type')
            + '({'
        );

        //Add the layer variable name to the layer_var_names array
        layer_var_names.push(cur_layer_var_name);
        
        //Add the HTML for the layer configuration to the final code output
        final_output.push(
            layer_models[item].generate_html(2)
        );

        final_output.push('\t});');
    }

    //Add layers to the map. 
    //  Note: we could do this in the above loop, but it's a little clearer
    //  to call map.addLayers and pass in all the layers at once.  
    final_output.push('');
    final_output.push('');
    final_output.push('\t//---------------------------------------');
    final_output.push('\t//Add layers to map');
    final_output.push('\t//---------------------------------------');
    final_output.push('\tmap_object.addLayers([');
    final_output.push('\t\t' + layer_var_names.join(','));
    final_output.push('\t])');




    //-----------------------------------
    //
    //Finialize everything
    //
    //-----------------------------------
    //We're done with our code, so end the script tag
    final_output.push('');
    final_output.push("</script>");
    final_output_string = final_output.join('\n');
    //Escape < and >
    final_output_string = final_output_string.replace(/</g, '&lt;');
    final_output_string = final_output_string.replace(/>/g, '&gt;');
    final_output_string = final_output_string.replace(/'/g, '&quot;');
    final_output_string = final_output_string.replace(/"/g, '&quot;');

    //First, we need to remove the existing code <pre> element because 
    //  SyntaxHighlighter turned into pretty code.  
    $('#code_wrapper').empty();
    //Everything in the code wrapper is gone, so now we need to recreate the
    //  <pre> tag with proper SyntaxHighlighter settings
    $('#code_wrapper').html(
        "<pre id='code' class='brush: js; html-script: true; toolbar: false;'></pre>");

    //Now, we can set the html of the <pre> element we just created
    $('#code').html(final_output_string);

    //Finally, call the SyntaxHighlighter function to make it look pretty
    SyntaxHighlighter.highlight();
}
