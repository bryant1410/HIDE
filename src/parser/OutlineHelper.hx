package parser;
import outline.OutlineParser;
import core.OutlinePanel;
import outline.OutlineFormatter;
import js.Node;

typedef DeclarationPos = 
{
	var min:Int;
	var max:Int;
}


typedef ClassField =
{
	var name:String;
	var pos:DeclarationPos;
}

/**
 * ...
 * @author AS3Boyan
 */
class OutlineHelper
{
	static var instance:OutlineHelper;
	
	var outlineParser:OutlineParser;
	
	public function new() 
	{
		outlineParser = new OutlineParser();
	}	
	
	public static function get()
	{
		if (instance == null)
		{
			instance = new OutlineHelper();
		}
			
		return instance;
	}
	
    var pathToLastFile:String;
    
	public function getList(data:String, path:String)
	{
		var outlinePanel = OutlinePanel.get();
		
		var outlineItems = outlineParser.parse(data , path );
		
		if( outlineItems != null)
		{
			var parsedData = parseOutlineItems(outlineItems);
			var mainClass = Node.path.basename(path);
			var rootItem:TreeItem = { label: mainClass };
			rootItem.items = parsedData.treeItems;
			rootItem.expanded = true;
			
            pathToLastFile = path;
            
			outlinePanel.clearFields();
			outlinePanel.addField(rootItem);
			outlinePanel.update();
			new OutlineFormatter( parsedData.treeItemFormats );	
			
		}
	}
	
	
	public function parseOutlineItems( outlineItems:Array<OutlineItem> )
	{
		var fileImports = [];
		
		var treeItems:Array<TreeItem> = [];
		var treeItemFormats:Array<TreeItemFormat> = [];
		
		for (outlineItem in outlineItems) switch (outlineItem.type)
		{
			case "class": 
				var treeItem: TreeItem = { label: outlineItem.name };
				var items:Array<TreeItem> = [];
				treeItem.items = items;
				treeItem.expanded = true;
				treeItemFormats.push( { type: outlineItem.type , isPublic: true , isStatic: false } );	
			
				for (item in outlineItem.fields ) 
				{
					 items.push( { label: item.name, value: {min: item.pos , max: item.pos + item.len } } ) ;
		
					treeItemFormats.push( { type: item.type , isPublic: item.isPublic , isStatic: item.isStatic } );
				}
				
				treeItems.push(treeItem);
			case "typedef": 
				var treeItem: TreeItem = { label: outlineItem.name };
				var items:Array<TreeItem> = [];
				treeItem.items = items;
				treeItem.expanded = true;
				treeItemFormats.push( { type: "typedef" , isPublic: true , isStatic: false } );	
			
				for (item in outlineItem.fields ) 
				{
					items.push( { label: item.name, value: {min: item.pos , max: item.pos + item.len } } );
					treeItemFormats.push( { type: item.type , isPublic: true , isStatic: item.isStatic });
				}
				
				treeItems.push(treeItem);
			case "enum": 
				var treeItem: TreeItem = { label: outlineItem.name };
				var items:Array<TreeItem> = [];
				treeItem.items = items;
				treeItem.expanded = true;
				treeItemFormats.push( { type: "enumGroup" , isPublic: true , isStatic: false } );	
			
				for (item in outlineItem.fields ) 
				{
					items.push( { label: item.name, value: item.pos } );
					treeItemFormats.push( { type: "enum" , isPublic: true , isStatic: false } );
				}
				
				treeItems.push(treeItem);
		}
		
		return { fileImports: fileImports, treeItems: treeItems , treeItemFormats: treeItemFormats};
	}
}