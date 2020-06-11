import { LightningElement,wire,track,api} from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import { NavigationMixin ,CurrentPageReference } from 'lightning/navigation';
import CaseNotInclude_Label from '@salesforce/label/c.CaseNotInclude';



export default class NewCase extends NavigationMixin(LightningElement)  {
    @track selectedValue;
    @track options = [];
    @track isopen =false;
    @api objectApiName;
    @api recordId;
    @track loading;

    label = {
        CaseNotInclude_Label,
    };
     valueOfLabel=this.label.CaseNotInclude_Label;
    connectedCallback(){
        this.isopen=true;
        console.log(' Record type Lbel  here ------',JSON.stringify(this.label.CaseNotInclude_Label));
        console.log(' Record type Lbel  here  new ------',JSON.stringify(this.valueOfLabel));



    }
    @wire(getObjectInfo, {objectApiName: CASE_OBJECT})
    caseObjectInfo({data,error}){
        if(data) {
            let optionsValues = [];
            // map of record type Info
            const rtInfos = data.recordTypeInfos;

            // getting map values
            let rtValues = Object.values(rtInfos);
            console.log('Active Record type here ------',JSON.stringify(rtValues));
            for(let i = 0; i < rtValues.length; i++) {
                if(rtValues[i].name !== 'Master' && rtValues[i].available===true && (false===this.valueOfLabel.includes(rtValues[i].name)) ) {
                    optionsValues.push({
                        label: rtValues[i].name,
                        value: rtValues[i].recordTypeId
                    })
                }
            }

            this.options = optionsValues;
        }
        else if(error) {
            window.console.log('Error ===> '+JSON.stringify(error));
        }
    }
    handleChange(event) {
        this.selectedValue = event.detail.value;
    }
    cancelClick(){
        const closeQA = new CustomEvent('close');
        // Dispatches the event.
        this.dispatchEvent(closeQA);

    }
    @wire(CurrentPageReference)
    wiredPageRef() {
        this.loading = false;
    }



    navigateToRecordViewPage(event) {
        console.log(' Account Id here ===>',this.recordId);

        console.log('Id here ===>',JSON.stringify(this.selectedValue));
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Case', // objectApiName is optional
                actionName: 'new'
            },
            state: {
               nooverride: 1,
               recordTypeId: this.selectedValue,
                defaultFieldValues:"AccountId="+this.recordId,
            }
        });
    }


}