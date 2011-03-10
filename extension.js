// Extension main script

var downloadImageUrl = chrome.extension.getURL("/images/downloadButton.png");
var stylesheetUrl = chrome.extension.getURL("hypestyles.css");

// This is all the JS that will be injected in the document body
var main = function(downloadImageUrl) {
	// Adds a download button next to each track
	var buttonScript = function() {
		// Wait for the tracks script to load
		var tracks = trackList[document.location.href];
		if (tracks === undefined || tracks.length < 1) {
			setTimeout(buttonScript, 1000);
		} else {
			// Check if this particular page has been processed
			// through a previous call
			if ($$('.cext').length < 1) {
				$$('ul.tools').each(function(track, index) {
					var songUrl = "/serve/play/"+tracks[index].id+"/";
					songUrl += tracks[index].key + ".mp3";
					track.insertAdjacentHTML("AfterBegin", '<li class="cext"><a href="'+songUrl+'"> <img class="cext" src="'+downloadImageUrl+'"></a></li>');
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
injectedScript.text = '('+main+')("'+downloadImageUrl+'");';
(document.body || document.head).appendChild(injectedScript);

//Lets create the CSS object. This has to be done this way rather than the manifest.json
//because we want to override some of the CSS properties so they must be injected after.
var injectedCSS = document.createElement('link');
injectedCSS.type = 'text/css';
injectedCSS.rel = 'stylesheet';
injectedCSS.href = stylesheetUrl;
(document.body || document.head).appendChild(injectedCSS);
