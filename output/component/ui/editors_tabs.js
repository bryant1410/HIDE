var path = require("path");

function ui_tabs_add(id)
	{
	var tab_name = id.split(path.sep).pop();
	var tab_index = $.inArray(id,tabs);
	console.log(tab_index);
	
	

	tab_str = "<li id='tab_"+tab_index+"'><a onclick='ui_tabs_activate("+tab_index+");'>"+tab_name+"</a></li>";
	$("#tabs_position").append(tab_str);
	
	// add editor
	tab_content = "<div style='display:none;' name='tab_content_"+tab_index+"' id='tab_content_"+tab_index+"'><textarea id='tab_content_textarea_"+tab_index+"'>"+editors[id]['content']+"</textarea></div>";
	$("#tabs_content_position").append(tab_content);
	
	
    editors[id]['cm'] = CodeMirror.fromTextArea($("#tab_content_textarea_"+tab_index)[0], {
        lineNumbers: true,
        lineWrapping:true,
        matchBrackets:true,
        styleActiveLine:true,
        indentUnit:4,
        smartIndent:true,
        indentWithTabs:true
        });	
    
  
	editors[id]['cm'].setOption("theme","blackboard");
	editors[id]['cm'].on("change",function(data)
		{
		editors[id]['content'] = data.getValue();
		
		var the_index = editors[id]['cm'].getDoc().indexFromPos(editors[id]['cm'].getCursor());
		editors[id]['carot_pos'] =  the_index;
	    editors[id]['last_key'] = data.getValue()[the_index -1];
	    editors[id]['last_last_key'] = data.getValue()[the_index -2];
		
		if (editors[id]['last_key'] == ".")
			{
			if (isNaN(editors[id]['last_last_key']) == true)
				{
				$(document).triggerHandler("autocomplete");
				}
			}
		});	
		

	ui_tabs_activate(tab_index);
	editors[id]['cm'].refresh();
	}
	
function ui_tabs_activate(tab_index)
	{
	//console.dir();
	session.current_active_file = tabs[tab_index];
	$("#tabs_content_position").children().css('display','none');
	$("#tabs_position").children().removeClass('active');
	$("#tab_content_"+tab_index).css('display','block');
	$("#tab_"+tab_index).addClass('active');
	}	
	
