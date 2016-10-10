

/* global $, window */

$(function () {
    'use strict';

    var web_app = '/';                                                   // Name of a web application (usually in full IIS mode). Can be found in Properties/Web/Server/Project-Url. Example: http://localhost/Demo (Name of web application is "Demo")

    // We use the upload handler integrated into Backload:
    // In this example we set an objectContect (id) in the url query (or as form parameter). You can use a user id as 
    // objectContext give users only access to their own uploads. ObjectContext can also be set server side (See Custom Data Provider Demo).
    var url = web_app + 'Backload/FileHandler?objectContext=C5F260DD3787';

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        url: url,
        maxChunkSize: 5000000,                                           // Size of file chunks (data packets): 5MB. Note: In a real world scenario this depends on target infrastructure or use cases.
        acceptFileTypes: /(jpg)|(jpeg)|(png)|(gif)|(pdf)$/i              // Allowed file types
    })




    // Optional: Load existing files:
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
