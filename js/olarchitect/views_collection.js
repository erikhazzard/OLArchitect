//============================================================================
//
//
//Collection View
//
//This is a view for a collection of items (layers, controllers, etc.)
//
//============================================================================
OLArchitect.views.classes.Collection = Backbone.View.extend({
    //NOTE: el must be passed in 
    //NOTE: item_type must be passed in (Layer, Map, or Control)
    //
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
        'mousedown .config_item_container': 'mousedown_config_item',
        'mouseup .config_item_container': 'mouseup_config_item',
        //Make sure we remove the active class if they press mouse down 
        //  then leave the button
        'mouseleave .config_item_container': 'mouseup_config_item',

        //Config item functions
        'click .config_item_remove': 'remove_config_item',
        'click .new_config_item': 'add_config_item',

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
            'hover_config_item', 'unhover_config_item', 
            'mousedown_config_item', 'mouseup_config_item', 
            'add_config_item', 'remove_config_item'
            );

        //Specify the collection (the layers of this map)
        if(this.collection === undefined){
            console.log('ERROR: No collection passed in');
            return false
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
            +       item.get('name')  + "<span class='config_item_title_id'>"
            +           "(" + item.cid + ")" + "</span>"
            +   "</span>"
            +   "<li class='config_item_remove' "
            +   "id='config_item_for_" + item.cid + "' ></li>"
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
        //Don't actually render anything until the App view is
        //  instaniated.  
        //Note: This view won't actually be instantiated until the app
        //  is initialized, which means any models that get added by default
        //      (either by default or through loading existing configurations)
        //  will try to call the generate_code function before it actually 
        //  exists.
        if(OLArchitect.views.objects.app !== undefined){
            //variable we'll use later
            var target_el = undefined; 
        
            //Clear the HTML first
            $(this.el).html('');

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

            //Create the 'Add new control' button
            target_el = '#form_wrapper_layers #base_layers';
            $(target_el).append(
                "<div class='config_item_container button new_config_item'>"
                +   "<span class='config_item_title'>"
                +       "New Layer"
                +   "</span>"
                + "</div>"
            );
            
            OLArchitect.views.objects.app.generate_code();
        }
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
    //
    //Layer Collection functions
    //
    //-----------------------------------
    add_layer: function(item){
        //This function is called whenever a layer object is added to
        //  the Layers collection (this.collection).
        //
        //First, we need to create a view for the individual layer
        //TODO: Create view
        this.render();
    },
    remove_layer: function(item){
        //Destroy the model
        item.destroy();

        //Rerender the view
        this.render();
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
    },
    mousedown_config_item: function(e){
        $(e.currentTarget).addClass('active');
    },
    mouseup_config_item: function(e){
        $(e.currentTarget).removeClass('active');
    },

    //-----------------------------------
    //Remove Config Item
    //-----------------------------------
    remove_config_item: function(e){
        //Get the target model based on the item the user clicked
        var cur_model = this.collection._byCid[
            e.currentTarget.id.replace('config_item_for_', '')];
        var that = this;
        //Make sure user wants to remove the item
        smoke.confirm('Are you sure you want to remove '
            + cur_model.get('name')
            + '?', function(e){
                if (e){
                    //Remove layer if user pressed yes
                    that.collection.remove(cur_model);
                }else{
                    //Do nothing
                }
            }, {ok:"Remove it", cancel:"Cancel"});     

    },

    //-----------------------------------
    //Add config item
    //-----------------------------------
    add_config_item: function(e){
        //This will add a new layer / control item
        //Get the target model based on the item the user clicked
        
        //TODO: Get the proper layer / control object
        //For now, just use a google layer
        var new_item = new OLArchitect.models.classes.Layers.Google({});
        this.collection.add(new_item);
    }
})
