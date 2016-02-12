pmb_im.services.factory('PMBService', ['$http','$timeout', 'leafletData', '$cordovaFileTransfer', function($http, $timeout, leafletData, $cordovaFileTransfer) {
  var base = "http://devel.pormibarrio.uy/";//"http://10.191.0.16:3000/";

  var PMBService = {

    report: function(form) {
      if (form.file) {
        var options = {
         fileKey: "photo",
         //fileName: filename,
         //chunkedMode: false,
         //mimeType: "image/jpg",
         params : form
        };
        var trustAllHosts = true;
        return  $cordovaFileTransfer.upload(base + 'report/new/mobile', form.file, options, trustAllHosts)
            .then(function(result) {
              // Success!
              console.log("Envío exitoso",result);
              alert("Envio");
              return true;
            }, function(err) {
              console.log("Error al subir el archivo",err);
              return false;
            }, function(progress) {
              $timeout(function() {
                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              });
            });
      }else{
          $http.get(base + 'report/new/mobile', { params: form }).success(function(data, status, headers,config){
            //var jsonResult = JSON.stringify(result);
            //console.log(jsonResult);
            console.log('data success');
            console.log(data); // object seems fine
            return true;
          })
          .error(function(data, status, headers,config){
            console.log('data error');
            console.log(data);
            return false;
          })
      }
    }

  };
  return PMBService;

}]);
