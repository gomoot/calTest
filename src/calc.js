var data = {}
var url="http://calctest.us-east-2.elasticbeanstalk.com/";
var fs = require('fs');
var operator = '';
const {dialog} = require('electron').remote;
var button = [ "bPlus" ,"bSub", "bMul", "bDiv", "bPow" ];
	
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
		switch(type) {
			case '+' : result = sum(value1,value2); break;
			case '-' : result = sub(value1,value2); break;
			case '*' : result = mul(value1,value2); break;
			case '/' : result = div(value1,value2); break;
			case '^' : result = pow(value1,value2); break;	
		}
		data.value1 = value1;
		data.value2 = value2;
		data.operator = type;
		data.result = result;
		
		manageButton(data.operator);
	}
	
	document.getElementById('result').value = result;
}

function load()
{
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
	
	if (!filename|| filename.length == 0) 
		return;
	
	fs.readFile(filename[0], 'utf8', function (err, jsonData) {
	  if (err) throw err;
		  
	  data = JSON.parse(jsonData);
	  setData(data)
		
	});
}

function setData(data) {
	
	if (!!data && !!data.value1 && !!data.value2 && 
		!!data.operator && !!data.result) {
		resetButton();
		document.getElementById('txtValue1').value = data.value1;
		document.getElementById('txtValue2').value = data.value2;
		document.getElementById('result').value = data.result;
			
		manageButton(data.operator);
	}
}

function save() {
	if (!data || !data.value1 ) {
		alert('Please input value A and B and click operator button (+, -,*,/, Pow)')
	}
	else {
		if (document.getElementById('cloud').checked ) 
			saveCloud();
		else 
			saveFile();
	}
}

function saveFile() {
	var filename ="";
	filename = dialog.showSaveDialog({properties: ['openFile'],
			filters: [
			  {name: 'JSON File Type', extensions: ['json']},
			  {name: 'All Files', extensions: ['*']}
			]
		  } );
	//console.log(filename);
	if (!filename|| filename.length == 0)  return;
	//let  dictstring = JSON.stringify(data); alert(dictstring);

	fs.writeFile(filename, JSON.stringify(data), (err) => {
		if (err) {
			console.error(err);
			return;
		};
		console.log("File has been created");
	});

}

function loadCloud() { 
	
	console.log("loadCloud");
	var xhr = new XMLHttpRequest();
	var urlLoad = url + "load";
	xhr.open("GET", urlLoad, true);
	//xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			//console.log("xhr.readyState " + xhr.readyState + ":" + xhr.responseText);
			if (!!xhr.responseText) {
				var json = JSON.parse(xhr.responseText);
			//alert(xhr.responseText)
				setData(json);
			}
		}
	};
	
	xhr.send();
}

function saveCloud() {
	
	var xhr = new XMLHttpRequest();
	var urlSave = url + "save"; 
	xhr.open("POST", urlSave, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			//var json = JSON.parse(xhr.responseText);
			alert(xhr.responseText)
		}
	};
	xhr.send(JSON.stringify(data));
	
}

function manageButton(operator) {
	let hightlight="";
	switch ( operator ){
		case '+' : hightlight = "bPlus" ; break;
		case '-' : hightlight = "bSub" ; break;
		case '*' : hightlight = "bMul" ; break;
		case '/' : hightlight = "bDiv" ; break;
		case '^' : hightlight = "bPow" ;  break;	
	} 
		
	if (hightlight !== "")
		document.getElementById(hightlight).style.backgroundColor ="#4CAF50";
}

function resetButton() {
	for (let i=0; i<button.length ; i++)
		document.getElementById(button[i]).style.backgroundColor="#e7e7e7";
}

function div(x,y) {
	if (y==0) return 0;
	return x/y;
}

function mul(x,y) {
	return x*y;
}

function sum(x,y) {
	return x+y;
}

function sub(x,y) {
	return x-y;
}

function pow(x,y) {
	return  Math.pow(x,y);;
}