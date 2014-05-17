package core;
import cm.Editor;
import jQuery.JQuery;
import js.Browser;
import js.html.AnchorElement;
import js.html.DivElement;
import tabmanager.TabManager;

/**
 * ...
 * @author AS3Boyan
 */
class AnnotationRuler
{
    static var positions:Array<Float> = [];
    
	public static function addErrorMarker(pathToFile:String, line:Int, ch:Int, message:String):Void 
	{
		var a:AnchorElement = Browser.document.createAnchorElement();
		a.href = "#";
		a.onclick = function (e):Void 
		{
			TabManager.openFileInNewTab(pathToFile, true, function ():Void 
			{
				var cm:Dynamic = Editor.editor;
				cm.centerOnLine(line);
			});
		};
		
		var div:DivElement = Browser.document.createDivElement();
		div.className = "errorMarker";
		
		var lineCount = TabManager.getCurrentDocument().lineCount();
		
        var targetLine:Float = line / lineCount * 100;
        
        while (positions.indexOf(targetLine) != -1)
        {
            targetLine++;
        }
        
		div.style.top = Std.string(targetLine) + "%";
		
        positions.push(targetLine);
        
		div.setAttribute("data-toggle", "tooltip");
		div.setAttribute("data-placement", "left");
		div.title = "Line: " + Std.string(line) + ":" + message;
		
		untyped new JQuery(div).tooltip({});
		
		a.appendChild(div);
		
		new JQuery("#annotationRuler").append(a);
	}
	
	public static function clearErrorMarkers():Void 
	{
		new JQuery("#annotationRuler").children().remove();
        positions = [];
	}
}