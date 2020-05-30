/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope Public
 */
define([
    'N/runtime',
    'N/record',
    'N/file'
], (runtime, record, file) => {
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type
     */
    var objScheduledScript = {};
	 
	
    objScheduledScript.execute = (scriptContext) => {
        //Get Script Parameters
        const objScript = runtime.getCurrentScript();
        const objParams = objScript.getParameter({name: 'custparam_parameters'});
        /**
         * This is the base64 encoded contents of the jpg. You will need to convert
         * to get the file cabinet to accept it. NS is wierd 
         * Something like this might be helpful on the client 
         * https://www.npmjs.com/package/react-file-base64
         */
        var myJPGContents = objParams.your_image_param;

        if(!myJPG){
            return;
        }
        
        try {
            
            //Variable for datetime
            var objDate = new Date();
            
            //Creation of file
            /**
             * Important thing here is the folder ID. 
             * You have to have this. A trick is to 
             * create a saved search that returns the folder id
             * by filtering for the name and create a param
             * for it on the script.
             */
            var objFile = file.create({
                //To make each file unique and avoid overwriting, append date on the title
                name: 'FILE_NAME - ' + objDate.toLocaleDateString() +'.jpg',
                fileType: file.Type.JPGIMAGE, //NS File Type
                contents: myJPGContents,
                description: 'FILE_DESCRIPTION',
                encoding: file.Encoding.UTF8,
                folder: 'YOURFOLDERID'
            });

            //Save the CSV file
            var stFileId = objFile.save();
            log.debug('File ID...', stFileId);

            if(!stFileId) {
                return;
            }
            /**
             * Now you just create the record and save the file
             * ID for the jpg to the field type document
             */
            var objContainer = record.create({
                type: 'customrecord_sample_file_container',
                isDynamic: true
            });
            objContainer.setValue({
                fieldId: 'custrecord_sample_file_field',
                value: stFileId
            });
            objContainer.save();

        } catch(e){

            log.debug('Error', e);
        }
    }
    return objScheduledScript;
});