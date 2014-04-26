package core;
import haxe.xml.Fast;
import js.Node;

/**
 * ...
 * @author AS3Boyan
 */
class HaxeHelper
{
	static var haxeArguments:Array<String>;
	static var haxeDefines:Array<String>;
	static var haxelibHaxelibs:Array<String>;
	static var installedHaxelibs:Array<String>;
	
	public static function getArguments(onComplete:Array<String>->Void):Void
	{
		if (haxeArguments != null) 
		{
			onComplete(haxeArguments);
		}
		else 
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
				haxeArguments = data;
				onComplete(haxeArguments);
			}
			);
		}
	}
	
	public static function getDefines(onComplete:Array<String>->Void):Void
	{
		if (haxeDefines != null) 
		{
			onComplete(haxeDefines);
		}
		else 
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
				haxeDefines = data;
				onComplete(haxeDefines);
			}
			);
		}
	}
	
	public static function getInstalledHaxelibList(onComplete:Array<String>->Void):Void
	{
		if (installedHaxelibs != null) 
		{
			onComplete(installedHaxelibs);
		}
		else 
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
				installedHaxelibs = data;
				onComplete(installedHaxelibs);
			}
			);
		}
	}
	
	public static function getHaxelibList(onComplete:Array<String>->Void):Void 
	{
		if (haxelibHaxelibs != null) 
		{
			onComplete(haxelibHaxelibs);
		}
		else 
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
				  haxelibHaxelibs = libs;
				  onComplete(haxelibHaxelibs);
			  });
			  
			});
			
			emitter.on('error', function(e) {
			  trace("Got error: " + e.message);
			});
		}
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
													
													//if (li.hasNode.div) 
													//{
														//var descriptionDiv = li.node.div;
														//
														//if (descriptionDiv.att.resolve("class") == "description") 
														//{		
															//try 
															//{
																//trace(li.node.a.innerData);
																//trace(descriptionDiv.innerData);
															//}
															//catch (unknown:Dynamic)
															//{
																//trace(unknown);
															//}
														//}
													//}
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