// command to create server
// $ haxe -v --wait 6000
// cd /D c:\flixel & openfl display flash -- get project stats
// C:\flixel>haxe -lib openfl -lib flixel -cp C:\flixel\source -main ProjectClass -v --display C:\flixel\source\ProjectClass.hx@30
// C:\Users\Administrator>haxe -lib openfl -lib flixel -cp C:\flixel\source -main ProjectClass --display C:\flixel\source\ProjectClass.hx@385

//cd /home/pah/haxeflixel/test ; 
//haxe -main ApplicationMain  -lib openfl -lib flixel -cp source -D tools=1 -D openfl_ver=1.0.10 -D openfl -D display -D web -cp export/flash/haxe --display /home/pah/haxeflixel/test/source/MenuState.hx@641 


var sys = require('sys');
var exec = require('child_process').exec;


$(document).on("autocomplete",function(event){

	if (settings.autosave_for_autocomplete == true)
		{
		$(document).triggerHandler("component_fileAccess_save");	
		}
	

	var id = session['current_active_file'];
	var tab_index = tabs[id];
	var carot_pos = editors[id]['carot_pos'];
	var classname = editors[id]['classname'];
	
	
	var exec_str = "";
	if (support_checkOS() == "linux")
		{
		join_str = " ; ";
		join_str_cd = "";
		}
	if (support_checkOS() == "windows")
		{
		join_str = " & ";
		join_str_cd = " /D ";
		}			
	
	var exec_str = ["cd "+join_str_cd+session.current_project_folder+join_str,
					"haxe "+session.current_project_xml_parameter + " --display "+id+"@"+carot_pos ].join("\n");
	
	console.log(exec_str);				
	exec(exec_str,function(error,stdout,stderr)
		{
		//console.dir(stderr);
		if (stderr.charAt(0) == "<")
			{
			editors[id]['autocomplete_cache'] = stderr;
			$(document).triggerHandler("display_autocomplete");
			//console.dir(stderr);
			}
		else
			{
			ui_notify("error",stderr);
			}
		});
	
});


$(document).on("display_autocomplete",function(event){
	var id = session['current_active_file'];
	var tab_index = tabs[id];
	var carot_pos = editors[id]['carot_pos'];
	var classname = editors[id]['classname'];
	
	var autocomplete = editors[id]['autocomplete_cache'];
	
	var json = $.xml2json(autocomplete);
	var haxeHint = [];
	//console.dir(json);
	
	
	if (json instanceof Object)
		{
		if (json.hasOwnProperty("i")) // multiple return
			{
			var json_array = json.i;
		    for (i = 0;i < json_array.length;i++)
		        {
		        var cur = json_array[i];
		        haxeHint.push(cur.n);
		        }			
			}
		}
		
	localStorage.haxeHint = haxeHint;
    CodeMirror.showHint(editors[id]['cm'],CodeMirror.hint.haxe);

	
	/*
	if (json instanceof Object == true)
		{
        json_array = json.i;
        for (i = 0;i < json_array.length;i++)
            {
            var cur = json_array[i];
            haxeHint.push(cur.n);
            }
		}
	else
		{
		}
		
    localStorage.haxeHint = haxeHint;
    CodeMirror.showHint(editors[id]['cm'],CodeMirror.hint.haxe);
    */
});
