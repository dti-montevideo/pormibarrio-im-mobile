


    var SearchStrategy = function(context) {
        this.context = context;

    };
    SearchStrategy.prototype.hideElementsOnSuggest = true;
    SearchStrategy.prototype.responseObject = {jqSelector: null, inputStr: null};


    SearchStrategy.prototype.concreteClickMethod = function(e, data) {
        throw 'please extend abstract object';
    };


    SearchStrategy.prototype.getRestURI = function(input) {

    };
    SearchStrategy.prototype.getInputSuggest = function(input) {
        throw 'please extend abstract object';
    };



    SearchStrategy.prototype.suggest = function(e, data) {

        var responseObject;
        if(this.suggestDisable) return;
        //TODO agregar condicion
        this.context.bindOnblur(false);
        $input = $(data.input);
        $ul = $('#ul-autocomplete-res');//this.context.$el;
        value = this.getInputSuggest($input.val());
        if(value==null)return;
        currentStrategy = this;

        html = "";
      //  $ul.listview();
       $ul.html('');
    	RestUtils.showInputHelpMessage(this.jQHMessageSelector.container,"",null);
        if (value && value.length >=this.minSuggestChars) {



           $ul.listview("refresh");
            $.mobile.showPageLoadingMsg();


            RestUtils.processResult(currentStrategy.getRestURI(value), this.processSuggest, currentStrategy, null, null, false,"Servicio no dispnible");


        }
    },

    SearchStrategy.prototype.processSuggest =function(data) {
    	//<span class="clase">(Estación de Subte (Metro))</span>
    	if(data.length==0){
        	RestUtils.showInputHelpMessage(this.jQHMessageSelector.container,this.jQHMessageSelector.message,"Los datos ingresados no son correctos.<br>Por favor verifique y vuelva a intentarlo.",true);
        	return;
    	}
    	$.each(data, function() {

            var infoUbicacion = this, inputStr;
                     $('<li>').append($('<a class="address"/>')).append($('<h2 />', {
                     text: infoUbicacion.nombre
                     })).append(infoUbicacion.descTipo=='VIA'? '':$('<span />', {
                     text: '('+infoUbicacion.descSubtipo+')',class:'span-suggest'
                     })).appendTo($ul).click(function() {
                     //$.mobile.showPageLoadingMsg();
                     responseObject = currentStrategy.concreteClickMethod(infoUbicacion);

                     $input.val(responseObject["inputStr"] + " ");
                     $ul.empty();
                     //get the input to set Focus on
                     $nextFocused = responseObject["jqSelector"] == null ? $input : $(responseObject["jqSelector"]);

                     RestUtils.focusField($nextFocused);

                   });/*.show();*/


                });

              //  $('#front-howto').html("<p>Multiple matches found</p>");
            //    $('#front-howto').append($ul);
                $ul.listview("refresh");

                $ul.trigger("updatelayout");
                $('.ui-page').trigger('create');
                $('#relocate').hide();
                $('#front-howto').show();


				//$.mobile.hidePageLoadingMsg();

            };
