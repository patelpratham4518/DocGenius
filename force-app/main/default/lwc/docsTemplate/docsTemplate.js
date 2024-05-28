import { LightningElement, track, wire ,api} from 'lwc';
import getAllDocs from '@salesforce/apex/GoogleDriveTemplatesController.getAllDocs'
import getTemplate from '@salesforce/apex/GoogleDriveTemplatesController.getTemplate'

export default class DocsTemplate extends LightningElement {

    @api templateId = "a09F300000DMIOmIAP"
    @api objectName

    isSpinner = true
    selectedTemplate
    showPopup = false
    webViewLink
    @track templates
   
    connectedCallback(){

        getTemplate({id:this.templateId}).then(response => {
            console.log('Response ==> ',response);
            if (response) {
                this.webViewLink = response
                this.isSpinner = false
            } else {
                this.showPopup = true
                getAllDocs({isAccessError : false, newAccessToken : null})
                .then((response)=>{
                     this.templates =  JSON.parse(response)
                        this.isSpinner = false
                })
            }
        }).catch(error => {
            console.log('Error ==> ',error);
        })

        // if (!this.selectedTemplate) {
        //     this.showPopup = true
        //     getAllDocs({isAccessError : false, newAccessToken : null})
        //     .then((response)=>{
        //          this.templates =  JSON.parse(response)
        //             this.isSpinner = false
        //     })
        // }
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
        this.webViewLink = this.selectedTemplate.webViewLink
        this.closePopup(); 
    }


}