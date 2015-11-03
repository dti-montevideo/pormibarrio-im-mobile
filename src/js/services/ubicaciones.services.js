starter.services.factory('locationAPI', ['$http', '$q','ApiImEndpoint','ApiDataEndpoint',function($http, $q,ApiImEndpoint,ApiDataEndpoint) {

  var restPreffix= "ubicacionesRest";

  var locationAPI = {};

  locationAPI.searchLocationByStr= function(_location){
    return $http.get(ApiImEndpoint.url + '/'+restPreffix+'/infoUbicacion/lugaresDeInteresYVias/', {
        method: 'GET',
        params: {
            nombre: _location
        }
    });
  };


  locationAPI.searchEsquinaByStr =function(_location) {
    console.log("searchEsquinaByStr = "+JSON.stringify(_location));
    return $http.get(ApiImEndpoint.url + '/'+restPreffix+'/infoUbicacion/esquinas/'+_location.calle+'/', {params:{nombre:_location.esquina}});
  };
  locationAPI.getLocationGeom = function(_location){
    var url = ApiImEndpoint.url + '/'+restPreffix+'/dataGeoUbicacion/'+_location.tipo;
    angular.forEach(_location.params, function(param, key) {
        url+= +'/'+param;
    });
    return $http.get(url);


  };


}]);
