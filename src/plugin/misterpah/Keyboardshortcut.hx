package plugin.misterpah;

import Utils;

class Keyboardshortcut
{
	public function new()
	{
		//create_ui();
		register_hooks();
	}

	private function register_hooks()
	{
		Utils.loadJavascript("./plugin/misterpah/jwerty.js");
		register_shortcutKey();
	}

	private function register_shortcutKey()
	{
		untyped jwerty.key('ctrl+N',function(){$(document).triggerHandler("core_file_newFile");});
		untyped jwerty.key('ctrl+O',function(){$(document).triggerHandler("core_file_openFile");});
		untyped jwerty.key('ctrl+S',function(){$(document).triggerHandler("core_file_save");});
		untyped jwerty.key('ctrl+W',function(){$(document).triggerHandler("core_file_close");});
		untyped jwerty.key('ctrl+shift+O',function(){$(document).triggerHandler("core_project_openProject");});
	}


}