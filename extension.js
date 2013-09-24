// Extension main script

var stylesheetUrl = chrome.extension.getURL("hypestyles.css");

// This is all the JS that will be injected in the document body
var main = function() {

  /**
   * Return outerHTML for the first element in a jQuery object,
   * or an empty string if the jQuery object is empty;  
   */
  jQuery.fn.outerHTML = function() {
     return (this[0]) ? this[0].outerHTML : '';  
  };
  
   /**
   * Utility to wrap the different behaviors between W3C-compliant browsers
   * and IE when adding event handlers.
   *
   * @param {Object} element Object on which to attach the event listener.
   * @param {string} type A string representing the event type to listen for
   *     (e.g. load, click, etc.).
   * @param {function()} callback The function that receives the notification.
   */
   function addListener(element, type, callback) {
    if (element.addEventListener) element.addEventListener(type, callback);
    else if (element.attachEvent) element.attachEvent('on' + type, callback);
   }

   /***
   * The name _dlExtGATracker is chosen so as not to conflict with HypeMachine's possible
   * use of Google Analytics object.
   */
   (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
   })(window,document,'script','//www.google-analytics.com/analytics.js','_dlExtGATracker');

   _dlExtGATracker('create', 'UA-44161401-1', 'hypem.com');
   _dlExtGATracker('send', 'pageview');

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
		// Wait for the tracks script to load
		var tracks = window.displayList['tracks'];
		 
    if (tracks === undefined || tracks.length < 1) {
		 	setTimeout(buttonScript, 1);
		} 
    else {
			// Check if this particular page has been processed
			// through a previous call
      if (jQuery('.dl').length < tracks.length) {
				jQuery('ul.tools').each(function(index, track) {
          var song = tracks[index];
          var title = song.song;
          var artist = song.artist;
          var id = song.id;
          var key = song.key;
          var hasDownloadButton = jQuery(track).data("hasDownloadButton");
          if (typeof(hasDownloadButton) === 'undefined' || !hasDownloadButton){
            jQuery.getJSON("/serve/source/"+ id + "/" + key, function(data) {
              var download_url = data.url;
              var download_button = document.createElement("a");
              download_button.target = "_top";
              download_button.href = download_url;
              download_button.className = "DownloadSongButton";
              download_button.download = artist + ' - ' + title + '.mp3';
              download_button.innerHTML = '<table class="arrow"><tr><td><div class="rect-arrow"></div></td></tr><tr><td class="'+triArrowString+     '"></td></tr></table>';
              jQuery(track).prepend('<li class="dl"><table class="spacer"></table>' + jQuery(download_button)[0].outerHTML + '</li>');
            });
            jQuery(track).data("hasDownloadButton", true);
          }
          
        });//each		
      }
    }
  };//buttonscript
  
  
  jQuery('ul.tools').on('click', '.DownloadSongButton', function() {
    console.log( "Downloading - " + jQuery(this)[0].download );
    _dlExtGATracker('send', 'event', 'download', 'click', 'song-downloads', 1);
  });
	
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
