var os = require('os');
var fs = require("fs");

function support_checkOS(){
    switch(os.type())
        {
        case "Windows_NT":
            return 'windows'
            break;
        case "Linux":
            return 'linux'
            break;
        }
    }
    
function support_capitalize(myString)
	{
	firstChar = myString.substr( 0, 1 ); // == "c"
	firstChar = firstChar.toUpperCase();
	tail = myString.substr( 1 ); // == "heeseburger"
	myString = firstChar + tail; // myString == "Cheeseburger"
	return myString;
	}
    
    

function support_createFile(filename)
	{
	fs.openSync(filename,"wx");
	}
	
function support_openFile(filename)
    {
    return fs.readFileSync(filename,"utf-8");
    }

function support_saveFile(filename, content)
    {
    fs.writeFileSync(filename, content);
    //console.log("SYSTEM: file saved "+filename);
    }
        
