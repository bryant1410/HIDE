package macros;

import sys.FileSystem;

/**
 * ...
 * @author AS3Boyan
 */
class PluginsListGenerator
{

	public static function generate():Void
	{
		var pluginsHxml:String = "  - cd ../plugin/";
		
		for (item in FileSystem.readDirectory("../plugin"))
		{
			if (StringTools.startsWith(item, "plugin")) 				
			{
				pluginsHxml += "\n";				
				pluginsHxml += ["  - cd " + item + "/source", "  - haxe build.hxml", "  - cd ../.."].join("\n");
			} 			
		} 			 			
		
		var templateData:String = sys.io.File.getContent("../.travis.yml.template");
		var updatedData:String = StringTools.replace(templateData, "::plugins::", pluginsHxml);
		
		sys.io.File.saveContent("../.travis.yml", updatedData);
	}
	
}