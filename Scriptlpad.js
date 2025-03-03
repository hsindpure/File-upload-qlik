<div class="excel-uploader-extension">
    <div class="container">
        <h2>Excel Data Uploader</h2>
        
        <div class="upload-section">
            <div class="file-input-container">
                <input type="file" id="fileInput" accept=".xlsx,.xls" />
                <label for="fileInput" class="file-input-label">
                    <span ng-if="!fileName">Choose Excel File</span>
                    <span ng-if="fileName">{{fileName}}</span>
                </label>
            </div>
            
            <div class="button-container">
                <button class="store-button" ng-click="uploadFile()" ng-disabled="uploading || !fileName">
                    <span ng-if="!uploading">Store File</span>
                    <span ng-if="uploading">Storing...</span>
                </button>
                
                <button class="reload-button" ng-click="reloadApp()" ng-disabled="reloading || !uploadSuccess">
                    <span ng-if="!reloading">Reload Data</span>
                    <span ng-if="reloading">Reloading...</span>
                </button>
            </div>
        </div>
        
        <div class="status-section">
            <!-- Upload Status -->
            <div class="status-message success" ng-if="uploadSuccess">
                File uploaded successfully!
            </div>
            
            <div class="status-message error" ng-if="uploadError">
                Error: {{errorMessage}}
            </div>
            
            <!-- Reload Status -->
            <div class="status-message success" ng-if="reloadSuccess">
                Data reloaded successfully! Charts will update automatically.
            </div>
            
            <div class="status-message error" ng-if="reloadError">
                Reload Error: {{errorMessage}}
            </div>
        </div>
    </div>
</div>
