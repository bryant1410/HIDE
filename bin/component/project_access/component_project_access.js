var component_project_access = ( function() {
	// this object is used to store private variables and methods across multiple instantiations
	var privates = {};
	var path = require("path");
	var exec = require('child_process').exec;
	var fs = require("fs");

  
	function _drawUi()
		{
		var menu = ["<li class='dropdown'>",
		"<a href='#' class='dropdown-toggle' data-toggle='dropdown'>Project</a>",
		"<ul class='dropdown-menu'>",
		"<li class='dropdown-header'>Project Management</li>",
		"<li><a onclick='$(document).triggerHandler(\"component_projectAccess_new\");'>New</a></li>",
		"<li><a onclick='$(document).triggerHandler(\"component_projectAccess_open\");'>Open</a></li>",
		"<li><a onclick='$(document).triggerHandler(\"component_projectAccess_configure\");'>Configure</a></li>",
		"<li><a onclick='$(document).triggerHandler(\"component_projectAccess_close\");'>Close</a></li>",
		"</ul>",
		"</li>"].join("\n");

		$("#position-navbar").append(menu);
		}



	$(document).on("component_projectAccess_open_chooseFile",function()
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



	$(document).on("component_projectAccess_open_parseProject",function()
		{
		var exec_str = "";
		exec_str = "openfl display "+session.current_project_xml+" -hxml flash";
		exec(exec_str,
			function(error,stdout,stderr){
			    var the_error = false;
			    
			    if (stderr != "") {the_error = true;}
			    
			    if (the_error == true){
			        ui_notify ("error","not a valid HaxeFlixel Project File (XML)");
			        session.current_project_xml = "";
			         session.current_project_folder = "";
			        }
			    if (the_error == false) {
			       	//session.current_project_xml_parameter = stdout;
					var filename = session.current_project_xml;		       	
				    var projectFolder = filename.split(path.sep);
				    projectFolder.pop();
				    projectFolder = projectFolder.join(path.sep);                
				    session.current_project_folder = projectFolder;
			       	
			       	
			       	
			        var content_push = [];
			        var content = stdout.split("\n");
			        var i = 0;
			        for (i = 0 ; i < content.length;i++)
			            {
			            var cur = content[i];
			            if (cur.indexOf('-lib') == 0) // starts with
			                {
			                content_push.push(cur);
			                }
			            else if (cur.indexOf('-cp') == 0) 
			                {
			                content_push.push(cur);
			                }
			            else if (cur.indexOf('-main') == 0) 
			                {
			                content_push.push(cur);
			                }                        
			            else if (cur.indexOf('-D') == 0) 
			                {
			                content_push.push(cur);
			                }                        
			            }
			        content = content_push.join(' ');
			        session.current_project_xml_parameter = content;
			        $(document).trigger("component_projectAccess_open_parseProject_complete");
			    } // stdout != ""
			});
		});












	$(document).on("component_projectAccess_new",function()
		{
		var html_content = ["<div class='input-group'>",
		"<input type='text' id='form_create_project' class='form-control'>",
		"</div>"].join("\n");
			
		if (support_checkOS() == 'linux'){
			nwworkingdir="~/haxeflixel/&lt;your_project_name&gt;"
			}
		if (support_checkOS() == 'windows'){
			nwworkingdir="C:\\haxeflixel\\&lt;your_project_name&gt;";
			}		
		
		ui_modal("newProject","Create New Project","<p>Enter your <b>project name</b> below.<br/>This will create a new project in the <b>"+nwworkingdir+"</b> folder</p>"+html_content,"Create","Cancel");
	
	
		$("#newProject").modal('show');
	
		$("#newProject_buttonOk").click(function(){
			if($("#form_create_project").val() != "")
			{
		
			if (support_checkOS() == 'linux')
				{
				os_cmd = ["cd ~",
						"mkdir haxeflixel",
						"cd haxeflixel",
						"mkdir \""+$("#form_create_project").val()+"\"",
						"cd \""+$("#form_create_project").val()+"\"",
						"haxelib run flixel -name \""+$("#form_create_project").val()+"\""
						].join(" ; ");
				}

			if (support_checkOS() == 'windows')
				{
				os_cmd = ["cd /D c:\\",
						"mkdir haxeflixel",
						"cd haxeflixel",
						"mkdir \""+$("#form_create_project").val()+"\" ",
						"cd \""+$("#form_create_project").val()+"\"",
						"haxelib run flixel -name \""+$("#form_create_project").val()+"\""
						].join(" & ");
				}
		
		
			//console.log(os_cmd);
		
			exec(os_cmd,
				function(error,stdout,stderr){
				    if (error != null)
				        {
				        ui_notify("error",stderr);
				        }
		
				    }
				);
		


		        //var filename = $(this).val();
		        //var filename = ""
		        
		        var filename = "";
		   		if (support_checkOS() == 'linux')
		   		{
		   		filename = "~/haxeflixel/"+$("#form_create_project").val()+"/"+$("#form_create_project").val()+".xml";
		   		}
		   		if (support_checkOS() == 'windows')
		   		{
		   		filename = "c:\\haxeflixel\\"+$("#form_create_project").val()+"\\"+$("#form_create_project").val()+".xml";
		   		}
		        //console.log(filename);
		        session.current_project_xml = filename;
		        
		        //system_parse_project();
		        
				$(document).triggerHandler("component_projectAccess_open_parseProject");			

	
	
	

			$("#newProject").modal('hide');
			$('#newProject').on('hidden.bs.modal', function () 
				{
				$("#newProject").remove();
				});
		
			} // if project != ''
			}); // end click		
		
		
		});











	








	$(document).on("component_projectAccess_open",function()
		{
		if (session.current_project_xml != "")
			{
			ui_notify("error","Only 1 project could be open at one time.");
			}
		else
			{
			var html_content = ["<div class='input-group'>",
			"<input type='text' id='form_choose_project' class='form-control'>",
			"<span onclick='$(document).triggerHandler(\"component_projectAccess_open_chooseFile\");' class='input-group-addon'>Choose</span>",
			"</div>",
			"<div style='display:none'><input id='projectDialog' type='file' /></div>"
			].join("\n");
				
			ui_modal("openProject","Open Project","<p>Click the choose button to select</p>"+html_content,"Open","Cancel");
		
		
			$("#openProject").modal('show');
		
			$("#openProject_buttonOk").click(function(){
				session.current_project_xml = $('#form_choose_project').val();		
		
				
				//editor_system_projectAccess_parseProject();
				$(document).triggerHandler("component_projectAccess_open_parseProject");			
				$("#openProject").modal('hide');
				$('#openProject').on('hidden.bs.modal', function () 
					{
					$("#openProject").remove();
					})
			
			
				}); // end click
			} // end else
		});
		
	$(document).on("component_projectAccess_configure",function()
		{
		alert('configure');
		});

	$(document).on("component_projectAccess_close",function()
		{
		alert('close');
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
