starter.services.factory('locationAPI', ['$http', '$q','ApiImEndpoint','ApiDataEndpoint',function($http, $q,ApiImEndpoint,ApiDataEndpoint) {

  return {
    searchLocationByStr: function(_location) {
      console.log("searchLocationByStr param = " + _location);
      return $http.get(ApiImEndpoint.url + '/ubicacionesRest/infoUbicacion/lugaresDeInteresYVias/', {
          method: 'GET',
          params: {
              nombre: _location
          }
      });
    },
    searchEsquinaByStr: function(_location) {
      return $http.post(ApiImEndpoint.url + '/ubicacionesRest/infoUbicacion/esquinas/'+_location.calle+'/', {name:_location.esquina});
    }
  };

}]);
