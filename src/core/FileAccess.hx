package core;
import jQuery.*;
import ui.*;	

class FileAccess
{
	static public function init()
	{
		
	}
	
	static public function createNewFile()
	{
		if (Main.session.current_project_xml == "")
		{
			trace ("open project first");
		}
		else
		{
			trace ("create a new file");
		}
	}
	
	static public function openFile()
	{
		//if (Main.session.current_project_xml == "")
		//{
			//trace ("open project first");
		//}
		//else
		//{
			trace ("open a file");
			var modal = new ModalDialog();
			modal.id='projectAccess_openFile';
			modal.title= 'Open File';
			modal.content = '<input id="ProjectAccess_openFile_file" type="file" />';
			modal.ok_text = "Open";
			modal.cancel_text = "Cancel";
			modal.show();

			var file_input = new JQuery("#ProjectAccess_openFile_file");
			file_input.click();
			file_input.change(function(event)
				{
				if (file_input.val() != "")
					{
						var filename:String = file_input.val();
						//var file_content = Utils.system_openFile(filename);
						//var filename_split = filename.split(Utils.path.sep);
						//var className = filename_split[filename_split.length - 1].split('.')[0];
						
						
						//Main.editors.set(filename,{'classname':className,'content':file_content});

						//Main.session.current_active_file = filename;
						//Main.tabs.push(filename); // add tab position
						//
						//var tab_index = Lambda.indexOf(Main.tabs,filename);
						//trace(tab_index);
						
						TabsManager.openFileInNewTab(filename);
						
						modal.hide();
					}
				});	
		//}
	}
	
	static public function saveActiveFile()
	{
		if (Main.session.current_project_xml == "")
		{
			trace ("open project first");
		}
		else
		{
			trace ("save active file");
		}
	}
	
	static public function closeActiveFile()
	{
		TabsManager.closeActiveTab();
		
		//if (Main.session.current_project_xml == "")
		//{
			//trace ("open project first");
		//}
		//else
		//{
			//trace ("close active file");
		//}
	}
}
