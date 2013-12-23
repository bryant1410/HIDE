package plugin.misterpah;
class Dummy
{
	static public function main():Void
		{
		trace("this is executed by plugin.misterpah.Dummy");
		}
		
	static public function externFunction():String
		{
		return "plugin.misterpah.Dummy - this is a Function exposed to other plugin through Extern";
		}
}