/* ========================================================================    
 *
 * main.js
 * ----------------------
 *
 *  Main 'bootstrapping' script for OLArchitect
 *
 * ======================================================================== */
//============================================================================
//Main App Object
//============================================================================
OLArchitect = {
    views: {},
    models: {},
    collections: {},
    
    //_map is the main object that holds the map configuration.
    //  The map > generated code string will use this object.  This map object
    //  will be updated by models / collections automatically.  It should never
    //  have to be directly modified (but can be accessed)
    _map: {},

    functions: {
        generate_form: undefined,
        generate_code: undefined
    }
};

//============================================================================
//
//Page setup
//
//============================================================================
$(document).ready(function(){
    //Enable syntax highlighter
    SyntaxHighlighter.all();

    //Create the App view
    OLArchitect.views.app_view = new OLArchitect.views.App();
});
