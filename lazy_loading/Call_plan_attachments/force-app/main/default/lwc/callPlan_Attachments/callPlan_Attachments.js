import { LightningElement,api,wire,track } from 'lwc';
import getContentdocuments from '@salesforce/apex/QRPFormController.accountDetails';
export default class CallPlan_Attachments extends LightningElement {
    @api opprecordobj;
    @api isModalOpen;
    maxRowSelection =1;
    attachmentdeatails = [];
    documents =[];
     columns = [{ label: 'Title', fieldName:'ContentDocumentTitle'}]
     
    @wire(getContentdocuments, { oppId :'$opprecordobj'})
    wiredContacts({data, error}){
        if(data){
            this.document = data;
            let currentData = [];

            data.forEach((row) => {
                 let rowData = {};
                if (row.ContentDocument) {
                    rowData.ContentDocumentTitle = row.ContentDocument.Title;
                }
                rowData.ContentDocumentId =row.ContentDocumentId;
                  console.log(JSON.stringify(rowData));
                currentData.push(rowData);
            });
            console.log('@#####',JSON.stringify(currentData));
            this.documents = currentData;
            }
        else if (error) {
            this.error = error;
          //  this.documents = undefined;
        }
    }
     
    handleRowActions(event) {
       
      /*  var el = this.template.querySelector('lightning-datatable');
         console.log(el);
         var selected = el.getSelectedRows();
           console.log(selected);*/
         const selectedRows = event.detail.selectedRows;
            console.log('------',JSON.stringify(selectedRows));
            console.log('------',selectedRows);
            selectedRows.forEach((row)=>{
                console.log('@@@@@',row);
                this.attachmentdeatails = row;
            });
          
    
    }
    
    closeModal() {
        this.isModalOpen = false;
    }
    submitDetails(event) {
        const attached =this.attachmentdeatails;
        console.log('======',attached);
          event.preventDefault();
          const selectedEvent = new CustomEvent('selected', { detail: attached });
          this.dispatchEvent(selectedEvent);
         // this.isModalOpen = false;
    }
}