
    var CombinadaStrategy = function(context, options) {
        this.context = context;
        this.jQHMessageSelector = this.context.jQHMessageSelector;
        this.minSuggestChars = options.minSuggestChars || 1;
        this.jQNextInputSelector = options.jQNextInputSelector;
        this.searchUrl = restServiceURL.ubicaciones + "/infoUbicacion/lugaresDeInteresYVias/?nombre=";

    };
    CombinadaStrategy.prototype = new SearchStrategy(); // extend the base parser

    CombinadaStrategy.prototype.concreteClickMethod = function(selectedElement) {

        this.context.model.selectedElement = selectedElement;

        this.context.model.selectedCalle = selectedElement;
    	this.responseObject.inputStr = selectedElement.nombre;

        if(selectedElement.descTipo=='VIA'){
        	this.context.model.inputState = CALLE_LOADED;
        	this.context.changeStrategyByName("esquina");
        	this.context.bindOnblur(true);
        	if(this.jQHMessageSelector){
        		RestUtils.showInputHelpMessage(this.jQHMessageSelector.container,this.jQHMessageSelector.message,"Ingrese el número de puerta o 'y' seguido de la esquina.");
        	}
        }else{
        	//TODO cambiar al siguiente input
        	this.responseObject.jqSelector=this.jQNextInputSelector;
            this.context.model.inputStr = this.responseObject.inputStr;
             this.getPoint();
        	 this.context.refreshWhileSearch();

        }



        return this.responseObject;
    };


    CombinadaStrategy.prototype.getRestURI = function(input) {
        return this.searchUrl + input;
    };


    CombinadaStrategy.prototype.getInputSuggest = function(input) {
        return input;
    };


    CombinadaStrategy.prototype.getPoint = function() {
        var strategy = this;
        this.getPointURL = restServiceURL["ubicaciones"] + "/dataGeoUbicacion/"+restGeoDataServicePath[this.context.model.selectedElement.descSubtipo]+"/"+strategy.context.model.selectedElement.codigo;
        $.getJSON(this.getPointURL, function(data) {
            strategy.context.model.set("currentLocation", data);
            strategy.context.model.set("tipoLugar",strategy.context.model.selectedElement.descSubtipo);
            strategy.context.model.set("params",[strategy.context.model.selectedElement.codigo]);
            if (strategy.context.pointListener){
              //invoco al listener
              strategy.context.pointListener(data.ubicacion);
            }


        });
    }
