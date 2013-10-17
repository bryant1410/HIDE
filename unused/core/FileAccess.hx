package core;
import jQuery.*;
import ui.*;
import haxe.ds.StringMap.StringMap;

class FileAccess
{
	public static var library:StringMap<String>;

	static public function init()
	{
		library = new StringMap();		
	}
	
	static public function createNewFile()
	{
		TabsManager.createFileInNewTab();
	}
	
	static public function openFile()
	{
		FileDialog.openFile(openFileHandler);
	}


	public static function openFileHandler(path:String):Void
	{
		if (Utils.getOS() == Utils.WINDOWS)
			{
			var ereg = ~/[\\]/g;
			path = ereg.replace(path, "/");
			}

		trace(library.get(path));
		/*
		for (i in 0...docs.length)
		{
			if (docs[i].path == path)
			{
				selectDoc(i);
				return;
			}
		}

		

		
		
		var pos:Int = null;
		
		if (Utils.getOS() == Utils.WINDOWS)
		{
			pos = path.lastIndexOf("\\");
			
			if (pos == -1)
			{
				pos = path.lastIndexOf("/");
			}
		}
		else
		{
			pos = path.lastIndexOf("/");
		}
		
		var filename:String = null;
		
		if (pos != -1)
		{
			filename = path.substr(pos + 1);
		}
		else
		{
			filename = path;
		}
		
		load(path, function(body) 
		{
			registerDoc(filename, new CodeMirror.Doc(body, "haxe"), path);
			selectDoc(docs.length - 1);
		});
		
		if (new JQuery("#panel").css("display") == "none" && docs.length > 0)
		{
			new JQuery("#panel").css("display", "block");
			TabsManager.editor.refresh();
			Main.updateMenu();
		}
		
		Main.resize();
		*/
	}



	
	static public function saveActiveFile()
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
	
	static public function closeActiveFile()
	{
		TabsManager.closeActiveTab();
	}
}
