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
OLArchitect.functions.generate_code = function(){
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

    //-----------------------------------
    //
    //Check for Third Party API requirements
    //
    //-----------------------------------
    //We need to first check if user has requested a google, osm, bing, etc.
    //  map so we can add the third party API script here
    final_output.push("<script src='third_party_api.js'></script>");

    //-----------------------------------
    //
    //Start building our map code string
    //
    //-----------------------------------
    final_output.push("<script>");


    final_output.push('//---------------------------------------');
    final_output.push('//Setup our map code');
    final_output.push('//---------------------------------------');

    //-----------------------------------
    //
    //Finialize everything
    //
    //-----------------------------------
    //We're done with our code, so end the script tag
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
