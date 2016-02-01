pmb_im.services.factory('LocationsService', [ function() {

  var locationsObj = {};
  locationsObj.initial_lat = "";
  locationsObj.initial_lng = "";

  locationsObj.save_initial_position = function(position) {
    locationsObj.initial_lat =  position.coords.latitude;
    locationsObj.initial_lng =  position.coords.longitude;
  }

  locationsObj.savedLocations = [];

  return locationsObj;

}]);
