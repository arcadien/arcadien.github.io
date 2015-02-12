jQuery(document).ready(function($){

    /* for now, hide english content */
    var languages = ["fr", "en"];
    var currentLanguageIndex = 1;
    function nextLanguage(){
            var page = $("#top");

            var lang = languages[currentLanguageIndex];
            page.find("[lang='"+lang+"']").each(function(){
                    $(this).hide();
            });
            currentLanguageIndex++;
            if(currentLanguageIndex > (languages.length-1) ){
               currentLanguageIndex = 0;
            }
            lang = languages[currentLanguageIndex];


            page.find("[lang='"+lang+"']").each(function(){
                $(this).show();
            });
            
    }    
    $("#langswitcher").on("click", function(){
        nextLanguage();
    });

    nextLanguage(); 
}); 
