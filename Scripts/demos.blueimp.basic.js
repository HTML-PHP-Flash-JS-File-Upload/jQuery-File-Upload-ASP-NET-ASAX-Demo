/*global window, $ */

$(function () {
    'use strict';

    // Name of a web application (usually in full IIS mode). Can be found in Properties/Web/Server/Project-Url. Example: http://localhost/Demo (Name of web application is "Demo")
    var web_app = '/';

    // We use the upload handler integrated into Backload:
    // In this example we set an objectContect (id) in the url query (or as form parameter). You can use a user id as 
    // objectContext give users only access to their own uploads. ObjectContext can also be set server side (See Custom Data Provider Demo, 2.2+).
    var url = web_app + 'Backload/FileHandler?objectContext=C5F260DD3787';


    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        url: url,
        dataType: 'json'
    })

        // if the following init method call causes problems bind event handlers manually 
        // like in blueimps basic example (https://blueimp.github.io/jQuery-File-Upload/basic.html)
    .data('blueimp-fileupload').initTheme("Basic");
});
