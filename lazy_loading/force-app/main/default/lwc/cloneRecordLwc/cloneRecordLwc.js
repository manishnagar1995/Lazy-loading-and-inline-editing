import { LightningElement, api, track, wire } from 'lwc';
import getData from '@salesforce/apex/LEX_CloneRecordController.getData';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
//import { getObjectInfo } from 'lightning/uiObjectInfoApi';
//import { getRecord } from 'lightning/uiRecordApi';

export default class CloneRecordLwc extends NavigationMixin(LightningElement) {

    @api objectApiName = 'Case';
    @api recordId ;
    //@track objectInfo;
    @api buttonLabel = 'Clone Record';
    @api parentField;
    
    
    
    
    
    
    
    

    /*@wire(getRecord, { recordId: '$recordId',layoutTypes: ['Full'], modes: ['View'] })
    wiredRecord({ error, data }) {
        if (error) {
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading contact',
                    message,
                    variant: 'error',
                }),
            );
        } else if (data) {
            console.log('data---', data);
        }
    }

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfo;

    get fieldOptions() {
        
        return fieldList;
    }*/

    getRecord(){
        /*
        let fieldList = [];
        let apiNames = '';
        if (this.objectInfo) {
            if (this.objectInfo.data) {
                if (this.objectInfo.data.fields) {
                    for (var i = 0; i < Object.entries(this.objectInfo.data.fields).length; i++) {
                        apiNames += Object.entries(this.objectInfo.data.fields)[i][0] + ' ,'; 
                    }
                }
            }
        }
        console.log('fieldList--', apiNames);
        */
        getData({recordId : this.recordId, objectApiName : this.objectApiName})
        .then(result =>{

            let defaultValues= {};
            let resp = result.record   ;
            let keys = Object.keys(resp);
            for(let i in keys){
                if(keys[i] != 'Id'){
                    defaultValues[keys[i]] =  resp[keys[i]];
                }
            }
			
            if(this.recordId){
                defaultValues['ParentId'] =  this.recordId;
            }
            
            console.log(defaultValues);
			
            this[NavigationMixin.Navigate]({
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: result.objectApiName,
                    actionName: 'new'
                },
                state: {
                    defaultFieldValues: encodeDefaultFieldValues(defaultValues)
                }
            });
        })
        .catch(error =>{
            console.log('error---', error);
        })
    }
	
	handleSuccess(){
		this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Case',
                actionName: 'view'
            },
        });
		
	}
}