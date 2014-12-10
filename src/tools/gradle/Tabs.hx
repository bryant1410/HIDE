package tools.gradle;
import haxe.Timer;
import jQuery.JQuery;
import js.Browser;
import js.html.DivElement;
import js.html.Element;
import js.html.EventListener;
import js.html.HtmlElement;
import js.html.LIElement;
import js.html.Node;
import js.html.NodeList;
import js.html.SpanElement;
import js.html.StyleElement;
import js.html.TextAreaElement;

/**
 * ...
 * @author espigah
 */
class Tabs
{
	
	var name:String;
	var divTag:String;
	var listItemTag:String;
	var spanTag:String;
	var textAreaTag:String;
	
	var textAreaElement:TextAreaElement;
	var divElement:DivElement;
	var spanElement:SpanElement;
	var listItemElement:LIElement;
	public function new(name:String)
	{
		this.name = name;
		divTag = name+"Tab";//new div -> core/index.html
		spanTag = name+"OutputTab";
		listItemTag = spanTag + "LI";
		textAreaTag = divTag + "TextArea";		
	}
	
	public function setup() 
	{
		setupElements();
		hide();
	}
	
	function setupElements():Void
	{		
		setupLine();
		setupSpan();
		setupDiv();
		setupTextArea();		
	}
	
	
	function setupLine() 
	{
		listItemElement =  cast Browser.document.getElementById(listItemTag);		
	}
	
	function setupSpan() 
	{
		spanElement =  cast Browser.document.getElementById(spanTag);	
	}
	
	function setupDiv() 
	{
		if (divElement != null)
		{
			return;			
		}
		divElement = cast Browser.document.getElementById(divTag);
		////divElement = Browser.document.createDivElement();
		//divElement.id = divTag;
		//Browser.document.getElementById("tabs1").appendChild(divElement);
	}
	
	function setupTextArea():Void
	{
		if (textAreaElement != null)
		{
			return;
		}
		
		//textAreaElement = cast Browser.document.getElementById("tt");
		textAreaElement = Browser.document.createTextAreaElement();
		textAreaElement.id = textAreaTag;
		textAreaElement.style.color = "#838383";
		textAreaElement.style.fontSize = "10pt";
		textAreaElement.style.width = "100%";
		textAreaElement.style.height = "100%";
		textAreaElement.style.resize = "none";
		textAreaElement.value = "";
		textAreaElement.readOnly = true;
		divElement.appendChild(textAreaElement);		
	}
	
	public function show():Void
	{		
		new JQuery("#"+listItemTag).show();
		new JQuery("#"+divTag).show();
	}
	
	public function hide():Void
	{	
		new JQuery("#"+listItemTag).hide();
		new JQuery("#"+divTag).hide();	
	}
	
	/*public*/ function active() 
	{		
		spanElement.click();
	}
	
	
	
	@:isvar public var text(get, set):String;
	function get_text():String 
	{
		if (textAreaElement == null) return "";
		return textAreaElement.value;
	}
	
	function set_text(value:String):String 
	{
		if (textAreaElement == null) return "";
		if (value == "" || value == null)
		{
			textAreaElement.value = "";
			return "";
		}
		
		active();
		textAreaElement.scrollTop = textAreaElement.scrollHeight;
		return textAreaElement.value += value+"\n";
	}
	
	public function destroy() 
	{
		hide();
		text = "";
	}
	
}


	//function teste2() 
	//{
		
		/*var divNode:Element = Browser.document.createElement("DIV");
		divNode.setAttribute("id", "name");
		var spanNode:Element = Browser.document.createElement("SPAN");
		spanNode.setAttribute("id", "nameTab");
		spanNode.setAttribute("localeString", "name");
		spanNode.innerText = name;
		var liNode:Element = Browser.document.createElement("LI");
		liNode.appendChild(spanNode);
		
		var jQuery:JQuery = new JQuery("#tabs1");
		
		var uiJQuery:JQuery = jQuery.has("UL");	
		jQuery.append(divNode);
		uiJQuery.append(liNode);*/		
		
	//}
	//
	//function teste1() 
	//{
		/*var jQuery:JQuery= new JQuery("#tabs1");
		var divNode:Element = Browser.document.createElement("DIV");		
		divNode.setAttribute("id", "name");
	
		var liNode:Element = Browser.document.createElement("LI");
		liNode.innerHTML = '<span id ="nameTab" localeString ="name">name</span>';		
		var nodeList  = jQuery.get()[0].childNodes;
		
		for (i in 0 ... nodeList.length) 
		{		
			
			if (nodeList[i].nodeName=="DIV")
			{				
				for (k in 0 ... nodeList[i].childNodes.length) 
				{
					trace("\t\t", nodeList[i].childNodes[k].nodeName);
					if (nodeList[i].childNodes[k].nodeName == "UL")
					{
						trace("\t\t\t", nodeList[i].childNodes[k].childNodes.length);						
						nodeList[i].childNodes[k].appendChild(liNode);
						break;
					}
				
				}
			}
			
		}*/
		//
	//}