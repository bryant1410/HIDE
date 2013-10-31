package ;

@:allow @:native('Session') extern class Session
{
	public var project_xml:String;
	public var project_xml_parameter:String;
	public var project_folder:String;
	public var active_file:String;

	public function new():Void;
}