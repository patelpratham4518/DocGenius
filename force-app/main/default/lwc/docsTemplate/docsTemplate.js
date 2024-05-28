import { LightningElement, track, wire ,api} from 'lwc';
import getAllDocs from '@salesforce/apex/GoogleDriveTemplatesController.getAllDocs'

export default class DocsTemplate extends LightningElement {

    @api templateId
    @api objectName

    isSpinner = true
    selectedTemplate
    showPopup
    @track templates
   
    connectedCallback(){
        if (!this.selectedTemplate) {
            this.showPopup = true
            getAllDocs({isAccessError : false, newAccessToken : null})
            .then((response)=>{
                 this.templates =  JSON.parse(response)
                    this.isSpinner = false
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