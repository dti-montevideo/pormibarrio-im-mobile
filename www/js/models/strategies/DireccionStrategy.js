

    var DireccionStrategy = function(context, jQNextInputSelector) {
        this.context = context;
        this.jQNextInputSelector = jQNextInputSelector;
        this.searchUrl = "";
        this.contextChanged = false;
    };
    DireccionStrategy.prototype = new SearchStrategy(); // extend the base parser
    DireccionStrategy.prototype.hideElementsOnSuggest = false;

    DireccionStrategy.prototype.suggest = function(e, data) {
        var pattern_calle = this.context.model.selectedElement.nombre, input = $(data.input).val();
        if (input.indexOf(pattern_calle) == -1) {
            //el input cambio y la calle seleccionada se borro
            this.context.changeStrategyByName("calle");
            this.context.refreshWhileSearch(data);

        } else {
            this.context.refreshWhileSearch();
            if (!this.contextChanged) {
                this.context.bindOnblur(true);
                this.contextChanged = true;
            }
        }
    };
//Este metodo no se ejecuta porque no se sugiere cuando se escribe una direccion concreta
    DireccionStrategy.prototype.concreteClickMethod = function(selectedElement) {



        var toReturn = {jqSelector: this.jQNextInputSelector, inputStr: null};
        this.context.model.inputState = ESQUINA_LOADED;

        //load the point

        this.context.model.selecteEsquina = selectedElement;
        this.getPointURL = restServiceURL.ubicaciones + "/direcciones/posicion/" + this.context.model.selectedCalle.codigo;
        this.getPoint();
        this.responseObject.jqSelector = this.jQNextInputSelector;
        //TODO revisar esto
        this.responseObject.inputStr = this.context.model.selectedCalle.nombre + " Y " + this.context.model.selecteEsquina.nombre;
        this.context.model.inputStr = this.responseObject.inputStr;
        this.context.refreshWhileSearch();
        //$(".hideable").show();

        //add hideable class
        // this.context.el.parent().addClass("hideable");
        //this.context.strategy = new AutoComplete
        return this.responseObject;


    };


    DireccionStrategy.prototype.getRestURI = function(input) {
        //hardcode

        this.searchUrl = restServiceURL.ubicaciones + "/direccion/" + this.context.model.selectedElement.codigo + "/" + input;

        return this.searchUrl;
    };


    DireccionStrategy.prototype.getInputSuggest = function(input) {

        var toReturn = null, pattern_esquina = this.context.model.selectedElement.nombre + " y ";
        pattern_calle = this.context.model.selectedElement.nombre;
        currentInput = input.split(pattern_esquina);
        if (input.indexOf(pattern_calle) == -1) {
            //el input cambio y la calle seleccionada se borro
            this.context.changeStrategy();
        }
        else {
            if (currentInput && currentInput.length > 1) {
                toReturn = input.split(pattern_esquina)[1];
            }
        }

        return toReturn;

    };
            DireccionStrategy.prototype.getPointURL = function() {
        var selectedCalle = this.context.model.selectedCalle,strategy=this;
        return restServiceURL.ubicaciones + "/dataGeoUbicacion/direccion/" + selectedCalle.codigo + "/" + selectedCalle.numPuerta;
    };
            DireccionStrategy.prototype.getPoint = function() {
        var strategy=this,selectedCalle = this.context.model.selectedCalle;

        $.getJSON(this.getPointURL(), function(data) {
            strategy.context.model.set("currentLocation", data);
            strategy.context.model.set("tipoLugar", "DIRECCION");
            strategy.context.model.set("params", [selectedCalle.codigo, selectedCalle.numPuerta]);

            if (strategy.context.pointListener){
              //invoco al listener
              strategy.context.pointListener(data.ubicacion);
            }

        }).done(function() {


        	console.log("Dirección válida");
        })
                .fail(function() {
            console.log("error");
//            strategy.context.bindOnblur(false);
            RestUtils.showError("No existe esa direccion",$(strategy.context.jQInputSelector));
            strategy.context.setCurrentLocation(null);
  //          strategy.context.bindOnblur(true);

        });
    };
            DireccionStrategy.prototype.getRestParamObj = function() {
        var selectedCalle = this.context.model.selectedCalle;
        return  {tipoLugar: "DIRECCION", params: [selectedCalle.codigo, selectedCalle.numPuerta]};

    };
