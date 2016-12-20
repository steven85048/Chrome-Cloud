function sendToDatabase (info,tab) {
    var selectionType = info.mediaType;
	
	var objContent;
	
	if (selectionType == "image")
		objContent = info.srcUrl;
	
	else if (selectionType == "video")
		objContent = info.pageUrl;
	
	else {
		var selection = info.selectionText;
		var objLink = info.linkUrl;
		
		if (selection != null){
			objContent = selection;
			selectionType = "text";
		} else { //objLink != null
			objContent = objLink;
			selectionType = "link";
		}
	}
	
	var date = new Date().toJSON().slice(0,10);
		
	var jsonObject = {
		type : selectionType,
		content : objContent,
		dateAdded : date,
		name : "Default Name",
		description : "Stuff Added",
		folder : "Default_Folder",
	};
	
	alert(JSON.stringify(jsonObject));
}

chrome.contextMenus.create({
  title: "Add to Clipboard", 
  contexts:["selection", "image", "link", "video"], 
  onclick: sendToDatabase,
});

// Create the XHR object.
function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	
	if ("withCredentials" in xhr) {
		xhr.open(method, url, true);
		
	} else if (typeof XDomainRequest != "undefined") {
		xhr = new XDomainRequest();
		xhr.open(method, url);
		
	} else {
		xhr = null;
	}
	
	return xhr;
}