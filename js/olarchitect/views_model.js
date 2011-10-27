//============================================================================
//
//
//Model View
//
//This view shows configuration for individal items (a single layer / control,
//  along with the map config)
//
//============================================================================
OLArchitect.views.classes.Model= Backbone.View.extend({
    //The Map, Layers, and Controls views will all be rendered
    //  to the same element (and destroyed on unrender)

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
            'update_data',
            'generate_form', 'generate_html');

        //Set this element's ID if it wasn't passed in
        //  If it wasn't passed in, assume we're looking at the map 

        //-----------------------------------
        //Specify the model for this view
        //-----------------------------------
        //Note: The OLArchitect.views.objects.map will always
        //  have something in it.  It is instaniated when the App is
        //  instaniated, so it may be either a new, empty object or
        //  an object containing existing settings
        if(this.model === undefined){
            console.log('ERROR: No model passed into Model view');
            return false;
        }

        //We don't have to expect the caller to pass in an el, so if they
        //  don't then build one.  Assume the ID will look like:
        //      config_item_inner_TYPE_CID 
        if(this.el === undefined){
            this.el = '#model_content_'
                + this.model.get('model_type').toLowerCase().replace(' ', '_')
                + '_' + this.model.cid;
        }

        //Whenever a model is changed, called render
        this.model.bind('change', this.render);

        return this;
    },

    //-----------------------------------
    //Render function
    //-----------------------------------
    render: function(){
        //Clear out existing HTML
        $(this.el).html('');

        //Show this element
        $(this.el).css('display', 'block');
        //We need to create input elements for each key/value pair
        //  in the model
   
        //Fill this view's element with form elements generated from
        //  this model
        $(this.el).html(
            this.generate_form({
                model: this.model
            })
        );
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
        //Set the target element's display to none
        $(this.el).css('display', 'none');
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
        //Call render
        this.render();
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

    //-----------------------------------
    //Generate Form
    //-----------------------------------
    generate_form: function(params){
        //This function generates form HTML elements, returns an HTML
        //  string of the created elements
        //Call the generate_form function...could be defined here, but it's
        //  quite long so keeping it in a module makes this view function
        //  easier to read
        //NOTE: params is not used really yet, but later on may be used
        //  to configure the form more
        return OLArchitect.functions.generate_form({
            model: this.model   
        });
    },

    //-----------------------------------
    //Generate HTML
    //-----------------------------------
    generate_html: function(params){
        //Returns an HTML string to be used in generate_code() which contains
        //  the JavaScipt code required to create the corresponding model 
        //  e.g., if the map model is passed in this function will loop
        //  through the model properties and return a string of javascript code.
        if(params === undefined){
            //num_tabs is the number of tabs to prepend to the outputted HTML
            //By default, use two tabs
            var num_tabs = 2;
        }else{
            if(params.num_tabs !== undefined){
                var num_tabs = params.num_tabs;
            }else{
                var num_tabs = 2;
            }
        }
        
        //Store an array which we'll join to a string and return
        var output_html = [];
        var temp_key= '';
        var temp_val = '';
        var attr = undefined;

        //Loop through all the attributes in the model and generate
        //  HTML for it
        for(attr in this.model.schema){
            if(this.model.schema.hasOwnProperty(attr)){
                //First, let's do some value checking.  If the value is
                //  undefined or the current item is a 'header' element,
                //  we won't use it
                if(this.model.get(attr) !== undefined 
                    && this.model.get(attr) !== 'undefined'){

                    if( typeof(this.model.get(attr)) === 'string'){
                        if( this.model.get(attr).search('header_') !== -1){
                            //If the cur attribute is a header attribute, 
                            //  skip this iteration and continue to to the
                            //  next iteration
                            continue;
                        }
                    }
                    //We're good!
                    //Add to the output_html
                    if(this.model.schema[attr].get_html !== undefined){
                        //For each item in the schema, set the 
                        //  key as the attribute and the value as the return value
                        //  of the get_html function.  If no get_html function is
                        //  defined, then just use the string value (assume we
                        //  don't have to do anything special, like add
                        //      'new OpenLayers.LonLat(...,...)'
                        output_html.push(
                            '\t'.multiply(num_tabs)
                            + attr + ': '
                            + this.model.schema[attr].get_html(
                                this.model.get(attr)      
                            )
                        );
                    }else{
                        //get_html function undefined, so assume we can just output
                        //  the value
                        //We also should do some string cleanup.  For now, just replace
                        //  spaces with '_'
                        //Get the key
                        temp_key = '\t'.multiply(num_tabs)
                            + attr + ': ';

                        //Get the temp_val string
                        //  Make sure its a string
                        temp_val = '' + this.model.get(attr);

                        //Make sure there are no spaces and
                        //  and do a little regex
                        temp_val = temp_val.replace(
                            / /g, '_').replace(
                            /[^a-zA-Z0-9_.]/g,'');

                        //Surround the value with quotes, since we assume it's
                        //  a string.  We'll check for true / false / int /
                        //  float below
                        temp_val = '"' + temp_val + '"';

                        //Check for true / false and int / floats
                        //  Note: When checking for floats, make sure to replace
                        //  '"' character
                        if(temp_val === '"true"'){
                            temp_val = true;
                        }else if(temp_val === '"false"'){
                            temp_val = false;
                        }else if(
                            '"' + parseInt(temp_val.replace('"',''), 10) + '"' 
                            === temp_val){
                            //If the parseInt to string is the same as the 
                            //  original value, then it's an int
                            temp_val = parseInt(temp_val.replace('"',''),10);
                        }else if(
                            '"' + parseFloat(temp_val.replace('"',''), 10) + '"'
                            === temp_val){
                            temp_val = parseFloat(temp_val.replace('"',''),10);
                        }

                        //Append the key and val to the output html
                        output_html.push(
                            temp_key + temp_val
                        );
                    }
                }
            }
        }

        //Done with loop, join the string and return it
        //  Join using a comma and new line
        return output_html.join(',\n');
    }
})
