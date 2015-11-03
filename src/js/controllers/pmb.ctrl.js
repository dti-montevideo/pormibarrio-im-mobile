starter.controllers.controller('PMBCtrl', ['$scope', '$state', 'leafletData', 'PMBService', 'ReportService', 'locationAPI', function($scope, $state, leafletData, PMBService, ReportService, locationAPI) {
  $scope.reportButton = {
    text: "Reportar",
    state: "unConfirmed"
  };
  $scope.searchMode = "calle.lugar";

  //Auto complete



  $scope.$on("$stateChangeSuccess", function() {
    $scope.ionAutocompleteElement = angular.element(document.getElementsByClassName("ion-autocomplete"));
    console.log(JSON.stringify($scope.ionAutocompleteElement));
    $scope.ionAutocompleteElement.bind('touchend click focus', $scope.onClick);
  });


  $scope.initReport = function() {

    var _pin, _pinIcon = L.icon({
      iconUrl: 'img/pin@x2.png',
      iconSize: [70, 110], // size of the icon
      iconAnchor: [-18, 55], // point of the icon which will correspond to marker's location
    });

    if ($scope.reportButton.state == "unConfirmed") {

      $scope.reportButton.text = "Confirmar";
      $scope.reportButton.state = "about2Confirm";


      leafletData.getMap().then(function(map) {
        _pin = new L.marker(map.getCenter(), {
          icon: _pinIcon,
          clickable: false
        }).addTo(map);

        ReportService._new();
        ReportService.current.setLatLng(map.getCenter());
        //console.log(JSON.stringify($scope.currentReport));

        $scope.ionAutocompleteElement = angular.element(document.getElementsByClassName("ion-autocomplete"));
        $scope.ionAutocompleteElement.bind('touchend click focus', $scope.onClick);


      });
    } else {
      console.log("currentReport =" + JSON.stringify($scope.currentReport));

      $state.go("app.wizard");
    }

  };


  $scope.searchLocation = function(query) {
    var promiseSearch;
    if (query) {
      console.log("query= " + query);

      if ($scope.searchMode == "calle.lugar") {
        promiseSearch = locationAPI.searchLocationByStr(query);

      } else {
        console.log("buscando calle/"+$scope.selectedItem.codigo+"esquina = " + query);

        promiseSearch = locationAPI.searchEsquinaByStr({
          calle: $scope.selectedItem.codigo,
          esquina: query
        });
      }

      return promiseSearch;


    }
  };


  $scope.onClick = function() {

    $scope.ionAutocompleteElement.controller('ionAutocomplete').showModal();


  };

  $scope.itemsClicked = function(callback) {
    $scope.clickedValueModel = callback;
    $scope.selectedItem = callback.selectedItems[0];
    $scope.ionAutocompleteElementSearch = angular.element(document.getElementsByClassName("ion-autocomplete-search"));
    if ($scope.serachMode == "esquina.numero") {

      $scope.searchMode = "calle.lugar";
      $scope.ionAutocompleteElementSearc.hideModal();
      $scope.ionAutocompleteElementSearch.attr("placeholder", "Buscar calle o lugar");

      //goto place en el mapa
    } else {


      if ($scope.selectedItem.descTipo === "VIA") {
        $scope.searchMode = "esquina.numero";
        $scope.ionAutocompleteElementSearch.attr("placeholder", "Esquina o número");
        $scope.ionAutocompleteElement.controller('ionAutocomplete').showModal();

      }
    }

  };




}]);
