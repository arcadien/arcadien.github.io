    function nextLanguage(){

         var lang = $('html').attr('lang');
            
         if(lang == 'fr'){
                 window.location.assign("http://" + location.host + "/index.html.en");
         }else{
                 window.location.assign("http://" + location.host + "/index.html.fr");
         }
    }    
