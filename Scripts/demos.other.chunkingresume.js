
/* global $, window */

$(function () {
    'use strict';

    var web_app = '/';                                                   // Name of a web application (usually in full IIS mode). Can be found in Properties/Web/Server/Project-Url. Example: http://localhost/Demo (Name of web application is "Demo")

    // We use the upload handler integrated into Backload:
    // In this example we set an objectContect (id) in the url query (or as form parameter). You can use a user id as 
    // objectContext give users only access to their own uploads. ObjectContext can also be set server side (See Custom Data Provider Demo).
    var url = web_app + 'Backload/FileHandler?objectContext=C5F260DD3787';
    var msg_resume =  ' bytes already uploaded. To resume upload click start';
    ''
    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        url: url,
        maxChunkSize: 5000000,                                           // Size of file chunks (data packets): 5MB. Note: In a real world scenario this depends on target infrastructure or use cases.
        acceptFileTypes: /(jpg)|(jpeg)|(png)|(gif)|(pdf)$/i,             // Allowed file types

        
        // Optional: Resume a partially uploaded chunked file of a previous upload attempt
        add: function (e, data) {
            var that = this;

            // "getFileInfo" requests meta data for the file just added to the client ui list from the server.
            //   execute: getFileInfo({filename}) (get file or chunk meta data); 
            //   ts: timestamp (prevents caching)
            $.getJSON(url, { execute: "getFileInfo(" + data.files[0].name + ")", t: e.timeStamp },
                // Server response
                function (result) {
                    // Response: If result.files.length == 0 or chunkInfo == null no pervious partial uploads
                    if (result.files.length > 0) {                                               // If result.files.length is 0 no previous partial uploads
                        var chunkInfo = result.files[0].extra.chunkInfo;
                        if (chunkInfo != null) {                                                 // To resume a partially uploaded file,
                            data.uploadedBytes = chunkInfo.uploadedSize;                         // set the length of bytes already uploaded
                            alert(chunkInfo.uploadedSize + msg_resume);
                        } else if (data.files[0].size == result.files[0].size) {                 // If true, file already uploaded
                            return;                                                              // Do not add file to list and return silently
                        }
                    }

                    $.blueimp.fileupload.prototype.options.add.call(that, e, data);              // Add file with updated data to list in the ui 
                }) 
        }
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
