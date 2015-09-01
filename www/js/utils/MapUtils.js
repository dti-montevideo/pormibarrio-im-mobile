

    var MapUtils = MapUtils || {};

    MapUtils.irAlPunto = function(x, y, offset) {
        var ul = new Array(), br = new Array();
        if (x == undefined || y == undefined)
            return;

        ul[0] = x - offset;
        ul[1] = y - offset;
        br[0] = x + offset;
        br[1] = y + offset;

        map.zoomToExtent(new OpenLayers.Bounds(ul[0], ul[1], br[0], br[1]));
    };

    MapUtils.markers = null;
    MapUtils.format = new OpenLayers.Format.GeoJSON();
    MapUtils.addMarker = function(markerIcon, point, markers) {
        var marker, icon, size_marker = new OpenLayers.Size(MARKERS_SIZE[markerIcon].w, MARKERS_SIZE[markerIcon].h), lonlat = new OpenLayers.LonLat(point.x, point.y);
        var offset = new OpenLayers.Pixel(-(size_marker.w / 2) + 16, -size_marker.h);
        icon = new OpenLayers.Icon(ICON_URL[markerIcon], size_marker, offset);
        marker = new OpenLayers.Marker(lonlat, icon);
        markers.addMarker(marker);
    }


    MapUtils.featureFromGeoJson = function(geoJson) {
        return MapUtils.format.parseGeometry(geoJson);


    },
            MapUtils.createGeoJson = function(p) {
        return {geom: {type: "Point", coordinates: [p.x, p.y]}};
    },
            MapUtils.createStyleMap = function(styleOptions) {

        return   _.object(_.keys(styleOptions), _.map(styleOptions, function(options) {
            return new OpenLayers.Style(options)
        }));


    }

    MapUtils.transformGeom2Google = function(geom) {
        return geom.transform(new OpenLayers.Projection('EPSG:32721'), new OpenLayers.Projection('EPSG:900913'));
    },
    MapUtils.transformLatLong2Geom = function(_long, _lat) {
        var point = new OpenLayers.Geometry.Point(_long, _lat);
        return point.transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:32721'));
    },

    MapUtils.fromLatLong2Json = function(_long, _lat) {

        var point = MapUtils.transformLatLong2Geom(_long, _lat);
        return MapUtils.createGeoJson(point);

    }


    MapUtils.zoomToExtent = function(map, extent) {

    },
    MapUtils.createBbox = function(geomPoint,offset){
    	  xLowerLeft = geomPoint.x- offset;
          yLowerLeft = geomPoint.y- offset;
          xUpperRight = geomPoint.x + offset;
          yUpperRight = geomPoint.y + offset;

          // make new bounding box
          var ul = new Array();// x, y
          var br = new Array();// x, y
          ul[0] = xLowerLeft;
          ul[1] = yLowerLeft;
          br[0] = xUpperRight;
          br[1] = yUpperRight;
          return new OpenLayers.Bounds(ul[0], ul[1], br[0], br[1]);

    },

            MapUtils.goToPoint = function(map, point) {
              map.zoomToExtent(MapUtils.createBbox());
    },
            MapUtils.addGetFeatureInfoCap = function(map, layer, wmsGFeatureInfoListener) {

        wmsGetFeatureInfoCtrl = new OpenLayers.Control.WMSGetFeatureInfo({
            url: geoserverWMSURL,
            title: 'Horarios en la parada',
            layers: [layer],
            queryVisible: true,
            infoFormat: 'application/vnd.ogc.gml',
            vendorParams: {buffer: 10}

        });
        wmsGetFeatureInfoCtrl.events.register("getfeatureinfo", this, wmsGFeatureInfoListener);
        map.addControl(wmsGetFeatureInfoCtrl);
        wmsGetFeatureInfoCtrl.activate();

    }
