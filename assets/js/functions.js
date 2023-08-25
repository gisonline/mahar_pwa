var address = config[5];
var style1 = {strokeWidth: 5, strokeOpacity: 0.5, strokeColor: "#00ff00"};
var map = null;
var testRoutLineSource;
var carPositionSource;
var extentSource;
var firLocationSource;
var closedMabarSource;
var mabarSource;
var Layers = [];
var watchID = null;
var sendInterval;
var getInterval;
var MabarClosedInterval;
//var selected_call_id;
var showPos = 1;
var showFire = 1;

/////interval of getting fire location data/////////
function getFireInterval() {
    geolocation.setTracking(true);
    console.log(view.getProjection())
    if (getInterval) {
        window.clearInterval(getInterval);
    }
    getInterval = setInterval(function () {
        wapco.getFire();
    }, 3000);////////////////////////dsfgsehrstherhdrtherh
}
////////get closed roads////////////
function getMabarClosedInterval() {
    if (MabarClosedInterval) {
        window.clearInterval(MabarClosedInterval);
    } else {
        MabarClosedInterval = setInterval(function () {
            wapco.getClosedMabar();
        }, 30000);
    }
}
///////////change mabar///////////////////
function changeMabarsInfo() {
    var LINK_ID = $('#LINK_ID').val();
    var LINK_NAME = $('#LINK_NAME').val();
    var CLOSED = $('#CLOSED').val();
    var DIRECT = $('#DIRECT').val();
    wapco.setMabar(LINK_ID, LINK_NAME, CLOSED, DIRECT);
}
/////////////////////////
//$("input[name='checkbox-0']").checkboxradio('enable');
$("input[name='checkbox-0']:eq(0)").attr("checked", true);
$("input[name='checkbox-0']:eq(1)").attr("checked", true);

function toggleZoomCar() {
    if (showPos === 0) {
        showPos = 1;
        wapco.zoom(1);
    } else {
        showPos = 0;
    }
}
function toggleZoomFire() {
    if (showFire === 0) {
        showFire = 1;
        wapco.zoom(2);
    } else {
        showFire = 0;
    }
}

/////wapco start/////////////
var wapco = {
    call_id: '',
    mac: '',
    getPic: 0,
    run: 1,
    a: 0,
    b: 0,
    station: 0,
    c: 0,
    d: [],
    e: [],
    f: 0,
    g: 0,
    car_id: 0,
    station_id: 0,
    avl_interval: 10000,
    tabletcode: 0,
    lastDate: '',
    mabar: false,
    testRoutFromWkt: '',
    testRoutStationId: '',
    testRoutToWkt: '',
    testRoutMacaddress: '',
    testRoutRoutWkt: '',
    testRoutDistance: '',
    reloadApp: function () {
//        location.reload();
    },
    lastPosition: {lon: '0', lat: '0'},
    lastFirePosition: {point: '0', addr: '0', call_id: '0'},
    msg: {
        savePicture: {
            success: 'تصویر با موفقیت ارسال شد',
            error: 'خطا ، تصویر ارسال نشد'
        },
        netFail: 'قطع ارتباط با سرور',
        archivActive: 'آرشیو اطلاعات فعال شد',
        netSuccess: 'اطلاعات به سرور انتقال یافت',
        stopWatch: 'جی پی اس غیر فعال شد',
        startWatch: 'جی پی اس فعال شد',
        SuccessUpdateSettings: 'تغییرات با موفقیت ثبت شد',
        SuccessInsertSettings: 'تنظیمات با موفقیت ثبت شد',
        PleaseInsertSettings: 'لطفا کد خودرو را با دقت وارد نمایید',
        FailUpdateSettings: 'خطا در ذخیره تغییرات',
        fireLoc: 'محل حادثه',
        carLoc: 'محل خودرو',
        setMabar: {
            success: 'تغییرات با موفقیت ارسال گردید',
            warning: 'خطا در ارتباط، لطفا دوباره ارسال نمایید',
            error: 'خطا در ارتباط، لطفا دوباره ارسال نمایید'
        },
        getMabar: {
            success: '',
            warning: '',
            error: ''
        },
        getClosedMabar: {
            warning: '',
            success: '',
            error: ''
        }
    },
    getFire: function () {
        if (mySerial) {
//            wapco.show_msg("has serial");
            wapco.MAC = mySerial;
            $("#wifi").hide();
            $.ajax({
                url: address,
                dataType: 'jsonp',
                async: true,
                data: {name: "Get last point", MACADDRESS: mySerial},
                success: function (e) {
//                    wapco.show_msg(e.previewPoint);
                    if (e.previewPoint) {
                        return false;
                    }
                    wapco.lastFirePosition.point = (e.point !== 'POINT( )' ? e.point : '0');
                    wapco.lastFirePosition.addr = (e.address !== 'null' ? e.address : '');
//                    wapco.lastFirePosition.desc = (e.call_desc !== 'null' ? '' : e.call_id);
                    wapco.lastFirePosition.desc = (e.call_desc !== 'null' ? 'شماره پرونده:' + e.call_id + ' ' + e.call_desc : 'شماره پرونده:' + e.call_id);
                    wapco.lastFirePosition.call_id = e.call_id;
                    wapco.lastFirePosition.rout = (e.rout !== '' ? e.rout : '0');
                    wapco.lastFirePosition.getPic = (e.getPic ? e.getPic : 0);
//                        if (wapco.lastPosition.lon !== '0' && wapco.lastPosition.lat !== '0' && wapco.lastFirePosition.point !== '0') {
//                            wapco.zoom(3);
//                        }
                    if (wapco.lastFirePosition.getPic === 1) {
                        context.drawImage(video, 0, 0, 160, 120);
                        $.ajax({
                            url: address,
                            dataType: 'jsonp',
                            async: true,
                            data: {
                                name: "SavePicture",
                                image: canvas.toDataURL('image/webp'),
                                MACADDRESS: mySerial
                            }
                        });
                    }

                    fireLocationSource.clear();
                    testRoutLineSource.clear();
//                        $('#menu4').text('').css('padding', '0');
                    if (wapco.lastFirePosition.point.toString() !== '0') {
//                            $("#firealarm").show();
//                            $('#menu4').text(e.address).css('padding', '15px 0').css('font-weight', 'bold').css('font-size', '16px');
                        addMyFeature(fireLocationSource, e.point.toString());
                        if (wapco.lastFirePosition.rout.toString() !== '0') {
                            addMyFeature(testRoutLineSource, e.rout.toString());
                        }
                        $('.address .content').html(wapco.lastFirePosition.addr);
                        $('.desc .content').html(wapco.lastFirePosition.desc);
                        ////////////////////////////////////////
                        if (showFire === 1 && showPos === 1) {
                            wapco.zoom(3);
                        } else if (showFire === 1 && showPos === 0) {
                            wapco.zoom(2);
                        }
                        //////////////////////////////////////
                        if (wapco.call_id !== wapco.lastFirePosition.call_id) {
                            wapco.call_id = wapco.lastFirePosition.call_id;
                            wapco.selected_call_id = wapco.lastFirePosition.call_id;
//                            cordova.plugins.backgroundMode.configure({
//                                text: e.address,
//                                ticker: 'حادثه جدید',
//                                title: 'حادثه در آدرس زیر:'
//                            });
//                            playBeep();
                            showFire = 1;
                        }
                        if (e.address !== 'null' && e.address && e.address !== '') {
                            $('.address').slideDown();
//                            cordova.plugins.backgroundMode.configure({
//                                text: e.address,
//                                ticker: 'حادثه جدید',
//                                title: 'حادثه در آدرس زیر:'
//                            });

                        } else {
                            $('.address').slideUp();
                        }
                        if (e.call_desc !== 'null' && e.call_desc && e.call_desc !== '') {
                            $('.desc').slideDown();
                        } else {
                            $('.desc').slideUp();
                        }
                    } else {
                        $("#firealarm").hide();
                        $('.address').slideUp();
                        $('.desc').slideUp();
//                        cordova.plugins.backgroundMode.configure({
//                            text: 'ارتباط با مرکز برقرار است::خبر خاصی نیست',
//                            ticker: 'مهار::بدون عملیات',
//                            title: 'سامانه مهار'});
                    }
                },
                error: function (e) {
                    wapco.show_msg(e.code);
                }
            });
        } else {
            $("#wifi").show();
            wapco.show_msg('wifi دستگاه خاموش است لطفا روشن نمایید');
        }
//        }, function (fail) {
//            wapco.show_msg('خطا در بدست آورد آدرس مک');
//        });
    },
    /////////////////////////////
    getBackFire: function () {
//        window.MacAddress.getMacAddress(function (MACADDRESS) {
        if (mySerial) {
            $.ajax({
                url: address,
                dataType: 'jsonp',
                data: {name: "Get last point", MACADDRESS: mySerial},
                success: function (e) {
                    if (e.previewPoint) {
                        return false;
                    }
                    wapco.lastFirePosition.point = e.point;
                    wapco.lastFirePosition.addr = e.address;
                    wapco.lastFirePosition.call_id = e.call_id;
                    wapco.lastFirePosition.getPic = (e.getPic ? e.getPic : 0);

                    if (wapco.lastFirePosition.point.toString() !== '0') {
                        cordova.plugins.backgroundMode.setDefaults({
                            text: e.address,
                            ticker: 'حادثه جدید',
                            title: 'حادثه در آدرس زیر:'
                        });
                        if (wapco.call_id !== wapco.lastFirePosition.call_id) {
                            wapco.call_id = wapco.lastFirePosition.call_id;
//                            playBeep();
                        }
                    } else {
                        cordova.plugins.backgroundMode.setDefaults({
                            text: 'ارتباط با مرکز برقرار است::خبر خاصی نیست',
                            ticker: 'مهار::بدون عملیات',
                            title: 'سامانه مهار'});
                    }
                }
            });
        } else {
            cordova.plugins.backgroundMode.setDefaults({
                text: 'خطا در بدست آورد آدرس مک',
                ticker: 'خطا در بدست آورد آدرس مک',
                title: 'سامانه مهار'});
        }
//        }, function (fail) {
//            cordova.plugins.backgroundMode.setDefaults({
//                text: fail,
//                ticker: 'خطا',
//                title: 'سامانه مهار'});
//        });
    },
    /////////////////////////

    showPosition: function (e) {
        var lon = e[0];
        var lat = e[1];
        var carWKT = 'POINT(' + lon + ' ' + lat + ')';
        if (carWKT !== 'POINT( )') {
            carPositionSource.clear();
            addCarFeature(carPositionSource, carWKT);
        }
//        if ($('#positionxy:contains("x / y")')) {
//            wapco.zoom(1);
//            $('.address').slideUp();
//        }
//        if (wapco.lastFirePosition.point.toString() === '0' && carWKT !== 'POINT( )') {
//            wapco.zoom(1);
//            $('.address').slideUp();
//        }
    },
    savePosition: function (e) {
        $("#sat").hide();
        var dt = wapcoDate();
        var lat = e[1];
        var lon = e[0];

        if (showFire === 1 && showPos === 1) {
            wapco.zoom(3);
        } else if (showFire === 0 && showPos === 1) {
            wapco.zoom(1);
        }
        $("#stopUpload").hide();
        wapco.lastDate = dt;
        $('#positionxy').text('x: ' + lon.toFixed(4) + ' / y: ' + lat.toFixed(4));
        wapco.lastPosition.lon = lon;
        wapco.lastPosition.lat = lat;
        var altitude = (e[2] ? e[2] : -1);
        var accuracy = (e[3] ? e[3] : -1);
        var altitudeAccuracy = (e[4] ? e[4] : -1);
        var heading = (e[5] ? e[5] : -1);
        var speed = (e[6] ? e[6] : -1);
        var timestamp = (e[7] ? e[7] : -1);
//            window.MacAddress.getMacAddress(function (MACADDRESS) {
//                if (MACADDRESS !== '00:00:00:00:00:00' && MACADDRESS) {
        if (mySerial) {
            $("#wifi").hide();
//                        wapco.show_msg('ذخیره مختصات ');
            if (wapco.a === 0) {
                wapco.a = 1;
                $.ajax({
                    url: address,
                    dataType: 'jsonp',
                    async: true,
                    data: {
                        name: "Save car's point",
                        MACADDRESS: mySerial,
                        TIMESTAMP: timestamp,
                        LON: lon.toFixed(6),
                        LAT: lat.toFixed(6),
                        ALTITUDE: altitude,
                        ACCURACY: accuracy,
                        ALTITUDEACCURACY: altitudeAccuracy,
                        HEADING: heading,
                        SPEED: speed.toFixed(3)
                    },
                    success: function () {
                        $("#stopUpload").hide();
                        $("#network").hide();
                        $("#sat").hide();
                        $("#upload").show();
                        wapco.a = 0;
                    },
                    error: function () {
                        wapco.a = 0;
                        $("#network").show();
                        $("#upload").hide();
                        wapco.show_msg(wapco.msg.netFail, "warn");
                    }
                });
            }
        } else {
            $("#wifi").show();
            wapco.show_msg('wifi دستگاه خاموش است لطفا روشن نمایید');
        }
    },
    errorToGetPosition: function (e) {
        alert('errorToGetPosition');
    },
    zoom: function (e) {
        if (e) {
            if (e === 1) {
                if (wapco.lastPosition.lon !== '0' && wapco.lastPosition.lat !== '0') {
//                    wapco.show_msg(wapco.lastPosition.lat + '>>>' + wapco.lastPosition.lon+' >>>> 1');
                    var zlat = wapco.lastPosition.lat;
                    var zlon = wapco.lastPosition.lon;
                    var carWKT = 'POINT(' + zlon + ' ' + zlat + ')';
                    console.log(carWKT)
                    carPositionSource.clear();
                    addCarFeature(carPositionSource, carWKT);
//                    center = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
//                    view.animate({
//                        center: center,
//                        duration: 2000
//                    });

                    map.getView().setCenter(ol.proj.transform([zlon, zlat], config[3], 'EPSG:3857'));
//                    map.getView().setZoom(5);
//                    wapco.show_msg(wapco.msg.carLoc, "success");
                }
//                else if (wapco.lastFirePosition.point.toString() !== '0') {
//                    wapco.show_msg("نمایش نقشه در حالت اتومات است", "success");
//                }
                else {
//                    wapco.show_msg("مختصات خودرو یافت نشد", "warn");
                }
            }
            if (e === 2) {
                if (wapco.lastFirePosition.point.toString() !== '0') {
//                    wapco.show_msg(wapco.lastPosition.lat + '>>>' + wapco.lastPosition.lon+' >>>> 2');
//                    wapco.show_msg(wapco.lastFirePosition.point.toString(), 'warn');
                    var wktFormat = new ol.format.WKT();
                    var feature = wktFormat.readFeature(wapco.lastFirePosition.point.toString());
//                    , {
//                        dataProjection: config[3],
//                        featureProjection: 'EPSG:3857'
//                    });

                    var coord = feature.getGeometry().getCoordinates();
//                    center = ol.proj.transform(coord, config[3], 'EPSG:3857');
//                    view.animate({
//                        center: center,
//                        duration: 2000
//                    });
                    map.getView().setCenter(ol.proj.transform(coord, config[3], 'EPSG:3857'));
                    $('.address').slideDown();
                } else {
//                    wapco.show_msg("مختصات حادثه یافت نشد", "warn");
                }
            }
            if (e === 3) {
                if ((wapco.lastPosition.lon !== '0' && wapco.lastPosition.lat !== '0') && wapco.lastFirePosition.point.toString() !== '0') {
//                    wapco.show_msg(wapco.lastPosition.lat + '>>>' + wapco.lastPosition.lon+'>>>>'+wapco.lastFirePosition.point.toString()+' >>>> 3');
                    ////////////////////////fire
                    extentSource.clear();
                    addMyFeature(extentSource, wapco.lastFirePosition.point.toString());
                    ////////////////////////////////////car
                    var zlat = wapco.lastPosition.lat;
                    var zlon = wapco.lastPosition.lon;
                    var carWKT = 'POINT(' + zlon + ' ' + zlat + ')';
                    addCarFeature(extentSource, carWKT);
                    ///////////////zoom to extent
                    map.getView().fit([extentSource.getExtent()[0] - 150, extentSource.getExtent()[1] - 150, extentSource.getExtent()[2] + 150, extentSource.getExtent()[3] + 150], map.getSize()); // map.getSize()=914.601
//                    wapco.show_msg(extentSource.getExtent()[0], 'warn');
//                $('.address .content').html(addr);
//                $('.address').slideDown();
                }
            } else {
//                wapco.show_msg("مختصات حادثه یا خودرو مشخص نیست", "warn");
            }
        }
    },
    closePanel: function () {
        $('#sub-menu').fadeOut('fast', function () {
            $(this).css('display', 'none');
        });
    },
    openPanel: function () {
        $('#sub-menu').fadeIn('fast', function () {
            $(this).css('display', 'block');
        });
    },
    show_msg: function (e, a) {
        $.notify(e, {position: "top center", className: a});
    },
    toggleMabar: function () {
        mabarSource.clear();
        if (wapco.mabar) {
            wapco.show_msg('شهرشناسی غیر فعال شد', 'success');
            wapco.mabar = false;
        } else {
            wapco.show_msg('شهرشناسی فعال شد', 'success');
            wapco.mabar = true;
        }
    },
    setMabar: function (LINK_ID, LINK_NAME, CLOSED, DIRECT) {
        $.ajax({
            url: address,
            dataType: 'jsonp',
            async: true,
            data: {
                name: 'set mabar',
                LINK_ID: LINK_ID,
                LINK_NAME: LINK_NAME,
                CLOSED: CLOSED,
                DIRECT: DIRECT
            },
            success: function (result) {
                if (result.rows !== 0) {
                    wapco.show_msg(wapco.msg.setMabar.success, 'success');
//                    $('#popupMabar').hide();
                    $('#mabar').trigger('click');
                    $('#LINK_ID,#LINK_NAME').val('');
                    $('#CLOSED option:first-child').prop('selected', true);
                    // $('#DIRECT option:first-child').prop('selected', false);
                    mabarSource.clear();
                    wapco.getClosedMabar();
                } else {
                    wapco.show_msg(wapco.msg.setMabar.warning, 'warn');
                }
            },
            error: function () {
                wapco.show_msg(wapco.msg.setMabar.error, 'error');
            }
        });
    },
    getMabar: function (lon, lat) {
        mabarSource.clear();
        $.ajax({
            url: address,
            dataType: 'jsonp',
            async: true,
            data: {
                name: "get mabar",
                lon: lon,
                lat: lat
            },
            success: function (result) {
                if (result.WKT) {
                    $('#LINK_NAME').show();
                    $('#LINK_NAME_lbl').show();
                    addMyFeature(mabarSource, result.WKT);
                    $('#LINK_ID').val(result.LINK_ID);
                    if (result.LINK_NAME === "null" || result.LINK_NAME === "") {
                        // $('#LINK_NAME').css("display", "block");
                        //  $('#LINK_NAME_lbl').css("display", "block");
                        $('#LINK_NAME').val(""); //result.LINK_NAME);
                    } else {
                        $('#LINK_NAME').hide();
                        $('#LINK_NAME_lbl').hide();
                        $('#LINK_NAME').val(""); //result.LINK_NAME);

                    }
                    $('#CLOSED').val(result.CLOSED);
                    $('#DIRECT').val(result.DIRECT);
                    $('#mabar').trigger('click');
//                    $('#popupMabar').show();
                    wapco.show_msg(wapco.msg.getMabar.success, 'success');
                    //$('#id').hide();
                    // $('#id').show();
                } else {
                    wapco.show_msg(wapco.msg.getMabar.warning, 'warn');
                }
            },
            error: function () {
                wapco.show_msg(wapco.msg.getMabar.error, 'error');
            }
        });
    },
    getClosedMabar: function () {
        $.ajax({
            url: address,
            dataType: 'jsonp',
            async: true,
            data: {name: "get closed mabar"},
            success: function (result) {
                closedMabarSource.clear();
                if (result.length) {
                    for (var i = 0; i < result.length; i++) {
                        addMyFeature(closedMabarSource, result[i].WKT);
//                        console.log(result[i].LINK_NAME);
                    }
                    wapco.show_msg(wapco.msg.getClosedMabar.warning, 'warn');
                } else
                    wapco.show_msg(wapco.msg.getClosedMabar.success, 'success');
            },
            error: function () {
                wapco.show_msg(wapco.msg.getClosedMabar.error, 'error');
            }
        });
    },
    savePicture: function (image) {
        var station = wapco.station_id;
        var call_id = wapco.lastFirePosition.call_id;
        if (call_id != '0') {
            $.ajax({
                url: config[8],
                dataType: 'jsonp',
                async: true,
                data: {
                    name: "SavePicture",
                    call_id: call_id,
                    macaddress: mySerial,
//                    station: station,
                    image: image
                },
                success: function (data, textStatus, jqXHR) {
                    wapco.show_msg(wapco.msg.savePicture.success, 'success');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    wapco.show_msg(wapco.msg.savePicture.error, 'error');
                }
            });
        }
    },
    saveTime: function (e) {
        var field = e;
        var call_id = wapco.lastFirePosition.call_id;
        if (call_id == '0') {
            wapco.show_msg('در حال حاظر عملیاتی برای شما وجود ندارد', 'warn');
            return false;
        }
        var data = {
            name: 'saveTime',
            call_id: call_id,
            field: field
        };
        $.ajax({
            url: address,
            dataType: 'jsonp',
            async: true,
            data: data,
            success: function (result) {
                $('#' + field).val(result.time);
                wapco.show_msg('با موفقیت ذخیره شد', 'success');
            },
            error: function () {
                wapco.show_msg('زمان ذخیره نشد', 'error');
            }
        });
    }
};
var camera = {
    takeCanvas: function () {
        var call_id = wapco.lastFirePosition.call_id;
        context.drawImage(video, 0, 0, 160, 120);
        $.ajax({
            url: address,
            dataType: 'jsonp',
            async: true,
            data: {
                name: "SavePicture",
                image: canvas.toDataURL('image/webp'),
                MACADDRESS: mySerial,
                call_id: call_id
            }
        });
    },
    sendSample: function () {
        var call_id = wapco.lastFirePosition.call_id;
//        context.drawImage(video, 0, 0, 160, 120);
        $.ajax({
            url: address,
            dataType: 'jsonp',
            async: true,
            data: {
                name: "SavePicture",
                image: 'thisisimage',
                MACADDRESS: mySerial,
                call_id: call_id
            }
        });
    },
    takePicture: function () {
        navigator.camera.getPicture(function (imageURI) {
            camera.send('data:image/jpg;base64,' + imageURI);
//            $('#picture').css('background-image', 'url(data:image/jpg;base64,' + imageURI + ')').css('display', 'block');
//            $('#picture').children().first().attr('onclick', "camera.send('data:image/jpg;base64," + imageURI + "');");
        }, function (message) {
        }, {quality: 10, destinationType: Camera.DestinationType.DATA_URL, encodingType: Camera.EncodingType.JPEG});
        //destinationType: Camera.DestinationType.FILE_URI
    },
    send: function (imageURI) {
//        $('#picture').css('display', 'none');
        wapco.savePicture(imageURI);
    },
    cancel: function () {
        $('#picture').css('display', 'none');
    },
};
function clearWatch() {
    if (watchID !== null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
}
function toggleWatchPosition() {
    if (watchID) {
        clearWatch();
    } else {
        if (wapco.f === 0) {
            wapco.f = 1;
            wapco.show_msg(wapco.msg.startWatch, 'success');
        }
        var options = {
//frequency: 5000,
            maximumAge: 3000,
            timeout: 5000,
            enableHighAccuracy: true
        };
        //watchID = navigator.geolocation.watchPosition(wapco.getPosition, function (e) {
        watchID = navigator.geolocation.watchPosition(function () {
        }, function () {
        }, options);
    }
}
function addMyFeature(vectorSource, wkt) {
    var wktFormat = new ol.format.WKT();
    var feature = wktFormat.readFeature(wkt, {
        dataProjection: config[3],
        featureProjection: 'EPSG:3857'
    });
    vectorSource.addFeature(feature);
}
function addCarFeature(vectorSource, wkt) {
//    console.log(wkt)
    var wktFormat = new ol.format.WKT();
    var feature = wktFormat.readFeature(wkt, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
    vectorSource.addFeature(feature);
}

function wapcoDate() {
    var date = new Date();
    date.setUTCDate(15);
    var Year = date.getFullYear();
    var Month = date.getMonth() + 1;
    Month = (Month < 10 ? "0" + Month : Month);
    var Day = date.getDay();
    Day = (Day < 10 ? "0" + Day : Day);
    var Hour = date.getHours();
    Hour = (Hour < 10 ? "0" + Hour : Hour);
    var Minute = date.getMinutes();
    Minute = (Minute < 10 ? "0" + Minute : Minute);
    var Second = date.getSeconds();
    Second = (Second < 10 ? "0" + Second : Second);
    return Year + '-' + Month + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Second;
}
function info(url, data, success) {
    $.ajax({
        url: address.replace('tablet', url),
        dataType: 'jsonp',
        async: true,
        data: data,
        success: success
    });
}
////////toggle layer/////////
function toggleMap(newMap, element) {
//    $("checkbox-h-2a").addClass("ui-btn-active");
    $("label[for*='checkbox-h-2']").removeClass("ui-btn-active");

    if (newMap === "google") {
        map.removeLayer(layer_tile);
        layer_tile = new ol.layer.Tile({
            source: new ol.source.TileImage({url: 'http://khm{0-3}.googleapis.com/kh?v=742&hl=pl&&x={x}&y={y}&z={z}'})});
        map.getLayers().insertAt(0, layer_tile);
    } else if (newMap === "osm") {
        map.removeLayer(layer_tile);
        layer_tile = new ol.layer.Tile({source: new ol.source.OSM()});
        map.getLayers().insertAt(0, layer_tile);
    } else if (newMap === 'offline') {
        var url = "tiles/" + config[4] + "/{z}/{x}/{y}.png";
        map.removeLayer(layer_tile);
        layer_tile = new ol.layer.Tile({source: new ol.source.XYZ({url: url})});
        map.getLayers().insertAt(0, layer_tile);
    } else if (newMap === 'wapco') {
        map.removeLayer(layer_tile);
        layer_tile = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'http://217.219.86.84:808/geoserver/ffo/wms',
                params: {'LAYERS': 'ffo:ffo-mashhad', 'TILED': true, 'format': 'image/jpeg'},
                serverType: 'geoserver'
            })
        });
        map.getLayers().insertAt(0, layer_tile);
    } else if (newMap === 'onlineFFO') {
        if (config[4] === 'mashhad') {
            map.removeLayer(layer_tile);
            layer_tile = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://www.mapprocessor.com:9898/wapcoserver/aqrazavi/wms',
                    params: {'LAYERS': 'aqrazavi:wapco_iran_base_map', 'TILED': true, 'format': 'image/jpeg'},
                    serverType: 'geoserver'
                })
            });
            map.getLayers().insertAt(0, layer_tile);
        } else if (config[4] === 'shiraz') {
            map.removeLayer(layer_tile);
            layer_tile = new ol.layer.Tile({
//          extent: [59.1900291442871,36.1060066223145,59.8792152404785,36.5422706604004],
                source: new ol.source.TileWMS({
                    url: 'http://125.shiraz.ir/geoserver/fire125/wms',
                    params: {'LAYERS': 'fire125:shiraz_map_totalfire', 'TILED': true, 'format': 'image/jpeg'},
                    serverType: 'geoserver'
                })
            });
            map.getLayers().insertAt(0, layer_tile);
        } else if (config[4] === 'ahwaz') {
            layer_tile = new ol.layer.Tile({
//          extent: [59.1900291442871,36.1060066223145,59.8792152404785,36.5422706604004],
                source: new ol.source.TileWMS({
                    url: 'https://91.108.152.86/geoserver/ffo/wms',
                    params: {'LAYERS': 'ffo:ffo_ahwaz', 'TILED': true, 'format': 'image/jpeg'},
                    serverType: 'geoserver'
                })
            });
            map.getLayers().insertAt(0, layer_tile);
        } else if (config[4] === 'kashan') {
            layer_tile = new ol.layer.Tile({
//          extent: [59.1900291442871,36.1060066223145,59.8792152404785,36.5422706604004],
                source: new ol.source.TileWMS({
                    url: 'http://mahar.kashan.ir:801/wapcomaps/ffo/wms',
                    params: {'LAYERS': 'ffo:ffo_kashan', 'TILED': true, 'format': 'image/jpeg'},
                    serverType: 'geoserver'
                })
            });
            map.getLayers().insertAt(0, layer_tile);
        } else if (config[4] === 'yazd') {
            layer_tile = new ol.layer.Tile({
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
    }
    setTimeout(function () {
        $("label[for='" + element + "']").addClass("ui-btn-active");
    }, 300);
}

function getMachineId() {

    let machineId = localStorage.getItem('MachineId');

    if (!machineId) {
        machineId = crypto.randomUUID();
        localStorage.setItem('MachineId', machineId);
    }

    return machineId;
}

// convert radians to degrees
function radToDeg(rad) {
    return rad * 360 / (Math.PI * 2);
}
// convert degrees to radians
function degToRad(deg) {
    return deg * Math.PI * 2 / 360;
}
// modulo for negative values
function mod(n) {
    return ((n % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
}

function addPosition(position, heading, m, speed) {
    var x = position[0];
    var y = position[1];
    var fCoords = positions.getCoordinates();
    var previous = fCoords[fCoords.length - 1];
    var prevHeading = previous && previous[2];
    if (prevHeading) {
        var headingDiff = heading - mod(prevHeading);

        // force the rotation change to be less than 180°
        if (Math.abs(headingDiff) > Math.PI) {
            var sign = (headingDiff >= 0) ? 1 : -1;
            headingDiff = -sign * (2 * Math.PI - Math.abs(headingDiff));
        }
        heading = prevHeading + headingDiff;
    }
    positions.appendCoordinate([x, y, heading, m]);

    // only keep the 20 last coordinates
    positions.setCoordinates(positions.getCoordinates().slice(-20));

    // FIXME use speed instead
    if (heading && speed) {
        markerEl.src = 'assets/img/geolocation_marker_heading.png';
    } else {
        markerEl.src = 'assets/img/geolocation_marker.png';
    }
}

// recenters the view by putting the given coordinates at 3/4 from the top or
// the screen
function getCenterWithHeading(position, rotation, resolution) {
    var size = map.getSize();
    var height = size[1];

    return [
        position[0] - Math.sin(rotation) * height * resolution * 1 / 4,
        position[1] + Math.cos(rotation) * height * resolution * 1 / 4
    ];
}

var previousM = 0;
function updateView() {
    // use sampling period to get a smooth transition
    var m = Date.now() - deltaMean * 1.5;
    m = Math.max(m, previousM);
    previousM = m;
    // interpolate position along positions LineString
    var c = positions.getCoordinateAtM(m, true);
    if (c) {
        view.setCenter(getCenterWithHeading(c, -c[2], view.getResolution()));
        view.setRotation(-c[2]);
        marker.setPosition(c);
    }
}



function simulatePositionChange(position) {
    var coords = position.coords;
    geolocation.set('accuracy', coords.accuracy);
    geolocation.set('heading', degToRad(coords.heading));
    var position_ = [coords.longitude, coords.latitude];
    var projectedPosition = ol.proj.transform(position_, 'EPSG:4326',
            'EPSG:3857');
    geolocation.set('position', projectedPosition);
    geolocation.set('speed', coords.speed);
    geolocation.changed();
}

function disableButtons() {
    geolocateBtn.disabled = 'disabled';
    simulateBtn.disabled = 'disabled';
}