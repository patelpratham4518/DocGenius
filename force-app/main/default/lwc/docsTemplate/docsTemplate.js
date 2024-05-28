import { LightningElement, track, wire } from 'lwc';
import getAllDocs from '@salesforce/apex/GoogleDriveTemplatesController.getAllDocs'

export default class DocsTemplate extends LightningElement {
    selectedTemplate
    showPopup = true
    @track templates
   
    connectedCallback(){
       getAllDocs({isAccessError : false, newAccessToken : null})
       .then((response)=>{
        console.log('Files ==> ',response);
            this.templates =  JSON.parse(response)
       })
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