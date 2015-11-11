 //pmb_im.services.factory('MapService', [ function() {
 pmb_im.services.factory('MapService', ['leafletData', function(leafletData) {

   //   pmb_im.services.factory('MapService', ['$scope', 'leafletData', function($scope, leafletData) {

   //Definicion de la proyecccion UTM 21 s
   proj4.defs('EPSG:32721', '+proj=utm +zone=21 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs');


   var mapService = {};

   mapService.goToPlace = function(_place) {

     var _geoJson = {
       properties: {
         nombre: _place.nombre
       },
       crs: {
         type: 'name',
         properties: {
           name: 'urn:ogc:def:crs:EPSG::32721'
         }
       }
     };
     angular.extend(_geoJson, _place.geoJSON);
     leafletData.getMap().then(function(map) {
       var _latlng, layer = L.Proj.geoJson(_geoJson, {
         'pointToLayer': function(feature, latlng) {
           _latlng = latlng;
           return L.marker(latlng).bindPopup(feature.properties.nombre);
         }
       });
       layer.addTo(map);
       // console.log(JSON.stringify(layer));

       map.setView(_latlng, 18);
       layer.openPopup();
     });
   };

   return mapService;

 }]);
