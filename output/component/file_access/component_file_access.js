var component_file_access = ( function() {
	// this object is used to store private variables and methods across multiple instantiations
	var privates = {};
	var path = require("path");
	var exec = require('child_process').exec;
	var fs = require("fs");

  
	function _drawUi()
		{
		var menu = ["<li class='dropdown'>",
		"<a href='#' class='dropdown-toggle' data-toggle='dropdown'>File</a>",
		"<ul class='dropdown-menu'>",
		"<li class='dropdown-header'>File Management</li>",
		"<li><a onclick='$(document).triggerHandler(\"component_fileAccess_new\");'>New</a></li>",
		"<li><a onclick='$(document).triggerHandler(\"component_fileAccess_open\");'>Open</a></li>",
		"<li><a onclick='$(document).triggerHandler(\"component_fileAccess_save\");'>Save</a></li>",
		"<li><a onclick='$(document).triggerHandler(\"component_fileAccess_close\");'>Close</a></li>",
		"</ul>",
		"</li>"].join("\n");

		$("#position-navbar").append(menu);
		}

	$(document).keypress(function(event) {
		console.dir(event);
		var keycode = (event.keyCode ? event.keyCode : event.which);

		// ctrl + n / N
		if(event.ctrlKey && keycode == '14' ) { 
		    $(document).triggerHandler("component_fileAccess_new");
		}
		
		// ctrl + s / S
		if(event.ctrlKey && keycode == '19' ) { 
		    $(document).triggerHandler("component_fileAccess_save");
		}
		
		// ctrl + o / O
		if(event.ctrlKey && keycode == '15' ) { 
		    $(document).triggerHandler("component_fileAccess_open");
		}		

		// ctrl + w / W
		if(event.ctrlKey && keycode == '23' ) { 
		    $(document).triggerHandler("component_fileAccess_close");
		}	
	});



	$(document).on("component_fileAccess_close",function()
		{
		var filename = session.current_active_file;
		var tab_index = $.inArray(filename,tabs);		
		delete tabs[tab_index];
		delete editors[filename];
		$("#tab_"+tab_index).remove();
		$("#tab_content_"+tab_index).remove();
		$("#tab_content_textarea_"+tab_index).remove();
		session.current_active_file = "";
		});


	$(document).on("component_fileAccess_save",function()
		{
		var filename = session.current_active_file;
		if (filename != "")
			{
			//var tab_index = $.inArray(filename,tabs);
			//console.log(tab_index);
			var file_content = editors[filename]['content']
			
			support_saveFile(filename, file_content);		
			console.log("file "+ filename +" saved.");
			}
		});


	$(document).on("component_fileAccess_new",function()
		{
		if (session.current_project_xml == "")
			{
			ui_notify("error","Open a Project First.");
			}
		else		
			{			
		
			var html_content = ["<div class='input-group'>",
			"<input type='text' id='form_create_file' class='form-control'>",
			"<span class='input-group-addon'>.hx</span>",
			"</div>"].join("\n");
			
			ui_modal("newFile","New File","<p>This will create a new file in folder <b>Source</b> of your project</p>"+html_content,"Create","Cancel");
	
			$("#newFile").modal('show');
			$("#newFile_buttonOk").click(
				function()
				{
				//filename = $('#form_create_file').val();
			
				var filename = session.current_project_folder + $('#form_create_file').html()+path.sep+'source'+path.sep+support_capitalize($('#form_create_file').val())+'.hx';
				console.log(filename);
				support_createFile(filename);
				//var filename = $(this).val();
				// check for duplicate
			
				if (typeof(editors[filename]) ==  "undefined")
					{			
					var content = support_openFile(filename);
					filename_split = filename.split(path.sep);
					className = filename_split[filename_split.length-1].split('.')[0];				
			
					var new_content = ["package;",
										"",
										"class "+support_capitalize($('#form_create_file').val()),
										"{",
										"}"].join("\n");			
			
					editors[filename] = {'content':new_content,'classname':className};
					support_saveFile(filename, editors[filename]['content']);
					session.current_active_file = filename;
					tabs.push(filename); // adds to tab list
					ui_tabs_add(filename);
					}
				else
					{
					ui_notify("error","File already Opened");
					session.current_active_file = filename;
					}


				$("#newFile").modal('hide');
				$('#newFile').on('hidden.bs.modal', function () {
					$("#newFile").remove();
					});
				});		
			
			} // end else		
		});



	$(document).on("component_fileAccess_open_chooseFile",function()
		{		
		var chooser = $("#projectDialog");
		chooser.trigger('click');
		chooser.change(function(evt)
		    {
		    if (chooser.val() != "")
		        {
		        var filename = $(this).val();
		        $('#form_choose_project').val(filename);
		        }
		    });
		});




	$(document).on("component_fileAccess_open",function()
		{
		//session.current_project_xml = "a";
		if (session.current_project_xml == "")
			{
			ui_notify("error","Open a Project First.");
			}
		else		
			{
			var html_content = ["<div class='input-group'>",
			"<input type='text' id='form_choose_project' class='form-control'>",
			"<span onclick='$(document).triggerHandler(\"component_fileAccess_open_chooseFile\");' class='input-group-addon'>Choose</span>",
			"</div>",
			"<div style='display:none'><input id='projectDialog' type='file' /></div>"
			].join("\n");
				
			ui_modal("openProject","Open File","<p>Click the choose button to select</p>"+html_content,"Open","Cancel");
		
		
			$("#openProject").modal('show');
		
			$("#openProject_buttonOk").click(function(){
				var filename = $('#form_choose_project').val();		
				if (typeof(editors[filename]) ==  "undefined")
					{			
					var content = support_openFile(filename);
					filename_split = filename.split(path.sep);
					className = filename_split[filename_split.length-1].split('.')[0];				
				
					editors[filename] = {'content':content,'classname':className};
					session.current_active_file = filename;
					tabs.push(filename); // adds to tab list
					ui_tabs_add(filename);
					}
				else
					{
					ui_notify("error","File already Opened");
					session.current_active_file = filename;
					}
				
				$("#openProject").modal('hide');
				$('#openProject').on('hidden.bs.modal', function () 
					{
					$("#openProject").remove();
					})
				}); // end click
			} // else
		});




  
	function component() 
		{
		this.init = function init_component()
			{
			_drawUi();	    
			};
		}

	return component;
})();
