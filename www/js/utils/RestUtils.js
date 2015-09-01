// Filename: views/projects/list



    var RestUtils = RestUtils || {};

    // TODO create MethodUtils class move to

    RestUtils.processResult = function(restURL,
      processResultListener, context, data, targetPage,
      skipRouterNavigation, onErrorMsg) {
      var bindMethod;
      data = !data ? {} : data;

      $.getJSON(
        restURL,
        data,
        function(data) {

          bindMethod = _.bind(processResultListener,
            context, data);
          bindMethod();
          // router.showRutaAPie(data.feature.properties);
          if (targetPage) {
            if (!skipRouterNavigation)
            //if(context)
            //window.router.navigate(targetPage);
            //asumo que el context es window.router
              context.navigate(targetPage);
            $.mobile.changePage(targetPage, {
              reverse: false,
              changeHash: false
            });
          }

          $.mobile.hidePageLoadingMsg();
        }).fail(function(jqxhr, textStatus, error) {
        $.mobile.hidePageLoadingMsg();
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
        RestUtils.showPopup({
          title: "Error",
          message: !onErrorMsg ? RestUtils.processErrorXhr(jqxhr.responseText) : onErrorMsg,
          buttonText: "Aceptar!",
          width: "400px"
        });

      });

    };
    RestUtils.showError = function(errorMessage, inputFocus) {
      RestUtils.showPopup({
        title: "Atención",
        message: errorMessage,
        buttonText: "Aceptar!",
        width: "300px",
        inputFocus: inputFocus
      });
    };
    RestUtils.toArrayObject = function(propName, valueArray) {
      var toReturn = [],
        currentValue;
      _.each(valueArray, function(value, index) {
        //currentValue = valueArray[index];
        toReturn.push({
          name: propName,
          value: value
        });
      });
      return toReturn;
    };

    RestUtils.showGeolocationError = function(error) {
      var errorMsg = "";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg = "No se permite acceder a su ubicación";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg = "Información de ubicación no disponible";
          break;
        case error.TIMEOUT:
          errorMsg = "Tiempo de espera agotado";
          break;
        case error.UNKNOWN_ERROR:
          errorMsg = "Error desconocido";
          break;
      }
      console.error("Error en la geolocalzacion: " + errorMsg + "\n" + error.message);
      $.mobile.hidePageLoadingMsg();
      RestUtils.showError("Error de geolocalización" + "<br>" + errorMsg);

    };

    RestUtils.showInputHelpMessage = function(containerJQSel,
      messageJQSel, message, errorMsg) {
      var classToRemove = errorMsg ? "warn-message" : "error-message",
        classToAdd = errorMsg ? "error-message" : "warn-message";
      if (!message)
        $(containerJQSel).hide();

      else {
        var messageDiv = $(messageJQSel);
        messageDiv.empty();
        messageDiv.append(message);
        if (messageDiv.hasClass(classToRemove)) {
          messageDiv.removeClass(classToRemove);
        }
        if (!messageDiv.hasClass(classToAdd)) {
          messageDiv.addClass(classToAdd);
        }



        $(containerJQSel).show();
      }

    };
    RestUtils.showPopup = function(context) {
      var popup = '<div data-role="popup" id="popupDialog" data-overlay-theme="a" data-theme="c"' +
        'data-dismissible="false" style="max-width:300px;" class="ui-corner-all comoir-popup"><div data-role="header"' +
        'data-theme="a" class="ui-corner-top"><h1>Delete Page?</h1></div><div data-role="content" data-theme="d"' +
        'class="ui-corner-bottom ui-content comoir-popup-content"><h3 class="ui-title"></h3>' +
        '<a href="#" data-role="button" data-inline="true" data-rel="back" data-theme="c">Aceptar</a>';
      //'<input value="BBB" type="button" data-theme="a" /></div></div>';

      var selectorPopupDialog = "#popupDialog";
      $.mobile.activePage.append(popup).trigger("pagecreate");

      $(selectorPopupDialog + ' input[type=button]').click(
        function() {
          $(selectorPopupDialog).popup('close');
        });
      if (context.width)
        $(selectorPopupDialog).width(context.width);
      if (context.title)
        $(selectorPopupDialog + ' h1').html(context.title);
      if (context.message)
        $(selectorPopupDialog + ' h3')
        .html(context.message);
      /*
      if (context.buttonText) {
      	$(selectorPopupDialog + ' input').val(
      			context.buttonText).button('refresh');
      }*/
      $(selectorPopupDialog).popup("open");
      $(document).on("popupafterclose", ".ui-popup",
        function() {
          $(this).remove();
          //TODO Si se vuelve al foco se genera un bug que cuando se quiere limpiar el texto con el clear button no borra
          if (context.inputFocus) {
            //RestUtils.focusField(context.inputFocus);
          }
        });
    };

    RestUtils.collectDestinos = function(busSelected, linea) {
        var destinoMaximañes = [],
          destinoNoMaximales = [],
          tramoBus = busSelected.directo.linea == linea ? busSelected.directo : busSelected.trasbordo;
        destinoMaximales = _.pluck(tramoBus.maximales, 'destino');
        destinoNoMaximales = _.pluck(tramoBus.noMaximales, 'destino');

        return destinoMaximales.concat(destinoNoMaximales);
      };

			RestUtils.processErrorXhr = function(responseText) {
        var responseObject = RestUtils.parseJsonJQ(responseText);
        if (responseObject.tipo == "org.jboss.resteasy.spi.BadRequestException") {
          return "Los datos ingresados no son correctos.<br>Por favor verifique y vuelva a intentarlo.";
        }
        if (responseObject.mensaje) {
          return responseObject.mensaje;
        }
        return responseObject;
      };

	  RestUtils.parseJsonJQ = function(code) {
        try {
          return $.parseJSON(code);
        } catch (e) {
          return code;
        }
      };
      RestUtils.focusField = function($field) {
        $field.focus();
        var v = $field.val();
        $field.get(0).setSelectionRange(v.length, v.length);
      };
    
