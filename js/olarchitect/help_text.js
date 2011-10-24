/* ========================================================================    
 *
 * help_text.js
 * ----------------------
 *
 *  Contains help text for all options.  Help text is grouped by category, 
 *      so map properties will be found under OLArchitect.help_text.map.PROP
 *      where PROP is any key found in the models' key: value store
 *
 * ======================================================================== */
//============================================================================
//Make sure the models object exist
//============================================================================
try{
    OLArchitect.help_text= {};
}catch(err){ OLArchitect.help_text= {}; }

//============================================================================
//
//Configure Help Text
//
//============================================================================
//============================================================================
//
//Map Help Text
//
//============================================================================
OLArchitect.help_text.map = {
    allOverlays: "Some text..."
}
