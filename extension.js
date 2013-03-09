// Extension main script

var stylesheetUrl = chrome.extension.getURL("hypestyles.css");

// This is all the JS that will be injected in the document body
var main = function() {

	//Random String generator.
    var generator = function()
    {
    	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var string_length = 8;
		var randomstring = "";
		for (var i=0; i<string_length; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			randomstring += chars.charAt(rnum);
		}
		return randomstring;
    };
    
    //Here is where we can randomly generate the name of the styles to avoid them checking for specific names.
    //Can add more here if they check additional names.
    //ref:http://jonraasch.com/blog/javascript-style-node
    var triArrowString = generator();
    var css = document.createElement('style');
    css.type = 'text/css';
    var styles = '.'+triArrowString+'{ width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent;	border-top: 10px solid #494949; }';
    styles += '.arrow:hover .'+triArrowString+'{ border-top: 10px solid #0063DC; }';
    
    //done this way for IE aparantly.
    if (css.styleSheet) css.styleSheet.cssText = styles;
    else css.appendChild(document.createTextNode(styles) );
    
    document.getElementsByTagName("head")[0].appendChild(css);
    
    
	// Adds a download button next to each track
	var buttonScript = function() {
		console.debug("Buttons injected.");
		// Wait for the tracks script to load
		var tracks = window.displayList['tracks'];
		 if (tracks === undefined || tracks.length < 1) {
		 	setTimeout(buttonScript, 1);
		 } else {
			// Check if this particular page has been processed
			// through a previous call
			if (jQuery('.dl').length < tracks.length) {
				jQuery('ul.tools').each(function(index, track) {
					// Request the song URL
					var xmlHttp = null;
    				xmlHttp = new XMLHttpRequest();
    				xmlHttp.onreadystatechange = function() { 
    					if (xmlHttp.readyState == 4 && xmlHttp.status == 200 && !jQuery(track).data("hasDownloadButton") && jQuery("#section-track-" + tracks[index].id + " .section-player .tools .dl").length == 0) {
    						var response = JSON.parse(xmlHttp.responseText);
    						var songUrl = response.url;
    						jQuery(track).data("hasDownloadButton", true);
							jQuery(track).prepend('<li class="dl"><table class="spacer"></table><a href="'+songUrl+'"' + ' download="' + tracks[index].artist + ' - ' + tracks[index].song + '.mp3"' + '><table class="arrow"><tr><td><div class="rect-arrow"></div></td></tr><tr><td class="'+triArrowString+'"></td></tr></table></a></li>');
						}
    				};
    				jQuery(track).data("hasDownloadButton", false);
    				xmlHttp.open("GET", "http://hypem.com/serve/source/" + tracks[index].id + "/" + tracks[index].key, true);
    				xmlHttp.send();
				});
			}		
		}
	};
	
	// Run it right away
	buttonScript();
	
	jQuery(document).ajaxComplete(function(event,request, settings){
		buttonScript();
   });

	// override hypem's handle_click function
	jQuery('#header, #player-container, #content-wrapper, #footer').off('click','a',handle_click);

	window.handle_click = function (event) {
	    log('handle_click(' + event + ') called');
	    if (event.which == 2 || jQuery(this).prop('target') == "_blank" || jQuery(this).prop('target') == "_top") {
	        event.stopPropagation();
	        return true;
	    }
	    if (jQuery(this).attr('href')) {
	        if (jQuery(this).attr('href').charAt(0) === '#') {
	            var offset = jQuery(jQuery(this).attr('href')).offset();
	            jQuery('html, body').animate({
	                scrollTop: offset.top,
	                scrollLeft: offset.left
	            });
	            if (is_html5_history_compat()) {
	                skip_update_page_contents = 1;
	                history.replaceState(null, null, document.location.protocol + '//' + document.location.host + document.location.pathname + jQuery(this).attr('href'));
	            }
	            return false;
	        }
	        t_elt = event.target || event.srcElement;
	        if (event.currentTarget.parentNode.className == "dl") {
	        	// let the shit download
	        	return true;
	    	} else if (t_elt.tagName != 'A') {
	        	console.log("A");
	            while (t_elt.tagName != 'A') {
	                t_elt = t_elt.parentNode;
	            }
	            url = t_elt.href;
	        } else {
	            url = t_elt.href;
	        }
	        if (url.match(/random$/)) {
	            load_random_track();
	        } else if (url.match(/random_search$/)) {
	            load_random_search();
	        } else {
	            load_url(url, null, event);
	            load_user_menu();
	        }
	        return false;
	    }
	};
	// re-bind the event
	jQuery('#header, #player-container, #content-wrapper, #footer').on('click','a',window.handle_click);
};

// Lets create the script objects
var injectedScript = document.createElement('script');
injectedScript.type = 'text/javascript';
injectedScript.text = '('+main+')("");';
(document.body || document.head).appendChild(injectedScript);





//Lets create the CSS object. This has to be done this way rather than the manifest.json
//because we want to override some of the CSS properties so they must be injected after.
var injectedCSS = document.createElement('link');
injectedCSS.type = 'text/css';
injectedCSS.rel = 'stylesheet';
injectedCSS.href = stylesheetUrl;
(document.body || document.head).appendChild(injectedCSS);

//var injectRandomCSS = document.createElement('style');
//injectRandomCSS = 'text/css';
//$$('<style type="ext/css">.'+triArrowString+'{ width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent;	border-top: 10px solid #494949; }</style>').appendTo("head");