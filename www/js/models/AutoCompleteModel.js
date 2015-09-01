// InfoUbicacionVia Model
// ==============

// Includes file dependencies
//(function( $, Backbone) {

    // The Model constructor
    var AutoCompleteModel = Backbone.Model.extend( {

        	defaults: {
		inputState:QUERY_CALLE,
                selectedElement:null,
                currentLocation:null,
                tipoLugar:"",
                params:[]
	},

          initialize: function(){

        },
                getRestParamObj:function(){

                        return  {tipoLugar:this.get("tipoLugar"),params:this.get("params")};


                }




    } );

    // Returns the Model class
    /*
    return AutoCompleteModel;

} )( $, Backbone);
*/
