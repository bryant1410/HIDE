package tools.gradle;

/**
 * ...
 * @author espigah
 */
class GradleConfig 
{
	public var path:String;
	public var settingsFile:String;
	public var buildFile:String;
	public var showDebug:Bool;
	public var showStack:Bool;
	public function new ()
	{
		path = "";
		settingsFile = "";
		buildFile = "";
		showDebug = false;
		showStack = false;
	}
	
}