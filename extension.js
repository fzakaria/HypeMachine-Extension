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
		var tracks = trackList[document.location.href];
		if (tracks === undefined || tracks.length < 1) {
			setTimeout(buttonScript, 1);
		} else {
			// Check if this particular page has been processed
			// through a previous call
			if (jQuery('.dl').length < 1) {
				jQuery('ul.tools').each(function(index, track) {
					var songUrl = "/serve/play/"+tracks[index].id+"/";
					songUrl += tracks[index].key;
					songUrl += ".mp3";
					jQuery(track).append('<li class="dl"><table class="spacer"></table><a href="'+songUrl+'"><table class="arrow"><tr><td><div class="rect-arrow"></div></td></tr><tr><td class="'+triArrowString+'"></td></tr></table></a></li>');
					});
			}		
		}
	};
	
	// Run it right away
	buttonScript();
	
	jQuery(document).ajaxComplete(function(event,request, settings){
		buttonScript();
   });
	

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