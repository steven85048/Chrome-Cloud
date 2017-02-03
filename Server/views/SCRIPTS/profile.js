window.onload = function() {
	// ajax request to obtain data of user in a json object
	getData(addDataToPage, "Default_Folder");
}

var currSelected = [];

/** GLOBAL VARIABLE TO LISTEN WHEN CONTROL IS PRESSED BY USER **/

var cntrlPressed = false;

$(document).keydown(function(event) {
	if (event.which = "17")
		cntrlPressed = true;
});

$(document).keyup(function() {
	cntrlPressed = false;
});

function moveElement(cb, objIds, currFolder, newFolder) {
	$.ajax({
		type: "GET",
		url : "/move",
		beforeSend: function(request) {
			var obj = {ids : objIds};
			request.setREquestHeader("IDMove", JSON.stringify(obj));
			request.setRequestHeader("fromFolder", currFolder);
			request.setRequestHeader("toFolder", newFolder);
		},
		success: function(res) {
			console.log("Moved Folders!");
		}
	});
}

function deleteElement(cb, objIds, folder){
	$.ajax({
		type: "GET",
		url : "/delete",
		beforeSend: function(request) {
			var obj = {ids : objIds};
			request.setRequestHeader("IDDelete", JSON.stringify(obj));
			request.setRequestHeader("folder", folder);
		},
		success: function(res) {
			console.log("deleted!");
		}
	});
}

// gets session data with ajax call to server
function getData(cb, folder) {
	$.get('/data', function (res) {
		var user = JSON.parse(res);
		
		// populate bar with folder names
		var folderList = [];
		
		// get data corresponding to folder name
		for (var i = 0 ; i < user.data.length; i++){
			folderList.push(user.data[i].folder);
			
			if (user.data[i].folder == folder)
				cb(user.data[i].content, user.data[i].folder);
		}

		// use array of folders to populate bar
		var listWrapper = document.getElementById("sidebar-list");
		for (var i = 0 ; i < folderList.length; i++){
			var enclosingList = document.createElement('li');
			var innerLink = document.createElement('a');
			
			innerLink.innerHTML = folderList[i];
			innerLink.setAttribute('class', 'folder');
			innerLink.setAttribute('href', '#' + folderList[i]);
			
			enclosingList.appendChild(innerLink);
			listWrapper.appendChild(enclosingList);
		}
	});
}
  
// adds data to page given folder
function addDataToPage(data, folder) {	
	for (var i = 0 ; i < data.length ; i++) {
		// verify if folder of data is correct		
		var caLeft = $('#data_container_0');
		var caRight = $('#data_container_1');
		
		var leftHeight = caLeft.outerHeight(true);
		var rightHeight = caRight.outerHeight(true);
					
		var cardArea;
		
		// ADD element to side that has a lower height
		
		if (leftHeight <= rightHeight)
			cardArea = caLeft;
		else 
			cardArea = caRight;
		
		// add enclosing div
		
		var enclosingDiv = document.createElement('div');
		enclosingDiv.className = 'card';
		
		// attach different data based on object type
		
		var objType = data[i].objType;
		var comp = data[i].content;
					
		var template;
		var id = data[i]._id;
		
		console.log(id);
		
		if (objType == 'text'){
			template = document.getElementById('text-template');
			template.content.querySelector('p').innerHTML = comp;
			template.content.querySelector('p').setAttribute('objId', id);
			template.content.querySelector('p').setAttribute('class', 'well element');
		}
		else if (objType == 'link'){
			template = document.getElementById('link-template');	
			template.content.querySelector('a').src = comp;
			template.content.querySelector('a').setAttribute('objId', id);
			template.content.querySelector('a').setAttribute('class', 'well');
		}
		else if (objType == 'image'){
			template = document.getElementById('photo-template');
			template.content.querySelector('img').src = comp;
			template.content.querySelector('img').setAttribute('objId', id);
			template.content.querySelector('img').setAttribute('class', 'well img-rounded');
		}
		
		enclosingDiv.addEventListener("click", function(template) {
			return function() {
				// convert element to jqueryElement
				var jTemplate = $(template);
				var selectedId = jTemplate.find(".element").children().first().attr("objid");

				if (!cntrlPressed) {
					deselectBoard();
					jTemplate.addClass("selected");
					
					currSelected = [];
					currSelected.push(selectedId);
				}
				else { // cntrlPressed				
					if (jTemplate.hasClass("selected")){
						jTemplate.removeClass("selected");
						
						// remove the object id from the array
						var index = currSelected.indexOf(selectedId);
						console.log(index);
						if (index > -1)
							currSelected.splice(index, 1);
					} // unselected -> selected
					else {
						jTemplate.addClass("selected");
						currSelected.push(selectedId);
					}
				}
				
				console.log(currSelected);	
			}
		}(enclosingDiv));
		
		// add removal icon
		var exitIcon = document.createElement('i');
		exitIcon.setAttribute('class', 'glyphicon glyphicon-remove remove-icon');
		exitIcon.addEventListener("click", function(entId) {
			return function() {
				var arr = [entId];
				deleteElement(null, arr, folder);
				
				// remove the element from the html
				// TO BE DONE
				
			}
		}(id));
		enclosingDiv.appendChild(exitIcon);
		
		var contentClone = window.document.importNode(template.content, true);
		enclosingDiv.appendChild(contentClone);
		
		
		// Add everything to original card area
		cardArea.append(enclosingDiv)
		
	}
}

// manage the current elements so left and right columns are even
function resetBoard() {
	// TO BE DONE
}

// deselects all selected elements from css
function deselectBoard() {
	var leftColumnSelected = $('#data_container_0').children('.selected').removeClass("selected");
	var rightColumnSelected = $('#data_container_1').children('.selected').removeClass("selected");
}

function downloadPhotosAsZip(){
	// TO BE DONE
}
