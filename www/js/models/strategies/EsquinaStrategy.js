

    var EsquinaStrategy = function(context, options) {
        this.context = context;
        this.jQNextInputSelector = options.jQNextInputSelector;
        this.searchUrl = "";
        this.minSuggestChars = options.minSuggestChars || 1;
        this.jQHMessageSelector = this.context.jQHMessageSelector;
    };
    EsquinaStrategy.prototype = new SearchStrategy(); // extend the base parser

    EsquinaStrategy.prototype.concreteClickMethod = function(selectedElement) {



        var toReturn = {jqSelector: this.jQNextInputSelector, inputStr: null};
        this.context.model.inputState = ESQUINA_LOADED;

        //load the point

        this.context.model.selecteEsquina = selectedElement;


        //CAMBIO ESTO NO ES NECESARIO
        this.getPointURL = restServiceURL.ubicaciones + "/dataGeoUbicacion/esquina/" + this.context.model.selectedCalle.codigo + "/" + this.context.model.selecteEsquina.codigo;

        this.getPoint();

        this.responseObject.jqSelector = this.jQNextInputSelector;
        this.responseObject.inputStr = this.context.model.selectedCalle.nombre + " Y " + this.context.model.selecteEsquina.nombre;
        this.context.model.inputStr = this.responseObject.inputStr;
        this.context.refreshWhileSearch();
        //$(".hideable").show();

        //add hideable class
        // this.context.el.parent().addClass("hideable");
        //this.context.strategy = new AutoComplete
        return this.responseObject;


    };


    EsquinaStrategy.prototype.getRestURI = function(input) {
        //hardcode

        this.searchUrl = restServiceURL.ubicaciones + "/infoUbicacion/esquinas/" + this.context.model.selectedElement.codigo + "/";

        return this.searchUrl + "?nombre=" + input;
    };


    EsquinaStrategy.prototype.getInputSuggest = function(input) {

        var toReturn = null, pattern_esquina = new RegExp(this.context.model.selectedElement.nombre + " y ", "i"),
                pattern_calle = this.context.model.selectedElement.nombre, currentInput,
                pattern_numero = new RegExp(/^[0-9]+$/);

        //comparo con el patron calle y esquina
        currentInput = input.split(pattern_esquina);

        if (currentInput && currentInput.length > 1) {
        	RestUtils.showInputHelpMessage(this.jQHMessageSelector.container,"",null);
            toReturn = input.split(pattern_esquina)[1];
        } else {
            //reseto la CurrentLocation --> el input no coincide con una una esquina valida
            this.context.setCurrentLocation(null);
            if (input.indexOf(pattern_calle) == -1) {
                //el input cambio y la calle seleccionada se borro
                RestUtils.showInputHelpMessage(this.jQHMessageSelector.container,"",null);

                toReturn = this.context.changeStrategyByName("calle").getInputSuggest(input);
            }
            else {
                currentInput = input.split(pattern_calle + " ");
                if (currentInput && currentInput.length > 1 && currentInput[1].match(pattern_numero)) {
                    console.log("numero detectado");
                    RestUtils.showInputHelpMessage(this.jQHMessageSelector.container,"",null);
                    this.context.bindOnblur(true);
                    this.context.refreshWhileSearch();
                    toReturn = this.context.changeStrategyByName("direccion").getInputSuggest(input);

                }else{
                	//guio al usuario
                	RestUtils.showInputHelpMessage(this.jQHMessageSelector.container,this.jQHMessageSelector.message,"Ingrese el número de puerta o 'y' seguido de la esquina.");
                	//this.context.changeStrategyByName("calle");
                }
            }




        }

        return toReturn;

    };


    EsquinaStrategy.prototype.getPoint = function() {
        var strategy = this;
        $.getJSON(this.getPointURL, function(data) {
            strategy.context.model.set("currentLocation", data);
            strategy.context.model.set("tipoLugar","ESQUINA");
            strategy.context.model.set("params",[strategy.context.model.selectedCalle.codigo, strategy.context.model.selecteEsquina.codigo]);

            if (strategy.context.pointListener){
              //invoco al listener
              strategy.context.pointListener(data.ubicacion);
            }


        });
    };
