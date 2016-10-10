

/* global $, window */

$(function () {
    'use strict';

    // Name of a web application (usually in full IIS mode). Can be found in Properties/Web/Server/Project-Url. Example: http://localhost/Demo (Name of web application is "Demo")
    var web_app = '/';

    // We use a custom file handler:
    // In this example we set an objectContect (id) in the url query (or as form parameter). You can use a user id as 
    // objectContext give users only access to their own uploads. ObjectContext can also be set server side (See Custom Data Provider Demo, 2.2+).
    var url = web_app + 'CustomPostProcessing/FileHandler?objectContext=C5F260DD3787';


    var uploadFailed = false;

    // Initialize the jQuery File Upload widget:
    var uploader = $('#fileupload').fileupload({
        url: url,
        acceptFileTypes: /(jpg)|(jpeg)|(png)|(gif)|(pdf)$/i                 // Allowed file types
    })

    // The 'fileuploadstop' event will be fired when uploads are finished, canceled or an error occured
    .bind('fileuploadstop', function (e, data) {
        if (!uploadFailed) {
            var auto = $('input[name="autoprocess"]')[0].checked;
            if (auto) {
                startPostProcessing();
            }
        }
        uploadFailed = false;
    })

    // The 'fileuploadfail' event will be fired, when an upload is canceled or an error occured
    .bind('fileuploadfail', function (e, data) {
        uploadFailed = true;
    });


    // Trigger post processing manually
    $('#start-processing').bind('click', function () {
        startPostProcessing();
    })


    // Start poat processing by an ajax call to the server
    function startPostProcessing() {
        // Disable ui during request
        $('#fileupload').addClass('fileupload-processing');
        $('#fileupload').fileupload('disable');

        // Trigger post processing event on server side
        // Make sure the url also contains objectContext and/or uploadContext if used in previous file uploads.
        // Parameter t prevents caching of the ajax request
        // Note: In this demo 2 parameters are included in the postprocess() server side method call. This is 
        // not neccessary but we can catch these parameters within the server side event handler to trigger the operations
        // like shown in this demo (see server side event handler).
        var sep = (url.indexOf('?') == -1) ? '?' : '&';
        var archiveFiles = true;
        var deleteFiles = $('input[name="autodelete"]')[0].checked;
        var execute = 'execute=postprocess(' + archiveFiles + ',' + deleteFiles + ')';
        var t = '&t=' + Math.random().toString(36).substr(2, 8);
        $.getJSON(url + sep + execute + t, function (result) {
            // Server response after post processing
            $('#servermessage').text(result.message);
            if (result.success) {
                $('#downloadurl').attr('href', result.url).text(result.name);
                $('#servertime').text(result.created);

                // remove files from ui (with animation ;))
                $('span#filesdeleted').text(result.deleted);
                if (result.deleted) {
                    $('table.table-striped').fadeOut(500, function () {
                        $('tr.template-download, tr.template-upload').remove();
                        $('table.table-striped').show();
                    });
                }
            } else {
                $('#downloadurl').attr('href', '#').text('');
                $('#servertime').text('');
            }

            // Enable ui after response
            $('#fileupload').fileupload('enable');
            $('#fileupload').removeClass('fileupload-processing');
        })
    }



    // Load existing files:
    $('#fileupload').addClass('fileupload-processing');
    $.ajax({
        // Uncomment the following to send cross-domain cookies:
        // xhrFields: {withCredentials: true},
        url: url,
        dataType: 'json',
        context: $('#fileupload')[0]
    }).always(function () {
        $(this).removeClass('fileupload-processing');
    }).done(function (result) {
        $(this).fileupload('option', 'done')
            .call(this, $.Event('done'), { result: result });
    });
});
