package parser;

/**
* @author 
 */

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
        
        var ereg = ~/package ([^;]*);$/m;
        
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


}