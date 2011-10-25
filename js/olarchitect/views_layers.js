//============================================================================
//
//
//Layers
//
//
//============================================================================
OLArchitect.views.classes.Layers.Collection = Backbone.View.extend({
    //The Map, Layers, and Controls views will all be rendered
    //  to the same element (and destroyed on unrender)
    el: '#configuration_options_layers',

    //-----------------------------------
    //Events:
    //-----------------------------------
    //  Attach events to map view elements.  We need at a minimum
    //  save and reset buttons
    events: {
        'mouseenter li': 'hover_li',
        'mouseleave li': 'unhover_li',
        'mouseenter .config_item_container': 'hover_config_item',
        'mouseleave .config_item_container': 'unhover_config_item',

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
            'update_data',
            'change_layer_order',
            'generate_item_container_html',
            'add_layer', 'remove_layer',
            'hover_li', 'unhover_li', 
            'hover_config_item', 'unhover_config_item'
            );

        //Specify the collection (the layers of this map)
        if(this.collection === undefined){
            this.collection = OLArchitect.models.objects.layers;
        }

        //Add some events to the collection
        this.collection.bind('add', this.add_layer);
        this.collection.bind('remove', this.remove_layer);

        //Whenever this model changes, call this.render
        //this.model.bind('change', this.render);
    },


    //-----------------------------------
    //Generate item container HTML
    //-----------------------------------
    generate_item_container_html: function(item){
        //Generate the HTML code for each 'item container', which is a button
        //  that represents an individual item (item being a layer or control).
        //Clicking on the individual item will show full details for that
        //  layer or control
        var ret_html = "<div class='config_item_container button'>"
            +   "<span class='config_item_title'>"
            +       item.get('name') 
            +   "</span>"
            +   "<li class='config_item_remove'></li>"
            +   "<div class='config_item_inner_wrapper'>"
            +       "<div id='config_item_inner_"
            //Use cid, since the object does not yet have a real ID
            +           item.cid + "' ></div>"
            +   "</div>"   
            +"</div>";
        return ret_html;
    },

    //-----------------------------------
    //Render function
    //-----------------------------------
    render: function(){
        //variable we'll use later
        var target_el = undefined; 

        //Show this element
        $(this.el).css('display', 'block');

        $(this.el).append("<div id='form_wrapper_layers'></div>");

        //Create the base and overlay labels and append them to the
        //  newly created element (above)
        $('#form_wrapper_layers').append("<div id='base_layers'>"
            +   "<li class='header_item'><h3>Base Layers</h3></li>"
            + "</div>");
        $('#form_wrapper_layers').append("<div id='overlay_layers'>"
            +   "<li class='header_item'><h3>Overlay Layers</h3></li>"
            + "</div>");
        //For each layer in the collection, create some html elements
        _(this.collection.models).each(function(item){
            //If it's a base layer, add it to the base div
            target_el = '#form_wrapper_layers #base_layers';
            $(target_el).append(
                this.generate_item_container_html(item)
            );
        }, this);
        
        //Call the generate_code function, which will generate
        //  code based on the user's current configuration.
        //  Note: This render() function gets called every time the
        //  model changes, so generate_code() also gets called every
        //  time this model changes
        OLArchitect.views.objects.app.generate_code();
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
    //Layer Collection functions
    //-----------------------------------
    add_layer: function(item){
        //This function is called whenever a layer object is added to
        //  the Layers collection (this.collection).
        //
        //First, we need to create a view for the individual layer
        var temp_view = new OLArchitect.views.classes.Layers.Layer({
            model: item
        });
    },
    remove_layer: function(){
        console.log('removed');
    },

    change_layer_order: function(){

    },

    //-----------------------------------
    //DOM Element Events Functions
    //-----------------------------------
    hover_li: function(e){
        //Add the 'hover' class to the currentTarget element.
        //  (See the App class' unrender() for an explanation why we use
        //  currentTarget vs. target or other properties
        $(e.currentTarget).addClass('hover');
    },
    unhover_li: function(e){
        $(e.currentTarget).removeClass('hover');
    },
    hover_config_item: function(e){
        $(e.currentTarget).addClass('hover');
    },
    unhover_config_item: function(e){
        $(e.currentTarget).removeClass('hover');
    }
})

//============================================================================
//
//
//Individual Layer View (e.g.,settings for a single google layer)
//
//
//============================================================================
OLArchitect.views.classes.Layers.Layer = Backbone.View.extend({
});
