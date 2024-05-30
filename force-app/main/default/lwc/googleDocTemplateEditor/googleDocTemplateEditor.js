import { LightningElement, track, wire ,api} from 'lwc';
import getAllDocs from '@salesforce/apex/GoogleDocTemplateEditorController.getAllDocs'
import getTemplate from '@salesforce/apex/GoogleDocTemplateEditorController.getTemplate'

export default class GoogleDocTemplateEditor extends LightningElement {
    @api templateId = "a09F300000DMIOmIAP"
    @api objectName

    isSpinner = true
    selectedTemplate
    showPopup = false
    webViewLink
    @track templates
   
    connectedCallback(){

        getTemplate({id :this.templateId}).then(response => {
            if (response) {
                this.webViewLink = response
                this.isSpinner = false
            } else {
                this.showPopup = true
                getAllDocs()
                .then((response)=>{
                    this.templates =  JSON.parse(response)
                    this.setDateAndSize()
                    this.isSpinner = false
                }).catch(error => {
                    console.log('Error ==> ',error);
                })
            }
        }).catch(error => {
            console.log('Error ==> ',error);
        })

    }
    closePopup(){
        this.showPopup = false
    }
    openPopup(){
        this.showPopup = true
    }
    handleTemplateClick(event) {
        

        const templateId = event.currentTarget.dataset.id;

        this.selectedTemplate = this.templates.find(template => template.id === templateId);
    }

    refreshDocs(){
        getAllDocs()
        .then((response)=>{
             this.templates =  JSON.parse(response)
             this.setDateAndSize()
            this.isSpinner = false
        }).catch(error => {
            console.log('Error ==> ',error);
        })
    }

    next(){
        if (this.selectedTemplate) {
            this.webViewLink = this.selectedTemplate.webViewLink
            this.closePopup()
        }
    }

    setDateAndSize(){
        this.templates = this.templates.map(template => {
            template.createdTime = template.createdTime.split("T")[0]
            if (template.size < 1024) {
                template.size = Math.round(template.size)+"Byte"
            } else if (template.size < 1024*1024) {
                template.size = Math.round(template.size/1024)+"KB"
            }else{
                template.size = Math.round(template.size/(1024*1024))+"MB"
            }
            return template
        })
    }
}