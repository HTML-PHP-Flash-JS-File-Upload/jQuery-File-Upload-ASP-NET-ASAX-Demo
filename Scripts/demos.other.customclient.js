

/* global $, window */

$(function () {
    'use strict';

    // In this example we use the integrated controller
    var url = '/Backload/FileHandler?objectContext=C5F260DD3787';

    function uploadFiles(formData) {
        resetProgress();

        // Prepare Ajax request
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onreadystatechange = function (e, s) {
            // readyState 4 is a finished request
            if (xhr.readyState == 4) {
                progressBar.className = "hidden";
                responseCode.textContent = xhr.status + " " + xhr.statusText;
                spinner.className = "hidden";

                if (xhr.status == 200) {
                    var json = JSON.parse(xhr.responseText);
                    displayResult(json);
                } else {
                    responseText.textContent = xhr.responseText;
                }
            }
        };

        xhr.onerror = function (e) {
            // Do some error handling
        };

        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                progressBar.value = (e.loaded / e.total) * 100;
                //progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
            }
        };


        xhr.send(formData);  // multipart/form-data
    }


    // Fires when a file is selected
    document.querySelector('input[type="file"]').addEventListener('change', function (e) {
        var formData = new FormData();

        // Read file into form
        for (var i = 0, file; file = this.files[i]; ++i) {
            formData.append(file.name, file);
        }

        uploadFiles(formData);
    }, false);





    // Clear and display Json result. This is not a core function.

    var progressBar = document.querySelector('progress');
    var responseCode = document.querySelector('#responsecode');
    var spinner = document.querySelector('#spinner');
    var container = document.querySelector('.custom_client_demo');

    function resetProgress() {
        progressBar.value = 0;
        progressBar.textContent = "0"; // Fallback for unsupported browsers.
        progressBar.className="shown";
        spinner.className = "shown";
        responseCode.textContent = "";

        var responseText = document.querySelector('pre');
        if (typeof responseText !== 'undefined') container.removeChild(responseText);
    }


    function displayResult(response)
    {
        var formatted = prettyPrintJson(response);
        container.appendChild(document.createElement('pre')).innerHTML = formatted;
    }


    function prettyPrintJson(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }

            if (match.indexOf('data:image') != -1) match = match.substr(0, 100) + '[...]';
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
});
