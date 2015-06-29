package nodejs.webkit;

@:jsRequire("nw.gui", "Shell")
extern class Shell
{
	static public function openExternal(url:String):Void;
	static public function openItem(path:String):Void;
	static public function showItemInFolder(Path:String):Void;
}