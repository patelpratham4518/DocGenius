public with sharing class GoogleDriveTemplatesController {
    public GoogleDriveTemplatesController() {

    }

    @AuraEnabled
    public static String getAllDocs(Boolean isAccessError, string newAccessToken) {
        try {
            String endpoint = 'https://www.googleapis.com/drive/v3/files';
            AuthProviderSettings__c authProvider = AuthProviderSettings__c.getInstance();

            Map<String, String> params = new Map<String, String>();
            params.put('q','mimeType= "application/vnd.openxmlformats-officedocument.wordprocessingml.document" or mimeType= "application/vnd.google-apps.document"');
            params.put('fields','files(id,name,mimeType,webViewLink)');

            String paramString = '';
            for (String key : params.keySet()) {
                if (!String.isEmpty(paramString)) {
                    paramString += '&';
                }
                paramString += EncodingUtil.urlEncode(key, 'UTF-8') + '=' + EncodingUtil.urlEncode(params.get(key), 'UTF-8');
            }

            HttpRequest request = new HttpRequest();
            request.setEndpoint(endpoint + '?'+paramString);
            request.setMethod('GET');
            if(isAccessError == true){
                request.setHeader('Authorization','Bearer '+ newAccessToken);
            }
            else{
                request.setHeader('Authorization','Bearer '+authProvider.access_token__c);
            }

            System.debug('request : ' + request);

            Http http = new Http();
            HttpResponse response = http.send(request);
            System.debug('Body '+response.getBody());
            if (response.getStatusCode() == 200) {
                Map<String, Object> responseMap = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
                if(isAccessError == true){
                    authProvider.access_token__c = newAccessToken;
                    upsert authProvider;
                }
                // return JSON.serialize(responseMap.get('files'));
                return response.getBody();
            } else if (response.getStatusCode() == 401) {
                System.debug('Here is some error 401');
                refreshAccessToken(authProvider, true);
            }
            return null;
           
        } catch (Exception e) {
            System.debug('Error In get all Docs ==> '+e.getMessage());
            Log_Handler.store_Exception(e,'GoogleDriveTemplatesController','getAllDocs');
            return null;
        }
    }

    // @AuraEnabled
    // public static String getTemplateHTML(String id) {
    //     try {
    //         String endpoint = 'https://www.googleapis.com/drive/v3/files/'+id+'/export';
    //         AuthProviderSettings__c authProvider = AuthProviderSettings__c.getInstance();
    //         Map<String, String> params = new Map<String, String>();
    //         params.put('mimeType','text/html');
    //         String paramString = '';
    //         for (String key : params.keySet()) {
    //             if (!String.isEmpty(paramString)) {
    //                 paramString += '&';
    //             }
    //             paramString += EncodingUtil.urlEncode(key, 'UTF-8') + '=' + EncodingUtil.urlEncode(params.get(key), 'UTF-8');
    //         }
    //         HttpRequest request = new HttpRequest();
    //         request.setEndpoint(endpoint + '?'+paramString);
    //         request.setMethod('GET');
    //         request.setHeader('Authorization','Bearer '+authProvider.access_token__c);
    //         Http http = new Http();
    //         HttpResponse response = http.send(request);
    //         if (response.getStatusCode() == 200) {
    //            return JSON.serialize(response.getBody());
    //         } else if (response.getStatusCode() == 401) {
    //             System.debug('Here is some error 401');
    //             Boolean token = refreshAccessToken(authProvider);
    //             if (token == true) {
    //                 return getTemplateHTML(id); // Retry after token refresh
    //             }
    //         }
    //         return null;
    
    //     } catch (Exception e) {
    //         System.debug('Error In get HTML of  Docs ==> '+e.getMessage());
    //         Log_Handler.store_Exception(e,'GoogleDriveTemplatesController','getTemplateHTML');
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }

    private static void refreshAccessToken(AuthProviderSettings__c settings, Boolean isAccessError) {
        String ENDPOINT = 'https://oauth2.googleapis.com/token';
        HttpRequest request = new HttpRequest();
        request.setEndpoint(ENDPOINT);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setBody('refresh_token=' + settings.refresh_token__c +
                        '&client_id=' + settings.ClientId__c +
                        '&client_secret=' + settings.ClientSecret__c +
                        '&grant_type=refresh_token');

        Http http = new Http();
        HttpResponse response = http.send(request);
        System.debug('Refresh token body ==>'+response.getBody());
        if (response.getStatusCode() == 200) {
            Map<String, Object> jsonResponse = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            String newToken = (String) jsonResponse.get('access_token');
            if(isAccessError == true){
                if (newToken != null) {
                    System.debug('newToken : ' + newToken);
                    getAllDocs(isAccessError, newToken);
                }
            }
            else{
                settings.access_token__c = newToken;
                upsert settings;
            }
        }

        System.debug('Token refresh failed. Status Code: ' + response.getStatusCode());
        System.debug('Response Body: ' + response.getBody());
        // return false;
    }
}