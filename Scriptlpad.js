// Add this to your QlikSense load script to make use of the Excel Uploader extension

// Create variable for Excel file path if it doesn't exist
LET vExcelFilePath = '';

// Main load script section that will use the Excel file path from the extension
//SECTION ACCESS;
//SECTION APPLICATION;

// Clear previous data
TRACE Starting data reload from Excel file: $(vExcelFilePath);
DROP TABLE IF EXISTS ExcelData;

// Check if the Excel file path is set
IF len('$(vExcelFilePath)') > 0 THEN
    // Load data from Excel file
    ExcelData:
    LOAD 
        *
    FROM [lib://DataConnections/$(vExcelFilePath)]
    (ooxml, embedded labels, table is Sheet1);
    
    TRACE Excel data loaded successfully;
ELSE
    // Load sample or default data if no Excel file is specified
    TRACE No Excel file specified, loading default data;
    
    ExcelData:
    LOAD * INLINE [
        Field1, Field2, Field3
        'Sample', 123, 456
    ];
END IF
