package ;
import core.ProjectAccess;
import ui.Alerts;

/**
 * ...
 * @author AS3Boyan
 */
class BuildTools
{

	public function new() 
	{
		
	}
	
	static public function runProject():Void
	{
		//Alerts.showAlert();
		
		if (ProjectAccess.currentProject.type == Project.OPENFL)
		{
			CompilerClient.buildOpenFLProject(["build", ProjectAccess.currentProject.target], function ():Void
			{
				//"-d", "bin/Export/html5"
				
				var nekoToolsClient:Dynamic = Utils.process.spawn("nekotools", ["server", "-p", "8000"]);
				
				nekoToolsClient.stdout.setEncoding('utf8');
				nekoToolsClient.stdout.on('data', function (data) {
						var str:String = data.toString();
						trace(str);
				});
				
				nekoToolsClient.stderr.setEncoding('utf8');
				nekoToolsClient.stderr.on('data', function (data) {
						var str:String = data.toString();
						trace(str);
				});
				
				nekoToolsClient.on('close', function (code:Int) {
						
						if (code == 0)
						{
							
						}
						else
						{
							trace('Neko Tools Server process exit code ' + Std.string(code));
						}
				});
				
				var window = Utils.gui.Window.open("http://localhost:8000/Export/html5/bin/index.html", { position:"center" } );
				//window.showDevTools();
			}
			);
		}
	}
	
	static public function buildProject():Void
	{
		if (ProjectAccess.currentProject.type == Project.OPENFL)
		{
			CompilerClient.buildOpenFLProject(["build", ProjectAccess.currentProject.target]);
		}
		else// if (ProjectAccess.currentProject.type == Project.HXML)
		{
			CompilerClient.buildProject("haxe", ProjectAccess.currentProject.args);
		}
		//else 
		//{
			//
		//}
	}
	
}