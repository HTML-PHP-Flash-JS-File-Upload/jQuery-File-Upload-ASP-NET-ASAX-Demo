
/* global $, window */

$(function () {
    'use strict';

    var web_app = '/';                                                   // Name of a web application (usually in full IIS mode). Can be found in Properties/Web/Server/Project-Url. Example: http://localhost/Demo (Name of web application is "Demo")

    // We use the upload handler integrated into Backload:
    // In this example we set an objectContect (id) in the url query (or as form parameter). You can use a user id as 
    // objectContext give users only access to their own uploads. ObjectContext can also be set server side (See Custom Data Provider Demo).
    var url = web_app + 'Backload/FileHandler?objectContext=C5F260DD3787';
    var msg_resume = ' bytes already uploaded. To resume upload click start';

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        url: url,
        maxChunkSize: 5000000,                                           // Size of file chunks (data packets): 5MB. Note: In a real world scenario this depends on target infrastructure or use cases.
        acceptFileTypes: /(jpg)|(jpeg)|(png)|(gif)|(pdf)$/i,             // Allowed file types

        // the add function is called immediately after a file was added to the client ui list, but not uploaded so far.
        add: function (e, data) {
            var that = this;

            // "getFileInfo" requests meta data for the file just added to the client ui list from the server.
            //   execute: getFileInfo({filename}) (get file or chunk meta data); 
            //   ts: timestamp (prevents caching)
            $.getJSON(url, { execute: "getFileInfo(" + data.files[0].name + ")", ts: e.timeStamp },
                // Server response
                function (result) {
                    var uuid = data.files[0].size.toString(16);                                             // Create new uuid based on the file size or any other value like user id, etc
                    
                    if (result.files.length > 0) {                                                          // If result.files.length is 0 no previous partial uploads
                        for (var i = 0; i < result.files.length; i++) {                                     // Iterate over the list of partial uploads for this file name, usually only one exist
                            var file = result.files[i];
                            if ((file.extra.chunkInfo != null) && (file.extra.chunkInfo.uuid == uuid)) {    // if chunkinfo is not null and has the same uuid we can resume the upload
                                data.uploadedBytes = file.extra.chunkInfo.uploadedSize;                     // Set number of bytes already uploaded
                                alert(file.extra.chunkInfo.uploadedSize + msg_resume);
                            } else if (data.files[0].size == file.size) {                                   // if true, file already uploaded
                                if (!confirm('File already uploaded. Overwrite anyway?')) {
                                    return;                                                                 // Do not add file to list, because file is already fully uploaded
                                }
                            }
                        }
                    }

                    data.formData = { 'uuid': uuid };                                                       // When uploading the file, the uuid prevents the file to be overwritten by a file with different size
                    $.blueimp.fileupload.prototype.options.add.call(that, e, data);                         // Add file with the uuid as form parameter to client ui list 
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
