/*
 * Skills.js
 *
 * render a collection of keywords collected on the page.
 * Keywords are rendered within grouped <ul> containing 6 keyword each
 * if Skel breakpoint "small" is active, otherwise in a word cloud.
 * Note that in the <ul> layout, only keywords that are present at least two
 * times are displayed.
 */

var WORD_LIST = undefined;

/**
 * Return an array of objects, as : {text : "keyword", size : weightOfKeyword}
 * 
 * @param doPonderation
 *            if true, each result object "size" attrribute is ponderated to
 *            allow seamless display in the word cloud. The ponderated value is
 *            the pixel size used to plot string chars. if false, each result
 *            object "size" attrribute is the occurence count of the keyword.
 */
function collectKeywords(doPonderation) {
    WORD_LIST = [];

    var page = $("#top");
    page.find(".keywords").each(function(index) {
        kws = $(this).text().split(", ");
        for (kw in kws) {
            kw = kws[kw];
            var prop = WORD_LIST[kw];
            if (undefined == prop) {
                WORD_LIST[kw] = 1;
            } else {
                WORD_LIST[kw] = prop + 1;
            }
        }
    });

    // ponderation is only used for word cloud
    if (true === doPonderation) {
        var maxOccurence = 0;
        for (keyword in WORD_LIST) {
            if (!WORD_LIST.hasOwnProperty(keyword)) {
                continue;
            }
            if (WORD_LIST[keyword] > maxOccurence) {
                maxOccurence = WORD_LIST[keyword];
            }
        }

        // max font size in px
        var maxSize = 100;

        if(skel.isActive('xlarge')){
                maxSize = 200;
        }else if(skel.isActive('large')){
                maxSize = 150;
        }else if(skel.isActive('medium')){
                maxSize = 100;
        }else if(skel.isActive('small')){
                maxSize = 100;
        }else if(skel.isActive('xsmall')){
                maxSize = 100;
        }

        var ratio = maxSize / maxOccurence;

        // ponderate each keyword size
        for (keyword in WORD_LIST) {
            if (!WORD_LIST.hasOwnProperty(keyword)) {
                continue;
            }
            WORD_LIST[keyword] = WORD_LIST[keyword] * ratio;
        }
    }

    // adapt the map into an array of object
    // to let the cloud layout accept it
    // TODO feed that structure directly
    var words = [];

    for (keyword in WORD_LIST) {
        if (!WORD_LIST.hasOwnProperty(keyword)) {
            continue;
        }
        words.push({
            text : keyword,
            size : WORD_LIST[keyword]
        });
    }
    return words;
};

/**
 * Collects keywords in the page (ie, each comma-separated value in elements
 * that have the "keyword" class) and render them in parentElement.
 * 
 * If Skel breakpoint 'small' is active, render as ul blocks of 6 elements each,
 * where each ul is rendered as a column. Keywords are then ordered on their
 * occurence. A keyword must appear at least twice to be displayed in ul.
 * 
 * If Skel breakpoint "small" is not active, render all keywords in a word
 * cloud.
 * 
 * @param parentElement
 */
function presentSkills(parentElement) {
    var cloud = $(parentElement);

    $('#skillCloud').empty();

    if(undefined == WORD_LIST){
        WORD_LIST = collectKeywords(true);
    }

    if (skel.isActive('skillcloud')) {

        /* sufficient width for cloud display */
        var fill = d3.scale.category20();
        
        d3.layout.cloud().size([ 600, 400 ]).words(WORD_LIST)
                .padding(5).rotate(function() {
                    return Math.floor(Math.random() * 16 - 8);
                }).font("Source Sans Pro").fontSize(function(d) {
                    return d.size;
                }).on("end", draw).start();

        function draw(words) {
            d3.select("#skillCloud").append("svg").attr("width", 600).attr(
                "height", 400).append("g").attr("transform",
                "translate(300,200)").selectAll("text").data(words).enter()
                .append("text").style("font-size", function(d) {
                    return d.size + "px";
                }).style("font-family", "Source Sans Pro").style("fill", function(d, i) {
                    return fill(i);
                }).attr("text-anchor", "middle").attr(
                        "transform",
                        function(d) {
                            return "translate(" + [ d.x, d.y ] + ")rotate("
                                    + d.rotate + ")";
                        }).text(function(d) {
                    return d.text;
                });
        }
    }else{

        /*
         * small devices : output a sorted <ul> rather than full cloud
         */
        /* first sort the word list based on values */
        var wordMap = WORD_LIST.slice();
        wordMap.sort = function sortMap(sortFunc) {
            var results = [];
            for (key in this) {
                if (this.hasOwnProperty(key) && this[key] !== sortMap) {
                    results.push(this[key]);
                }
            }
            return results.sort(sortFunc);
        };
        var wordKeys = wordMap.sort(function(a, b) {
            return (b.size - a.size);
        });

        var ul = $("<ul style='float: left;'/>").appendTo(cloud);

        var itemCounter = 0;
        var totalCounter = 1; // no more than 3*5 elements to avoid layout break
        wordKeys.forEach(function(key) {
            if (key.size > 1 && totalCounter < 16) {
                if (itemCounter == 5) {
                    ul = $("<ul style='float: left; margin-left : 20px;'/>")
                            .appendTo(cloud);
                    itemCounter = 0;
                }
                if(totalCounter == 15){
    
                    var lang = $('html').attr('lang');
                    if(lang == "fr"){
                        $('<li />').html('et plus encore!').appendTo(ul);
                    }else{
                        $('<li />').html('and more!').appendTo(ul);
                    }
                }else{
                    $('<li />').html(key.text).appendTo(ul);
                }
                itemCounter++;
                totalCounter++;
            }
        });

   }
};
