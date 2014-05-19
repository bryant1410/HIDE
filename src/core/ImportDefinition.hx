package core;
import parser.RegexParser;
import CodeMirror.TokenData;
import parser.ClassParser;
import parser.OutlineHelper;
import completion.Hxml.CompletionData;

/**
* @author AS3Boyan
 */
class ImportDefinition
{
    public static function searchImport(data:String, path:String)
    {
        var ast = ClassParser.parse(data, path);
        
        var cm = cm.Editor.editor;
        var token = cm.getTokenAt(cm.getCursor());

        var fileImports:Array<String> = [];
        
        var mode:String = null;
        
        var selectedText:String = null;
        
        var from:CodeMirror.Pos = null;
        var to:CodeMirror.Pos = null;
        
        if (cm.somethingSelected())
        {
            selectedText = cm.getSelection();
            
            if (selectedText.indexOf(".") != -1)
            {
                mode = "selection";
                
                var selection = cm.listSelections()[0];
                
                from = selection.anchor;
                to = selection.head;
                
                cm.setSelection(to);
            }
        }
        else if (token.type != null && token.string != "")
        {
			mode = "token";
        }
            
        if (mode != null)
        {
            if (ast != null) 
            {
                fileImports = OutlineHelper.parseDeclarations(ast).fileImports;	            
            }
            else
            {
                trace("haxeparser is unable to parse this file. Falling back to regex parsing.");
                
                var value = tabmanager.TabManager.getCurrentDocument().getValue();

                fileImports = RegexParser.getFileImportsList(value);
            }
			
            switch (mode)
            {
                case "token":
                    checkImport(fileImports, token);
                case "selection":
                    var found:Bool = false;
                    
                    for (list in [ClassParser.importsList,  ClassParser.haxeStdImports])
                    {
                    	if (list.indexOf(selectedText) != -1)
                        {
                            found = true;
                            break;
                        }
                    }
            
            		if (fileImports.indexOf(selectedText) == -1)
                    {
                        if (found)
                        {
                            importClass(cm, selectedText, from, to);
                        }
                        else
                        {
                            Completion.showImportDefinition([selectedText], from, to);
                        }
                    }
                    else
                    {
                        updateImport(cm, selectedText.split(".").pop(), from, to);
                    }
                    
                default:

            }
        }
        else
        {
            Alertify.log("Place cursor on class name or select full class name to import it (for instance, you can select 'flash.display.Sprite' and it can be imported and selected text will be replaced to 'Sprite'");
        }
    }
    
    static function checkImport(fileImports:Array<String>, token:TokenData)
    {
        var searchPattern = "." + token.string;

        var foundImports:Array<String> = [];
        var foundAtTopLevel:Bool = false;
        var alreadyImported:Array<String> = [];
        
        for (list in [ClassParser.importsList,  ClassParser.haxeStdImports])
        {
            for (item in list)
            {
                if (StringTools.endsWith(item, searchPattern))
                {
                    if (fileImports.indexOf(item) == -1)
                    {
                        foundImports.push(item);
                    }
                    else
                    {
                        alreadyImported.push(item);
                    }
                }
            }
        }

        for (list in [ClassParser.topLevelClassList, ClassParser.haxeStdTopLevelClassList])
        {	
            if (list.indexOf(token.string) != -1)
            {
                foundAtTopLevel = true;
                break;
            }
        }

        if (foundAtTopLevel)
        {
            Alertify.log("'" + token.string + "' doesn't needs to be imported, since it's already found at top level");
        }
        else if (foundImports.length > 0)
        {
            Completion.showImportDefinition(foundImports);
        }
        else
        {
            var info = "Unable to find additional imports for '" + token.string + "'.";

            if (alreadyImported.length > 0)
            {
                info += " Already imported:\n" + Std.string(alreadyImported);
            }

            Alertify.log(info);
        }
    }
        
    public static function importClassHint(from:CodeMirror.Pos, to:CodeMirror.Pos, cm:CodeMirror, data:Dynamic, completion:CompletionData)
	{
        importClass(cm, completion.text, from, to);
    }
        
    static function importClass(cm:CodeMirror, text:String, from:CodeMirror.Pos, to:CodeMirror.Pos)
	{
        var value = tabmanager.TabManager.getCurrentDocument().getValue();
        
        var filePackage = RegexParser.getFilePackage(value);
        
        if (from != null && to != null)
       	{
            updateImport(cm, text, from, to);
        }
        
        var pos:CodeMirror.Pos;

        if (filePackage.filePackage != null)
        {
            pos = cm.posFromIndex(filePackage.pos);
            pos.ch = 0;
            pos.line++;
        }
        else
        {
            pos = cm.posFromIndex(0);
        }

        cm.replaceRange("import " + text + ";\n", pos, pos);
        
        Alertify.success(text + " definition successfully imported");
    }

	static function updateImport(cm:CodeMirror, text:String, from:CodeMirror.Pos, to:CodeMirror.Pos)
	{
        cm.replaceRange(text.split(".").pop(), from, to);
    }

}