starter.controllers.controller('ReportCtrl', ['$scope', "$state",'$cordovaCamera', '$cordovaFile', '$ionicSlideBoxDelegate', '$ionicNavBarDelegate', 'leafletData', 'ReportService', function($scope,$state, $cordovaCamera, $cordovaFile, $ionicSlideBoxDelegate, $ionicNavBarDelegate, leafletData, ReportService) {


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


    });
  }else{
    $scope.goToState("app.wizard");
  }

  };

  $scope.goToState = function(stateView) {

    $state.go(stateView);
  };

  $scope.confirmReport = function() {


    ReportService.report($scope.currentReport).then(function(result) {

    });
  };

  $scope.$on('wizard:Previous', function(e) {

    $ionicNavBarDelegate.showBackButton($ionicSlideBoxDelegate.currentIndex() == 1);


  });
  $scope.$on('wizard:Next', function(e) {


    $ionicNavBarDelegate.showBackButton(false);


  });

  $scope.image = null;
  $scope.addImage = function(isFromAlbum) {

    var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: !isFromAlbum ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY, // Camera.PictureSourceType.PHOTOLIBRARY
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
    };


    $cordovaCamera.getPicture(options).then(function(imageData) {


      onImageSuccess(imageData);

      function onImageSuccess(fileURI) {
        window.FilePath.resolveNativePath(fileURI, function(result) {
          // onSuccess code
          fileURI = 'file://' + result;
          createFileEntry(fileURI);


        }, function(error) {
          console.error("Error resolveNativePath" + error);
        });

      }

      function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
      }

      // 5
      function copyFile(fileEntry) {
        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        var newName = makeid() + name;

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
            fileEntry.copyTo(
              fileSystem2,
              newName,
              onCopySuccess,
              fail
            );
          },
          fail);
      }

      // 6
      function onCopySuccess(entry) {
        $scope.$apply(function() {
          $scope.image = entry.nativeURL;
        });
      }

      function fail(error) {

        console.log("fail: " + error.code);
        console.log("fail: " + angular.toJson(error));
      }

      function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

    }, function(err) {
      console.log(err);
    });
  };

  $scope.urlForImage = function() {
    var imageURL = "http://placehold.it/300x300";
    if ($scope.image) {
      var name = $scope.image.substr($scope.image.lastIndexOf('/') + 1);
      imageURL = cordova.file.dataDirectory + name;
    }
    console.log("ImageURL = " + imageURL);
    return imageURL;
  };

}]);
