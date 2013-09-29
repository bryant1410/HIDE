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