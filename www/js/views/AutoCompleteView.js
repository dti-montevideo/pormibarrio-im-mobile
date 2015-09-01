

    // Extends Backbone.View
    var AutoCompleteView = Backbone.View.extend({
        // The View Constructor
        initialize: function(options) {

            this.model = new AutoCompleteModel();
            this.delay = options.delay || 500;
            this.jQInputSelector = options.jQInputSelector;
            this.includeGeolocation =options.includeGeolocation;
            this.jQHMessageSelector = options.jQHMessageSelector;
            this.strategy = new CombinadaStrategy(this, {jQNextInputSelector: options.jQNextInputSelector,minSuggestChars: 2});//new CalleStrategy(this, {minSuggestChars: 2});
            //add jquery inputSelector
            this.nextStrategy = new EsquinaStrategy(this, {jQNextInputSelector: options.jQNextInputSelector, minSuggestChars: 1});
            this.strategies = {calle: this.strategy, esquina: this.nextStrategy, direccion: new DireccionStrategy(this)};
            this.searching = null;
            this.pointListener = options.pointListener;
            //   bind jqm suggest event change the this context
            this.$el.on("listviewbeforefilter", _.debounce($.proxy(this.suggest, this), this.delay));

            var self = this;
            this.suggestEnabled=true;
            $('.ui-content').on('click', '.ui-input-clear', function(e){
            	self.bindOnblur(false);
            });
            this.lastTabInputStr={aqhp:"",ubicacion:""};

        },
        //refactor and use Strategy Desgin pattern
        suggest: function(e, data) {
            if (this.strategy.hideElementsOnSuggest) {
                this.refreshWhileSearch(data);
            }
            if(this.suggestEnabled){
            	this.strategy.suggest(e, data);
            }

        },
        onBlurInput: function(event) {
            var pattern = /[0-9]+/g;
            var inputStrArray = $(event.currentTarget).val().match(pattern);
            if (!inputStrArray)
                return;
            numberStr = inputStrArray[inputStrArray.length - 1];
            console.log(numberStr);
            //TODO parametrzar melhor
            this.model.selectedCalle.numPuerta = numberStr;
            //this.strategy.getPointURL= restServiceURL["ubicaciones"] + "/direccion/" + this.model.selectedCalle.codigo + "/" + numberStr;
            this.strategy.getPoint();
            this.model.inputStr = $(event.currentTarget).val();

        },
        changeStrategy: function(nextStrategy) {
            temp = this.strategy;
            this.strategy = this.nextStrategy;
            this.nextStrategy = temp;


        },
        changeStrategyByName: function(strategyName) {
            this.strategy = this.strategies[strategyName];
            return this.strategy;
        },
        refreshWhileSearch: function(data) {
            var val = data === undefined ? "" : $(data.input).val(), wrappers = $(".autocomplete-wrapper ul"),
                    thisel = this.$el[0], methodStr;
            methodStr = val === "" ? "show" : "hide";
            $(".hideable")[methodStr]();
            _.each(wrappers, function(item) {
                if (item != thisel)
                    $(item).parent()[methodStr]();
            });
        },
        bindOnblur: function(bind) {
            var self = this;
            if (bind) {
                if ($._data($(this.jQInputSelector)[0], 'events').blur.length == 2) {
                    $(this.jQInputSelector).on("blur", $.proxy(self.onBlurInput, self));
                }

            } else {
                if ($._data($(this.jQInputSelector)[0], 'events').blur.length > 2) {
                    $(this.jQInputSelector).off("blur", self.onBlurInput);
                }

            }
        },
        setCurrentInput: function(inputStr) {
            $(this.jQInputSelector).val(inputStr);

        },
        extractCurrentInput: function() {
            return $(this.jQInputSelector).val().trim();
        },
        restoreLastTabInput:function(tab){
          return this.setCurrentInput(this.lastTabInputStr[tab]);
        },
        saveLastTabInput:function(tab){
           this.lastTabInputStr[tab]= this.extractCurrentInput();
        },
        getCurrentLocation: function() {
            return this.model.get("currentLocation");
        },
        isValid: function() {
            //TODO Evaluar si tiene sentido migrar esta validacion al model;
            return this.model.get("currentLocation") !== null;
        },
        setCurrentLocation: function(location) {

            this.model.set("currentLocation", location);
        },
        getRestParamObj: function() {

            return this.model.getRestParamObj();
        },
        getUbicacionByGeolocation: function(position) {
            console.log("Calculando posición actual geocoding......");
            var p =  MapUtils.fromLatLong2Json(position.coords.longitude, position.coords.latitude), geocodingURL;


            var params = [
                {name: "x", value: p.geom.coordinates[0]},
                {name: "y", value: p.geom.coordinates[1]}
            ];


            this.setCurrentLocation({ubicacion:p});
            geocodingURL = restServiceURL.ubicaciones + "/dataGeoUbicacion/point";
            $.mobile.loading( 'show', {text: 'Geolocalizacion disponible - Geocoding',textVisible:true});
            RestUtils.processResult(geocodingURL, this.updateUbicacion, this, params, null, false,"Error calculando la ubicación actual");
            //   RestUtils.processResult(restServiceURL["transporte"] + "/hora/", this.loadCurrentTime, this);
        },
        updateUbicacion: function(data) {
            var params=[];
            this.setCurrentInput(data.descripcion);
            this.model.inputStr= data.descripcion;
            this.setModelProperty("tipoLugar",data.descTipo);
            //CASE GIGANTE TIPO DE UBICACION
            console.log("Calculando posición actual actualizando parametros......");
            switch (data.descTipo){
                case "ESQUINA":{
                      params=[data.via,data.via2];break;
                }
                case "DIRECCION":{
                      params=[data.via,data.numero];break;
                }
                default:{
                      params=[data.nombre];break;
                }
            }

            this.setModelProperty("params",params);

            //alert(data);

        },

           setModelProperty:function(property,value){
            this.model.set(property,value);
                },
        enableSuggest:function(enable){
        	this.suggestEnabled = enable;
        },
        updateInputId:function(id){
        	$(this.jQInputSelector).attr("id",id);
        	this.jQInputSelector =("#"+id);
        },

        setSelectedTab:function(selectedTab){
        	this.selectedTab = selectedTab;
        },
        setModel:function(model){

        	this.model=model;
        	this.setCurrentInput(this.model.inputStr);
        },

        matchInputWithModel:function(){
          return this.model.inputStr == this.extractCurrentInput();
        },
        setPlaceHolder:function(placeHolder){
      $(this.jQInputSelector).attr("placeholder", placeHolder);
        }


    });
