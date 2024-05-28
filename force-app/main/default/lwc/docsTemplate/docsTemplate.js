import { LightningElement, track, wire } from 'lwc';
import getAllDocs from '@salesforce/apex/GoogleDriveTemplatesController.getAllDocs'

export default class DocsTemplate extends LightningElement {
    selectedTemplate
    showPopup = false
    @track templates
    // @wire(getAllDocs)setTemplates ({error, data}) {
    //     if (error) {
    //         console.log("Error getting templates ==> ", error);
    //     } else if (data) {
    //         this.templates = JSON.parse(data)
    //     }
    // }
    connectedCallback(){
       getAllDocs({isAccessError : false, newAccessToken : null})
       .then((response)=>{
        console.log('Files ==> ',response);
            // this.templates = response
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