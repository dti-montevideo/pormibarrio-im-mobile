starter.services.factory('MapServices', [ function() {

  var instructionsObj = {};

  instructionsObj.instructions = {
    newLocations : {
      text : 'Por mi barrio App',
      seen : false
    }
  };

  return instructionsObj;

}]);
