package plugin.misterpah;
class DummyA
{
	static public function main():Void
		{
		trace("this is executed by plugin.misterpah.DummyA");
		}
		
	static public function externFunction():String
		{
		return "plugin.misterpah.DummyA - this is a Function exposed to other plugin through Extern";
		}
}