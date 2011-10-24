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

    //-----------------------------------
    //Events:
    //-----------------------------------
    initialize: function(){
        _.bindAll(this, 'enable_target_view', 'unrender',
            'select_code');

        //-----------------------------------
        //Set the associated model.  This model is just a model that contains
        //  all the other models: Map, Layers, Controls, etc.
        //-----------------------------------
        //TODO: Allow loading of existing models
        if(this.model === undefined){
            this.model = new OLArchitect.models.App();
        }
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
        $('.configuration_options').css('display', 'none');

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
        //Render the target view
        OLArchitect.views[target_view + '_view'].render();
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
    }
});

