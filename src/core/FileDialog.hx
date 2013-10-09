package core;
import js.Browser;
import js.html.InputElement;

/**
 * ...
 * @author AS3Boyan
 */
class FileDialog
{
	private static var input:InputElement;
	private static var onClick:Dynamic;

	public function new() 
	{
		
	}
	
	public static function init():Void
	{
		input = Browser.document.createInputElement();
		input.type = "file";
		input.style.display = "none";
		input.addEventListener("change", function(e) 
		{
			var value:String = input.value;
			if (value != "") 
			{
				onClick(value);
			}
		});
		
		Browser.document.body.appendChild(input);
	}
	
	public static function openFile(_onClick:Dynamic):Void
	{
		input.value = "";
		
		onClick = _onClick;
		
		if (input.hasAttribute("nwsaveas"))
		{
			input.removeAttribute("nwsaveas");
		}
		
		input.click();
	}
	
	public static function saveFile(_onClick:Dynamic, ?_name:String):Void
	{
		input.value = "";
		
		onClick = _onClick;
		
		if (_name == null)
		{
			_name = "";
		}
		
		input.setAttribute("nwsaveas", _name);
		input.click();
	}
	
}