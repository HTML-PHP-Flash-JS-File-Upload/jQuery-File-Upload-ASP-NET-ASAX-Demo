
/* jshint nomen:false */
/* global window, angular */

(function () {
    'use strict';

    // Name of a web application (usually in full IIS mode). Can be found in Properties/Web/Server/Project-Url. Example: http://localhost/Demo (Name of web application is "Demo")
    var web_app = '/';

    // We use the upload handler integrated into Backload:
    // In this example we set an objectContect (id) in the url query (or as form parameter). You can use a user id as 
    // objectContext give users only access to their own uploads. ObjectContext can also be set server side (See Custom Data Provider Demo, 2.2+).
    var url = web_app + 'Backload/FileHandler?objectContext=C5F260DD3787';


    angular.module('demo', [
        'blueimp.fileupload'
    ])
        .config([
            '$httpProvider', 'fileUploadProvider',
            function ($httpProvider, fileUploadProvider) {
                delete $httpProvider.defaults.headers.common['X-Requested-With'];
            }
        ])

        .controller('DemoFileUploadController', [
            '$scope', '$http', '$filter', '$window',
            function ($scope, $http) {
                $scope.options = {
                    url: url
                };
                $scope.loadingFiles = true;
                $http.get(url)
					.then(
						function (response) {
						    $scope.loadingFiles = false;
						    $scope.queue = response.data.files || [];
						},
						function () {
						    $scope.loadingFiles = false;
						}
					);
            }
        ])

        .controller('FileDestroyController', [
            '$scope', '$http',
            function ($scope, $http) {
                var file = $scope.file,
                    state;
                if (file.url) {
                    file.$state = function () {
                        return state;
                    };
                    file.$destroy = function () {
                        state = 'pending';
                        return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                        }).then(
                            function () {
                                state = 'resolved';
                                $scope.clear(file);
                            },
                            function () {
                                state = 'rejected';
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
                }
            }
        ]);

}());
