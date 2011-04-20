// Extension main script

var stylesheetUrl = chrome.extension.getURL("hypestyles.css");

// This is all the JS that will be injected in the document body
var main = function() {
	// Adds a download button next to each track
	var buttonScript = function() {
		// Wait for the tracks script to load
		var tracks = trackList[document.location.href];
		if (tracks === undefined || tracks.length < 1) {
			setTimeout(buttonScript, 1);
		} else {
			// Check if this particular page has been processed
			// through a previous call
			if ($$('.dl').length < 1) {
				$$('ul.tools').each(function(track, index) {
					var songUrl = "/serve/play/"+tracks[index].id+"/";
					songUrl += tracks[index].key;
					track.insertAdjacentHTML("AfterBegin", '<li class="dl"><table class="spacer"></table><a href="'+songUrl+'"><table class="arrow"><tr></td><td><div class="rect"></div></td></td></tr><tr><td class="tri"></td></tr></table></a></li>');
					});
			}		
		}
	};

	// Run it right away
	buttonScript();

	// Re-display buttons after an Ajax update is complete
	Ajax.Responders.register({
		onComplete: buttonScript
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