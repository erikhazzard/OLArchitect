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
    //OLArchitect is the name space for this app.  It contains all the models 
    //  / views / routers from Backbone
    //
    //Let's set up the skeleton first.  This global OLArchitect object will be
    //  used throughout the app
    //
    //===================================
    //
    //Models
    //
    //===================================
    models: {
        classes: {
            //Contains all the model classes.  E.g., the Map class, which
            //  contains all the map configuration options (note - the main
            //  model object is the App class model object, which contains
            //  links to all individual model classes
            //The classes are the definitions for each backbone model.
            //  NOTE: The Map object really will probably never have more than
            //  a single model, but for consistency
            App: {
                App: undefined,
                Collection: undefined
            },
            Controls: {
                Collection: undefined,
                OverviewMap: undefined
                //etc...
            },
            Layers: {
                Collection: undefined,
                Google: undefined
                //etc...
            },
            Map: {
                Collection: undefined,
                Map: undefined
            }
        },
        objects: {
            //Objects contain instaniated model classes.  There will only
            //  be four objects - app, map, layers, and controls.  Layers and
            //  controls are actually a collection, but we'll set up 
            //  the app map model object as collections too
            //NOTE: Each model object here points to a collection object
            //
            //Example values are above default values
            //
            //The app object is our 'main' object.  It is a model containing
            //  all the other model objects
            //The app object is really, right now, only a single object but
            //  we'll set it up as a collection for consistenancy and 
            //  extendability later (if, say, we want to allow users to load
            //  multiple map / layer / control settings)
            //
            //app: new OLArchitect.models.classes.App.Collection()
            //OLArchitect.models.objects.app.add(
            //  new OLArchitect.models.classes.App.App({
            //      map: map_model_object, controls: controls_collection,
            //      layers: layers_collection
            //})
            app: undefined,
            
            //controls: new OLArchitect.models.classes.Controls.Collection()
            controls: undefined,
    
            //layers: new OLArchitect.models.classes.Layers.Collection()
            layers: undefined,

            //map: new OLArchitect.models.classes.Map.Collection()
            map: undefined
        }
    },

    //===================================
    //
    //Models
    //
    //===================================
    views: {
        classes: {
            //Similar to above.  The App and Map class really will only
            //  have a view for a single model object, so App will point 
            //  to a view, NOT an object literal like the rest of the objects.
            App: undefined,
            Collection: undefined,
            Model: undefined,
            //NewOLObject is used to display the types (for either controls
            //  or layers) when the user adds a new control or layer)
            NewOLObject: undefined
        },
        objects: {
            //Objects contain instaniated app classes. See above (models)
            //  for more info
            app: undefined,
            controls: {
                collection: undefined,
                overview_map_cID: undefined
                //etc...
            },
            layers: {
                collection: undefined,
                google_cID: undefined
                //etc...
            },
            //There is only a single view for the map
            map: undefined,

            //Views for the new control and layer options
            new_ol_control: undefined,
            new_ol_layer: undefined
        }
    },
    

    /*PUT IT APP VIEW*/
    functions: {
        generate_form: undefined,
        generate_code: undefined
    }
};
//============================================================================
//
//UTILITY Functions
//
//============================================================================
//Add a multiply function for all strings
String.prototype.multiply = function(n) {
    return Array.prototype.join.call({length:n+1}, this);
};

String.prototype.capitalize= function(str){
    return (this.slice(0,1).toUpperCase() 
        + this.toLowerCase().slice(1,this.length));
}

//============================================================================
//
//Page setup
//
//============================================================================
$(document).ready(function(){
    //Enable syntax highlighter
    SyntaxHighlighter.all();

    //Create the App view
    OLArchitect.views.objects.app = new OLArchitect.views.classes.App();
});
