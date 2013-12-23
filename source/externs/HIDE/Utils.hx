package;

@:keep @:expose extern class Utils{
	public static var os;
	public static var fs;
	public static var path;
	public static var exec;
	public static var sys;
	public static var nwworkingdir:String;
	
	public static var gui;
	public static var window:Dynamic;
	
	public static var WINDOWS:Int;
	public static var LINUX:Int;
	public static var OTHER:Int;
    
    public static function getOS():Int;
    public static function capitalize(myString:String):String;
    public static function system_openFile(filename:String):Dynamic;
    public static function system_createFile(filename:String):Dynamic;
    public static function system_saveFile(filename:String, content:String):Dynamic;
    public static function loadJavascript(script:String):Dynamic;
    public static function loadCss(css:String):Dynamic;
    public static function system_get_completion(position:Int):Dynamic;
    public static function system_create_project(exec_str:String):Dynamic;
    public static function system_parse_project():Dynamic;
    public static function register_plugin(plugin_credentials:Map<String,String>):Void;
}