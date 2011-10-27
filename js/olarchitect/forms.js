/* ========================================================================    
 *
 * forms.js
 * ----------------------
 *
 *  Generates HTML form inputs based on a passed in model, using the
 *      passed in model's schema property, which determines the form_types of
 *      inputs to create
 *
 * ======================================================================== */

//============================================================================
//
//Create the generate_form function
//
//============================================================================
//---------------------------------------
//generate_form( PARAMS{ model: undefined } )
//---------------------
//This function returns a block of HTML that contains form elements based on the
//  passed in model.  The params is an object that looks like:
//      params: { 
//          model: some_model
//      }
//Note: The passed in model must have a 'schema' attribute, which is an object
//  containing settings for each attribute of the model.  They can also just
//  pass in a model instead of an object containing a key for the model
OLArchitect.functions.generate_form = function( params ){
    //Store a local copy of the model
    var model = undefined;

    //Just do some tests to make sure this function was properly called
    if(params === undefined){
        return false;
    }

    //If a model was propert was not passed in and the schema property
    //  of the passed in parameter does not exist, it means they didn't pass
    //  in the right thing
    if(params.model === undefined && params.schema === undefined){
        return false;
    }

    //Now we can set up the schema
    if(params.model !== undefined){
        //They passed in an object containing a model eg
        //  { model: my_model }
        model = params.model;
    }else if(params.schema){
        //They just passed in the model itself
        model = params;
    }
    //output_array will be an array of strings, each element a string
    //  containing the form element.  It will then be .join('')'ed at the
    //  end of this function and returned.
    var output_array = [];
            
    //Variables we'll use later
    var cur_el_id = undefined,
        cur_obj = undefined,
        cur_el_html = undefined;
    
    //-----------------------------------
    //
    //Set up form elements based on the schema
    //
    //-----------------------------------
    //Add a wrapper div
    output_array.push("<div id='form_wrapper_" 
        + model.get('name').toLowerCase().replace(' ','_')
        + "' class='form_wrapper'>");

    //NOTE: Each input / select elemented generated must have a name
    //  property which is equal to the current key (attribute) being
    //  looped on
    for(attr in model.schema){
        //Loop through model's attributes, and make sure we can get a 
        //  property
        if(model.schema.hasOwnProperty(attr)){
            //Go through each item in the schema.  If a property is not defined
            //  in the schema, we won't create an element for it.
            cur_el_id = model.cid + "_" + attr;
            //Get a reference to the current object we're looping on
            cur_obj = model.schema[attr];
            cur_el_html = '<li id="li_' 
                + cur_el_id + '" ';
            
            //Schema can also contain "headers", which are like labels
            //  but have no input - just a header
            if(cur_obj.form_type !== 'header'){
                //Close the LI element tag
                cur_el_html += " >";

                //---------------------------
                //Create label for the element
                //--------------------------- 
                cur_el_html += "<label for='"
                    + cur_el_id
                    + "' >"
                    + attr
                    + "</label>";
            }else{
                //Add a class because this is a header element
                cur_el_html += " class='header_item' >";

                //Create a header element and put it in the list element
                cur_el_html += "<h3>" 
                    + cur_obj.default_value
                    + "</h3>";
            }

            //---------------------------
            //Check for types
            //---------------------------
            if(cur_obj.form_type === 'string' 
                || cur_obj.form_type === 'float' 
                || cur_obj.form_type === 'int'){
                //---------------------------
                //INPUT element
                //---------------------------
                //  Note: Don't include quotes after type, that will be done in 
                //  each value check
                cur_el_html += '<input name="'
                    + attr + '" type=';

                //---------------------------
                //check for input type
                //---------------------------
                if(cur_obj.form_type === 'int'
                    ||cur_obj.form_type === 'float'){
                    //Use a number type
                    cur_el_html += "'number' ";

                    //Check for min and max
                    if(cur_obj.min !== undefined){
                        cur_el_html += "min='"
                            + cur_obj.min
                            + "' ";
                    }
                    if(cur_obj.max !== undefined){
                        cur_el_html += "min='"
                            + cur_obj.min
                            + "' ";
                    }

                    //Check for precision
                    if(cur_obj.precision !== undefined){
                        //Precision should be a string like "0.000"
                        cur_el_html += "step='"
                            + cur_obj.precision 
                            + "' ";
                    }
                }else{
                    //If it's not an int or float, then it's probably
                    //  a string or something else that we will use text for
                    cur_el_html += "'text'";
                }

                //---------------------------
                //finish the input element
                //---------------------------
                //Check for value
                if(model.attributes[attr] !== undefined){
                    cur_el_html += " value='"
                        + model.attributes[attr] + "' ";
                }
                //Check for placeholder
                if(cur_obj.default_value !== undefined){
                    cur_el_html += " placeholder='"
                        + cur_obj.default_value + "' ";
                }
                //Give it a title
                if(cur_obj.title !== undefined){
                    cur_el_html += " title='"
                        + cur_obj.title + "' ";
                }
                //And an ID
                cur_el_html += " id='" 
                    + cur_el_id + "' />";


            }else if(cur_obj.form_type === 'select'
                || cur_obj.form_type === 'boolean'){
                //---------------------------
                //SELECT element
                //---------------------------
                cur_el_html += '<select id="'
                    + cur_el_id + '" name="' + attr + '" >';

                //---------------------------
                //Add options
                //---------------------------
                //Add an 'empty' option
                cur_el_html += "<option value='undefined'>-----</option>";

                if(cur_obj.form_type === 'boolean'){
                    //Only show true or false
                    //Create true option
                    cur_el_html += "<option value='true' ";
                    //If set the selected value to true if it's the current 
                    //  value
                    if(model.attributes[attr] === 'true' ){
                        cur_el_html += " selected ";
                    }
                    cur_el_html += " >true</option>";

                    //Create false option
                    cur_el_html += "<option value='false' ";
                    //If set the selected value to true if it's the current 
                    //  value
                    if(model.attributes[attr] === 'false'){
                        cur_el_html += " selected ";
                    }
                    cur_el_html += " >false</option>";
                }else if(cur_obj.form_type === 'select'){
                    //Add options based on the options property
                    for(option in cur_obj.options){
                        cur_el_html += "<option value='" + 
                            cur_obj.options[option][0] + "' "

                        //See if the item should be selected
                        if(model.attributes[attr] 
                            === cur_obj.options[option][0]){
                            cur_el_html += " selected ";
                        }

                        //Finish up the option
                        cur_el_html += ">" 
                            + cur_obj.options[option][1] 
                            + "</option>";
                    } 
                }

                //---------------------------
                //End select
                //---------------------------
                cur_el_html += '</select>'; 

            }

            //---------------------------
            //See if property has a help tip
            //---------------------------
            if(cur_obj.help_text !== undefined){
                cur_el_html += '<span class="help" '
                    + 'title="' + cur_obj.help_text + '">?</span>';
            }

            //---------------------------
            //Finalize element and append it to the output array
            //---------------------------
            cur_el_html += '</li>'
            output_array.push(cur_el_html);
        }
    }
    //After all elements have been added, close the wrapping div
    output_array.push('</div>');

    //---------------------------
    //Turn the output array to a string and return it
    //---------------------------
    return output_array.join('');
}
