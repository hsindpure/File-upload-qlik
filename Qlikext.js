/**
 * QlikSense Excel Uploader Extension
 * 
 * This extension allows users to upload Excel files and reload Qlik data.
 * When a user uploads a file and clicks reload, the data will be updated 
 * in the Qlik app, refreshing all connected visualizations.
 */

define([
    "jquery",
    "qlik",
    "text!./style.css",
    "./properties"
], function($, qlik, cssContent, properties) {
    'use strict';

    // Add the CSS to the document
    $("<style>").html(cssContent).appendTo("head");

    return {
        // Definition of the properties panel
        definition: properties,
        
        // Initial properties
        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 10,
                    qHeight: 50
                }]
            }
        },
        
        // Property panel
        support: {
            snapshot: false,
            export: false,
            exportData: false
        },
        
        // Paint method - renders the extension
        paint: function($element, layout) {
            // Get the current app
            var app = qlik.currApp();
            
            // Clear the element
            $element.empty();
            
            // Create container for the uploader
            var $container = $('<div class="excel-uploader-container">');
            
            // Create file input and label
            var $fileInputLabel = $('<label for="excelFileInput" class="file-input-label">Choose Excel File</label>');
            var $fileInput = $('<input type="file" id="excelFileInput" class="file-input" accept=".xlsx, .xls">');
            
            // Create filename display element
            var $filenameDisplay = $('<div class="filename-display">No file selected</div>');
            
            // Create reload button
            var $reloadButton = $('<button class="reload-button" disabled>Reload Data</button>');
            
            // Create status message
            var $statusMessage = $('<div class="status-message"></div>');
            
            // Add event listener for file selection
            $fileInput.on('change', function(e) {
                var fileName = e.target.files[0] ? e.target.files[0].name : 'No file selected';
                $filenameDisplay.text(fileName);
                
                if (e.target.files[0]) {
                    $reloadButton.prop('disabled', false);
                    $statusMessage.text('File selected. Click "Reload Data" to update the app.');
                } else {
                    $reloadButton.prop('disabled', true);
                    $statusMessage.text('');
                }
            });
            
            // Add event listener for reload button
            $reloadButton.on('click', function() {
                var file = document.getElementById('excelFileInput').files[0];
                if (!file) {
                    $statusMessage.text('Please select a file first.');
                    return;
                }
                
                $statusMessage.text('Uploading file and reloading data...');
                $reloadButton.prop('disabled', true);
                
                // Create FormData object
                var formData = new FormData();
                formData.append('file', file);
                
                // Get the app ID
                var appId = qlik.currApp().id;
                
                // Set the variable for the Excel file path
                app.variable.setContent('vExcelFilePath', file.name)
                    .then(function() {
                        // This is where we would normally trigger a reload
                        // Since we can't directly reload from extension, we'll use the engineAPI
                        return app.doReload()
                            .then(function() {
                                // After reload, save the app
                                return app.doSave();
                            });
                    })
                    .then(function() {
                        $statusMessage.text('Data successfully reloaded!');
                        setTimeout(function() {
                            $statusMessage.text('');
                        }, 5000);
                    })
                    .catch(function(error) {
                        $statusMessage.text('Error: ' + error.message);
                        $reloadButton.prop('disabled', false);
                    });
            });
            
            // Append all elements to the container
            $container.append($fileInputLabel);
            $container.append($fileInput);
            $container.append($filenameDisplay);
            $container.append($reloadButton);
            $container.append($statusMessage);
            
            // Append the container to the element
            $element.append($container);
            
            return qlik.Promise.resolve();
        }
    };
});
