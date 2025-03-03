/*
* QlikSense Excel Uploader Extension
* This extension allows users to upload Excel files, store them in QlikSense folder structure,
* and trigger a reload to update the application with the new data.
*/

define([
    "jquery",
    "qlik",
    "css!./style.css",
    "./properties",
    "text!./template.html"
],
function($, qlik, css, properties, template) {
    'use strict';

    return {
        template: template,
        support: {
            snapshot: false,
            export: false,
            exportData: false
        },
        definition: properties,
        initialProperties: {
            version: 1.0,
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 10,
                    qHeight: 50
                }]
            }
        },
        paint: function($element, layout) {
            // Return the promise to render the extension
            return qlik.Promise.resolve();
        },
        controller: ['$scope', '$element', function($scope, $element) {
            // Get the app reference
            $scope.app = qlik.currApp();
            
            // Initialize variables
            $scope.fileName = "";
            $scope.uploading = false;
            $scope.storageFolder = $scope.layout.storageFolder || "ExcelUploads";
            $scope.uploadSuccess = false;
            $scope.uploadError = false;
            $scope.errorMessage = "";
            $scope.reloading = false;
            $scope.reloadSuccess = false;
            $scope.reloadError = false;
            
            // Handle file selection
            $scope.handleFileSelect = function(evt) {
                var files = evt.target.files;
                if (files.length > 0) {
                    $scope.selectedFile = files[0];
                    $scope.fileName = files[0].name;
                    $scope.$apply();
                }
            };
            
            // Upload and store the file
            $scope.uploadFile = function() {
                if (!$scope.selectedFile) {
                    $scope.uploadError = true;
                    $scope.errorMessage = "Please select a file first";
                    return;
                }
                
                $scope.uploading = true;
                $scope.uploadSuccess = false;
                $scope.uploadError = false;
                
                // Create FormData object for the file upload
                var formData = new FormData();
                formData.append('file', $scope.selectedFile);
                formData.append('folder', $scope.storageFolder);
                
                // Get the Qlik server base URL
                var baseUrl = window.location.origin;
                var appId = qlik.currApp().id;
                
                // Use the QlikSense REST API for file upload
                $.ajax({
                    url: baseUrl + '/api/v1/file-upload',
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    headers: {
                        'qlik-csrf-token': qlik.getGlobal().session.attributes.csrfToken
                    },
                    success: function(data) {
                        $scope.uploading = false;
                        $scope.uploadSuccess = true;
                        
                        // Set a variable in Qlik with the file path
                        var filePath = $scope.storageFolder + "/" + $scope.fileName;
                        $scope.app.variable.setContent('vExcelFilePath', filePath);
                        
                        $scope.$apply();
                    },
                    error: function(error) {
                        $scope.uploading = false;
                        $scope.uploadError = true;
                        $scope.errorMessage = "Error uploading file: " + (error.responseText || "Unknown error");
                        $scope.$apply();
                    }
                });
            };
            
            // Trigger a reload of the app
            $scope.reloadApp = function() {
                if (!$scope.uploadSuccess) {
                    $scope.reloadError = true;
                    $scope.errorMessage = "Please upload a file first";
                    return;
                }
                
                $scope.reloading = true;
                $scope.reloadSuccess = false;
                $scope.reloadError = false;
                
                // Trigger a partial reload of the app
                $scope.app.doReload().then(function(success) {
                    $scope.reloading = false;
                    if (success) {
                        $scope.reloadSuccess = true;
                        
                        // After successful reload, refresh all objects in the app
                        qlik.callRepository('/qrs/app/full', 'POST', { id: $scope.app.id }).then(function() {
                            // Refresh all visualizations
                            qlik.getObjectList().then(function(list) {
                                list.forEach(function(item) {
                                    qlik.get(item.id).then(function(obj) {
                                        obj.refreshView();
                                    });
                                });
                            });
                        });
                    } else {
                        $scope.reloadError = true;
                        $scope.errorMessage = "Error reloading the app";
                    }
                    $scope.$apply();
                }).catch(function(error) {
                    $scope.reloading = false;
                    $scope.reloadError = true;
                    $scope.errorMessage = "Error reloading the app: " + (error.message || "Unknown error");
                    $scope.$apply();
                });
            };
            
            // Initialize file input element
            $element.find('#fileInput').on('change', $scope.handleFileSelect);
        }]
    };
});
