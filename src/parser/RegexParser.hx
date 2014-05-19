package parser;

/**
* @author 
 */
class RegexParser
{
    public static function getFileImportsList(data:String)
    {
        var fileImports:Array<String> = [];
        
        //Regex for parsing imports ported from haxe-sublime-bundle
        //https://github.com/clemos/haxe-sublime-bundle/blob/master/HaxeHelper.py#L21
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
        
        var ereg = ~/package ([^;]*);$/m;
        
        if (ereg.match(data))
        {
            filePackage = StringTools.trim(ereg.matched(1));
        }
        
        return {filePackage: filePackage, pos: ereg.matchedPos().pos};
    }


}