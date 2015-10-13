starter.services.factory('ReportService', ['$http', 'leafletData', '$cordovaFileTransfer', function($http, leafletData, $cordovaFileTransfer) {
  var base = "http://10.191.0.16:3000";


  /**
   * Constructor, with class name
   */
  function Report(_data) {
    angular.extend(this, _data);
  }




Report._default = function(){
  var _data = {
    lat: 0,
    lon: 0,
    title: '',
    details: '',
    may_show_name: '',
    category: '',
    phone: '',
    pc: '',
    file: '',
    name:'Nacho Apellido',
  email:'ignacio.talavera@imm.gub.uy',
  submit_sign_in:1,
  password_sign_in:'test',
  remember_me:1
  };
  return new Report(_data);
};
  Report._all = [];
  Report.current = {};
  Report._new = function(){
    Report.current = Report._default();
    return Report.current;
  };



  /**
   * Static method, assigned to class
   * Instance ('this') is not available in static context
   */
  Report.build = function(_data) {

    return new Report(
      _data
    );
  };

  Report.prototype.setLatLng = function (latlng) {

    this.lat = latlng.lat;
    this.lon = latlng.lng;
  };

  /**
   * Return the constructor function
   */
  return Report;

}]);
