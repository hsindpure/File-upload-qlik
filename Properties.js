define([], function() {
    'use strict';
    
    // Define the properties panel for this extension
    return {
        type: "items",
        component: "accordion",
        items: {
            settings: {
                uses: "settings",
                items: {
                    storageSettings: {
                        type: "items",
                        label: "Storage Settings",
                        items: {
                            storageFolder: {
                                ref: "storageFolder",
                                label: "Storage Folder",
                                type: "string",
                                defaultValue: "ExcelUploads",
                                expression: "optional"
                            },
                            filePathVariable: {
                                ref: "filePathVariable",
                                label: "File Path Variable",
                                type: "string",
                                defaultValue: "vExcelFilePath",
                                expression: "optional",
                                description: "Variable name that will store the uploaded file path"
                            }
                        }
                    },
                    reloadSettings: {
                        type: "items",
                        label: "Reload Settings",
                        items: {
                            autoReload: {
                                ref: "autoReload",
                                label: "Auto Reload After Upload",
                                type: "boolean",
                                defaultValue: false
                            },
                            partialReload: {
                                ref: "partialReload",
                                label: "Use Partial Reload",
                                type: "boolean",
                                defaultValue: true
                            }
                        }
                    }
                }
            }
        }
    };
});
