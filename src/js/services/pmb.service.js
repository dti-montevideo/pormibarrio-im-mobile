pmb_im.services.factory('PMBService', ['$http', 'leafletData', '$cordovaFileTransfer', function($http, leafletData, $cordovaFileTransfer) {
  var base = "http://datauy.netuy.net/";//"http://10.191.0.16:3000/";

  var PMBService = {

    report: function(form) {

      var promise;
      if (form.file) {
        var options ={};
      return  $cordovaFileTransfer.upload(base + 'report/new/mobile', form.file, options)
          .then(function(result) {
            // Success!
            //creo el reclamo
            $http.post(base + 'report/new/mobile', form);
          }, function(err) {
            console.log("Error al subir el archivo",err);
          }, function(progress) {
            $timeout(function() {
              $scope.downloadProgress = (progress.loaded / progress.total) * 100;
            });
          });

      }else{
        return $http.get(base + 'report/new/mobile', form);
      }

      //

    }

  };
  return PMBService;

}]);
