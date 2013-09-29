package core;
import jQuery.*;
	
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
		if (Main.session.current_project_xml == "")
		{
			trace ("open project first");
		}
		else
		{
			trace ("open a file");
		}
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
		if (Main.session.current_project_xml == "")
		{
			trace ("open project first");
		}
		else
		{
			trace ("close active file");
		}
	}
}
