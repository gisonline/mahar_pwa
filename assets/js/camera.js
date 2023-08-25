/// take picture from cameras
var takeOrselect;
$('#but_take').click(function () {
    if (wapco.selected_call_id == 0 || !wapco.selected_call_id) {
        wapco.show_msg('عملیات فعال وجود ندارد. لطفاشماره عملیات را انتخاب نمایید', 'warn');
        $.ajax({
            url: config[5],
            dataType: 'jsonp',
            data: {name: "getActionsList", MACADDRESS: mySerial},
            success: function (e) {
                var opts = '<option value="">انتخاب کنید</option>';
                for (i = 0; i < e.length; i++) {
                    opts += '<option value="' + e[i].call_id + '">' + e[i].call_id + '[' + e[i].call_addr + ']</option>';
                }
                $("#actionNumber").empty();
                $("#actionNumber").append(opts);
                $('#actionsList').trigger('click');
                takeOrselect = $('#but_take');
            }
        });
    } else {
        navigator.camera.getPicture(onSuccessUp, onFailUp, 
        {
            quality: 20,
            encodingType: Camera.EncodingType.JPEG,
            sourceType : Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.DATA_URL
        });
    }
});

// upload select 
$("#but_select").click(function () {
    if (wapco.selected_call_id == 0 || !wapco.selected_call_id) {
        wapco.show_msg('عملیات فعال وجود ندارد. لطفاشماره عملیات را انتخاب نمایید', 'warn');
        $.ajax({
            url: config[5],
            dataType: 'jsonp',
            data: {name: "getActionsList", MACADDRESS: mySerial},
            success: function (e) {
                var opts = '<option value="">انتخاب کنید</option>';
                for (i = 0; i < e.length; i++) {
                    opts += '<option value="' + e[i].call_id + '">' + e[i].call_id + '[' + e[i].call_addr + ']</option>';
                }
                $("#actionNumber").empty();
                $("#actionNumber").append(opts);
                $('#actionsList').trigger('click');
                takeOrselect = $('#but_select');
            }
        });
    } else {
        navigator.camera.getPicture(onSuccessUp, onFailUp, 
        {
            quality: 50,
            encodingType: Camera.EncodingType.JPEG,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            allowEdit: true,
            destinationType: Camera.DestinationType.DATA_URL
        });
    }
});

//$("#actionNumber").change(function () {
//    selected_call_id = $("#actionNumber").val();
//});
$("#popupActionsListBtn").on('click', function () {
    var cid = $("#actionNumber").val();
    if (cid && cid != '') {
        wapco.selected_call_id = $("#actionNumber").val();
        $('#closePopupActionsList').trigger('click');
        takeOrselect.trigger('click');
    } else {
        wapco.show_msg('لطفا با دقت شماره عملیات را انتخاب نمایید!', 'error');
    }
});

// Change image source and upload photo to server
function onSuccessUp(imageURI) {
    // Set image source
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1) + '.png';
    options.mimeType = "text/plain";

    var params = {};
    params.MACADDRESS = wapco.MAC;
    params.call_id = wapco.selected_call_id;

    options.params = params;
    options.chunkedMode = false;
    options.headers = {
        Connection: "close"
    };
    if (wapco.selected_call_id != 0) {
        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI(config[8]), function (result) {
            wapco.show_msg('تصویر با موفقیت بارگزاری شد', 'success');
            wapco.selected_call_id = wapco.lastFirePosition.call_id;
        }, function (error) {
            wapco.show_msg('تصویر ارسال نشد!', 'error');
            wapco.show_msg(error.code, 'error');
        }, options, true);
    } else {
        wapco.show_msg('خطا در دریافت شناسه عملیات!', 'error');
    }
}
function onFailUp(error) {
//    wapco.show_msg('تصویر ارسال نشد!', 'error');
    wapco.show_msg(error.code, 'error');
}