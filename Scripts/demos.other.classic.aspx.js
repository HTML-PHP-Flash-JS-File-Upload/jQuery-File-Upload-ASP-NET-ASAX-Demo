
/* global $, window */

$(function () {
    'use strict';

    // Name of a web application (usually in full IIS mode). Can be found in Properties/Web/Server/Project-Url. Example: http://localhost/Demo (Name of web application is "Demo")
    var web_app = '/';

    // In this example we use a custom Generic Handler
    // We send an objectCOntext parameter which can be a user id. The server side component is configured 
    // to accept requests only if this parameter is send with the request (see Web.Backload.config)
    var url = web_app + 'Other/Handler/FileHandler.ashx?objectContext=C5F260DD3787';


    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        url: url,
        acceptFileTypes: /(jpg)|(jpeg)|(png)|(gif)|(pdf)$/i              // Allowed file types
    })


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
