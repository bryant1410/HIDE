package ui.menu;
import jQuery.JQuery;

/**
 * ...
 * @author AS3Boyan
 */

class MenuItem
{
	var text:String;
	var onClickFunction:String;
	
	public function new(_text:String, _onClickFunction:String)
	{
		text = _text;
		onClickFunction = _onClickFunction;
	}
	
	public function getCode():String
	{
		return "<li><a onclick='$(document).triggerHandler(\"" + onClickFunction + "\");'>" + text + "</a></li>";
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
	
	public function addMenuItem(_text:String, _onClickFunction:String)
	{
		items.push(new MenuItem(_text, _onClickFunction));
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
		
		for (i in 0...items.length) items.pop();
		items = null;
		headerText = null;
		text = null;
	}
	
}