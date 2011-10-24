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
    el: '#configuration_options_map',

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
    //Initialize
    //-----------------------------------
    //  Do some initialization stuff.  Bind this context to the views and set
    //  up the associated model
    initialize: function(){
        //Bind this context, pass in all of this view's functions
        _.bindAll(this, 'render', 'unrender', 
            'hover_li', 'unhover_li', 
            'update_data');


        //-----------------------------------
        //Specify the model for this view
        //-----------------------------------
        if(this.model === undefined){
            this.model = new OLArchitect.models.Map();
        }

        //Whenever this model changes, call this.render
        this.model.bind('change', this.render);
    },

    //-----------------------------------
    //Render function
    //-----------------------------------
    render: function(){
        //Show this element
        $(this.el).css('display', 'block');
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
