package parser;
import cm.Editor;

/**
* @author 
 */

typedef VariableData = {
	var name:String;
	@:optional var type:String;
}

//Regex for parsing imports ported from haxe-sublime-bundle
//https://github.com/clemos/haxe-sublime-bundle/blob/master/HaxeHelper.py#L21
class RegexParser
{
    public static function getFileImportsList(data:String)
    {
        var fileImports:Array<String> = [];
        
        var ereg = ~/^[ \t]*import ([a-z0-9._*]+);$/gim;

        ereg.map(data, function (ereg)
                 {
                     fileImports.push(ereg.matched(1));
                     return "";
                 });
        
        return fileImports;
    }
    
    public static function getFilePackage(data:String)
    {
        var filePackage:String = null;
        var pos:Int = null;
        
        var ereg = ~/package *([^;]*);$/m;
        
        if (ereg.match(data))
        {
            filePackage = StringTools.trim(ereg.matched(1));
            pos = ereg.matchedPos().pos;
        }
        
        return {filePackage: filePackage, pos: pos};
    }
	
    public static function getTypeDeclarations(data:String)
    {
        var typeDeclarations:Array<{type:String, name:String, ?opaqueType:String}> = [];
        
        var ereg = ~/(class|typedef|enum|typedef|abstract) +([A-Z][a-zA-Z0-9_]*) *(<[a-zA-Z0-9_,]+>)?/gm;
        
        ereg.map(data, function (ereg2)
                {
                    var typeDeclaration = {type: ereg2.matched(1), name: ereg2.matched(2)};
                    typeDeclarations.push(typeDeclaration);
                    return "";
                });
            
       	return typeDeclarations;
    }
    
    public static function getFunctionDeclarations(data:String)
    {
        var functionDeclarations:Array<{name:String, ?params:Array<String>}> = [];
        
        var eregFunction = ~/function +([^;\.\(\) ]*)/gi;
        var eregFunctionParameters = ~/function +[a-zA-Z0-9_]+ *\(([^\)]*)/gm;
        var eregParam = ~/(= *"*[^"]*")/gm;
        
        eregFunction.map(data, function (ereg2:EReg)
                        {
                            var name:String = ereg2.matched(1);
                            
                            if (name != "new")
                            {
                                functionDeclarations.push({name: name});
                            }
                            
                            return "";
                        });
        
        eregFunctionParameters.map(data, function (ereg2:EReg)
                                  {
                                      trace(ereg2.matched(1));
                                      return "";
                                  });
        
        return functionDeclarations;
    }

    public static function getVariableDeclarations(data:String)
    {
		var variableDeclarations:Array<VariableData> = [];
        
        var eregVariables = ~/var +([a-z_]+):?([^=;]+)?/gi;
			//~/var +([^:;\( ]*)/gi;
        
        eregVariables.map(data, function(ereg2:EReg)
                         {							 
							 var cm = Editor.editor;
							 
							 var pos = ereg2.matchedPos();
							 var index = pos.pos + pos.len;
							 
// 							 var tokenType = cm.getTokenAt(cm.posFromIndex(index)).type;							 
// 							 if (true)
//  							 {
								 var name = ereg2.matched(1);
								 var type = ereg2.matched(2);

								 var varDecl = Lambda.find(variableDeclarations, function (varDecl1:VariableData)
											{
												return varDecl1.name == name;
											});
								 
								 if (varDecl == null)
								 {
									 var varDecl1:VariableData = {name: name};
									 
									 if (type != null)
									 {
										 type = StringTools.trim(type);
										 
										 if (type != "")
										 {
										 	varDecl1.type = type;	 
										 }
									 }
									 
									 variableDeclarations.push(varDecl1);
								 } 
//  							 }
							 
                             return ""; 
                         });
		
        return variableDeclarations;
    }


}