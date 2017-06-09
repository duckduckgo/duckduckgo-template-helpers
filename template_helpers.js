(function(env) {

    // Applies logical conjuction to an arbitrary number of parameters,
    // and show enclosed block if true
    //
    // example:
    //
    // {{#and conditionOne conditionTwo}}
    // This will display if conditionOne and conditionTwo are truthy
    // {{/and}}
    Handlebars.registerHelper('and', function() {
        // `arguments` is not a real Array (therefore doesn't have Array's methods).
        // This converts it into an array.
        var args = Array.prototype.slice.call(arguments),
            // The last argument is always the `options` object.
            options = args.pop();

        for(var i = 0; i < args.length; i++) {
            if(!args[i]) { return; }
        }

        return options.fn(this);
    });

    /**
     * Simple wrapper around DDG.commifyNumber
     *
     * @param {int} number
     * @return {string}
     */
    Handlebars.registerHelper("commifyNumber", function (number) {
        return DDG.commifyNumber(number);
    });

    /** 
     * @function concat
     *
     * **Block Helper**
     * 
     * Concatenates all the elements in a collection (array of strings)
     * 
     * An optional item separator can be appended to
     * each item and an optional conjunction can be
     * used for the last item.
     *
     * Note: Technically, the elements can be of any type, but it is assumed that the block returns a string
     *
     * @param {string} sep  **[optional]** Item separator. Default: `''`
     *                      
     * @param {string} conj **[optional]** Final separator, preceeds last item. Default: `''`
     *
     * @returns {string}
     *
     * Example:
     *
     * ```
     * {{#concat context sep="," conj="and"}}
     *     {{this}}
     *  {{/concat}}
     * ```
     *
     * when `context` is:
     * - `['a']`           returns:  `a`
     * - `['a', 'b']`      returns:  `a and b`
     * - `['a', 'b', 'c']` returns:  `a, b and c`
     * 
     */
    Handlebars.registerHelper("concat", function(context, options) {
        if (!context) { return ""; }

        var sep = options.hash.sep || '',
            conj = options.hash.conj || '',
            len = context.length,
            out = "";

        // some special cases
        if (len === 1) { return options.fn(context[0]); }
        if (len === 2) { return options.fn(context[0]) + conj + options.fn(context[1]); }
        if (len === 3) { return options.fn(context[0]) + sep + " " + options.fn(context[1]) + conj + options.fn(context[2]); }

        for (var i=0; i<len; i++){

            if (i == len - 1) {
                out += sep + conj;
             } else if (i>0) {
                 out+= sep + " "; // i is not zero
             }

            out += options.fn(context[i]);
        }
        return out;
    });

    /**
     * @function condense
     * 
     * Shortens a string
     * 
     * An optional maximum string length can be provided if preferred.
     *
     * @param {number} maxlen **[optional]** Maximum allowed string length. Default: `10`
     *                      
     * @param {number} fuzz The allowable deviation from the maxlen, used to allow a sentence/word to complete if it is less than fuzz characters longer than the maxlen
     *                        
     * @param {string truncation **[optional]** The truncation string. Default: `'...'`
     *
     * Example:
     * 
     * `{{condense myString maxlen="135" truncation="..."}}`
     * 
     * This will output the value of `myString` up to a maximum of 135 characters
     * (not including the length of the truncation string) and then append
     * the truncation string to the output
     *
     */
    // TODO: break on word boundary or call DDG.shorten instead
    Handlebars.registerHelper("condense", function(s, params) {
        var maxlen = 0, fuzz = 0;
        var trunc = params.hash.truncation || '...';

        if (params.hash.maxlen) {
            maxlen = parseInt(params.hash.maxlen, 10);
        }

        // the "fuzz" is an allowable deviation from the maxlen,
        // allowing a sentence/word to complete if it is less than
        // fuzz characters over the maxlen
        if (params.hash.fuzz) {
            fuzz = parseInt(params.hash.fuzz, 10);
        }

        if (!s) { return ''; }

        if (fuzz > maxlen) {
            fuzz = 0;
        }

        // try to end on a sentence, then a word, then just slice
        if (maxlen && s.length > maxlen) {
            var temp_s;
            // return s.substring(0, maxlen) + trunc;
            if (s.length > maxlen && s.lastIndexOf('.', maxlen)+1 !== 0) {
                temp_s = s.substr(0, s.lastIndexOf('.', maxlen)) + trunc;
            } else if (s.length > maxlen-fuzz && s.lastIndexOf(' ', maxlen) !== 0) {
                temp_s = s.substr(0, s.lastIndexOf(' ', maxlen)) + trunc;
            }

            // maxlen - fuzz should be the minimum length of the string
            if (!(temp_s.length < (maxlen + fuzz) && temp_s.length > (maxlen - fuzz))) {
                return s.substring(0, maxlen) + trunc;
            }

            return temp_s;
        }

        return s;
    });

    // Gets the domain name of a given URL.
    // It converts things like: http://blogs.wsj.com/law/2013/11/14/google-wins-dismissal-of-book-scanning-suit/?mod=smallbusiness/
    // Into: blogs.wsj.com
    Handlebars.registerHelper("domain", function(url) {
        var re = new RegExp('^.*?\/\/([^\/\?\:\#]+)');
        if (re.test(url)) {
            return RegExp.$1.replace('www.','');
        }
    });

    // Gets the domain with path of a given URL.
    // It converts things like: http://blogs.wsj.com/law/2013/11/14/google-wins-dismissal-of-book-scanning-suit/?mod=smallbusiness/
    // Into: blogs.wsj.com/law/2013/11/14/google-wins-dismissal-of-book-scanning-suit/?mod=smallbusiness/
    Handlebars.registerHelper("domainWithPath", function(url) {
        var re = new RegExp('^.*?\/\/([^\?\:\#]+)');
        if (re.test(url)) {
            return RegExp.$1.replace('www.','').replace(/\/$/,'');
        }
    });


    /**
     *
     * @function durationFormat
     *
     * Takes a time duration in milliseconds
     * and converts it to nice, formatted 
     * string duration (i.e. 1:23:10)
     *
     * usage: "{{durationFormat ms}}"
     *
     */
    Handlebars.registerHelper("durationFormat", function(ms, options) {
        return DDG.formatDuration(ms);
    });

    /**
     * @function ellipsis
     *
     * Shortens a string by removing words until string length is <= `limit` and
     * appends an ellipsis ('...') to the output
     * 
     * Note: It automatically appends any closing tag if one is missing.
     * 
     * @param {string} text  text to shorten
     * @param {number} limit maximum length of shortened string
     * 
     * @return {string}
     *
     * Example:
     *
     * `{{ellipsis title 50}}`
     * 
     */
    Handlebars.registerHelper("ellipsis", function(text, limit, options) {
        if (!text) { return ""; }

        // If we get a number, convert it to a string.
        // We convert things to a string because [object Number] doesn't have the `split` method.
        if(DDG.isNumber(text)) {
            text = text + "";
        }

        // strip links if necessary
        if (options && options.hash.parseFirst) {
            text = DDG.parse_link(text,"rest");
        }

        // check to ensure that we have a valid limit, if not fall back to the provided default
        if (!$.isNumeric(limit)) {
            if (options && options.hash.fallback) {
                limit = options.hash.fallback;
            }

            // if still no valid limit, just default
            // it to 100 characters:
            if (!$.isNumeric(limit)) {
                limit = 100;
            }
        }

        var result = [],
            count = 0,
            words = text.split(" ");

        for(var i = 0; i < words.length; i++) {
            count += words[i].length + (i < words.length-1 ? 1 : 0);
            if(count <= limit) {
                result.push(words[i]);
            }
        }

        // Return the same text if we weren't able to trim.
        if(result.length === 0) {
            return text;
        }

        var append = words.length > result.length;
        result = result.join(" ");

        // Count the number of opening and closing tags.
        var open_b = result.split("<b>").length - 1;
        var close_b = result.split("</b>").length - 1;

        // Check if there is a mismatch.
        result += open_b > close_b ? "</b>" : "";

        if(append && !(result[result.length - 1].match(/\.$/))) {
            return result + "...";
        }
        return result;
    });

    /**
     * favicon
     * 
     * Find favicon and generate the appropriate markup.
     *
     */
    Handlebars.registerHelper("favicon", function(obj, options) {
        var sourceUrl = obj || this.source_url,
            ops = options && options.hash || {},
            lazy = ops.lazyload,
            className = ops.className || 'zci__more-at__icon',
            w = ops.w || '16',
            h = ops.h || '16',
            url = DDG.get_favicon_url(sourceUrl),
            output = '<img width="'+w+'" height="'+h+'" class="'+className;
        
        if (lazy) {
            output += ' js-lazyload" data-src="'+url+'" />';
        } else {
            output += '" src="'+url+'" />';
        }

        return output;
    });

    Handlebars.registerHelper("firstLetter", function(obj) {
        //console.log("firstLetter for %o", obj);
        return obj.charAt(0).toLowerCase();
    });

    /**
     * Takes an array of components (or a single component) and 
     * renders the HTML to use them as the subtitle.
     *
     * @param {array/object/string} components
     * @return {string}
     */
    Handlebars.registerHelper("formatSubtitle", function(components) {
        // don't leave a blank spot in the template
        if (!components) { return '&nbsp;'; }

        components = $.isArray(components) ? components: [components];

        return DDG.exec_template('subtitle', {
            components: components
        });
    });

    /**
     * formatTitle
     *
     * Takes a string with parenthesis and splits it into stylable markup.
     *
     * e.g. takes Chicago (Illinois) and converts it to:
     * <h1 class="title">Chicago <span class="title__sub">Illinois</span></h1>
     * 
     * Will also remove the title from an abstract by taking the link text (parseFirst)
     *
     */
    Handlebars.registerHelper("formatTitle", function(obj, options) {
        var ops = options.hash;

        if (ops.parseFirst) {
            obj = DDG.parse_link(obj,"text");
        }

        var tile = DDG.parseAbstract(obj),
            title = tile.main;

        if (ops.ellipsis) {
            title = Handlebars.helpers.ellipsis(tile.main, ops.ellipsis);
        }

        return DDG.exec_template('title', {
            tagName: ops.el || 'span',
            className: ops.className || 'title',
            classNameSec: ops.classNameSec,
            subTitle: !ops.noSub && tile.subTitle,
            optSub: ops.optSub,
            title: title,
            href: (ops.href && this[ops.href]) || ops.href,
            hrefTitle: tile.main && !tile.main.match(/<b>/) ? tile.main : null
        });
    });

    /**
     *
     * @function imageProxy
     *
     * Rewrite a URL as a DuckDuckGo image redirect
     *
     * @returns {string}
     *
     * Example:
     * 
     * `{{imageProxy imageURL}}`
     * 
     * produces: `/iu/?u={{imageURL}}`
     *
     * This works for direct urls, seems not to work for those with a query string
     *
     * works with:
     * http://wac.450f.edgecastcdn.net/80450F/screencrush.com/files/2013/06/Enders-Game.jpg
     *
     * does not work with:
     * http://ts2.mm.bing.net/th?id=H.4942980247914057&pid=15.1&H=106&W=160
     *
     */

    Handlebars.registerHelper("imageProxy", function(url) {
        return DDG.getImageProxyURL(url);
    });

    /**
     * @function include
     *
     * Loads the specified Handlebars template and applies it with
     * the current context
     * 
     * Note: There is no recursive cycle detection! **Be careful**.
     *
     * Example:
     * 
     * `{{include ../myTemplate}}`
     * 
     * Applies the template `myTemplate` using `this` as the data context
     *
     * `{{include template wrap="wrapper"}}`
     *
     * inserts into template 'wrapper', wrapper inserts template(x)
     * via a reference to 'content', for instance:
     *
     * `<div>{{{content}}}</div>`
     */

    Handlebars.registerHelper("include", function(template_name, options) {
        var ops = options && options.hash || {},
            wrap_template = ops.wrap,
            context = $.extend(this, ops),
            result = "";

        result = DDG.exec_template(template_name, context);

        if (result && wrap_template) {
            return Spice.exec_template(wrap_template, {content:result});
        }

        return result;
    });


    /**
     *
     * @function keys
     *
     * **Block Helper**
     *
     * Iterates over the properties of an object and provides
     * a new object containing the "key" and "value" for each
     *
     * Example:
     * 
     * ```
     * {{#keys myObject}}
     *      {{key}} : {{value}}
     * {{/keys}}
     * ```
     */
    Handlebars.registerHelper("keys", function(obj, options) {
        var out = "";

        for (var k in obj) {
            out += options.fn( $.extend({}, this, {"key": k, "value": obj[k]}) );
        }

        return out;
    });

    // tokenize incoming text by wrapping in an l() function 
    Handlebars.registerHelper('l', function() {
        return l.apply(window,arguments);
    });

    // tokenize incoming text by wrapping in an lp() function (token w/ context)
    Handlebars.registerHelper('lp', function() {
        return lp.apply(window,arguments);
    });

    /**
     * @function loop
     *
     * **Block Helper**
     * 
     * Counts from zero to the value of `context` (assuming `context` is a **number**)
     * applying the content of the block each time.
     * 
     * Note: A maximum of 100 loops is allowed.
     *
     * Example:
     * 
     * ```
     * {{#loop star_rating}}
     *     <img src="{{star}}" class="star"></span>
     * {{/loop}}
     * ```
     *
     */
    Handlebars.registerHelper("loop", function(numLoops, block) {
        var ret, data;

        numLoops = Math.min(numLoops, 100);

        /* provide index to inner block */
        if (block.data) {
            data = Handlebars.createFrame(block.data);
        }

        ret = "";

        for (var i=0; i<numLoops; i++) {
            if (data) { data.index = i; data.max = numLoops; }
            ret += block.fn(this, {data: data});
        }
        return ret;
    });

    /*
     *   Add a line break between each lyric stanza
     */
    Handlebars.registerHelper("lyricsAbstract", function(ab){
        return ab.split(/<(?:<b>)?break(?:<\/b>)?>/).join('<br />');
    });

    /*
     * Creates the title and subtitle for lyrics
     * title comes in two forms
     * $song: lyrics: $album: $artist
     * $song: lyris: $artist
     *
     */
    Handlebars.registerHelper("lyricsTitle", function(title, url) {
        var parser = /^(.*?):\slyrics:\s(?:(.*?):\s(.*?)$|(.*?)$)/,
            result = parser.exec(title),
            song = result[1],
            subTitle = result[4] || result[3] + ' (' + result[2] + ')';

        return DDG.exec_template('title', {
            tagName: 'h1',
            className: 'c-info__title',
            title: song,
            subTitle: subTitle,
            href: url
        });
    });

    // For duckduckgo.com urls, make relative so they go to the current hostname.
    Handlebars.registerHelper("makeRelative", function(url) {
        if (/^https?:\/\/(?:[^\.]+\.|)duckduckgo.com\/?(.*)$/.test(url)) {
            return RegExp.$1;
        } else {
            return url;
        }
    });
    
    // helper that requires moment.js - bails if not available
    Handlebars.registerHelper("momentDate", function(obj, options) {
        if (!moment) { return ''; }
        var ops = options && options.hash || {},
            date = moment.utc(obj, "YYYY-MM-DD HH:mm:ss"),
            format = ops.format || 'ddd MMM D';
        
        return date.local().format(format);
    });

    // helper that requires moment.js - bails if not available
    Handlebars.registerHelper("momentTime", function(obj) {
        if (!moment) { return ''; }
        var time = moment.utc(obj, "YYYY-MM-DD HH:mm:ss");
        
        return time.local().format('LT');
    });

    /**
     *
     * moreAt
     *
     * Create an attribution line 
     *
     */
    Handlebars.registerHelper("moreAt", function(meta, name, options) {
        var ops = options && options.hash || {};

        meta = meta || {};

        // if meta is a string then it's just a url, if it is an object
        // then assume it conforms to our standard Spice meta object parameters
        if (typeof meta === 'string') {
            // do not proceed if there's no source name
            if (!name) { return; }
            meta = {
                sourceUrl: meta,
                sourceName: name,
                sourceIcon: true
            };
        }
        else if (meta.repo === 'fathead'){
            // do not proceed if there's no source name
            if (!name) { return; }
            meta.sourceUrl = name;
            meta.sourceName = meta.src_name;
            meta.sourceIcon = true;
        }
        else if (meta.repo === 'longtail'){
            if (!name) { return; }
            // skip serp link on the metabar for now
            // 'none' is passed as the name param to moreAt in these cases
            if (name === 'none'){ return; }

            meta.sourceName = meta.name;
            meta.sourceUrl = name;
            meta.sourceIcon = true;
        }
        else if (!meta.sourceIconUrl && meta.sourceUrl && !meta.sourceLogo && meta.sourceIcon !== false) {
            meta.sourceIcon=true;
        }
        
        // bail if we still don't have a valid URL
        if (!meta.sourceUrl) { return; }

        // defaults
        meta.className = 'zci__more-at';
        meta.iconClassName = 'zci__more-at__icon';

        // moreAtText var used in translation interpolation:
        var moreAtText = meta.moreAtText = (DDG.templates.more_at_text(meta) || '').trim();

        // pick up and use any helper options
        if (ops.noIcon) { meta.sourceIcon = false; }
        if (ops.className) { meta.className = ops.className; }
        if (ops.iconClassName) { meta.iconClassName = ops.iconClassName; }
        if (ops.iconUrl) {
            meta.sourceIconUrl = ops.iconUrl;
            meta.sourceIcon = false;
        }
        if (ops.iconPlaceholder) {
            meta.sourceIconUrl = '/assets/icon_favicon_placeholder.v104.png';
            meta.sourceIcon = false;
        }
        if (!meta.hideMoreAtText && !ops.hideMoreAtText && !ops.dynamicMoreAtText && !(DDG.device.isMobile && ops.sourceOnlyMobile)) {
            meta.moreAtText = DDG.Text.MORE_AT_STRING;
        }
        // hides the 'More At' text when the source name is longer than the # of characters passed into the variable:
        if (ops.dynamicMoreAtText) {
            meta.moreAtText = (meta.moreAtText.length < ops.dynamicMoreAtText) ? DDG.Text.MORE_AT_STRING : meta.moreAtText;
        }

        return DDG.templates.more_at(meta);
    });

    /**
     * @function numFormat
     *
     * Delimits a number or string with multiple numbers,
     * using commas or given delimiter
     * 
     * Note: This supports integers and decimal numbers.
     *
     * Credit: This function was borrowed from
     * http://cwestblog.com/2011/06/23/javascript-add-commas-to-numbers/
     *
     * @param {string} delimiter **[optional]** The delimiter string. Default: `','`
     *
     * Example:
     *
     * ```
     * {{numFormat num}}
     * {{numFormat num delimiter="." }}
     * ```
     */
    Handlebars.registerHelper("numFormat", function(num, options) {

        if (!num) { return ""; }

        var delimiter = ",",
            num_string = num.toString();

        if (options && options.hash && options.hash.delimiter) {
            delimiter = options.hash.delimiter;
        }

        return num_string.replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
            return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
        });
    });

    /**
     * @function ordinal
     *
     * Pass-through to DDG.getOrdinal utility
     *
     * @param {string} num
     *
     */
    Handlebars.registerHelper("ordinal", function(num) {
        return DDG.getOrdinal(num);
    });

    /**
     * @function plural
     *
     * Returns the value of `context` (assuming `context` is a **number**)
     * and appends the singular or plural form of the specified word,
     * depending on the value of `context`
     *
     * @param {string} singular Indicates the singular form to use
     * @param {string} plural   Indicates the plural form to use
     * @param {string} delimiter **[optional]** Format the number with the `numFormat` helper
     *
     * Example:
     * 
     * `{plural star_rating singular="star" plural="stars"}}`
     * 
     * Will produce:
     * - `{{star_rating}} star`  if the value of `star_rating` is `1`, or
     * - `{{star_rating}} stars` if `star_rating` > `1`
     *
     */
    Handlebars.registerHelper("plural", function(num, ops) {
        var word = DDG.pluralize(num, ops.hash.singular, ops.hash.plural);

        if (!word) { return; }

        if (ops.hash.delimiter){
            num = Handlebars.helpers.numFormat(num, ops);
        }

        return num + " " + word;
    });

    /**
     * function for returning the HTML for price rating
     */
    Handlebars.registerHelper("priceSymbols", function(numerator, denominator) {
        var str = '',
            i = 0;

        for (i=0; i<denominator; i++) {
            if (i<numerator) {
                str += '<b>$</b>';
            } else {
                str += '$';
            }
        }

        return str;
    });

    Handlebars.registerHelper("renderStars", function(obj) {
        if(typeof obj === 'string'){
            obj = { rating: obj };
        }

        return DDG.templates.stars(obj);
    });

    /**
     * Takes the path to an image and
     * returns the 1x, 2x or 3x version depending
     * on the current device pixel ratio.
     *
     * Assumes file naming convention of:
     * image.png
     * image@2x.png
     * image@3x.png
     *
     * Input is the whole path to the 1x version (with no suffix)
     *
     * @param {string} path
     * @return {string}
     */
    Handlebars.registerHelper("retinaImage", function(path) {
        var splitPath = path.split('.');
        splitPath[splitPath.length-2] += DDG.device.is3x ? '@3x' : DDG.device.is2x ? '@2x' : '';
        return splitPath.join('.');
    });

    Handlebars.registerHelper("reviewCount", function(count, url, hideReviewText, abbrev) {

        // bail if count is invalid.
        if (!count || count === '') {
            count = 0;
        }

        var html,
            pre = '<span class="review-count">',
            post = '</span>',
            displayCount = count;

        if (abbrev && abbrev === true) {
            displayCount = DDG.abbrevNumber(count);
        } else {
            displayCount = DDG.commifyNumber(count);
        }

        if (hideReviewText === true) {
            if (!count) { return ''; }
            html = pre + displayCount + post;
        } else {
            html = ln('%2$s %1$s %3$s review', '%2$s %1$s %3$s reviews', displayCount, pre, post);
        }

        if (url) {
            html = '<a href="' + url + '">' + html + '</a>';
        }

        return html;
    });

    Handlebars.registerHelper("starRating", function(rating) {
        rating = $.isNumeric(rating) ? rating : 0;

        var sr = rating.toString();
        if (sr.match(/(\d)\.(\d)/)) {   // only matches the two integers around the .
            var whole = parseInt(RegExp.$1, 10);
            var half = parseInt(RegExp.$2, 10) > 4 ? 5 : 0;

            if (whole > 5) {
                whole = 5;
            }

            rating = whole;

            if (half && whole < 5) {
                rating += '-' + half;
            }
        }
        else {
            rating = Math.floor(rating);
        }

        // we should be sending either 'unrated', an integer between 1-5, or an integer and '-5' for half
        return Handlebars.helpers.renderStars({rating: rating });
    });

    Handlebars.registerHelper("starsAndReviews", function(rating, count, url, hideReviewText) {
        return Handlebars.helpers.starRating(rating) + Handlebars.helpers.reviewCount(count,url,hideReviewText,true);
    });

    /**
     * @function stripHTML
     * 
     * Strips HTML tags/elements from text
     * 
     * @returns {string}
     * 
     * Example:
     * 
     * `{{stripHTML stringWithHTML}}`
     */
    
     Handlebars.registerHelper("stripHTML", function(text, options) {
         return options.fn(DDG.strip_html(text));
     });

    /*
        Helper for table_detail.handlebars template

        iterates through a list (context) and use the value from context as 
        a key to reference a value form the data object.

        use: {{#table-each list data}}
                {{key}}{{value}}
             {{/table-each}}
    */
    Handlebars.registerHelper("table-each", function(context, options) {
        if (!context){
            return "";
        }

        var result = "";
        //console.log("each helper: options.hash: %o", options.hash);

        // check for a list of record keys
        if(context.record_keys){

            var keys = context.record_keys;

            for(var key in keys) {
               if(context.record_data[keys[key]]){
                  result += options.fn({ key: keys[key], value: context.record_data[keys[key]]});
                }
            }
        } else {
            for(var item in context.record_data){
                 result += options.fn({ key: item, value: context.record_data[item]});
            }
        }
        return result;
    });

    Handlebars.registerHelper("toHTTP", function (url) {
        return DDG.toHTTP(url);
    });

    Handlebars.registerHelper("toHTTPS", function (url) {
        return DDG.toHTTPS(url);
    });

    /**
     * @function trim
     *
     * Removes leading and trailing spaces from text
     *
     * @return {string}
     * 
     * Example:
     * 
     * `{{trim stringWithSpaces}}`
     * 
     */
    Handlebars.registerHelper("trim", function(obj) {
        if (obj) { return obj.trim(); }
    });

    /**
     * @function stripNonAlpha
     *
     * Removes all non-alpha characters and makes lowercase
     *
     * (useful for adding to classes etc)
     */
    Handlebars.registerHelper("stripNonAlpha", function(obj) {
        if (obj) { return DDG.strip_non_alpha(obj.toLowerCase()); }
    });

    /**
     * For adding a loading animation to 
     * the DOM.
     *
     * @param {string} color [white|black], optional
     */
    Handlebars.registerHelper("loader", function(color) {
        var loaderColor = typeof color === 'string' && color,
            loaderSize = DDG.is3x ? 'x3' : DDG.is2x ? 'x2' : 'x1';

        if (!loaderColor) {
            // if no explicit color is passed, look at hte page
            // background color setting and if it's a light color use
            // the black loader, if dark color use the white loader:
            var bgColor = DDG.settings.get('k7'),
                colorObject = tinycolor(bgColor),
                isDarkColor = colorObject.isValid() && colorObject.toHsl().l < 0.5;

            loaderColor = isDarkColor ? 'white' : 'black';
        }

        var src = '/assets/loader/' + loaderColor + loaderSize + '.png';

        return '<div class="loader" style="background-image:url(\'' + src + '\');"></div>';
    });

})(this);
