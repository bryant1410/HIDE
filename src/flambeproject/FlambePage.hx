package flambeproject;
import about.Presentation;
import haxe.ds.StringMap;
import js.Browser;
import js.html.DivElement;
import js.html.InputElement;
import js.html.SpanElement;
import newprojectdialog.NewProjectDialog;
import watchers.LocaleWatcher;

/**
 * ...
 * @author ... espigah
 * TODO - change page 2 in order to change the flambe.yaml file
 * look at ->  NewProjectDialog::createCategory
 */
class FlambePage
{
	public static inline var FILD_GAME_NAME:String = "GameName";
	public static inline var FILD_DEV_NAME:String = "DevName";
	public static inline var FILD_PLATFORM:String = "Platform";
	public static inline var FILD_GAME_ID:String = "GameID";
	public static inline var TYPE_CHECKBOX:String = "checkbox";
	public static inline var TYPE_TEXT:String = "text";
	static var options:DivElement;
	static var textfields:StringMap<InputElement>;
	static var checkboxes:StringMap<InputElement>;
	public function new() 
	{
		
	}
	public static function hide():Void
	{
		options.style.display = "none";
	}	
	public static function show():Void
	{
		options.style.display = "";
	}
	public static function createPage2(page2:DivElement):Void
	{
		textfields  = new StringMap();
		checkboxes  = new StringMap();
		options = Browser.document.createDivElement();
		options.className = "options flmabe";
		createTextWithCheckbox(page2, FILD_GAME_NAME);
		createTextWithCheckbox(page2, FILD_DEV_NAME);
		createTextWithCheckbox(page2, FILD_PLATFORM);
		createTextWithCheckbox(page2, FILD_GAME_ID);
		page2.appendChild(options);
		 //hide();
	}
	
	public static function createTextWithCheckbox(_page2:DivElement, _text:String):Void
	{
		var row:DivElement = Browser.document.createDivElement();
		row.className = "row";
		
		var inputGroup:DivElement = Browser.document.createDivElement();
		inputGroup.className = "input-group";
		row.appendChild(inputGroup);
		
		var inputGroupAddon:SpanElement = Browser.document.createSpanElement();
		inputGroupAddon.className = "input-group-addon";
		inputGroup.appendChild(inputGroupAddon);
		
		var checkbox:InputElement = Browser.document.createInputElement();
		checkbox.type = TYPE_CHECKBOX;
		checkbox.checked = true;
		inputGroupAddon.appendChild(checkbox);
		
		checkboxes.set(_text+TYPE_CHECKBOX, checkbox);
		
		var text:InputElement = Browser.document.createInputElement();
		text.type = TYPE_TEXT;
		text.className = "form-control";
		text.id = _text;
		text.placeholder = LocaleWatcher.getStringSync(_text);
		textfields.set(_text, text);
		
		checkbox.onchange = function (e)
		{
			if (checkbox.checked)
			{
				text.disabled = false;
			}
			else
			{
				text.disabled = true;
			}
		};
		
		inputGroup.appendChild(text);
		options.appendChild(row);
	}
	
	static public function loadData():Void
	{		
		setDefaultData(FILD_GAME_NAME,textfields);
		setDefaultData(FILD_DEV_NAME,textfields);
		setDefaultData(FILD_PLATFORM,textfields);
		setDefaultData(FILD_GAME_ID, textfields);
		setDefaultData(FILD_GAME_NAME+TYPE_CHECKBOX,checkboxes);
		setDefaultData(FILD_DEV_NAME+TYPE_CHECKBOX,checkboxes);
		setDefaultData(FILD_PLATFORM+TYPE_CHECKBOX,checkboxes);
		setDefaultData(FILD_GAME_ID+TYPE_CHECKBOX,checkboxes);
	}
	static private function setDefaultData(__text:String,__map:StringMap<InputElement>):Void
	{		
		var element:InputElement = __map.get(__text);
		var value:Dynamic ;
		if (element.type == TYPE_CHECKBOX)
		{
			value = Browser.getLocalStorage().getItem(__text);
			if (value != null && value!="")
			{
				element.value = value;
			}	
		}
		else
		{
			value = Browser.getLocalStorage().getItem(__text);
			if (value != null && value!="")
			{
				element.checked = value;
			}	
		}
		
	}
	static public function saveData(__text:String,__map:StringMap<InputElement>):Void
	{
		var element:InputElement = __map.get(__text);
		var value:Dynamic  = element.type == TYPE_CHECKBOX ? element.checked : element.value ; 
		
		if (value != null && value!="")
		{
			Browser.getLocalStorage().setItem(__text, value);
		}		
	}
	
	static public function saveAllData() 
	{
		saveData(FILD_GAME_NAME,textfields);
		saveData(FILD_DEV_NAME,textfields);
		saveData(FILD_PLATFORM,textfields);
		saveData(FILD_GAME_ID, textfields);
		saveData(FILD_GAME_NAME+TYPE_CHECKBOX,checkboxes);
		saveData(FILD_DEV_NAME+TYPE_CHECKBOX,checkboxes);
		saveData(FILD_PLATFORM+TYPE_CHECKBOX,checkboxes);
		saveData(FILD_GAME_ID+TYPE_CHECKBOX,checkboxes);		
	}
	
}