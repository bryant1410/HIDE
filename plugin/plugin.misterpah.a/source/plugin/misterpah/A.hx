package plugin.misterpah;
@:keepSub @:expose class A
{
	static public function main():Void
		{
		trace("this is executed by plugin.misterpah.A");
		}
		
	static public function externFunction():String
		{
		return "plugin.misterpah.A - this is a Function exposed to other plugin through Extern";
		}
}