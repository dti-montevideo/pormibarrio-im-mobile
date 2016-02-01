pmb_im.controllers.controller('MapController', ['$scope', '_',
  '$cordovaGeolocation',
  '$stateParams',
  '$ionicModal',
  '$ionicPopup','leafletData', 'PMBService','LocationsService',
  function(
    $scope, _,
    $cordovaGeolocation,
    $stateParams,
    $ionicModal,
    $ionicPopup,leafletData, PMBService, LocationsService
  ) {

    /**
     * Once state loaded, get put map on scope.
     */
    $scope.featureReports = {};
    $scope.baseURL = "http://devel.pormibarrio.uy/";






    $scope.$on("$stateChangeSuccess", function() {


        $scope.addReportsLayer();
        $scope.addMapControls();



      $scope.map = {
        defaults: {
          tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          maxZoom: 18,
          zoomControlPosition: 'topleft',
        },
        markers: {},
        events: {
          map: {
            enable: ['context'],
            logic: 'emit'
          }
        }
      };
        $scope.map.center = {
          lat: -34.901113,
          lng: -56.164531,
          zoom: 14
        };
      //      $scope.goTo(0);

    });

    var Location = function() {
      if (!(this instanceof Location)) return new Location();
      this.lat = "";
      this.lng = "";
      this.name = "";
    };

    $ionicModal.fromTemplateUrl('templates/addLocation.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.report = function() {
      $scope.set_active_option('button-report');
      document.getElementById("report-list-scroll").style.display = "none";
    }

    $scope.list_reports = function() {
      $scope.set_active_option('button-list-reports');
      document.getElementById("report-list-scroll").style.display = "block";
    }

    $scope.help = function() {
      $scope.set_active_option('button-help');
      document.getElementById("report-list-scroll").style.display = "none";
    }

    $scope.set_active_option = function(buttonid) {
      document.getElementById("button-report").className = "option-inactive";
      document.getElementById("button-list-reports").className = "option-inactive";
      document.getElementById("button-help").className = "option-inactive";
      document.getElementById("button-find-me").className = "option-inactive";
      document.getElementById(buttonid).className = "option-active";
    }
    /**
     * Center map on user's current position
     */
    $scope.locate = function() {

      $cordovaGeolocation
        .getCurrentPosition()
        .then(function(position) {
          $scope.map.center.lat = position.coords.latitude;
          $scope.map.center.lng = position.coords.longitude;
          $scope.map.center.zoom = 15;

          $scope.map.markers.now = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            message: "You Are Here",
            focus: true,
            draggable: false
          };

        }, function(err) {
          // error
          console.log("Location error!");
          console.log(err);
        });

    };


    $scope.getReports = function() {

      leafletData.getMap().then(function(map) {
        var bbox = map.getBounds();
        Console.log(bbox);

        PMBService.around(bbox).then(function(data) {
          for (var i = 0; i < data.length; i++) {
            console.log("pin " + i + "=" + data[i]);
          }
        });
      });
    };

    $scope.addMapControls = function() {

      var _crosshair, _crosshairIcon = L.icon({
        iconUrl: 'img/crosshairs@x2.png' //,
          /*  iconSize: [36, 36], // size of the icon
            iconAnchor: [18, 18], // point of the icon which will correspond to marker's location
            */
      });

      leafletData.getMap().then(function(map) {

        /*_crosshair = new L.marker(map.getCenter(), {
          icon: _crosshairIcon,
          clickable: false
        });

        L.easyButton({
          id: 'id-for-the-button',
          position: 'bottomleft',
          type: 'replace',
          leafletClasses: true,
          states: [{
              stateName: 'mark-center',
              onClick: function(button, map) {
                _crosshair.setLatLng(map.getCenter());
                _crosshair.addTo(map);
                map.on('move', function(e) {
                  _crosshair.setLatLng(map.getCenter());
                });

                button.state('remove-mark-center');
              },
              title: 'show me the middle',
              icon: 'ion-pinpoint'
            }, {
              stateName: 'remove-mark-center',
              onClick: function(button, map) {
                map.removeLayer(_crosshair);
                button.state('mark-center');
              },
              title: 'show me the middle',
              icon: 'ion-ios-undo'
            }

          ]
        }).addTo(map);

      //  L.Control.geocoder().addTo(map);
      */

      });
    };

    $scope.addReportsLayer = function() {

      var baseURL = "http://devel.pormibarrio.uy/", ///"http://pormibarrio.uy/";//"http://datauy.netuy.net/",
        buildPopup = function(data, marker) {
          var reportId = data[3],
            descripcion = data[4];

          var html = '<a class="text report-link" href=' + baseURL + 'report/' + reportId + '><p>' + descripcion + '</p></a>';
          return html;


        },

        onEachFeature = function(feature, layer) {
          // does this feature have a property named popupContent?
          var html, reportId, descripcion;
          if (feature.properties) {
            reportId = feature.properties.id;
            descripcion = feature.properties.title;
            html = '<a class="text report-link" href=' + baseURL + 'report/' + reportId + '><p>' + descripcion + '</p></a>';
            layer.bindPopup(html);
          }
        },

        l = new L.LayerJSON({
          url: baseURL + "ajax_geo?bbox={bbox}" /*"ajax_geo?bbox={bbox}"*/ ,
          locAsGeoJSON: true /*locAsArray:true*/
        });

      leafletData.getMap().then(function(map) {
        map.addLayer(l);
      });


      l.on('dataloaded', function(e) { //show loaded data!
        $scope.reports = e.data.features;
      });


      l.on('layeradd', function(e) {
        e.layer.eachLayer(function(_layer) {
          var markerIcon = L.icon({
            iconUrl: baseURL + _layer.feature.properties.pin_url,
            iconSize: [29, 34],
            iconAnchor: [8, 8],
            popupAnchor: [0, -8]
          });
          _layer.setIcon(markerIcon);
          if ($scope.featureReports[_layer.feature.properties.id] === undefined) {
            $scope.featureReports[_layer.feature.properties.id] = _layer;
          }
        });

      });


    };

    $scope.goToReport = function(report) {

      var report_divs_active = document.getElementsByClassName("report-inside-list-active");
      if(report_divs_active.length > 0){
        report_divs_active[0].className = "report-inside-list";
      }
      var report_div = document.getElementById("report-container-"+report.properties.id);
      report_div.className = "report-inside-list-active";

      var layer = $scope.featureReports[report.properties.id];
      leafletData.getMap().then(function(map) {
        var coords = layer.getLatLng();
        var lat = coords.lat;
        //Move a little the map center because the map view is smaller (report list is displayed)
        lat = lat - 0.008;
        map.setView(new L.LatLng(lat, coords.lng), 14);
        layer.openPopup();
      });
    };

    $scope.newReport = function() {
      alert("Nuevo Reporte");
    };


    // Suggestion
    $scope.model = "";
    $scope.clickedValueModel = "";
    $scope.removedValueModel = "";

    $scope.getTestItems = function(query) {
      var toReturn = [],
        obj;
      if (query) {
        obj = {
          items: [{
            id: "1",
            name: query + "1",
            view: "view: " + query + "1"
          }, {
            id: "2",
            name: query + "2",
            view: "view: " + query + "2"
          }, {
            id: "3",
            name: query + "3",
            view: "view: " + query + "3"
          }]
        };
        toReturn = obj.items;
      }
      return toReturn;
    };


    $scope.itemsRemoved = function(callback) {
      $scope.removedValueModel = callback;
    };



    $scope.find_me = function(){
        $scope.set_active_option("button-find-me");
        document.getElementById("report-list-scroll").style.display = "none";
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
                $scope.map.center.lat  = position.coords.latitude;
                $scope.map.center.lng = position.coords.longitude;
                $scope.map.center.zoom = 15;

                $scope.map.markers.now = {
                  lat:position.coords.latitude,
                  lng:position.coords.longitude,
                  message: "Te encuentras aquí",
                  focus: true,
                  draggable: false
                };

              }, function(err) {
                // error
                console.log("Location error!");
                console.log(err);
              });

          };

          var Location = function() {
        if ( !(this instanceof Location) ) return new Location();
        this.lat  = "";
        this.lng  = "";
        this.name = "";
      };

      $ionicModal.fromTemplateUrl('templates/addLocation.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modal = modal;
        });

      /**
       * Detect user long-pressing on map to add new location
       */
      $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
        $scope.newLocation = new Location();
        $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
        $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
        $scope.modal.show();
      });

      $scope.saveLocation = function() {
        LocationsService.savedLocations.push($scope.newLocation);
        $scope.modal.hide();

        $scope.map.center.lat  = $scope.newLocation.lat;
        $scope.map.center.lng = $scope.newLocation.lng;
        $scope.map.center.zoom = 15;

        $scope.map.markers.now = {
          lat:$scope.newLocation.lat,
          lng:$scope.newLocation.lng,
          message: "Nuevo reporte",
          focus: true,
          draggable: false
        };
        //$scope.goTo(LocationsService.savedLocations.length - 1);
      };


  }
]);
