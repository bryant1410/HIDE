package parser;
import core.OutlinePanel;
import haxe.macro.Expr;
import haxe.macro.Expr.Field;
import haxe.macro.Expr.Position;
import haxeparser.Data.ClassFlag;
import haxeparser.Data.Definition;
import haxeparser.Data.ImportMode;
import haxeparser.Data.TypeDef;
import js.Node;

typedef	ClassField =
{
	var name:String;
	var pos:Int;
}

/**
 * ...
 * @author AS3Boyan
 */
class OutlineHelper
{
	public static function getList(data:String, path:String)
	{
		var ast = ClassParser.parse(data, path);
		
		if (ast != null) 
		{
			var parsedData = parseDeclarations(ast);
			
			var mainClass = Node.path.basename(path);
			
			var rootItem:TreeItem = { label: mainClass };
			rootItem.items = parsedData.treeItems;
			rootItem.expanded = true;
			
			OutlinePanel.clearFields();
			OutlinePanel.addField(rootItem);
			OutlinePanel.update();
		}
	}
	
	public static function parseDeclarations(ast:{decls:Array<TypeDef>, pack:Array<String>}) 
	{		
		var fileImports = [];
		
		var treeItems:Array<TreeItem> = [];
		
		for (decl in ast.decls) switch (decl) 
		{
			case EImport(sl, mode):
				fileImports.concat(parseImports(sl, mode));
			case EUsing(path): 
			case EAbstract(data):
				var treeItem: TreeItem = { label: data.name };
				treeItem.expanded = true;
				treeItems.push(treeItem);
			case EClass(data): 
				var treeItem: TreeItem = { label: data.name };
				var items:Array<TreeItem> = [];
				treeItem.items = items;
				treeItem.expanded = true;
				
				for (item in getClassFields(data)) 
				{
					items.push( { label: item.name, value: item.pos } );
				}
				
				treeItems.push(treeItem);
			case EEnum(data): 
				var treeItem: TreeItem = { label: data.name };
				treeItem.expanded = true;
				treeItems.push(treeItem);
			case ETypedef(data): 
				var treeItem: TreeItem = { label: data.name };
				treeItem.expanded = true;
				treeItems.push(treeItem);
		}
		
		return { fileImports: fileImports, treeItems: treeItems};
	}
	
	public static function parseImports(sl : Array<{ pos : Position, pack : String }> ,  mode : ImportMode ) 
	{
		var fileImports = [];
		
		var importPackages:Array<String> = [];
		
		for (item in sl) 
		{
			importPackages.push(item.pack);
		}
		
		var fullImportName:String = importPackages.join(".");
		
		switch (mode) 
		{
			case INormal:
				fileImports.push(fullImportName);
			case IAsName(s):
				fileImports.push(s);
			case IAll:
				fileImports.push(fullImportName);
				
				for (item in ClassParser.importsList) 
				{
					if (item.indexOf(fullImportName) == 0) 
					{
						fileImports.push(item);
					}
				}
		}
		
		return fileImports;
	}
	
	static function getClassFields(type:Definition<ClassFlag, Array<Field>>):Array<ClassField>
	{
		var fields:Array<ClassField> = [];
		
		for (i in 0...type.data.length)
		{
			switch (type.data[i].kind) 
			{
				case FFun(f):
					var data:String = type.data[i].name + "(";
					
					var args:Array<String> = [];
					
					for (item in f.args) 
					{
						args.push(getFieldNameAndType(item.name, item.type));
					}
					
					data += args.join(", ");
					data += ")";
					
					if (f.ret != null) 
					{
						data += ":" + getFieldType(f.ret);
					}
					
					fields.push( { name: data, pos: type.data[i].pos.min } );
					
					//currentFunctionScopeType = getFunctionScope(type.data[i], f);
					//
					//if (pos > f.expr.pos.min && pos < f.expr.pos.max) 
					//{
						//if (processExpression(f.expr.expr, pos)) 
						//{
							//break;
						//}
					//}
				case FVar(t, e):
					fields.push( { name: getFieldNameAndType(type.data[i].name, t), pos: type.data[i].pos.min } );
					
					//TPath( p : TypePath );
					//TFunction( args : Array<ComplexType>, ret : ComplexType );
					//TAnonymous( fields : Array<Field> );
					//TParent( t : ComplexType );
					//TExtend( p : Array<TypePath>, fields : Array<Field> );
					//TOptional( t : ComplexType );
					
					
					//completions.push(type.data[i].name);
					//trace(e);
					//currentFunctionScopeType = SClass;
				case FProp(get, set, t, e):
					fields.push({name: type.data[i].name, pos: type.data[i].pos.min});
					//completions.push(type.data[i].name);
					//currentFunctionScopeType = SClass;
			}
		}
		
		return fields;
	}
	
	static function getFieldType(t:Null<ComplexType>):String 
	{
		var name:String = null;
		
		if (t != null)
		{
			switch (t) 
			{
				case TPath(p):
					name = p.name;
				case TFunction(args, ret):
				case TAnonymous(fields):
				case TParent(t):
				case TExtend(p, fields):
				case TOptional(t):	
			}    
		}
		
		return name;
	}
	
	static function getFieldNameAndType(name:String, type:Null<ComplexType>):String
	{
		var nameAndType:String = name;
		
		var fieldType:String = getFieldType(type);
		
		if (fieldType != null) 
		{
			nameAndType += ":" + fieldType;
		}
		
		return nameAndType;
	}
}