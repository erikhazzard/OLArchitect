/* ========================================================================    
 *
 * views.js
 * ----------------------
 *
 *  Contains views definitions for the app
 *
 * ======================================================================== */
//============================================================================
//Make sure the models object exist
//============================================================================
try{
    OLArchitect.views = {};
}catch(err){ OLArchitect.views = {}; }


//============================================================================
//
//Configure Views 
//
//============================================================================
//============================================================================
//
//App View
//
//============================================================================
OLArchitect.views.App = Backbone.View.extend({
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

    //No associated model
    
    //-----------------------------------
    //Events:
    //-----------------------------------
    initialize: function(){
        _.bindAll(this, 'enable_target_view', 'unrender',
            'select_code');
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
        $('#' + e.currentTarget.id).addClass('tab_active');

        //Manually empty the configuration wrapper, in case the other views
        //  haven't been defined yet
        $('#configuration_options').empty();

        //Call undrender() of each view, but make sure the view exists first
        if(OLArchitect.views.map_view !== undefined){
            OLArchitect.views.map_view.unrender();
        }
        if(OLArchitect.views.layers_view !== undefined){
            OLArchitect.views.layers_view.unrender();
        }
        if(OLArchitect.views.controls_view !== undefined){
            OLArchitect.views.controls_view.unrender();
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

        //See if a view has already been created
        if(OLArchitect.views[target_view + '_view'] === undefined){
            //The corresponding View class is just the capitalized version
            //  of the target_view string.  e.g., the map view class is called
            //  Map, the layers the Layers, the controls is Controls
            //So, we just need set the current target view object equal to a 
            //  new instance of the target_view's class (e.g., if target_view
            //  is 'map', the corresponding code will compile like
            //      OLArchitect.views.map_view = OlArchitect.views.Map();
            OLArchitect.views[target_view + '_view'] 
                = new OLArchitect.views[target_view[0].toUpperCase()
                    + target_view.substring(1)](); 
        }
        OLArchitect.views[target_view + '_view'].render();
    },

    //-----------------------------------
    //Select code
    //-----------------------------------
    select_code: function(e){
        //This function will select all the text in the generated code block
        //  (In supported browsers)
        var range = document.createRange();
        range.selectNodeContents($('#code .container')[0]);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
});

//============================================================================
//
//
//Map View
//
//
//============================================================================
OLArchitect.views.Map = Backbone.View.extend({
    //The Map, Layers, and Controls views will all be rendered
    //  to the same element (and destroyed on unrender)
    el: '#configuration_options',

    //-----------------------------------
    //Events:
    //-----------------------------------
    //  Attach events to map view elements.  We need at a minimum
    //  save and reset buttons
    events: {
        'mouseenter li': 'hover_li',
        'mouseleave li': 'unhover_li',

        'change input': 'update_data',
        'change select': 'update_data',
        'change textarea': 'update_data'
    },

    //-----------------------------------
    //Specify the model for this view
    //-----------------------------------
    model: new OLArchitect.models.Map(),

    //-----------------------------------
    //Initialize
    //-----------------------------------
    //  Do some initialization stuff.  Bind this context to the views and set
    //  up the associated model
    initialize: function(){
        //Bind this context, pass in all of this view's functions
        _.bindAll(this, 'render', 'unrender', 
            'hover_li', 'unhover_li', 
            'update_data');

        //Whenever this model changes, call this.render
        this.model.bind('change', this.render);

    },

    //-----------------------------------
    //Render function
    //-----------------------------------
    render: function(){
        //We need to create input elements for each key/value pair
        //  in the model
   
        //Fill this view's element with form elements generated from
        //  this model
        $(this.el).html(
            OLArchitect.functions.generate_form({
                model: this.model
            })
        );

        //Call the generate_code function, which will generate
        //  code based on the user's current configuration.
        //  Note: This render() function gets called every time the
        //  model changes, so generate_code() also gets called every
        //  time this model changes
        OLArchitect.functions.generate_code();
        
        return this;
    },

    //-----------------------------------
    //Unrender function
    //-----------------------------------
    unrender: function(){
        //get rid of all elements in the configuration div
        $(this.el).empty();
    },

    //-----------------------------------
    //Update data (called whenever an input is changed)
    //-----------------------------------
    update_data: function(e){
        //Create a temporary object literal to store the target element's
        //  name property as the key, and the value as the element's value
        //  because we can't use variables as keys when defining object
        //  literals (e.g. {varname: 'test'} doesn't work
        var temp_obj = {};
        //Create a new variable key by accessing a nonexistent (yet) property
        //  and passing in the element's value
        temp_obj[e.currentTarget['name']] = e.currentTarget.value;
        console.log(temp_obj);
        
        //Now, update the model and set the key:value we just defined above
        this.model.set(temp_obj);
    },

    //-----------------------------------
    //DOM Element Events Functions
    //-----------------------------------
    hover_li: function(e){
        //Add the 'hover' class to the currentTarget element.
        //  (See the App class' unrender() for an explanation why we use
        //  currentTarget vs. target or other properties
        $('#' + e.currentTarget.id).addClass('hover');
    },
    unhover_li: function(e){
        $('#' + e.currentTarget.id).removeClass('hover');
    }
})

//============================================================================
//
//
//Layers
//
//
//============================================================================
OLArchitect.views.Layers = Backbone.View.extend({
    //The Map, Layers, and Controls views will all be rendered
    //  to the same element (and destroyed on unrender)
    el: '#configuration_options',

    //-----------------------------------
    //Events:
    //-----------------------------------
    //  Attach events to map view elements.  We need at a minimum
    //  save and reset buttons
    events: {
        'mouseenter li': 'hover_li',
        'mouseleave li': 'unhover_li',

        'change input': 'update_data',
        'change select': 'update_data',
        'change textarea': 'update_data'
    },

    //-----------------------------------
    //We won't use a single model, instead we'll set a collection
    //  in initialize() 
    //-----------------------------------

    //-----------------------------------
    //Initialize
    //-----------------------------------
    //  Do some initialization stuff.  Bind this context to the views and set
    //  up the associated model
    initialize: function(){
        //Bind this context, pass in all of this view's functions
        _.bindAll(this, 'render', 'unrender', 
            'hover_li', 'unhover_li', 
            'update_data',
            'change_layer_order',
            'add_layer', 'remove_layer'
            );

        //Specify the collection (the layers of this map)
        this.collection = new OLArchitect.models.Layers.Collection();

        //Add some events to the collection
        this.collection.bind('add', this.add_layer);
        this.collection.bind('remove', this.remove_layer);

        //By default, create a new Google layer and add it to the layer list
        var google_layer = new OLArchitect.models.Layers.Google();
        this.collection.add(google_layer);

        //Whenever this model changes, call this.render
        //this.model.bind('change', this.render);


    },

    //-----------------------------------
    //Render function
    //-----------------------------------
    render: function(){
        //First, clear the HTML

        //Call the generate_code function, which will generate
        //  code based on the user's current configuration.
        //  Note: This render() function gets called every time the
        //  model changes, so generate_code() also gets called every
        //  time this model changes
        OLArchitect.functions.generate_code();

        //For each layer in the collection, create some html elements
        _(this.collection.models).each(function(item){
            $(this.el).append(
                "<li>" + item + "</li>");
        }, this);
        
        return this;
    },

    //-----------------------------------
    //Unrender function
    //-----------------------------------
    unrender: function(){
        //get rid of all elements in the configuration div
        $(this.el).empty();
    },

    //-----------------------------------
    //Update data (called whenever an input is changed)
    //-----------------------------------
    update_data: function(e){
        //Create a temporary object literal to store the target element's
        //  name property as the key, and the value as the element's value
        //  because we can't use variables as keys when defining object
        //  literals (e.g. {varname: 'test'} doesn't work
        var temp_obj = {};
        //Create a new variable key by accessing a nonexistent (yet) property
        //  and passing in the element's value
        temp_obj[e.currentTarget['name']] = e.currentTarget.value;
        console.log(temp_obj);
        
        //Now, update the model and set the key:value we just defined above
        this.model.set(temp_obj);
    },

    //-----------------------------------
    //DOM Element Events Functions
    //-----------------------------------
    hover_li: function(e){
        //Add the 'hover' class to the currentTarget element.
        //  (See the App class' unrender() for an explanation why we use
        //  currentTarget vs. target or other properties
        $('#' + e.currentTarget.id).addClass('hover');
    },
    unhover_li: function(e){
        $('#' + e.currentTarget.id).removeClass('hover');
    },

    //-----------------------------------
    //Layer Collection functions
    //-----------------------------------
    change_layer_order: function(){

    },
    add_layer: function(layer_object){
        //This function adds a layer object to the Layers collection
        console.log('added');
    },
    remove_layer: function(){
        console.log('removed');
    }
})
