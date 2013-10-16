package core;
import jQuery.*;
import ui.*;

class FileAccess
{
	static public function init()
	{
		
	}
	
	static public function createNewFile():Void
	{
		TabsManager.createFileInNewTab();
	}
	
	static public function openFile():Void
	{
		FileDialog.openFile(TabsManager.openFileInNewTab);
	}
	
	static public function saveActiveFile():Void
	{
		trace ("save active file");

		// get active file
		var curDoc = TabsManager.curDoc;
		var curDoc_filepath = curDoc.path;
		var curDoc_val = curDoc.doc.cm.getValue();
		
		var historySize = curDoc.doc.historySize();
		
		if (curDoc_filepath != "" && historySize.undo == 0 && historySize.redo == 0)
		{
			trace("no changes detected");
			return;
		}
		
		if (curDoc_filepath == "")
		{
			FileDialog.saveFile(function (path:String):Void
			{
				Utils.system_saveFile(path, curDoc_val);
			}
			, curDoc.name);
		}
		else
		{
			Utils.system_saveFile(curDoc_filepath, curDoc_val);
		}
	}
	
	static public function closeActiveFile():Void
	{
		TabsManager.closeActiveTab();
	}
}
