starter.controllers.controller('IntroCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.step2 = {};
  $scope.step3 = {};

  $scope.start = function() {
    $state.go('tab.dash');
  };

  $scope.startCondition = function() {
    return angular.isDefined($scope.step3.something);
  };

}])


.controller('imageController', function($scope, $cordovaCamera, $cordovaFile) {
  $scope.image = null;

  $scope.addImage = function(isFromAlbum) {
    // 2
    var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: !isFromAlbum ? Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY, // Camera.PictureSourceType.PHOTOLIBRARY
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
    };

    // 3
    $cordovaCamera.getPicture(options).then(function(imageData) {

      // 4
      onImageSuccess(imageData);

      function onImageSuccess(fileURI) {
        window.FilePath.resolveNativePath(fileURI, function(result) {
           // onSuccess code
           fileURI = 'file://' + result;
           createFileEntry(fileURI);


         }, function (error) {
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
        console.log("fail: " + angular.toJson (error));
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

    if(!$scope.image) return "http://placehold.it/300x300";
    var name = $scope.image.substr($scope.image.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;
    return trueOrigin;
  };
});
