/*jslint unparam: true */
/*global window, $ */
$(function () {
    'use strict';
    // Name of a web application (usually in full IIS mode). Can be found in Properties/Web/Server/Project-Url. Example: http://localhost/Demo (Name of web application is "Demo")
    var web_app = '/';

    // We use the upload handler integrated into Backload:
    var url = web_app + 'Backload/FileHandler';


    var uploader = new qq.FineUploader({
        element: document.getElementById("fine-uploader"),
        template: 'qq-template',
        request: {
            endpoint: url,
            params: {                                                                       // Send a plugin param or set Fine Uploader in 
                plugin: "FineUploader",                                                     // Web.Backload.config as the default client plugin                                                    
                objectContext: "030357B624D9"
            }
        },

        session: {                                                                          // Initial GET request to load existing files
            endpoint: url,
            params: {                                                                       // Send a plugin param or set Fine Uploader in 
                plugin: "FineUploader",                                                     // Web.Backload.config as the default client plugin                                                      
                objectContext: "030357B624D9"
            }
        },

        deleteFile: {
            enabled: true                                                                   // Enable file delete
        },

        chunking: {
            enabled: true,                                                                  // true to enable file chunking
            partSize: 10000000                                                              // 10MB chunks (usually to small, but this is a demo)
        },

        validation: {
            allowedExtensions: ['jpeg', 'jpg', 'gif', 'png', 'pdf']
        },

        callbacks: {
            onComplete: function (id, name, response, xhr) {
                if ((response) && (response.success)) {
                    this.setDeleteFileEndpoint(response.deleteFileEndpoint, id);            // Set the deleteFileEndpoint adress
                }
            }
        }
    });
});
