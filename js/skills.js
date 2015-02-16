/*
 * Skills.js
 *
 * render a collection of keywords collected on the page.
 * Keywords are rendered within grouped <ul> containing 6 keyword each
 * if Skel breakpoint "small" is active, otherwise in a word cloud.
 * Note that in the <ul> layout, only keywords that are present at least two
 * times are displayed.
 */

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
    var wordsMap = [];

    var page = $("#top");
    page.find(".keywords").each(function(index) {
        kws = $(this).text().split(", ");
        for (kw in kws) {
            kw = kws[kw];
            var prop = wordsMap[kw];
            if (undefined == prop) {
                wordsMap[kw] = 1;
            } else {
                wordsMap[kw] = prop + 1;
            }
        }
    });

    // ponderation is only used for word cloud
    if (true === doPonderation) {
        var maxOccurence = 0;
        for (keyword in wordsMap) {
            if (!wordsMap.hasOwnProperty(keyword)) {
                continue;
            }
            if (wordsMap[keyword] > maxOccurence) {
                maxOccurence = wordsMap[keyword];
            }
        }

        // max font size in px
        var maxSize = 100;
        var ratio = maxSize / maxOccurence;

        // ponderate each keyword size
        for (keyword in wordsMap) {
            if (!wordsMap.hasOwnProperty(keyword)) {
                continue;
            }
            wordsMap[keyword] = wordsMap[keyword] * ratio;
        }
    }

    // adapt the map into an array of object
    // to let the cloud layout accept it
    // TODO feed that structure directly
    var words = [];

    for (keyword in wordsMap) {
        if (!wordsMap.hasOwnProperty(keyword)) {
            continue;
        }
        words.push({
            text : keyword,
            size : wordsMap[keyword]
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

    if (skel.isActive("small")) {

        /*
         * small devices : output a sorted <ul> rather than full cloud
         */
        /* first sort the word list based on values */
        var wordMap = collectKeywords(false);
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
        wordKeys.forEach(function(key) {
            if (key.size > 1) {
                if (itemCounter == 5) {
                    ul = $("<ul style='float: left; margin-left : 20px;'/>")
                            .appendTo(cloud);
                    itemCounter = 0;
                }
                $('<li />').html(key.text).appendTo(ul);
                itemCounter++;
            }
        });

    } else {

        /* sufficient width for cloud display */
        var fill = d3.scale.category20();
        d3.layout.cloud().size([ 600, 400 ]).words(collectKeywords(true))
                .padding(5).rotate(function() {
                    return Math.floor(Math.random() * 16 - 8);
                }).font("AwsomeFont").fontSize(function(d) {
                    return d.size;
                }).on("end", draw).start();

    }

    function draw(words) {
        d3.select("#skillCloud").append("svg").attr("width", 600).attr(
                "height", 400).append("g").attr("transform",
                "translate(300,200)").selectAll("text").data(words).enter()
                .append("text").style("font-size", function(d) {
                    return d.size + "px";
                }).style("font-family", "Impact").style("fill", function(d, i) {
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

};
