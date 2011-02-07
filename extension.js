//This is the main javascript that will handle the injection of the download
//button on to the hypemachine website.

//Variables
var downloadImageUrl = chrome.extension.getURL("./images/downloadButton.png");

var stylesheetUrl = chrome.extension.getURL("hypestyles.css");

//we save backslash in a variable because there seemed to be an error nesting strings in strings
var backSlash = "/";


//This is the script to inject the download button for each list item
var buttonScript = "function add_download_btn() {\
		var count =0;\
		var songUrl = 0;\
		$$('ul.tools').each(function(index) {\
			songUrl = \"/serve/play/\"+trackList[document.location.href][count].id+\"/\";\
			songUrl += trackList[document.location.href][count].key + \".mp3\";\
			index.insertAdjacentHTML(\"AfterBegin\", \"<li class=\\\"cext\\\"><a href=\"+songUrl+\"> <img class=\\\"cext\\\" src="+downloadImageUrl+"></a></li>\");\
			count+=1;\
			});\
		}\
		add_download_btn();";	

//this is the script where we override the handle_click event
//This was the best function I found to override in order to be able to 
//make sure the script runs on every ajax call and such that the list elements have been created
//TODO: Improve
var clickScript = "function handle_click(event) {\
	console.debug('Personal Function Called');\
	if (!event) {\
		var event = window.event;\
	}\
	t_elt = event.target || event.srcElement;\
	if(t_elt.tagName != 'A') { \
		while(t_elt.tagName!='A') {\
			t_elt = t_elt.parentNode;\
		}\
		url = t_elt.href; \
	} else { \
		url = t_elt.href; \
	}\
    if (url.match(/random$/)) { load_random_track(); }\
    else if (url.match(/random_search$/)) { load_random_search(); }\
    else { load_url(url); }\
	waitForLoad();\
	return false;\
}";

//Lets create the script objects	
var buttonInjectScript = document.createElement('script');
buttonInjectScript.type = 'text/javascript';
buttonInjectScript.text = buttonScript;

var clickEventScript = document.createElement('script');
clickEventScript.type = 'text/javascript';
clickEventScript.text = clickScript;

//Lets create the CSS object. This has to be done this way rather than the manifest.json
//because we want to override some of the CSS properties so they must be injected after.
var elementCSS = document.createElement('link');
elementCSS.type = 'text/css';
elementCSS.rel = 'stylesheet';
elementCSS.href = stylesheetUrl;
	

function appendScript()
{
	$("div#footer").append(elementCSS);
	$("div#footer").append(buttonInjectScript);
	$("div#footer").append(clickEventScript);
}

var attempts = 0;
function waitForLoad()
{
	//doesn't exist yet so lets wait for load
	if ($('ul.tools').length ==0 && attempts < 10)
	{
		console.debug("Couldn't find ul.tools, waiting 500ms on try #: "+attempts);
		attempts += 1;
		setTimeout(function() {waitForLoad();}, 500);
	}
	else
	{
		appendScript();
	}

}

//lets start and try appending right from the start anyways
document.head.appendChild(clickEventScript);
waitForLoad();

