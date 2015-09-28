starter.services.factory('PMBService', ['$http','leafletData', function($http,leafletData) {
  var base = "http://10.191.0.16:3000";

  var PMBService = {

    around: function(_bbox) {


      return $http.get(base + '/ajax/', {
        params: {
          bbox: _bbox
        }
      });
    }




  };
  return PMBService;

}]);
