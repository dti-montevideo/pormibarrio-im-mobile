starter.controllers.controller('PMBCtrl', ['$scope', '$state', 'leafletData','PMBService', 'ReportService',function($scope, $state, leafletData,PMBService,ReportService) {
  $scope.reportButton={text:"Reportar",state:"unConfirmed"};

  $scope.initReport = function() {

    var _pin, _pinIcon = L.icon({
      iconUrl: 'img/pin@x2.png',
         iconSize: [70, 110], // size of the icon
          iconAnchor: [-18,55], // point of the icon which will correspond to marker's location
    });

    if($scope.reportButton.state=="unConfirmed"){

      $scope.reportButton.text ="Confirmar";
      $scope.reportButton.state = "about2Confirm";


    leafletData.getMap().then(function(map) {
      _pin = new L.marker(map.getCenter(), {
        icon: _pinIcon,
        clickable: false
      }).addTo(map);

      ReportService._new();
      ReportService.current.setLatLng(map.getCenter());
      //console.log(JSON.stringify($scope.currentReport));




    });
  }else{
    console.log("currentReport =" +JSON.stringify($scope.currentReport));

    $state.go("app.wizard");
  }

  };


}]);
