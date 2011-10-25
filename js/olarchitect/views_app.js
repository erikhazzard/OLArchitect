/* ========================================================================    
 *
 * views.js
 * ----------------------
 *
 *  Contains views definitions for the app
 *
 * ======================================================================== */
//============================================================================
//
//App View
//
//============================================================================
//Note: The initialize() function contains the heart of the app setup, which
//  loads the app configuration
OLArchitect.views.classes.App = Backbone.View.extend({
    //The app lives in the body tag
    el: 'body',
    
    //-----------------------------------
    //Eventsenable_target_view:
    //-----------------------------------
    //Set up events when user interacts with app buttons
    events: {
        'click #select_code': 'select_code',
        //Each of the buttons will show the corresponding view. Each button
        //  will call the same function, and depending on the type of
        //  button they click the corresponding view will get called
        'click #config_map': 'enable_target_view',
        'click #config_layers': 'enable_target_view',
        'click #config_controls': 'enable_target_view'
        //TODO: Save / export buttons
    },

    //-----------------------------------
    //Events:
    //-----------------------------------
    initialize: function(){
        _.bindAll(this, 'enable_target_view', 'unrender',
            'select_code', 
            'generate_code', 'generate_form');

        //-----------------------------------
        //Set the associated model.  This model is just a model that contains
        //  all the other models: Map, Layers, Controls, etc.
        //-----------------------------------
        //TODO: Allow loading of existing models
        if(this.collection === undefined){
            //Store a reference to the App collection object.  
            //  NOTE: This app collection object contains references to
            //  ALL the models of our app, and is used heavily in the code
            //  generation function.  We use a collection instead of a single
            //  model in case we want to extent the app later to support 
            //  multiple active map configurations
            OLArchitect.models.objects.app = 
                new OLArchitect.models.classes.App.Collection();
            //Set this collection to point to the App collection model object
            this.collection = OLArchitect.models.objects.app;

            //---------------------------
            //DEFAULT CONFIGURATION
            //---------------------------
            //TODO: Load from a config file?
            //Setup starting settings, such as adding a google map layer
            //
            //Setup the MAP
            //--------------------
            OLArchitect.models.objects.map = 
                new OLArchitect.models.classes.Map.Collection()

            //Setup the view object
            OLArchitect.views.objects.map.collection 
                = new OLArchitect.views.classes.Map.Collection(); 

            //Add a single map object to the map collection.  Note:
            //  we only use one model object for the map configuration settings
            OLArchitect.models.objects.map.add(
                new OLArchitect.models.classes.Map.Map());

            //Setup the CONTROLS
            //--------------------
            OLArchitect.models.objects.controls = 
                new OLArchitect.models.classes.Controls.Collection()
            //Setup the view object
            OLArchitect.views.objects.controls.collection 
                = new OLArchitect.views.classes.Controls.Collection(); 

            //Setup the LAYERS
            //--------------------
            //Setup the model
            OLArchitect.models.objects.layers = 
                new OLArchitect.models.classes.Layers.Collection()
            //Setup the view object
            OLArchitect.views.objects.layers.collection 
                = new OLArchitect.views.classes.Layers.Collection(); 

            //Set up THIS Application's collection object.  It contains
            //  models which we'll use throughout the application
            this.collection.add(new OLArchitect.models.classes.App.App({
                controls: OLArchitect.models.objects.controls,
                map: OLArchitect.models.objects.map,
                layers: OLArchitect.models.objects.layers
            }));

            //---------------------------
            //Now, add some default layers / controls
            //---------------------------
            //Add a google maps layer 
            OLArchitect.models.objects.layers.add(
                new OLArchitect.models.classes.Layers.Google());

        }
        //We're done loading default values

        //Generate the starting code based on the current app configuration
        this.generate_code();
    },

    //-----------------------------------
    //unrender will call the unrender method of all related views
    //-----------------------------------
    unrender: function(e){
        //Remove the 'tab_active class from all the tab buttons
        $('#tabs li').removeClass('tab_active');
        //Add the 'tab_active' class to the currentTarget element.  We use
        //  currentTarget because currentTarget represents the element that
        //  is being checked by the event listener, not the actual element that
        //  dispatched the event (for example, if the bound element had a child
        //  element, currentTarget would point to the bound parent element and
        //  target would point to the child element.  We don't want that
        //  behavior here)
        $(e.currentTarget).addClass('tab_active');

        //Manually empty the configuration wrapper, in case the other views
        //  haven't been defined yet
        $('.configuration_options').css('display', 'none');

        //Call undrender() of each view, but make sure the view exists first
        if(OLArchitect.views.objects.map.collection !== undefined){
            OLArchitect.views.objects.map.collection.unrender();
        }
        if(OLArchitect.views.objects.layers.collection !== undefined){
            OLArchitect.views.objects.layers.collection.unrender();
        }
        if(OLArchitect.views.objects.controls.collection !== undefined){
            OLArchitect.views.objects.controls.collection.unrender();
        }

    },

    //-----------------------------------
    //Create map view
    //-----------------------------------
    enable_target_view: function(e){
        //Unrender all existing config views
        this.unrender(e);

        //Depending on the button the user clicked on, do something.
        //  We'll look at the id...we could add another property
        //  to the element, but this works just as well
        var target_view = e.target.id.replace('config_','');
        //Target view will be either 'map', 'layers', or 'controls'

        //Now we need to create a view if one hasn't been created yet,
        //  and call render() of the target view

        //NOTE: All the collection views have been created, so we can
        //  render the target view
        OLArchitect.views.objects[target_view].collection.render();
    },

    //-----------------------------------
    //Select code
    //-----------------------------------
    //Pressing the select code button will trigger this function which
    //  simply selects all the generated code in the pre element
    select_code: function(e){
        //This function will select all the text in the generated code block
        //  (In supported browsers)
        var range = document.createRange();
        range.selectNodeContents($('#code .container')[0]);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    },

    //-----------------------------------
    //Generate Code
    //-----------------------------------
    generate_code: function(){
        //Call the generate_code function. 
        //NOTE: We could define the function here instead, but the function
        //  is pretty big and it would make the code a lot harder to read.
        //  This function is combined when the code is minified with closure,
        //  so it makes little difference
        var that = this;
        OLArchitect.functions.generate_code(that);
    },

    //-----------------------------------
    //Generate Form
    //-----------------------------------
    generate_form: function(params){
        //Call the generate_form function. 
        //NOTE: We could define the function here instead, but the function
        //  is pretty big and it would make the code a lot harder to read.
        //  This function is combined when the code is minified with closure,
        //  so it makes little difference
        return OLArchitect.functions.generate_form(params);
    }
});

