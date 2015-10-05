starter.controllers.controller('PMBCtrl', ['$scope', '$state', 'PMBService', function($scope, $state, PMBService) {
  $scope.step2 = {};
  $scope.step3 = {};

  $scope.start = function() {
    $state.go('tab.dash');
  };

  $scope.startCondition = function() {
    return angular.isDefined($scope.step3.something);
  };

}]);
