$(function () {
    ///////////////////////////////////////////////////
    window.mySerial = getMachineId();
    console.log('muSerisal is >> ' + window.mySerial)

    var url = "tiles/" + config[4] + "/{z}/{x}/{y}.png";
    var key = 'pk.eyJ1Ijoid2FwY28iLCJhIjoiY2ozcmttZjZ3MDAzejJ3cDZmOHNneGllMiJ9.nML5TJqPqy_mLGYx7d2adw'
//    var SHADOW_Z_INDEX = 10;
//    var MARKER_Z_INDEX = 11;
//    var size = new wap.Size(32, 37);
//    var offset = new wap.Pixel(-(size.w / 2), -size.h);
//    style_fire = wap.Util.extend({externalGraphic: 'img/Burn.png', backgroundGraphic: "img/marker_shadow.png", backgroundXOffset: 0, backgroundYOffset: -27, graphicWidth: size.w, graphicHeight: size.h, graphicOpacity: 1, graphicXOffset: offset.x, graphicYOffset: offset.y, graphicZIndex: MARKER_Z_INDEX, backgroundGraphicZIndex: SHADOW_Z_INDEX, backgroundWidth: 42, backgroundHeight: 28}, wap.Feature.Vector.style['default']);
//    style_car = wap.Util.extend({externalGraphic: 'img/car.png', graphicWidth: size.w, graphicHeight: size.h, graphicOpacity: 1, graphicXOffset: offset.x, graphicYOffset: offset.y, graphicZIndex: MARKER_Z_INDEX}, wap.Feature.Vector.style['default']);
////    layer_tile = new wap.Layer.OSM("wapcoTMS", url, {numZoomLevels: 18});


    //////////intervals start



    if (config[6] === 'online') {
        layer_tile = new ol.layer.Tile({source: new ol.source.OSM()});
    } else if (config[6] === 'offline') {
        layer_tile = new ol.layer.Tile({source: new ol.source.XYZ({url: url})});
    } else if (config[6] === 'google') {
//        layer_tile = new ol.layer.Tile({source: new ol.source.XYZ({url: url})});
        layer_tile = new ol.layer.Tile({source: new ol.source.TileImage({url: 'http://khm{0-3}.googleapis.com/kh?v=742&hl=pl&&x={x}&y={y}&z={z}'})});
    } else if (config[6] === 'onlineFFO') {
        if (config[4] === 'mashhad') {
            layer_tile = new ol.layer.Tile({
//          extent: [59.1900291442871,36.1060066223145,59.8792152404785,36.5422706604004],
                source: new ol.source.TileWMS({
                    url: 'http://217.219.86.84:808/geoserver/ffo/wms',
                    params: {'LAYERS': 'ffo:ffo-mashhad', 'TILED': true, 'format': 'image/jpeg'},
                    serverType: 'geoserver'
                })
            });
        } else if (config[4] === 'shiraz') {
            layer_tile = new ol.layer.Tile({
//          extent: [59.1900291442871,36.1060066223145,59.8792152404785,36.5422706604004],
                source: new ol.source.TileWMS({
                    url: 'https://125.shiraz.ir/geoserver/fire125/wms',
                    params: {'LAYERS': 'fire125:shiraz_map_totalfire', 'TILED': true, 'format': 'image/jpeg'},
                    serverType: 'geoserver'
                })
            });
        } else if (config[4] === 'ahwaz') {
            layer_tile = new ol.layer.Tile({
//          extent: [59.1900291442871,36.1060066223145,59.8792152404785,36.5422706604004],
                source: new ol.source.TileWMS({
                    url: 'https://91.108.152.86/geoserver/ffo/wms',
                    params: {'LAYERS': 'ffo:ffo_ahwaz', 'TILED': true, 'format': 'image/jpeg'},
                    serverType: 'geoserver'
                })
            });
        } else if (config[4] === 'kashan') {
            layer_tile = new ol.layer.Tile({
//          extent: [59.1900291442871,36.1060066223145,59.8792152404785,36.5422706604004],
                source: new ol.source.TileWMS({
                    url: 'http://mahar.kashan.ir:801/wapcomaps/ffo/wms',
                    params: {'LAYERS': 'ffo:ffo_kashan', 'TILED': true, 'format': 'image/jpeg'},
                    serverType: 'geoserver'
                })
            });
        } else if (config[4] === 'yazd') {
            layer_tile = new ol.layer.Tile({
//          extent: [59.1900291442871,36.1060066223145,59.8792152404785,36.5422706604004],
                source: new ol.source.TileWMS({
                    url: 'https://mahar.yazd.ir:8081/wapcoms/wms',
                    params: {'LAYERS': 'wapco:wapco_iran_base_map', 'TILED': true, 'format': 'image/jpeg'},
                    serverType: 'geoserver'
                })
            });
        } else if (config[4] === 'zanjan') {
            layer_tile = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://mahar.zanjan.ir:8081/wapcoms/wms',
                    params: {'LAYERS': 'wapco:wapco_iran_base_map', 'TILED': true, 'format': 'image/jpeg'},
                    serverType: 'geoserver'
                })
            });
        } else if (config[4] === 'gorgan') {
            layer_tile = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://10.75.2.25/wapcomaps/wms',
                    params: {'LAYERS': 'wapco:wapco_iran_base_map', 'TILED': true, 'format': 'image/jpeg'},
                    serverType: 'geoserver'
                })
            });
        }
    } else if (config[6] === 'localVector') {
        var big = ["trunk", "trunk_link", "primary", "primary_link"];
        layer_tile = new ol.layer.Image({

            source: new ol.source.ImageVector({
                source: new ol.source.Vector({
                    url: 'maps/mashhad.geojson',
                    format: new ol.format.GeoJSON(),
                    projection: 'EPSG:4326'
                }),
                style: function (feature) {
                    var StyleConfig = {
                        stroke: new ol.style.Stroke({
                            color: ((big.indexOf(feature.get('highway')) != -1) ? 'rgba(31, 173, 209, 1.0)' : 'rgba(169, 173, 166 , 0)'),
                            width: ((feature.get('highway') == 'trunk') ? 4 : 2)
                        })
                    }
                    var textStyleConfig = {
                        text: new ol.style.Text({
                            text: ((map.getView().getZoom() >= 17 && feature.get('name')) || (map.getView().getZoom() >= 15 && feature.get('highway') == 'secondary' && feature.get('name')) || (map.getView().getZoom() < 15 && feature.get('highway') == 'trunk') && feature.get('name')) ? feature.get('name') : '',
                            fill: new ol.style.Fill({color: "#000000"}),
                            stroke: new ol.style.Stroke({color: "#FFFFFF", width: 2})
                        })
                    }
                    var textStyle = new ol.style.Style(textStyleConfig);
                    var style = new ol.style.Style(StyleConfig);
                    return [style, textStyle];
                }
            })

        });
//        layer_tile = new ol.layer.Image({
//            source: new ol.source.ImageVector({
//              source: new ol.source.Vector({
//                url: 'maps/mashhad2.geojson',
//                format: new ol.format.GeoJSON(),
//                projection: 'EPSG:4326'
//              }),
//              style: createPolygonStyleFunction()
//            })
//          });

//            new ol.layer.Image({
//            source: new ol.source.ImageVector({
//                format: new ol.format.OSMXML(),
//                url: 'maps/mashhad.osm',
//                projection: 'EPSG:4326'
//            }),
//            style: function (feature) {
//                for (var key in styles) {
//                    var value = feature.get(key);
//                    if (value !== undefined) {
//                        for (var regexp in styles[key]) {
//                            if (new RegExp(regexp).test(value)) {
//                                return styles[key][regexp];
//                            }
//                        }
//                    }
//                }
//                return null;
//            }
//        })
    }



    testRoutLineSource = new ol.source.Vector();
    var testRoutLine = new ol.layer.Vector(
            {
                title: 'line',
                source: testRoutLineSource,
                style: new ol.style.Style(
                        {
                            stroke: new ol.style.Stroke(
                                    {
                                        color: 'blue', width: 6
                                    })
                        })
            });
    fireLocationSource = new ol.source.Vector();
    var fireLocation = new ol.layer.Vector(
            {
                title: 'fire',
                source: fireLocationSource,
                style: new ol.style.Style({
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [0.5, 0.5],
                        size: [32, 32],
                        offset: [0, 0],
                        opacity: 1,
                        scale: 0.9,
//                        anchorXUnits: 'pixels',
//                        anchorYUnits: 'pixels',
                        src: './assets/img/fire.gif'
                    }))
                })
//                style: new ol.style.Style({
//                    image: new ol.style.Circle({
//                        radius: 9,
//                        fill: new ol.style.Fill({
//                            color: '#ff0c0c'
//                        }),
//                        stroke: new ol.style.Stroke({
//                            color: '#fffd8c',
//                            width: 8
//                        }),
//                        zIndex: 2000
//                    })
//                })
            });
    extentSource = new ol.source.Vector();
    var extentLocation = new ol.layer.Vector(
            {
                title: 'extent',
                source: extentSource,
                style: new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 10,
                        fill: new ol.style.Fill({color: 'rgba(255,255,255,0.2)'})
                    })
                })
            });
    carPositionSource = new ol.source.Vector();
    var carPosition = new ol.layer.Vector(
            {
                title: 'car',
                source: carPositionSource,
                style: new ol.style.Style({
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [0.5, 0.5],
                        size: [128, 128],
                        offset: [0, 0],
                        opacity: 1,
                        scale: 0.3,
                        src: './assets/img/car.png'
                    }))
                })
//                style: new ol.style.Style({
//                    image: new ol.style.Circle({
//                        radius: 9,
//                        fill: new ol.style.Fill({
//                            color: '#3399CC'
//                        }),
//                        stroke: new ol.style.Stroke({
//                            color: '#eff4fc',
//                            width: 8
//                        }),
//                        zIndex: 2000
//                    })
//                })
            });
    closedMabarSource = new ol.source.Vector();
    var closedMabar = new ol.layer.Vector(
            {
                title: 'closedMabar',
                source: closedMabarSource,
                style: new ol.style.Style(
                        {
                            stroke: new ol.style.Stroke(
                                    {
                                        color: 'red', width: 6
                                    })
                        })
            });
    mabarSource = new ol.source.Vector();
    var mabar = new ol.layer.Vector(
            {
                title: 'mabar',
                source: mabarSource,
                style: new ol.style.Style(
                        {
                            stroke: new ol.style.Stroke(
                                    {
                                        color: 'green', width: 6
                                    })
                        })
            });
    Layers = [layer_tile, mabar, extentLocation, closedMabar, testRoutLine, fireLocation, carPosition];
    view = new ol.View({
//        minResolution: 0.9742894634219894,
//        maxResolution: 249.4181026360293,
//        units: 'm',
//        resolutions: [200, 50, 10, 5, 1, 0.5, 0.1],
//        projection: 'EPSG:900913',
//        maxExtent: [5817887.793407015, 3424021.948945076, 5876431.117737366, 3487872.9832198997],
        enableRotation: false,
        center: [config[0], config[1]],
        zoom: config[2],
        minZoom: 10,
        maxZoom: 17,
    });
//    var controls = ol.control.defaults({rotate: true});
//    var interactions = ol.interaction.defaults({altShiftDragRotate: false, pinchRotate: false});


    map = new ol.Map({
        layers: Layers,
//        renderer: exampleNS.getRendererFromQueryString(),
        controls: controls,
//        interactions: ol.interaction.defaults({
//            dragPan: false,
//            mouseWheelZoom: false,
//            altShiftDragRotate: false,
//            pinchRotate: false
//        }).extend([
//            new ol.interaction.DragPan({kinetic: false}),
//            new ol.interaction.MouseWheelZoom({duration: 0})
//        ]),
        target: 'map',
        view: view
    });
    zoomslider = new ol.control.ZoomSlider();
//    map.addControl(zoomslider);
    var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });

//    map.addControl(mousePositionControl);
    ////////////remove attributes
    var controls = map.getControls();
    var attributionControl;
    controls.forEach(function (el) {
        console.log(el instanceof ol.control.Attribution);
        if (el instanceof ol.control.Attribution) {
            attributionControl = el;
        }
    });
    map.removeControl(attributionControl);
    
    ////////////////////
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    });
    map.on('singleclick', function (e) {
        if (wapco.mabar) {
            var projectedCoords = ol.proj.transform(e.coordinate, 'EPSG:3857', config[3]);
            wapco.getMabar(projectedCoords[0], projectedCoords[1]);
        }
    });
    $('.address .close').click(function () {
        $('.address').slideUp();
    });
// Geolocation marker
    markerEl = document.getElementById('geolocation_marker');
    var marker = new ol.Overlay({
        positioning: 'center-center',
        element: markerEl,
        stopEvent: false
    });
    map.addOverlay(marker);

// LineString to store the different geolocation positions. This LineString
// is time aware.
// The Z dimension is actually used to store the rotation (heading).
//    positions = new ol.geom.LineString([],
//            /** @type {ol.geom.GeometryLayout} */ ('XYZM'));
///////geolocation//////////////////////////////////////////////////////
    ///////geolocation//////////////////////////////////////////////////////
    geolocation = new ol.Geolocation({
        projection: view.getProjection(),
        trackingOptions: {
            maximumAge: 10000,
            enableHighAccuracy: true,
            timeout: 600000
        }
    });

    // handle geolocation error.
    geolocation.on('error', function (error) {
        alert('error')
        console.log(error)
//        var info = document.getElementById('info');
//        info.innerHTML = error.message;
//        info.style.display = '';
    });

    var accuracyFeature = new ol.Feature();
    geolocation.on('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });

    var positionFeature = new ol.Feature();
    positionFeature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#3399CC'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2
            })
        })
    }));

    geolocation.on('change:position', function () {
        var coordinates = geolocation.getPosition();
        var projectedCoords = ol.proj.transform(coordinates, 'EPSG:3857', config[3]);
        
        projectedCoords[3] = geolocation.getAccuracy();
        projectedCoords[5] = geolocation.getHeading() || 0;
        projectedCoords[6] = geolocation.getSpeed() || 0;
        projectedCoords[7] = Date.now();
        
        console.log(projectedCoords)
        wapco.lastPosition.lon = projectedCoords[0]
        wapco.lastPosition.lat = projectedCoords[1]
        wapco.showPosition(projectedCoords)
        wapco.savePosition(projectedCoords);
        positionFeature.setGeometry(coordinates ?
                new ol.geom.Point(coordinates) : null);
    });
    new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
            features: [accuracyFeature, positionFeature]
        })
    });

    ///////geolocation//////////////////////////////////////////////////////
    ///////geolocation//////////////////////////////////////////////////////


    getFireInterval();
    getMabarClosedInterval();
    wapco.getClosedMabar();
});