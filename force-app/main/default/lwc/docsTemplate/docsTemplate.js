import { LightningElement, track, wire } from 'lwc';
import getAllDocs from '@salesforce/apex/GoogleDriveTemplatesController.getAllDocs'

export default class DocsTemplate extends LightningElement {
    selectedTemplate
    showPopup
    @track templates
   
    connectedCallback(){
        if (!this.selectedTemplate) {
            this.showPopup = true
            getAllDocs({isAccessError : false, newAccessToken : null})
            .then((response)=>{
                 this.templates =  JSON.parse(response)
            })
        }else {
            this.showPopup = false
        }
    }
    closePopup(){
        this.showPopup = false
    }
    openPopup(){
        this.showPopup = true
    }
    handleTemplateClick(event) {
        const templateId = event.target.dataset.id;
        this.selectedTemplate = this.templates.find(template => template.id === templateId);
        console.log('Selected template ==> '+ this.selectedTemplate);
        this.closePopup(); 
    }


}