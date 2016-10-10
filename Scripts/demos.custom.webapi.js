
/* global $, window */

$(function () {
    'use strict';

    // Name of a web application (usually in full IIS mode). Can be found in Properties/Web/Server/Project-Url. Example: http://localhost/Demo (Name of web application is "Demo")
    var web_app = '/';

    // We use a Web Api controller:
    // In this example we set an objectContect (id) in the url query (or as form parameter).
    // You can use a user id as objectContext give users only access to their own uploads.
    var url = web_app + 'api/FileHandler?objectContext=C5F260DD3787';


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
