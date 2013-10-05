package ui.menu.basic;
import jQuery.JQuery;

/**
 * ...
 * @author AS3Boyan
 */

interface MenuItem
{
	public function getCode():String;
	public function registerEvent():Void;
}
 
class MenuButtonItem implements MenuItem
{
	var text:String;
	var onClickFunctionName:String;
	var onClickFunction:Void->Void;
	var hotkey:String;
	
	public function new(_text:String, _onClickFunctionName:String, _onClickFunction:Void->Void, ?_hotkey:String)
	{
		text = _text;
		onClickFunctionName = _onClickFunctionName;
		onClickFunction = _onClickFunction;
		hotkey = _hotkey;
	}
	
	public function getCode():String
	{
		var hotkey_code:String = "";
		
		if (hotkey != null)
		{
			hotkey_code = "<span style='color: silver; float:right;'>" + hotkey + "</span>";
		}
		
		return "<li><a style='left: 0;' onclick='$(document).triggerHandler(\"" + onClickFunctionName + "\");'>" + text + hotkey_code + "</a></li>";
	}
	
	public function registerEvent():Void
	{
		if (onClickFunction != null) 
		{
			new JQuery(js.Browser.document).on(onClickFunctionName, onClickFunction);
		}
	}
}

class Separator implements MenuItem
{
	public function new()
	{
		
	}
	
	public function getCode():String
	{
		return "<li class=\"divider\"></li>";
	}
	
	public function registerEvent():Void
	{
		
	}
}
 
class Menu
{
	var text:String;
	var headerText:String;
	var items:Array<MenuItem>;

	public function new(_text:String, ?_headerText:String) 
	{
		text = _text;
		headerText = _headerText;
		
		items = new Array();
	}
	
	public function addMenuItem(_text:String, _onClickFunctionName:String, _onClickFunction:Void->Void, ?_hotkey:String):Void
	{
		items.push(new MenuButtonItem(_text, _onClickFunctionName, _onClickFunction, _hotkey));
	}
	
	public function addSeparator():Void
	{
		items.push(new Separator());
	}
	
	public function addToDocument()
	{
		var retStr = ["<li class='dropdown'>",
		"<a href='#' class='dropdown-toggle' data-toggle='dropdown'>" + text + "</a>",
		"<ul class='dropdown-menu'>"].join("\n");
		
		if (headerText != null)
		{
			retStr += "<li class='dropdown-header'>" + headerText + "</li>\n";
		}
		
		for (i in 0...items.length)
		{
			retStr += items[i].getCode();
		}
		
		retStr +=
		["</ul>",
		"</li>"].join("\n"); // a fancy way to combine string. a norm in javascript.
		
		new JQuery("#position-navbar").append(retStr); // this position is defined in the HTML.
		
		for (i in 0...items.length) items[i].registerEvent();
		items = null;
		headerText = null;
		text = null;
	}
	
}