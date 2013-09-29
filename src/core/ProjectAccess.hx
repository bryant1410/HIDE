package core;
import jQuery.*;
import ui.*;

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
		var modal = new Modal();
		modal.id='projectAccess_new';
		modal.title= 'New Project';
		modal.content = 'this is just a sample';
		modal.ok_text = "Create";
		modal.cancel_text = "Cancel";
		modal.show();
		
		new JQuery("#projectAccess_new .button_ok").on("click",
			function()
			{
				trace("you've clicked the OK button");
			});
	}
	
	public static function openProject()
	{
		trace("open a project");

		var modal = new Modal();
		modal.id='projectAccess_openProject';
		modal.title= 'Open Project';
		modal.content = '<input id="ProjectAccess_openProject_file" type="file" />';
		modal.ok_text = "Open";
		modal.cancel_text = "Cancel";
		modal.show();

		var file_input = new JQuery("#ProjectAccess_openProject_file");
		file_input.click();
		file_input.change(function(event)
			{
			if (file_input.val() != "")
				{
				Main.session.current_project_xml = file_input.val();
				modal.hide();
				parseProject();
				}
			});
	}

	public static function parseProject()
	{
		trace('parse the project');
		//trace(Main.session.current_project_xml);
		
		// if file is xml, convert to hxml
		var test_extension = Main.session.current_project_xml.split(".");
		trace (test_extension);
	}
	
	public static function configureProject()
	{
		trace("configure project");
	}
	
	public static function closeProject()
	{
		trace ("close project");
	}
}