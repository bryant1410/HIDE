package core;

import parser.ClassParser;
import parser.OutlineHelper;


/**
* @author AS3Boyan
 */
class ImportDefinition
{
    public static function searchImport(data:String, path:String)
    {
        var ast = ClassParser.parse(data, path);
        
        if (ast != null) 
		{
			var parsedData = OutlineHelper.parseDeclarations(ast);
			trace(parsedData);
		}
    }

}