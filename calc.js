var data = {}
var fs = require('fs');
var operator = '';
const {dialog} = require('electron').remote;
var button = ["bSub", "bMul", "bPlus" , "bPow" , "bDiv"];
	
function resetButton() {
	for (let i=0; i<button.length ; i++)
		document.getElementById(button[i]).style.backgroundColor="#e7e7e7";
}

function calculate(type){
	let result = 0;
	let value1 = parseInt(document.forms[0][0].value);
	let value2 = parseInt(document.forms[0][1].value);
		//alert(value1 + " " + type + " " + value2 ) ;
	
	resetButton();
	if (isNaN(value1) || isNaN(value2))
		result = "Please input number !!" ; 
	else {
		let hightlight = '' 
		switch(type)
		{
			case '+' : result = value1 + value2; hightlight = "bPlus";  break;
			case '-' : result = value1 - value2; hightlight = "bSub"; break;
			case '*' : result = value1 * value2; hightlight = "bMul";break;
			case '/' : result = value1 / value2; hightlight = "bDiv"; break;
			case '^' : result = Math.pow(value1, value2); hightlight = "bPow"; break;
			
		}
		data.value1 = value1;
		data.value2 = value2;
		data.operator = type;
		data.result = result;
	
		if (hightlight !== "")
			document.getElementById(hightlight).style.backgroundColor ="#4CAF50";
	
	}
	
	document.getElementById('result').value = result;
	
	//window.alert(result);  
		
};

function load()
{
	//alert(document.getElementById('cloud').checked );
	if (document.getElementById('cloud').checked ) 
		loadCloud();
	else 
		loadFile();
}



function loadFile() {
	var filename = "";
	filename = dialog.showOpenDialog({properties: ['openFile'],
			filters: [
			  {name: 'JSON File Type', extensions: ['json']},
			  {name: 'All Files', extensions: ['*']}
			]
		  } );
	
	if (filename === undefined) 
		return;
	
	fs.readFile(filename[0], 'utf8', function (err, jsonData) {
	  if (err) throw err;
		  
	  data = JSON.parse(jsonData);
	  setData(data)
		
	});
}

function setData(data) {
	resetButton();
	document.getElementById('txtValue1').value = data.value1;
	document.getElementById('txtValue2').value = data.value2;
	document.getElementById('result').value = data.result;
		
	let hightlight="";
	switch ( data.operator ) 
	{
		case '+' : hightlight = "bPlus" ; break;
		case '-' : hightlight = "bSub" ; break;
		case '*' : hightlight = "bMul" ; break;
		case '/' : hightlight = "bDiv" ; break;
		case '^' : hightlight = "bPow" ;  break;
			
	} 
		
	if (hightlight !== "")
		document.getElementById(hightlight).style.backgroundColor ="#4CAF50";
}

function save() {
	if (document.getElementById('cloud').checked ) 
		saveCloud();
	else 
		saveFile();
}

function saveFile() {
	var filename = dialog.showSaveDialog({properties: ['openFile'],
			filters: [
			  {name: 'JSON File Type', extensions: ['json']},
			  {name: 'All Files', extensions: ['*']}
			]
		  } );
	//console.log(filename);
	if (filename === undefined) return;
	let  dictstring = JSON.stringify(data); alert(dictstring);
	//var fs = require('fs');
	//fs.writeFile("thing.json", dictstring);
	fs.writeFile(filename, dictstring, (err) => {
		if (err) {
			console.error(err);
			return;
		};
		console.log("File has been created");
	});

}

function loadCloud() {

	var xhr = new XMLHttpRequest();
	var url = "http://127.0.0.1:3000/load";
	xhr.open("GET", url, true);
	//xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var json = JSON.parse(xhr.responseText);
			//alert(xhr.responseText)
			setData(json);
		}
	};
	
	xhr.send();


}

function saveCloud() {
	var xhr = new XMLHttpRequest();
	var url = "http://127.0.0.1:3000/save";
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			//var json = JSON.parse(xhr.responseText);
			alert(xhr.responseText)
		}
	};
	//var data = JSON.stringify({"email": "hey@mail.com", "password": "101010"});
	xhr.send(JSON.stringify(data));
}

