package core;
import haxe.xml.Fast;
import js.Node;

/**
 * ...
 * @author AS3Boyan
 */
class HaxeHelper
{
	public static function getArguments(onComplete:Array<String>->Void):Void
	{
		var data:Array<String> = [];
		
		ProcessHelper.runProcess("haxe", ["--help"], null, function (stdout:String, stderr:String):Void 
		{
			var regex:EReg = ~/-+[A-Z-]+ /gim;
			regex.map(stderr, function (ereg:EReg):String
			{
				var str = ereg.matched(0);
				data.push(str.substr(0, str.length - 1));
				return str;
			}
			);
			onComplete(data);
		}
		);
	}
	
	public static function getDefines(onComplete:Array<String>->Void):Void
	{
		var data:Array<String> = [];
		
		ProcessHelper.runProcess("haxe", ["--help-defines"], null, function (stdout:String, stderr:String):Void 
		{
			var regex:EReg = ~/[A-Z-]+ +:/gim;
			regex.map(stdout, function (ereg:EReg):String
			{
				var str = ereg.matched(0);
				data.push(StringTools.trim(str.substr(0, str.length - 1)));
				return ereg.matched(0);
			}
			);
			onComplete(data);
		}
		);
	}
	
	public static function getInstalledHaxelibList(onComplete:Array<String>->Void):Void
	{
		var data:Array<String> = [];
		
		ProcessHelper.runProcess("haxelib", ["list"], null, function (stdout:String, stderr:String):Void 
		{
			var regex:EReg = ~/^[A-Z-]+:/gim;
			regex.map(stdout, function (ereg:EReg):String
			{
				var str = ereg.matched(0);
				data.push(str.substr(0, str.length - 1));
				return str;
			}
			);
			onComplete(data);
		}
		);
	}
	
	public static function getHaxelibList(onComplete:Array<String>->Void):Void 
	{
		var options = {
		  host: 'lib.haxe.org',
		  port: 80,
		  path: '/all'
		};

		var emitter = Node.http.get(options, function(res) {
		  trace("Got response: " + res.statusCode);
		  
		  res.setEncoding(NodeC.UTF8);
		  
		  var data:String = "";
		  
		  res.on('data', function (chunk:String):Void 
		  {
			  data += chunk;
		  });
		  
		  res.on('end', function ():Void 
		  {
			  var libs = parseHtml(data);
			  onComplete(libs);
		  });
		  
		});
		
		emitter.on('error', function(e) {
		  trace("Got error: " + e.message);
		});
	}
	
	static function parseHtml(data:String):Array<String>
	{
		var libs:Array<String> = [];
		
		var xml = Xml.parse(data);
		var fast = new Fast(xml);
		
		if (fast.hasNode.html) 
		{
			var html:Fast = fast.node.html;
			
			if (html.hasNode.body) 
			{
				var body:Fast = html.node.body;
				
				if (body.hasNode.div) 
				{				
					for (node in body.nodes.div) 
					{			
						if (node.has.resolve("class") && node.att.resolve("class") == "page") 
						{
							for (div in node.nodes.div) 
							{
								if (div.has.resolve("class") && div.att.resolve("class") == "content")
								{									
									for (div2 in div.nodes.div) 
									{
										if (div2.has.resolve("class") && div2.att.resolve("class") == "projects")
										{
											if (div2.hasNode.ul) 
											{
												var ul = div2.node.ul;
												
												for (li in ul.nodes.li) 
												{
													libs.push(li.node.a.innerData);
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		
		return libs;
	}
}