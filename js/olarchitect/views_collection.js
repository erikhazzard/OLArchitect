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
        'mousedown .config_item_title': 'mousedown_config_item',
        'mouseup .config_item_title': 'mouseup_config_item',
        //Make sure we remove the active class if they press mouse down 
        //  then leave the button
        'mouseleave .config_item_container': 'mouseup_config_item',

        //Config item functions
        'click .config_item_remove': 'ui_remove_model',
        'click .new_config_item': 'create_new_model',
        'click .config_item_title': 'toggle_config_item',

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
        _.bindAll(this, 
            'get_model_identifier_string',    
            'render', 'unrender', 
            'update_data',
            'change_layer_order',
            'generate_item_container_html',
            'add_model', 'remove_model',
            'hover_li', 'unhover_li', 
            'hover_config_item', 'unhover_config_item', 
            'mousedown_config_item', 'mouseup_config_item', 
            'toggle_config_item',
            'create_new_model', 'ui_remove_model',
            'generate_html'
            );

        //Specify the collection (the layers of this map)
        //  collection must be passed in
        if(this.collection === undefined){
            console.log('ERROR: No collection passed into collection view');
            return false
        }

        //Get the collection type (will be either 'Layer' or 'Control')
        if(this.el.id.search(/layer/gi) !== -1){
            this.collection_type = 'layer';
        }else if(this.el.id.search(/control/gi) !== -1){
            this.collection_type = 'control';
        }else {
            this.collection_type = undefined;
        }

        //Add some events to the collection
        this.collection.bind('add', this.add_model);
        this.collection.bind('remove', this.remove_model);

        //Whenever this model changes, call this.render
        //this.model.bind('change', this.render);
    },

    get_model_identifier_string: function(item){
        //Returns a string used to identify the model
        //  e.g. layer_google_1
        var model_string = ''
            + item.get('model_type').toLowerCase().replace(' ', '_')
            + '_' + item.cid;
        return model_string;
    },
    //-----------------------------------
    //Generate item container HTML
    //-----------------------------------
    generate_item_container_html: function(item){
        //Generate the HTML code for each 'item container', which is a button
        //  that represents an individual item (item being a layer or control).
        //Clicking on the individual item will show full details for that
        //  layer or control
        var ret_html = "<div id='model_container_"
            +       this.get_model_identifier_string(item)
            +       "' class='config_item_container button'>"
            +   "<div id='model_container_header_"
            +       this.get_model_identifier_string(item)
            +       "' class='config_item_title'>"
            +       item.get('name')  + "<span class='config_item_title_id'>"
            +           "(" + item.cid + ")" + "</span>"
            +   "</div>"
            +   "<li class='config_item_remove' "
            +   "id='config_item_for_" 
            +       this.get_model_identifier_string(item)
            +       "' ></li>"
            +   "<div class='config_item_inner_wrapper' "
            +       " id='model_content_"
            +       this.get_model_identifier_string(item)
            +       "' >"
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

            $(this.el).append("<div id='form_wrapper_"
                + this.collection_type + "'></div>");

            //If this view is for a Layer, collection, we want to render
            //  Base and Overlay headers
            if(this.collection_type === 'layer'){
                //Create the base and overlay labels and append them to the
                //  newly created element (above)
                $('#form_wrapper_'
                    + this.collection_type).append("<div id='base_layers'>"
                    +   "<li class='header_item'><h3>Base Layers</h3></li>"
                    + "</div>");
                $('#form_wrapper_'
                    + this.collection_type).append("<div id='overlay_layers'>"
                    +   "<li class='header_item'><h3>Overlay Layers</h3></li>"
                    + "</div>");
            }
            //Get target element to append stuff into
            target_el = '#form_wrapper_'
                + this.collection_type;
            if(this.collection_type === 'layer'){
                target_el += ' #base_layers';
            }

            //For each layer in the collection, create some html elements
            _(this.collection.models).each(function(item){
                //If it's a base layer, add it to the base div
                $(target_el).append(
                    this.generate_item_container_html(item)
                );
            }, this);

            //Create the 'Add new control' button
            $(target_el).append(
                "<div class='config_item_container button new_config_item'>"
                +   "<div id='new_" + this.collection_type + "_button' >"
                +       "New " 
                +           this.collection_type[0].toUpperCase()
                +           this.collection_type.substring(1)
                +   "</div>"
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
        //TODO: Really this should be done in the views_models so we don't
        //  repeat ourselves.  The views_model will need to be changed 
        //  slightly to work with the element it generates differently
        //  as it currently captures no events when instaniated from a
        //  collection
        var target_model_id = $(e.currentTarget).parents()[2].id.replace(
            'model_content_','');
        var target_model = OLArchitect.views.objects[
            this.collection_type + 's'][
            target_model_id
            ].model;

        //Create a temporary object literal to store the target element's
        //  name property as the key, and the value as the element's value
        //  because we can't use variables as keys when defining object
        //  literals (e.g. {varname: 'test'} doesn't work
        var temp_obj = {};

        //Create a new variable key by accessing a nonexistent (yet) property
        //  and passing in the element's value
        temp_obj[e.currentTarget['name']] = e.currentTarget.value;
        
        //Now, update the model and set the key:value we just defined above
        target_model.set(temp_obj);
    },

    //-----------------------------------
    //
    //Layer Collection functions
    //
    //-----------------------------------
    add_model: function(item){
        //This function is called whenever a layer object is added to
        //  the Layers collection (this.collection).
        //
        //First, we need to create a view for the individual layer
        //TODO: Create view
        OLArchitect.views.objects[this.collection_type + 's'][
            item.get('model_type').toLowerCase()
            + '_' 
            + item.cid] 
            = new OLArchitect.views.classes.Model({
                el: '#model_content_'
                    + this.get_model_identifier_string(item),
                model: item
            });

        this.render();
    },
    remove_model: function(item){
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
    //Toggle Config Item
    //-----------------------------------
    //Show / Hide the config item (an individual model of the collection)
    toggle_config_item: function(e){
        //Get the target model id
        var target_model_id = e.currentTarget.id.replace(
            'model_container_header_','');

        //Get the related view
        var target_view = OLArchitect.views.objects[
            this.collection_type + 's'][
            target_model_id];

        //The target element we want to toggle is the model
        //  content div, not the entire model container div
        var target_el = '#model_content_' + target_model_id;

        //Render the target view
        if($(target_el).css('display') !== 'block'){
            target_view.render();
        }else{
            target_view.unrender();
        }
    },

    //-----------------------------------
    //Remove Config Item
    //-----------------------------------
    ui_remove_model: function(e){
        //If the remove button is clicked, stop all other events from
        //  propagating - we dont want to toggle the model view if they
        //  tried to remove it
        e.stopPropagation();
        //Get the target model based on the item the user clicked
        var cur_model_name = e.currentTarget.id.replace('config_item_for_', 
            '');
        var cur_model = OLArchitect.views.objects[
                    this.collection_type + 's'][
                    cur_model_name].model;
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
    //Create config item
    //-----------------------------------
    create_new_model: function(e){
        //This is called whenever the user clicked the 'New' button
        
        //target_type is the type of control or layer to create 
        //  (e.g., a Goolge Layer or an OverviewMap control)
        var target_type = undefined,
            target_id = e.delegateTarget.id;

        if(target_id.search(/layer/gi) !== -1){
            //Layer
            target_type = 'layer';
        }else if(target_id.search(/control/gi) !== -1){
            //Control
            target_type = 'control';
        }

        //  Render the associated view that allows user to pick the 
        //  type they want to add
        OLArchitect.views.objects['new_ol_' + target_type].render();
    },

    //-----------------------------------
    //Generate HTML for collection
    //-----------------------------------
    generate_html: function(num_tabs){
        //This function 
        if(num_tabs === undefined){
            var num_tabs = 2;
        }
        var output_html = [];
        var object_var_names = [];
        //Setup tab strings. We'll want unindent and indent levels as well
        var tab_string_unindent = '\t'.multiply(num_tabs-1);
        var tab_string = '\t'.multiply(num_tabs);
        var tab_string_indent = '\t'.multiply(num_tabs+1);

        output_html.push('');
        output_html.push('\t//=======================================');
        output_html.push('\t//Set up ' + this.collection_type + 's');
        output_html.push('\t//=======================================');

        //Loop through each model in this collection view's collection and
        //  generate OpenLayers code for each layer / control in the collection
        for(model in this.collection.models){
            if(this.collection.models.hasOwnProperty(model)){
                //Push a comment
                output_html.push('\t//Create a new ' + this.collection.models[model].get('model_type')
                    + ' ' + this.collection_type);
                var cur_object_var_name = this.collection_type + '_'
                    + this.collection.models[model].get('model_type').toLowerCase()
                    + '_' + this.collection.models[model].cid

                //And then the model object (layer or control) creation string
                output_html.push('\tvar '
                    + cur_object_var_name 
                    +' = new OpenLayers.Layer.'
                    + this.collection.models[model].get('model_type')
                    + '({'
                );

                //Add the variable name to the object_var_names array
                object_var_names.push(cur_object_var_name);

                //Add the HTML for the layer / control configuration to the 
                //  final code output
                //This calls the generate_html() function of the corresponding
                //  model view 
                output_html.push(
                    OLArchitect.views.objects[
                        this.collection_type + 's'][
                        this.collection.models[model].get(
                            'model_type').toLowerCase()
                        + '_' 
                        + this.collection.models[model].cid].generate_html({
                            num_tabs: num_tabs + 1   
                        })
                );
                output_html.push('\t});');
                //Add an empty line
                output_html.push('');
            }
        }

        //---------------------------
        //Add objects to the map. 
        //  Make sure they have at least one model
        //---------------------------
        if(object_var_names.length > 0){
            output_html.push(tab_string_unindent
                + '//---------------------------------------');
            output_html.push(tab_string_unindent
                + '//Add the ' + this.collection_type + 's to map');
            output_html.push(tab_string_unindent
                + '//---------------------------------------');
                output_html.push(tab_string_unindent
                    + 'map_object.addLayers([');
                output_html.push(tab_string + object_var_names.join(
                    ',\n' + tab_string));
                output_html.push(tab_string_unindent
                    + ']);');
        }else{
            output_html.push('\t//WARNING: You do not have any layers!');
        }

        return output_html.join('\n');
    }
})
