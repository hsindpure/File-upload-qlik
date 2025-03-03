/**
 * Properties definition for the Excel Uploader extension
 */
define([], function() {
    'use strict';
    
    // Properties panel definition
    return {
        type: "items",
        component: "accordion",
        items: {
            settings: {
                uses: "settings",
                items: {
                    excelSettings: {
                        type: "items",
                        label: "Excel Uploader Settings",
                        items: {
                            variableName: {
                                ref: "props.variableName",
                                label: "Excel File Path Variable",
                                type: "string",
                                defaultValue: "vExcelFilePath",
                                expression: "optional"
                            },
                            reloadLabel: {
                                ref: "props.reloadLabel",
                                label: "Reload Button Text",
                                type: "string",
                                defaultValue: "Reload Data",
                                expression: "optional"
                            },
                            uploadLabel: {
                                ref: "props.uploadLabel",
                                label: "Upload Button Text",
                                type: "string",
                                defaultValue: "Choose Excel File",
                                expression: "optional"
                            }
                        }
                    }
                }
            }
        }
    };
});
