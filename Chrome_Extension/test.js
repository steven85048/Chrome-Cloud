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

var xhr = createCORSRequest("GET", "http://192.168.0.35:1234/write");

var jsonObject = {
		objType : "text",
		content : "content",
		dateAdded : "03-02-1998",
		name : "Default Name",
		description : "Stuff Added",
		folder : "Default_Folder",
	};

xhr.setRequestHeader("Data", JSON.stringify(jsonObject));
xhr.withCredentials = true;

xhr.addEventListener("load", function listener(){
	var text = xhr.responseText;
	document.getElementById("div").innerHTML = text;
});

xhr.send();