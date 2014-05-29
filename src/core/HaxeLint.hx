package core;
import cm.Xml;
import cm.Editor;
import haxe.ds.StringMap.StringMap;
import tabmanager.TabManager;

typedef Info = {
	var from:CodeMirror.Pos;
	var to:CodeMirror.Pos;
	var message:String;
	var severity:String;
}

/**
 * ...
 * @author 
 */
class HaxeLint
{
	public static var fileData:StringMap<Array<Info>> = new StringMap();
	public static var parserData:StringMap<Array<Info>> = new StringMap();

	public static function load():Void
	{
		CodeMirror.registerHelper("lint", "haxe", function (text:String) 
		{
			var found = [];
			
			var path:String = TabManager.getCurrentDocumentPath();
			
			if (fileData.exists(path)) 
			{
				var data:Array<Info> = fileData.get(path);
				
				found = found.concat(data);
			}
			
			if (parserData.exists(path)) 
			{
				var data:Array<Info> = parserData.get(path);
				
				found = found.concat(data);
			}
			
			return found;
		}
		);
	}
	
	public static function updateLinting():Void
	{
		AnnotationRuler.clearErrorMarkers();
		
        var doc = TabManager.getCurrentDocument();
        
		if (doc != null)
		{
            if (doc.getMode().name == "haxe")
            {
               	try
                {
                    HaxeParserProvider.getClassName();
                }
                catch (e:Dynamic)
                {
                    trace(e);
                }

                parser.OutlineHelper.getList(doc.getValue(), TabManager.getCurrentDocumentPath());

                var path:String = TabManager.getCurrentDocumentPath();

                if (fileData.exists(path)) 
                {
                    var data:Array<Info> = fileData.get(path);

                    for (item in data) 
                    {
                        AnnotationRuler.addErrorMarker(path, item.from.line, item.from.ch, item.message);
                    }
                }

                Editor.editor.setOption("lint", false);
                Editor.editor.setOption("lint", true); 
            }       
            else if (doc.getMode().name == "xml")
            {
                Xml.generateXmlCompletion();
            }
        	else
           	{
                OutlinePanel.clearFields();
            	OutlinePanel.update();
            }
			
		}
    	else
        {
            OutlinePanel.clearFields();
            OutlinePanel.update();
        }
	}
	
}