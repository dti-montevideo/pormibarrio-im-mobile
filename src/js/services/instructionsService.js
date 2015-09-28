starter.services.factory('InstructionsService', [ function() {

  var instructionsObj = {};

  instructionsObj.instructions = {
    newLocations : {
      text : 'Por mi barrio App',
      seen : false
    }
  };

  return instructionsObj;

}]);
