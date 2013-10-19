package plugin.misterpah;

import jQuery.*;

class CompileTo
{
	public function new()
	{
		//create_ui();
		register_hook();
	}

	private function register_hook()
	{
		new JQuery(js.Browser.document).on("core_compileTo_flash",compile_to_flash);
	}


	// use openfl service
	private function compile_to_flash()
	{
		var exec_str = "";
		var join_str = "";
		var join_str_cd = "";

		var path = Main.session['project_xml'];

		if (Utils.getOS() == Utils.LINUX)
			{
			join_str = " ; ";
			join_str_cd = "";
			}
		if (Utils.getOS() == Utils.WINDOWS)
			{
			join_str = " & ";
			join_str_cd = " /D ";
			}		

		var exec_str = "cd " + join_str_cd + Main.session['project_folder']+join_str + " openfl test flash";

		trace(exec_str);
		Utils.exec(exec_str,function(error,stdout,stderr)
			{
				trace(error);
				trace(stdout);
				trace(stderr);
			});
	}
}