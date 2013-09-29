package ui.menu.basic;
import jQuery.JQuery;

/**
 * ...
 * @author AS3Boyan
 */

class MenuItem
{
	var text:String;
	var onClickFunctionName:String;
	var onClickFunction:Void->Void;
	
	public function new(_text:String, _onClickFunctionName:String, _onClickFunction:Void->Void)
	{
		text = _text;
		onClickFunctionName = _onClickFunctionName;
		onClickFunction = _onClickFunction;
	}
	
	public function getCode():String
	{
		return "<li><a onclick='$(document).triggerHandler(\"" + onClickFunctionName + "\");'>" + text + "</a></li>";
	}
	
	public function registerEvent():Void
	{
		if (onClickFunction != null) 
		{
			new JQuery(js.Browser.document).on(onClickFunctionName, onClickFunction);
		}
	}
}
 
class Menu
{
	var text:String;
	var headerText:String;
	var items:Array<MenuItem>;

	public function new(_text:String, _headerText:String) 
	{
		text = _text;
		headerText = _headerText;
		
		items = new Array();
	}
	
	public function addMenuItem(_text:String, _onClickFunctionName:String, _onClickFunction:Void->Void)
	{
		items.push(new MenuItem(_text, _onClickFunctionName, _onClickFunction));
	}
	
	public function addToDocument()
	{
		var retStr = ["<li class='dropdown'>",
		"<a href='#' class='dropdown-toggle' data-toggle='dropdown'>" + text + "</a>",
		"<ul class='dropdown-menu'>",
		"<li class='dropdown-header'>" + headerText + "</li>"].join("\n");
		
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