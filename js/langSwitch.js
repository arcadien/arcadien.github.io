    function nextLanguage(){

         var lang = $('html').attr('lang');
            
         if(lang == 'fr'){
                 window.location.assign("http://www.skima.fr/index.html.en");
         }else{
                 window.location.assign("http://www.skima.fr/index.html.fr");
         }
    }    
