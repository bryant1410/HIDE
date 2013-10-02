package core;
import jQuery.*;
import ui.*;
import Utils;

class ProjectAccess
{
	public static function createNewProject()
	{
		trace ("create a new project");
		
		// this is how to notify the user
		var notify = new Notify();
		notify.type = "error";
		notify.content = "Just to test notify!";
		notify.show();
		
		// this is how to open a model
		var modalDialog = new ModalDialog();
		modalDialog.id='projectAccess_new';
		modalDialog.title= 'New Project';
		modalDialog.content = 'this is just a sample';
		modalDialog.ok_text = "Create";
		modalDialog.cancel_text = "Cancel";
		modalDialog.show();
		
		new JQuery("#projectAccess_new .button_ok").on("click",
			function()
			{
				trace("you've clicked the OK button");
				//modal.hide();
			});
	}
	
	public static function openProject()
	{
		trace("open a project");

		if (Main.session.current_project_xml == "")
		{
			var modal = new ModalDialog();
			modal.id='projectAccess_openProject';
			modal.title= 'Open Project';
			modal.content = '<input id="ProjectAccess_openProject_file" type="file" />';
			modal.ok_text = "Open";
			modal.cancel_text = "Cancel";
			
			modal.updateModalDialog();
			//modal.show();

			var file_input = new JQuery("#ProjectAccess_openProject_file");
			file_input.click();
			file_input.change(function(event)
				{
				if (file_input.val() != "")
					{
						Main.session.current_project_xml = file_input.val();
						//modal.hide();
						Utils.system_parse_project();
					}
				});			
		}
		else
		{
			var notify = new Notify();
			notify.type = "error";
			notify.content = "Only One project could be open at one time. Please close the project first.";
			notify.show();			
		}

	}

	/*
	public static function parseProject()
	{
		trace('parse the project');
		//trace(Main.session.current_project_xml);
		
		// if file is xml, convert to hxml
		var skip = true;
		var test_extension = Main.session.current_project_xml.split(".");
		if (test_extension[1] == "xml") // need to convert to hxml
			{
			exec_str = "openfl display "+session.current_project_xml+" -hxml flash";
			//Utils.exec
			}
		else if (text_extension[1] == "hxml")
			{

			}
		else
			{
			var notify = new Notify();
			notify.type = "error";
			notify.content = "Currently we only support haxe XML and HXML extension.";
			notify.show();			
			}
	}
	*/
	
	public static function configureProject()
	{
		trace("configure project");
	}
	
	public static function closeProject()
	{
		trace ("close project");
		
		if (Main.session.current_project_xml != "")
		{
		Main.session.current_project_xml = "";
		Main.session.current_project_folder = "";
		Main.session.current_project_xml_parameter = "";			
		}
		else
		{
			var notify = new Notify();
			notify.type = "error";
			notify.content = "No project to close.";
			notify.show();				
		}

	}
}