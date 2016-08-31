(function (console, $global) { "use strict";
var $hxClasses = {};
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,matchedRight: function() {
		if(this.r.m == null) throw new js__$Boot_HaxeError("No string matched");
		var sz = this.r.m.index + this.r.m[0].length;
		return HxOverrides.substr(this.r.s,sz,this.r.s.length - sz);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw new js__$Boot_HaxeError("No string matched");
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) this.r.s = s;
			return b;
		} else {
			var b1 = this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf = new StringBuf();
		do {
			if(offset >= s.length) break; else if(!this.matchSub(s,offset)) {
				buf.add(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf.add(HxOverrides.substr(s,offset,p.pos - offset));
			buf.add(f(this));
			if(p.len == 0) {
				buf.add(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else offset = p.pos + p.len;
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) buf.add(HxOverrides.substr(s,offset,null));
		return buf.b;
	}
	,__class__: EReg
};
var HIDE = function() { };
$hxClasses["HIDE"] = HIDE;
HIDE.__name__ = ["HIDE"];
HIDE.loadJS = function(name,urls,onLoad) {
	if(name != null) {
		var _g1 = 0;
		var _g = urls.length;
		while(_g1 < _g) {
			var i = _g1++;
			urls[i] = js_Node.require("path").join(HIDE.getPluginPath(name),urls[i]);
		}
	}
	HIDE.loadJSAsync(name,urls,onLoad);
};
HIDE.traceScriptLoadingInfo = function(name,url) {
	var str;
	if(name != null) str = "\n" + name + ":\n" + url + "\n"; else str = url + " loaded";
};
HIDE.getPluginPath = function(name) {
	var pluginManager = pluginloader_PluginManager.get();
	var pathToPlugin = pluginManager.pathToPlugins.get(name);
	if(pathToPlugin == null) haxe_Log.trace("HIDE can't find path for plugin: " + name + "\nPlease check folder structure of plugin, make sure that it corresponds to it's 'name'",{ fileName : "HIDE.hx", lineNumber : 99, className : "HIDE", methodName : "getPluginPath"});
	return pathToPlugin;
};
HIDE.openPageInNewWindow = function(name,url,params) {
	var fullPath = url;
	if(!StringTools.startsWith(url,"http") && name != null) fullPath = js_Node.require("path").join(HIDE.getPluginPath(name),url);
	var $window = nodejs_webkit_Window.open(fullPath,params);
	HIDE.windows.push($window);
	$window.on("close",function(e) {
		HxOverrides.remove(HIDE.windows,$window);
		$window.close(true);
	});
	return $window;
};
HIDE.compilePlugins = function(onComplete,onFailed) {
	var pluginManager = pluginloader_PluginManager.get();
	pluginManager.compilePlugins(onComplete,onFailed);
};
HIDE.surroundWithQuotes = function(path) {
	return "\"" + path + "\"";
};
HIDE.loadJSAsync = function(name,urls,onLoad) {
	var script;
	var _this = window.document;
	script = _this.createElement("script");
	script.src = urls.splice(0,1)[0];
	script.onload = function(e) {
		HIDE.traceScriptLoadingInfo(name,script.src);
		if(urls.length > 0) HIDE.loadJSAsync(name,urls,onLoad); else if(onLoad != null) onLoad();
	};
	window.document.body.appendChild(script);
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
};
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
};
Lambda.find = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v = $it0.next();
		if(f(v)) return v;
	}
	return null;
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,first: function() {
		if(this.h == null) return null; else return this.h[0];
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,iterator: function() {
		return new _$List_ListIterator(this.h);
	}
	,__class__: List
};
var _$List_ListIterator = function(head) {
	this.head = head;
	this.val = null;
};
$hxClasses["_List.ListIterator"] = _$List_ListIterator;
_$List_ListIterator.__name__ = ["_List","ListIterator"];
_$List_ListIterator.prototype = {
	head: null
	,val: null
	,hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		this.val = this.head[0];
		this.head = this.head[1];
		return this.val;
	}
	,__class__: _$List_ListIterator
};
var Main = function() { };
$hxClasses["Main"] = Main;
Main.__name__ = ["Main"];
Main.main = function() {
	Main.window = nodejs_webkit_Window.get();
	Main.window.showDevTools();
	Main.window.title = "HIDE";
	js_Node.process.on("uncaughtException",function(err) {
		haxe_Log.trace(err,{ fileName : "Main.hx", lineNumber : 73, className : "Main", methodName : "main"});
		Main.window.show();
	});
	Main.sync = true;
	core_PreserveWindowState.init();
	window.addEventListener("load",function(e) {
		var splitter = core_Splitter.get();
		splitter.load();
		watchers_SettingsWatcher.load();
		var snippetsCompletion = watchers_SnippetsWatcher.get();
		snippetsCompletion.load();
		core_Utils.prepare();
		core_Hotkeys.prepare();
		menu_BootstrapMenu.createMenuBar();
		newprojectdialog_NewProjectDialog.load();
		var zoom = cm_Zoom.get();
		zoom.load();
		var fileTreeInstance = filetree_FileTree.get();
		fileTreeInstance.init();
		var projectOptions = projectaccess_ProjectOptions.get();
		projectOptions.create();
		dialogs_DialogManager.load();
		core_FileDialog.create();
		var tabManagerInstance = tabmanager_TabManager.get();
		tabManagerInstance.load();
		var classpathWalker = parser_ClasspathWalker.get();
		classpathWalker.load();
		core_HaxeLint.load();
		cm_Editor.load();
		core_MenuCommands.add();
		var completionInstance = core_Completion.get();
		completionInstance.load();
		autoformat_HaxePrinterLoader.load();
		projectaccess_ProjectAccess.registerSaveOnCloseListener();
		var haxeProject = haxeproject_HaxeProject.get();
		var openFLProject = openflproject_OpenFLProject.get();
		var flambeProject = flambeproject_FlambeProject.get();
		var khaProject = kha_KhaProject.get();
		khaProject.load();
		core_CompilationOutput.load();
		var recentProjectsList = core_RecentProjectsList.get();
		var args = nodejs_webkit_App.argv;
		haxe_Log.trace(args,{ fileName : "Main.hx", lineNumber : 145, className : "Main", methodName : "main"});
		var success = false;
		if(args.length > 0) success = openproject_OpenProject.openProject(args[0]);
		if(args.length == 0 || !success) openproject_OpenProject.searchForLastProject();
		core_DragAndDrop.prepare();
		var classWalker = parser_ClasspathWalker.get();
		var welcomeScreen = core_WelcomeScreen.get();
		welcomeScreen.load();
		var quickOpen = core_QuickOpen.get();
		watchers_LocaleWatcher.processHtmlElements();
		Main.sync = false;
		Main.currentTime = new Date().getTime();
		var processHelper = core_ProcessHelper.get();
		var pluginManager = pluginloader_PluginManager.get();
		processHelper.checkProcessInstalled("haxe",["-v"],function(installed) {
			if(installed) {
				core_HaxeServer.check();
				pluginManager.loadPlugins();
			} else {
				alertify.error("Haxe compiler is not found");
				pluginManager.loadPlugins(false);
			}
		});
		processHelper.checkProcessInstalled("npm",["-v"],function(installed1) {
			haxe_Log.trace("npm installed " + (installed1 == null?"null":"" + installed1),{ fileName : "Main.hx", lineNumber : 193, className : "Main", methodName : "main"});
			if(installed1) processHelper.runProcess("npm",["list","-g","flambe"],null,function(stdout,stderr) {
				haxe_Log.trace("flambe installed " + Std.string(stdout.indexOf("(empty)") == -1),{ fileName : "Main.hx", lineNumber : 199, className : "Main", methodName : "main"});
			},function(code,stdout1,stderr1) {
				haxe_Log.trace("flambe installed " + Std.string(stdout1.indexOf("(empty)") == -1),{ fileName : "Main.hx", lineNumber : 203, className : "Main", methodName : "main"});
			});
		});
		processHelper.checkProcessInstalled("haxelib run lime",[],function(installed2) {
			haxe_Log.trace("lime installed " + (installed2 == null?"null":"" + installed2),{ fileName : "Main.hx", lineNumber : 212, className : "Main", methodName : "main"});
		});
		processHelper.checkProcessInstalled("git",["--version"],function(installed3) {
			haxe_Log.trace("git installed " + (installed3 == null?"null":"" + installed3),{ fileName : "Main.hx", lineNumber : 218, className : "Main", methodName : "main"});
		});
		Main.window.show();
		Main.setupTools();
	});
	Main.window.on("close",function(e1) {
		nodejs_webkit_App.closeAllWindows();
	});
};
Main.setupTools = function() {
	tools_gradle_GradleTool.get().setup();
};
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js_Boot.__instanceof(v,t);
};
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null; else return js_Boot.getClass(o);
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw new js__$Boot_HaxeError("Too many arguments");
	}
	return null;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw new js__$Boot_HaxeError("No such constructor " + constr);
	if(Reflect.isFunction(f)) {
		if(params == null) throw new js__$Boot_HaxeError("Constructor " + constr + " need parameters");
		return Reflect.callMethod(e,f,params);
	}
	if(params != null && params.length != 0) throw new js__$Boot_HaxeError("Constructor " + constr + " does not need parameters");
	return f;
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js_Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumIndex = function(e) {
	return e[1];
};
var Xml = function(nodeType) {
	this.nodeType = nodeType;
	this.children = [];
	this.attributeMap = new haxe_ds_StringMap();
};
$hxClasses["Xml"] = Xml;
Xml.__name__ = ["Xml"];
Xml.parse = function(str) {
	return haxe_xml_Parser.parse(str);
};
Xml.createElement = function(name) {
	var xml = new Xml(Xml.Element);
	if(xml.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + xml.nodeType);
	xml.nodeName = name;
	return xml;
};
Xml.createPCData = function(data) {
	var xml = new Xml(Xml.PCData);
	if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + xml.nodeType);
	xml.nodeValue = data;
	return xml;
};
Xml.createCData = function(data) {
	var xml = new Xml(Xml.CData);
	if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + xml.nodeType);
	xml.nodeValue = data;
	return xml;
};
Xml.createComment = function(data) {
	var xml = new Xml(Xml.Comment);
	if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + xml.nodeType);
	xml.nodeValue = data;
	return xml;
};
Xml.createDocType = function(data) {
	var xml = new Xml(Xml.DocType);
	if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + xml.nodeType);
	xml.nodeValue = data;
	return xml;
};
Xml.createProcessingInstruction = function(data) {
	var xml = new Xml(Xml.ProcessingInstruction);
	if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + xml.nodeType);
	xml.nodeValue = data;
	return xml;
};
Xml.createDocument = function() {
	return new Xml(Xml.Document);
};
Xml.prototype = {
	nodeType: null
	,nodeName: null
	,nodeValue: null
	,parent: null
	,children: null
	,attributeMap: null
	,get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + this.nodeType);
		return this.nodeName;
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + this.nodeType);
		return this.attributeMap.get(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + this.nodeType);
		this.attributeMap.set(att,value);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + this.nodeType);
		return this.attributeMap.exists(att);
	}
	,attributes: function() {
		if(this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + this.nodeType);
		return this.attributeMap.keys();
	}
	,iterator: function() {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element or Document but found " + this.nodeType);
		return HxOverrides.iter(this.children);
	}
	,elements: function() {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element or Document but found " + this.nodeType);
		var ret;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.children;
		while(_g1 < _g2.length) {
			var child = _g2[_g1];
			++_g1;
			if(child.nodeType == Xml.Element) _g.push(child);
		}
		ret = _g;
		return HxOverrides.iter(ret);
	}
	,elementsNamed: function(name) {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element or Document but found " + this.nodeType);
		var ret;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.children;
		while(_g1 < _g2.length) {
			var child = _g2[_g1];
			++_g1;
			if(child.nodeType == Xml.Element && (function($this) {
				var $r;
				if(child.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + child.nodeType);
				$r = child.nodeName;
				return $r;
			}(this)) == name) _g.push(child);
		}
		ret = _g;
		return HxOverrides.iter(ret);
	}
	,addChild: function(x) {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element or Document but found " + this.nodeType);
		if(x.parent != null) x.parent.removeChild(x);
		this.children.push(x);
		x.parent = this;
	}
	,removeChild: function(x) {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element or Document but found " + this.nodeType);
		if(HxOverrides.remove(this.children,x)) {
			x.parent = null;
			return true;
		}
		return false;
	}
	,__class__: Xml
};
var autoformat_HaxePrinter = function() { };
$hxClasses["autoformat.HaxePrinter"] = autoformat_HaxePrinter;
autoformat_HaxePrinter.__name__ = ["autoformat","HaxePrinter"];
autoformat_HaxePrinter.formatSource = function(source) {
	var input = byte_js__$ByteData_ByteData_$Impl_$.ofString(source);
	var parser = new haxeparser_HaxeParser(input,"");
	var ast;
	try {
		ast = parser.parse();
	} catch( $e0 ) {
		if ($e0 instanceof js__$Boot_HaxeError) $e0 = $e0.val;
		if( js_Boot.__instanceof($e0,hxparse_NoMatch) ) {
			var e = $e0;
			throw new js__$Boot_HaxeError(e.pos.format(input) + ": Unexpected " + Std.string(e.token.tok));
		} else if( js_Boot.__instanceof($e0,hxparse_Unexpected) ) {
			var e1 = $e0;
			throw new js__$Boot_HaxeError(e1.pos.format(input) + ": Unexpected " + Std.string(e1.token.tok));
		} else throw($e0);
	}
	var printer = new haxeprinter_Printer();
	var options = { };
	options.encoding = "utf8";
	printer.config = tjson_TJSON.parse(js_Node.require("fs").readFileSync(js_Node.require("path").join("core","config","autoformat.json"),options));
	return printer.printAST(ast);
};
var autoformat_HaxePrinterLoader = function() { };
$hxClasses["autoformat.HaxePrinterLoader"] = autoformat_HaxePrinterLoader;
autoformat_HaxePrinterLoader.__name__ = ["autoformat","HaxePrinterLoader"];
autoformat_HaxePrinterLoader.load = function() {
	var tabManagerInstance = tabmanager_TabManager.get();
	menu_BootstrapMenu.getMenu("Source",5).addMenuItem("Autoformat",1,function() {
		if(js_Node.require("path").extname(tabManagerInstance.getCurrentDocumentPath()) == ".hx") {
			var data = cm_Editor.editor.getValue();
			if(data != "") {
				data = autoformat_HaxePrinter.formatSource(data);
				cm_Editor.editor.setValue(data);
			}
		}
	},"Ctrl-Shift-F");
	menu_BootstrapMenu.getMenu("Options").addMenuItem("Open autoformat configuration file",1,(function(f,a1) {
		return function() {
			f(a1);
		};
	})($bind(tabManagerInstance,tabManagerInstance.openFileInNewTab),js_Node.require("path").join("core","config","autoformat.json")));
};
var bootstrap_ButtonManager = function() {
};
$hxClasses["bootstrap.ButtonManager"] = bootstrap_ButtonManager;
bootstrap_ButtonManager.__name__ = ["bootstrap","ButtonManager"];
bootstrap_ButtonManager.get = function() {
	if(bootstrap_ButtonManager.instance == null) bootstrap_ButtonManager.instance = new bootstrap_ButtonManager();
	return bootstrap_ButtonManager.instance;
};
bootstrap_ButtonManager.prototype = {
	createButton: function(text,disabled,hide,primary) {
		if(primary == null) primary = false;
		if(hide == null) hide = false;
		if(disabled == null) disabled = false;
		var button;
		var _this = window.document;
		button = _this.createElement("button");
		button.type = "button";
		if(primary) button.className = "btn btn-primary"; else button.className = "btn btn-default";
		button.setAttribute("localeString",text);
		button.textContent = watchers_LocaleWatcher.getStringSync(text);
		if(disabled) button.classList.add("disabled");
		if(hide) button.setAttribute("data-dismiss","modal");
		return button;
	}
	,__class__: bootstrap_ButtonManager
};
var bootstrap_InputGroup = function() {
	var _this = window.document;
	this.inputGroup = _this.createElement("div");
	this.inputGroup.className = "input-group";
	var _this1 = window.document;
	this.input = _this1.createElement("input");
	this.input.type = "text";
	this.input.className = "form-control";
	this.inputGroup.appendChild(this.input);
};
$hxClasses["bootstrap.InputGroup"] = bootstrap_InputGroup;
bootstrap_InputGroup.__name__ = ["bootstrap","InputGroup"];
bootstrap_InputGroup.prototype = {
	inputGroup: null
	,input: null
	,getInput: function() {
		return this.input;
	}
	,getElement: function() {
		return this.inputGroup;
	}
	,__class__: bootstrap_InputGroup
};
var bootstrap_InputGroupButton = function(text) {
	bootstrap_InputGroup.call(this);
	var _this = window.document;
	this.span = _this.createElement("span");
	this.span.className = "input-group-btn";
	var buttonManager = bootstrap_ButtonManager.get();
	this.button = buttonManager.createButton(text);
	this.span.appendChild(this.button);
	this.inputGroup.appendChild(this.span);
};
$hxClasses["bootstrap.InputGroupButton"] = bootstrap_InputGroupButton;
bootstrap_InputGroupButton.__name__ = ["bootstrap","InputGroupButton"];
bootstrap_InputGroupButton.__super__ = bootstrap_InputGroup;
bootstrap_InputGroupButton.prototype = $extend(bootstrap_InputGroup.prototype,{
	span: null
	,button: null
	,getSpan: function() {
		return this.span;
	}
	,getButton: function() {
		return this.button;
	}
	,__class__: bootstrap_InputGroupButton
});
var bootstrap_ListGroup = function() {
	this.items = [];
	var _this = window.document;
	this.listGroup = _this.createElement("div");
	this.listGroup.className = "list-group";
};
$hxClasses["bootstrap.ListGroup"] = bootstrap_ListGroup;
bootstrap_ListGroup.__name__ = ["bootstrap","ListGroup"];
bootstrap_ListGroup.prototype = {
	length: null
	,listGroup: null
	,items: null
	,addItem: function(text,description,onClick) {
		var a;
		var _this = window.document;
		a = _this.createElement("a");
		a.href = "#";
		a.className = "list-group-item";
		if(onClick != null) a.onclick = onClick;
		var h4;
		h4 = js_Boot.__cast(window.document.createElement("h4") , HTMLHeadingElement);
		h4.className = "list-group-item-heading";
		h4.textContent = text;
		a.appendChild(h4);
		var p;
		var _this1 = window.document;
		p = _this1.createElement("p");
		p.className = "list-group-item-text";
		p.textContent = description;
		a.appendChild(p);
		this.items.push(a);
		this.listGroup.appendChild(a);
		this.length = this.items.length;
	}
	,clear: function() {
		var len = this.listGroup.childNodes.length;
		while(len-- > 0) this.listGroup.removeChild(this.listGroup.lastChild);
		this.items = [];
		this.length = -1;
	}
	,getItems: function() {
		return this.items;
	}
	,getElement: function() {
		return this.listGroup;
	}
	,__class__: bootstrap_ListGroup
};
var bootstrap_RadioElement = function(_name,_value,_text,_onChange) {
	var _this = window.document;
	this.element = _this.createElement("div");
	this.element.className = "radio";
	var label;
	var _this1 = window.document;
	label = _this1.createElement("label");
	this.element.appendChild(label);
	var _this2 = window.document;
	this.input = _this2.createElement("input");
	this.input.type = "radio";
	this.input.name = _name;
	this.input.value = _value;
	this.input.onchange = function(e) {
		if(_onChange != null) _onChange();
	};
	label.appendChild(this.input);
	label.appendChild(window.document.createTextNode(_text));
	this.element.appendChild(label);
};
$hxClasses["bootstrap.RadioElement"] = bootstrap_RadioElement;
bootstrap_RadioElement.__name__ = ["bootstrap","RadioElement"];
bootstrap_RadioElement.prototype = {
	element: null
	,input: null
	,getInput: function() {
		return this.input;
	}
	,getElement: function() {
		return this.element;
	}
	,__class__: bootstrap_RadioElement
};
var build_CommandPreprocessor = function() { };
$hxClasses["build.CommandPreprocessor"] = build_CommandPreprocessor;
build_CommandPreprocessor.__name__ = ["build","CommandPreprocessor"];
build_CommandPreprocessor.preprocess = function(command,path) {
	var processedCommand = command;
	processedCommand = StringTools.replace(processedCommand,"%path%",path);
	var ereg = new EReg("%join%[(](.+)[)]","");
	if(ereg.match(processedCommand)) {
		var matchedString = ereg.matched(1);
		var args = matchedString.split(",");
		processedCommand = StringTools.replace(processedCommand,ereg.matched(0),js_Node.require("path").join(args[0],args[1]));
	}
	return processedCommand;
};
var build_Hxml = function() { };
$hxClasses["build.Hxml"] = build_Hxml;
build_Hxml.__name__ = ["build","Hxml"];
build_Hxml.checkHxml = function(dirname,filename,hxmlData,onComplete) {
	var useCompilationServer = true;
	var startCommandLine = false;
	if(hxmlData != null) {
		if(hxmlData.indexOf("-cmd") != -1) startCommandLine = true;
		if(hxmlData.indexOf("-cpp") != -1) useCompilationServer = false;
	}
	build_Hxml.buildHxml(dirname,filename,useCompilationServer,startCommandLine,onComplete);
};
build_Hxml.buildHxml = function(dirname,filename,useCompilationServer,startCommandLine,onComplete) {
	if(startCommandLine == null) startCommandLine = false;
	if(useCompilationServer == null) useCompilationServer = true;
	var params = [];
	if(startCommandLine) {
		var _g = core_Utils.os;
		switch(_g) {
		case 0:
			params.push("start");
			break;
		default:
		}
	}
	var pathToHaxe = core_HaxeHelper.getPathToHaxe();
	params = params.concat([pathToHaxe,"--cwd",dirname]);
	if(useCompilationServer) params = params.concat(["--connect","5000"]);
	params.push(filename);
	var $process = params.shift();
	var cwd = projectaccess_ProjectAccess.path;
	var processHelper = core_ProcessHelper.get();
	processHelper.runProcessAndPrintOutputToConsole($process,params,cwd,onComplete);
};
var byte_js__$ByteData_ByteData_$Impl_$ = {};
$hxClasses["byte.js._ByteData.ByteData_Impl_"] = byte_js__$ByteData_ByteData_$Impl_$;
byte_js__$ByteData_ByteData_$Impl_$.__name__ = ["byte","js","_ByteData","ByteData_Impl_"];
byte_js__$ByteData_ByteData_$Impl_$.get_length = function(this1) {
	return this1.length;
};
byte_js__$ByteData_ByteData_$Impl_$.readString = function(this1,pos,len) {
	var buf_b = "";
	var _g1 = pos;
	var _g = pos + len;
	while(_g1 < _g) {
		var i = _g1++;
		buf_b += String.fromCharCode(this1[i]);
	}
	return buf_b;
};
byte_js__$ByteData_ByteData_$Impl_$.ofString = function(s) {
	var a = new Uint8Array(s.length);
	var _g1 = 0;
	var _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = s.charCodeAt(i);
	}
	return a;
};
var cm_ColorPreview = function() { };
$hxClasses["cm.ColorPreview"] = cm_ColorPreview;
cm_ColorPreview.__name__ = ["cm","ColorPreview"];
cm_ColorPreview.create = function(cm1) {
	cm_ColorPreview.preview = js_Boot.__cast(window.document.getElementsByClassName("colorPreview")[0] , HTMLDivElement);
	cm_ColorPreview.startScroll = cm1.getScrollInfo();
	$(".colorPreview").spectrum({ showButtons : false, show : function() {
		cm_ColorPreview.isColorPickerShown = true;
		cm_ColorPreview.applyChanges = true;
		$(".colorPreview").spectrum("set",cm_ColorPreview.preview.style.backgroundColor);
	}, hide : function() {
		cm_ColorPreview.isColorPickerShown = false;
	}, change : function(color) {
		if(cm_ColorPreview.applyChanges) {
			var colorString = color.toHex();
			cm1.replaceRange(cm_ColorPreview.startingFormat + colorString,cm_ColorPreview.wordStart,cm_ColorPreview.wordEnd);
		} else cm_ColorPreview.preview.style.backgroundColor = cm_ColorPreview.startingColor;
	}, move : function(color1) {
		var colorString1 = color1.toHex();
		cm_ColorPreview.preview.style.backgroundColor = "#" + colorString1;
	}});
	window.onkeyup = function(e) {
		cm_ColorPreview.applyChanges = false;
		if(e.keyCode == 27 && cm_ColorPreview.preview.style.display != "none") $(".colorPreview").spectrum("hide");
	};
	$(window.document).click(function(e1) {
		if(!Std["is"](window.document.activeElement,HTMLTextAreaElement)) {
			cm_ColorPreview.applyChanges = false;
			$(cm_ColorPreview.preview).fadeOut(250);
			$(".colorPreview").spectrum("hide");
		}
	});
};
cm_ColorPreview.update = function(cm1) {
	var completionInstance = core_Completion.get();
	var wordData = completionInstance.getCurrentWord(cm1,{ word : new EReg("[A-Fx0-9#]+$","i")},cm1.getCursor());
	var word = wordData.word;
	var color = null;
	if(word != null && word.length > 2) {
		if(!cm_ColorPreview.isColorPickerShown) {
			cm_ColorPreview.wordStart = wordData.from;
			cm_ColorPreview.wordEnd = wordData.to;
			if(StringTools.startsWith(word,"0x")) {
				color = HxOverrides.substr(word,2,null);
				cm_ColorPreview.startingFormat = "0x";
			} else if(StringTools.startsWith(word,"#")) {
				color = HxOverrides.substr(word,1,null);
				cm_ColorPreview.startingFormat = "#";
			}
			if(color != null) {
				cm_ColorPreview.startScroll = cm1.getScrollInfo();
				var pos = cm1.cursorCoords(null);
				cm_ColorPreview.top = pos.bottom;
				cm_ColorPreview.left = pos.left;
				cm_ColorPreview.startingColor = "#" + color;
				cm_ColorPreview.preview.style.backgroundColor = cm_ColorPreview.startingColor;
				$(cm_ColorPreview.preview).animate({ left : (pos.left == null?"null":"" + pos.left) + "px", top : (pos.bottom == null?"null":"" + pos.bottom) + "px"});
				if(cm_ColorPreview.preview.style.display == "none") $(cm_ColorPreview.preview).fadeIn(250);
			} else $(cm_ColorPreview.preview).fadeOut(250);
		}
	} else {
		$(cm_ColorPreview.preview).fadeOut(250);
		$(".colorPreview").spectrum("hide");
	}
};
cm_ColorPreview.scroll = function(cm1) {
	if(cm_ColorPreview.preview.style.display != "none") {
		var curScroll = cm1.getScrollInfo();
		var editor = cm1.getWrapperElement().getBoundingClientRect();
		var newTop = cm_ColorPreview.top + cm_ColorPreview.startScroll.top - curScroll.top;
		var point = newTop - $().scrollTop();
		if(point <= editor.top || point >= editor.bottom) {
			$(cm_ColorPreview.preview).fadeOut(250);
			return;
		}
		cm_ColorPreview.preview.style.top = newTop + "px";
		cm_ColorPreview.preview.style.left = cm_ColorPreview.left + cm_ColorPreview.startScroll.left - curScroll.left + "px";
	}
};
var cm_ERegPreview = function() { };
$hxClasses["cm.ERegPreview"] = cm_ERegPreview;
cm_ERegPreview.__name__ = ["cm","ERegPreview"];
cm_ERegPreview.update = function(cm1) {
	var lineData = cm1.getLine(cm1.getCursor().line);
	var ereg = new EReg("~/(.)+/[gimsu]+","");
	var foundEreg = null;
	var foundEregOptions = null;
	if(ereg.match(lineData)) {
		var str = ereg.matched(0);
		str = StringTools.trim(HxOverrides.substr(str,2,str.length - 2));
		var index = str.lastIndexOf("/");
		foundEreg = HxOverrides.substr(str,0,index);
		foundEregOptions = HxOverrides.substr(str,index + 1,null);
	}
	var _g = 0;
	var _g1 = cm_ERegPreview.markers;
	while(_g < _g1.length) {
		var marker = _g1[_g];
		++_g;
		marker.clear();
	}
	cm_ERegPreview.markers = [];
	if(foundEreg != null) try {
		var ereg1 = new EReg(foundEreg,foundEregOptions);
		ereg1.map(cm1.getValue(),function(matchedEreg) {
			var pos = cm1.posFromIndex(matchedEreg.matchedPos().pos);
			var pos2 = cm1.posFromIndex(matchedEreg.matchedPos().pos + matchedEreg.matchedPos().len);
			cm_ERegPreview.markers.push(cm1.markText(pos,pos2,{ className : "showRegex"}));
			return "";
		});
	} catch( unknown ) {
		if (unknown instanceof js__$Boot_HaxeError) unknown = unknown.val;
		haxe_Log.trace(unknown,{ fileName : "ERegPreview.hx", lineNumber : 53, className : "cm.ERegPreview", methodName : "update"});
	}
};
var cm_Editor = function() { };
$hxClasses["cm.Editor"] = cm_Editor;
cm_Editor.__name__ = ["cm","Editor"];
cm_Editor.load = function() {
	cm_Editor.regenerateCompletionOnDot = true;
	var readFileOptions = { };
	readFileOptions.encoding = "utf8";
	var options = { };
	try {
		options = tjson_TJSON.parse(js_Node.require("fs").readFileSync(js_Node.require("path").join(watchers_SettingsWatcher.pathToFolder,"editor.json"),readFileOptions));
	} catch( err ) {
		if (err instanceof js__$Boot_HaxeError) err = err.val;
		haxe_Log.trace(err,{ fileName : "Editor.hx", lineNumber : 64, className : "cm.Editor", methodName : "load"});
	}
	cm_Editor.walk(options);
	var tabManagerInstance = tabmanager_TabManager.get();
	var completionInstance = core_Completion.get();
	var xmlInstance = cm_Xml.get();
	options.extraKeys = { '.' : (function($this) {
		var $r;
		var passAndHint = function(cm1) {
			if(tabManagerInstance.getCurrentDocument().getMode().name == "haxe") {
				var completionActive = cm_Editor.editor.state.completionActive;
				var completionType = completionInstance.getCompletionType();
				if((completionType == core_CompletionType.REGULAR || completionType == core_CompletionType.CLASSLIST) && completionActive != null && completionActive.widget != null) completionActive.widget.pick();
			}
			return CodeMirror.Pass;
		};
		$r = passAndHint;
		return $r;
	}(this)), ';' : (function($this) {
		var $r;
		var passAndHint1 = function(cm2) {
			var cursor = cm_Editor.editor.getCursor();
			var ch = cm_Editor.editor.getRange(cursor,{ line : cursor.line, ch : cursor.ch + 1});
			if(ch == ";") {
				cm2.execCommand("goCharRight");
				return null;
			} else return CodeMirror.Pass;
		};
		$r = passAndHint1;
		return $r;
	}(this)), '=' : (function($this) {
		var $r;
		var passAndHint2 = function(cm21) {
			var mode = tabManagerInstance.getCurrentDocument().getMode().name;
			if(completionInstance.getCompletionType() == core_CompletionType.REGULAR && mode == "haxe" || mode == "xml") {
				var completionActive1 = cm21.state.completionActive;
				if(completionActive1 != null && completionActive1.widget != null) completionActive1.widget.pick();
				if(mode == "xml") {
					var cur = cm21.getCursor();
					cm21.replaceRange("=\"\"",cur,cur);
					cm21.execCommand("goCharLeft");
					xmlInstance.completeIfInTag(cm21);
					return null;
				} else return CodeMirror.Pass;
			} else return CodeMirror.Pass;
		};
		$r = passAndHint2;
		return $r;
	}(this)), '\'<\'' : (function($this) {
		var $r;
		var passAndHint3 = function(cm22) {
			xmlInstance.completeAfter(cm22);
			return CodeMirror.Pass;
		};
		$r = passAndHint3;
		return $r;
	}(this)), '\'/\'' : (function($this) {
		var $r;
		var passAndHint4 = function(cm23) {
			xmlInstance.completeIfAfterLt(cm23);
			return CodeMirror.Pass;
		};
		$r = passAndHint4;
		return $r;
	}(this)), '\' \'' : (function($this) {
		var $r;
		var passAndHint5 = function(cm24) {
			xmlInstance.completeIfInTag(cm24);
			return CodeMirror.Pass;
		};
		$r = passAndHint5;
		return $r;
	}(this)), 'Ctrl-J' : "toMatchingTag"};
	cm_Editor.editor = CodeMirror.fromTextArea(window.document.getElementById("code"),options);
	cm_Editor.editor.on("keypress",function(cm3,e) {
		if(e.shiftKey) {
			if(e.keyCode == 40 || e.keyCode == 62) {
				if(completionInstance.getCompletionType() == core_CompletionType.REGULAR && tabManagerInstance.getCurrentDocument().getMode().name == "haxe") {
					var completionActive2 = cm_Editor.editor.state.completionActive;
					if(completionActive2 != null && completionActive2.widget != null) completionActive2.widget.pick();
				}
			}
		}
	});
	$("#editor").hide(0);
	cm_Editor.loadThemes(["3024-day","3024-night","ambiance-mobile","ambiance","base16-dark","base16-light","blackboard","cobalt","eclipse","elegant","erlang-dark","lesser-dark","mbo","mdn-like","midnight","monokai","neat","neo","night","paraiso-dark","paraiso-light","pastel-on-dark","rubyblue","solarized","the-matrix","tomorrow-night-eighties","twilight","vibrant-ink","xq-dark","xq-light"],cm_Editor.loadTheme);
	var value = "";
	var map = CodeMirror.keyMap.sublime;
	var mapK = CodeMirror.keyMap["sublime-Ctrl-K"];
	var _g = 0;
	var _g1 = Reflect.fields(map);
	while(_g < _g1.length) {
		var key = _g1[_g];
		++_g;
		if(key != "Ctrl-K" && key != "fallthrough") value += "  \"" + key + "\": \"" + Std.string(Reflect.field(map,key)) + "\",\n";
	}
	var _g2 = 0;
	var _g11 = Reflect.fields(mapK);
	while(_g2 < _g11.length) {
		var key1 = _g11[_g2];
		++_g2;
		if(key1 != "auto" && key1 != "nofallthrough") value += "  \"Ctrl-K " + key1 + "\": \"" + Std.string(Reflect.field(mapK,key1)) + "\",\n";
	}
	js_Node.require("fs").writeFileSync(js_Node.require("path").join("core","bindings.txt"),value,"utf8");
	window.addEventListener("resize",function(e1) {
		core_Helper.debounce("resize",function() {
			cm_Editor.editor.refresh();
		},100);
		haxe_Timer.delay(cm_Editor.resize,50);
	});
	$("#thirdNested").on("resize",null,function(event) {
		var panels = event.args.panels;
		cm_Editor.resize();
	});
	cm_ColorPreview.create(cm_Editor.editor);
	cm_Editor.editor.on("cursorActivity",function(cm4) {
		core_Helper.debounce("cursorActivity",function() {
			var functionParametersHelper = core_FunctionParametersHelper.get();
			functionParametersHelper.update(cm4);
			cm_ColorPreview.update(cm4);
			cm_ERegPreview.update(cm4);
		},100);
		var doc = tabManagerInstance.getCurrentDocument();
		if(doc != null) {
			var pos = doc.getCursor();
			window.document.getElementById("status-cursor").textContent = "Line " + Std.string(pos.line + 1) + ", Column " + Std.string(pos.ch + 1);
		}
	});
	cm_Editor.editor.on("scroll",function(cm5) {
		cm_ColorPreview.scroll(cm_Editor.editor);
	});
	var timer = null;
	var basicTypes = ["Array","Map","StringMap"];
	cm_Editor.editor.on("change",function(cm6,e2) {
		if(e2.origin == "paste" && e2.from.line - e2.to.line > 0) {
			var _g12 = e2.from.line;
			var _g3 = e2.to.line;
			while(_g12 < _g3) {
				var line2 = _g12++;
				cm6.indentLine(line2);
			}
		}
		var doc1 = tabManagerInstance.getCurrentDocument();
		var modeName = doc1.getMode().name;
		if(modeName == "haxe") {
			core_Helper.debounce("change",function() {
				core_HaxeLint.updateLinting();
			},100);
			var cursor1 = cm6.getCursor();
			var data = cm6.getLine(cursor1.line);
			var lastChar = data.charAt(cursor1.ch - 1);
			if(lastChar == ".") cm_Editor.triggerCompletion(cm_Editor.editor,true); else if(data.charAt(cursor1.ch - 2) == "=" && lastChar == " ") {
				var name = StringTools.trim(data.substring(0,cursor1.ch - 2));
				var type = null;
				var ereg = new EReg("[a-z_0-9]+$","i");
				var start = name.length;
				while(start - 1 > 0 && ereg.match(name.charAt(start - 1))) start--;
				name = HxOverrides.substr(name,start,null);
				if(name != "" && name.indexOf(".") == -1) {
					var variableDeclarations = parser_RegexParser.getVariableDeclarations(doc1.getValue());
					var variableWithExplicitType = [];
					var _g4 = 0;
					while(_g4 < variableDeclarations.length) {
						var item = variableDeclarations[_g4];
						++_g4;
						if(item.type != null) variableWithExplicitType.push(item);
					}
					var _g5 = 0;
					while(_g5 < variableWithExplicitType.length) {
						var item1 = variableWithExplicitType[_g5];
						++_g5;
						if(name == item1.name) {
							type = item1.type;
							break;
						}
					}
					var suggestions = [];
					var value1 = doc1.getValue();
					if(type != null) {
						if(type == "Bool") suggestions = ["false;","true;"]; else if(StringTools.startsWith(type,"Array<")) suggestions = ["["]; else if(type == "String") suggestions = ["\""]; else if(type == "Dynamic") suggestions = ["{"];
						var variableWithSameType = [];
						var _g6 = 0;
						while(_g6 < variableWithExplicitType.length) {
							var item2 = variableWithExplicitType[_g6];
							++_g6;
							if(type == item2.type) variableWithSameType.push(item2.name);
						}
						var _g7 = 0;
						while(_g7 < variableWithSameType.length) {
							var item3 = variableWithSameType[_g7];
							++_g7;
							var ereg1 = new EReg("[\t ]*" + item3 + "[\t ]*= *(.+)$","gm");
							var ereg2 = new EReg("[\t ]*" + item3 + "[\t ]*:[a-zA-Z0-9_<>]*[\t ]*= *(.+)$","gm");
							ereg1.map(value1,function(ereg3) {
								var text = StringTools.trim(ereg3.matched(1));
								if(text != "" && HxOverrides.indexOf(suggestions,text,0) == -1) suggestions.push(text);
								return "";
							});
							ereg2.map(value1,function(ereg31) {
								var text1 = StringTools.trim(ereg31.matched(1));
								if(text1 != "" && HxOverrides.indexOf(suggestions,text1,0) == -1) suggestions.push(text1);
								return "";
							});
						}
						suggestions.push("new " + type);
						completionInstance.showCodeSuggestions(suggestions);
					} else {
						haxe_Log.trace(name,{ fileName : "Editor.hx", lineNumber : 428, className : "cm.Editor", methodName : "load"});
						var ereg4 = new EReg("[\t ]*" + name + "[\t ]*= *(.+)$","gm");
						ereg4.map(value1,function(ereg32) {
							var text2 = StringTools.trim(ereg32.matched(1));
							if(text2 != "" && HxOverrides.indexOf(suggestions,text2,0) == -1) suggestions.push(text2);
							return "";
						});
						if(suggestions.length > 0) completionInstance.showCodeSuggestions(suggestions);
					}
				}
			} else if(lastChar == ":") {
				if(data.charAt(cursor1.ch - 2) == "@") completionInstance.showMetaTagsCompletion(); else {
					var pos1 = { line : cursor1.line, ch : cursor1.ch - 1};
					var word = completionInstance.getCurrentWord(cm_Editor.editor,{ word : new EReg("[A-Z_0-9\\.]+$","i")},pos1);
					if(word.word == null || word.word != "default") {
						var len = 0;
						if(word.word != null) len = word.word.length;
						var dataBeforeWord = data.substring(0,pos1.ch - len);
						dataBeforeWord = StringTools.trim(dataBeforeWord);
						if(!StringTools.endsWith(dataBeforeWord,"case")) completionInstance.showClassList();
					}
				}
			} else if(lastChar == "<") {
				var _g8 = 0;
				while(_g8 < basicTypes.length) {
					var type1 = basicTypes[_g8];
					++_g8;
					if(StringTools.endsWith(HxOverrides.substr(data,0,cursor1.ch - 1),type1)) {
						completionInstance.showClassList();
						break;
					}
				}
			} else if(StringTools.endsWith(data,"import ")) completionInstance.showClassList(true); else if(StringTools.endsWith(data,"in )")) {
				var ereg5 = new EReg("for[\t ]*\\([a-z_0-9]+[\t ]+in[\t ]+\\)","gi");
				if(ereg5.match(data)) cm_Editor.triggerCompletion(cm_Editor.editor,false);
			} else if(StringTools.endsWith(data,"new ") || StringTools.endsWith(data,"extends ")) completionInstance.showClassList(false);
		} else if(modeName == "hxml") {
			var cursor2 = cm6.getCursor();
			var data1 = cm6.getLine(cursor2.line);
			if(data1 == "-") completionInstance.showHxmlCompletion(); else if(data1 == "-cp ") completionInstance.showFileList(false,true); else if(data1 == "-dce " || data1 == "-lib ") completionInstance.showHxmlCompletion(); else if(data1 == "--macro ") completionInstance.showClassList(true);
		}
		var tab = tabManagerInstance.tabMap.get(tabManagerInstance.selectedPath);
		tab.setChanged(!tab.doc.isClean());
		haxe_Log.trace(e2,{ fileName : "Editor.hx", lineNumber : 539, className : "cm.Editor", methodName : "load"});
		if(HxOverrides.indexOf(["+input","+delete"],e2.origin,0) != -1) {
			var text3 = e2.text[0];
			var removed = e2.removed[0];
			if(text3 != "\t" && text3 != " " && removed != "\t" && removed != " " && cm_Editor.isValidWordForCompletionOnType()) {
				var doc2 = tabManagerInstance.getCurrentDocument();
				var pos2 = doc2.getCursor();
				completionInstance.getCompletion(function() {
					if(cm_Editor.isValidWordForCompletionOnType()) completionInstance.showRegularCompletion(false);
				},pos2);
			}
		}
	});
	CodeMirror.prototype.centerOnLine = function(line) {
		 var h = this.getScrollInfo().clientHeight;  var coords = this.charCoords({line: line, ch: 0}, 'local'); this.scrollTo(null, (coords.top + coords.bottom - h) / 2); ;
	};
	cm_Editor.editor.on("gutterClick",function(cm7,line1,gutter,e3) {
		if(projectaccess_ProjectAccess.currentProject != null && gutter == "CodeMirror-foldgutter") cm_Editor.saveFoldedRegions();
	});
};
cm_Editor.isValidWordForCompletionOnType = function() {
	var isValid = false;
	var cm1 = cm_Editor.editor;
	var tabManagerInstance = tabmanager_TabManager.get();
	var completionInstance = core_Completion.get();
	var doc = tabManagerInstance.getCurrentDocument();
	if(doc != null && doc.getMode().name == "haxe") {
		var completionActive = cm_Editor.editor.state.completionActive;
		if(completionActive == null) {
			var pos = doc.getCursor();
			var word = completionInstance.getCurrentWord(cm_Editor.editor,{ word : new EReg("[A-Z_0-9]+$","i")},pos);
			var type = cm1.getTokenTypeAt(pos);
			var eregDigit = new EReg("[0-9]+$","i");
			if(word.word != null && type != "string" && type != "string-2") {
				if(word.word.length >= 1 && !eregDigit.match(word.word.charAt(0))) {
					var lineData = doc.getLine(pos.line);
					var dataBeforeWord = lineData.substring(0,pos.ch - word.word.length);
					if(!StringTools.endsWith(dataBeforeWord,"var ") && !StringTools.endsWith(dataBeforeWord,"function ")) isValid = true;
				}
			}
		}
	}
	return isValid;
};
cm_Editor.saveFoldedRegions = function() {
	var tabManagerInstance = tabmanager_TabManager.get();
	var doc = tabManagerInstance.getCurrentDocument();
	if(doc != null && projectaccess_ProjectAccess.currentProject != null) {
		var cm1 = cm_Editor.editor;
		var cursor = doc.getCursor();
		var foldedRegions = [];
		var _g = 0;
		var _g1 = doc.getAllMarks();
		while(_g < _g1.length) {
			var marker = _g1[_g];
			++_g;
			var pos = marker.find().from;
			if(cm1.isFolded(pos)) foldedRegions.push(pos);
		}
		var selectedFile = projectaccess_ProjectAccess.getFileByPath(tabManagerInstance.getCurrentDocumentPath());
		if(selectedFile != null) {
			selectedFile.foldedRegions = foldedRegions;
			selectedFile.activeLine = cursor.line;
			haxe_Log.trace("folding regions saved successfully for" + Std.string(selectedFile),{ fileName : "Editor.hx", lineNumber : 661, className : "cm.Editor", methodName : "saveFoldedRegions"});
		} else haxe_Log.trace("cannot save folded regions for this document",{ fileName : "Editor.hx", lineNumber : 665, className : "cm.Editor", methodName : "saveFoldedRegions"});
	} else haxe_Log.trace("unable to preserve code folding for" + Std.string(doc),{ fileName : "Editor.hx", lineNumber : 670, className : "cm.Editor", methodName : "saveFoldedRegions"});
};
cm_Editor.triggerCompletion = function(cm1,dot) {
	if(dot == null) dot = false;
	haxe_Log.trace("triggerCompletion",{ fileName : "Editor.hx", lineNumber : 677, className : "cm.Editor", methodName : "triggerCompletion"});
	var tabManagerInstance = tabmanager_TabManager.get();
	var completionInstance = core_Completion.get();
	var modeName = tabManagerInstance.getCurrentDocument().getMode().name;
	switch(modeName) {
	case "haxe":
		if(!dot || cm_Editor.regenerateCompletionOnDot || dot && !cm1.state.completionActive) tabManagerInstance.saveActiveFile(function() {
			completionInstance.showRegularCompletion();
		});
		break;
	case "hxml":
		completionInstance.showHxmlCompletion();
		break;
	case "xml":
		cm1.showHint({ completeSingle : false});
		break;
	default:
	}
};
cm_Editor.walk = function(object) {
	var regexp = RegExp;
	var _g = 0;
	var _g1 = Reflect.fields(object);
	while(_g < _g1.length) {
		var field = _g1[_g];
		++_g;
		var value = Reflect.field(object,field);
		if(typeof(value) == "string") {
			if(StringTools.startsWith(value,"regexp")) try {
				Reflect.setField(object,field,Type.createInstance(regexp,[value.substring(6)]));
			} catch( err ) {
				if (err instanceof js__$Boot_HaxeError) err = err.val;
				haxe_Log.trace(err,{ fileName : "Editor.hx", lineNumber : 723, className : "cm.Editor", methodName : "walk"});
			} else if(StringTools.startsWith(value,"eval")) try {
				Reflect.setField(object,field,js_Lib["eval"](value.substring(4)));
			} catch( err1 ) {
				if (err1 instanceof js__$Boot_HaxeError) err1 = err1.val;
				haxe_Log.trace(err1,{ fileName : "Editor.hx", lineNumber : 734, className : "cm.Editor", methodName : "walk"});
			}
		}
		if(Reflect.isObject(value) && !((value instanceof Array) && value.__enum__ == null) && (function($this) {
			var $r;
			var e = Type["typeof"](value);
			$r = e[0];
			return $r;
		}(this)) == "TObject") cm_Editor.walk(value);
	}
};
cm_Editor.resize = function() {
	var panels = $("#thirdNested").jqxSplitter("panels");
	var height = window.innerHeight - 34 - $("ul.tabs").height() - panels[1].element[0].clientHeight - 5;
	$(".CodeMirror").css("height",Std.string(height | 0) + "px");
	$("#annotationRuler").css("height",Std.string(height - 1 | 0) + "px");
};
cm_Editor.loadTheme = function() {
	var localStorage2 = js_Browser.getLocalStorage();
	if(localStorage2 != null) {
		var theme = localStorage2.getItem("theme");
		if(theme != null) cm_Editor.setTheme(theme); else cm_Editor.setTheme("mbo");
	}
};
cm_Editor.loadThemes = function(themes,onComplete) {
	var themesSubmenu = menu_BootstrapMenu.getMenu("View").getSubmenu("Themes");
	var theme;
	var pathToThemeArray = [];
	themesSubmenu.addMenuItem("default",0,function() {
		cm_Editor.setTheme("default");
	});
	var _g1 = 0;
	var _g = themes.length;
	while(_g1 < _g) {
		var i = _g1++;
		theme = themes[i];
		themesSubmenu.addMenuItem(theme,i + 1,(function(f,a1) {
			return function() {
				f(a1);
			};
		})(cm_Editor.setTheme,theme));
	}
	onComplete();
};
cm_Editor.setTheme = function(theme) {
	cm_Editor.editor.setOption("theme",theme);
	js_Browser.getLocalStorage().setItem("theme",theme);
};
var cm_HighlightRange = function() {
};
$hxClasses["cm.HighlightRange"] = cm_HighlightRange;
cm_HighlightRange.__name__ = ["cm","HighlightRange"];
cm_HighlightRange.get = function() {
	if(cm_HighlightRange.instance == null) cm_HighlightRange.instance = new cm_HighlightRange();
	return cm_HighlightRange.instance;
};
cm_HighlightRange.prototype = {
	highlight: function(cm1,from,to) {
		var marker = cm1.markText(from,to,{ className : "showDeclaration"});
		haxe_Timer.delay(function() {
			marker.clear();
		},1000);
	}
	,__class__: cm_HighlightRange
};
var cm_Xml = function() {
};
$hxClasses["cm.Xml"] = cm_Xml;
cm_Xml.__name__ = ["cm","Xml"];
cm_Xml.get = function() {
	if(cm_Xml.instance == null) cm_Xml.instance = new cm_Xml();
	return cm_Xml.instance;
};
cm_Xml.prototype = {
	generateXmlCompletion: function() {
		var tabManagerInstance = tabmanager_TabManager.get();
		var data = tabManagerInstance.getCurrentDocument().getValue();
		var xml = null;
		try {
			xml = haxe_xml_Parser.parse(data);
		} catch( unknown ) {
			if (unknown instanceof js__$Boot_HaxeError) unknown = unknown.val;
			haxe_Log.trace(unknown,{ fileName : "Xml.hx", lineNumber : 46, className : "cm.Xml", methodName : "generateXmlCompletion"});
		}
		var tags = { '!attrs' : { }};
		if(xml != null) {
			var fast = new haxe_xml_Fast(xml);
			this.walkThroughElements(tags,fast);
			cm_Editor.editor.setOption("hintOptions",{ schemaInfo : tags});
		}
	}
	,walkThroughElements: function(tags,fast) {
		var $it0 = fast.get_elements();
		while( $it0.hasNext() ) {
			var element = $it0.next();
			if(Reflect.field(tags,element.get_name()) == null) Reflect.setField(tags,element.get_name(),{ attrs : { }});
			var attrs = Reflect.field(tags,element.get_name()).attrs;
			var $it1 = element.x.attributes();
			while( $it1.hasNext() ) {
				var attribute = $it1.next();
				var values;
				if(Reflect.field(attrs,attribute) == null) {
					values = [];
					attrs[attribute] = values;
					if(attribute == "path") {
						var _g = 0;
						var _g1 = parser_ClassParser.filesList;
						while(_g < _g1.length) {
							var item = _g1[_g];
							++_g;
							values.push(item.path);
						}
					}
				} else values = Reflect.field(attrs,attribute);
				var value = element.att.resolve(attribute);
				if(HxOverrides.indexOf(values,value,0) == -1) values.push(value);
			}
			Reflect.setField(tags,element.get_name(),{ attrs : attrs});
			this.walkThroughElements(tags,element);
		}
	}
	,completeAfter: function(cm1,pred) {
		var cur = cm1.getCursor();
		if(pred == null || pred() != null) haxe_Timer.delay(function() {
			if(cm1.state.completionActive == null) cm1.showHint({ completeSingle : false});
		},100);
		return CodeMirror.Pass;
	}
	,completeIfAfterLt: function(cm1) {
		return this.completeAfter(cm1,function() {
			var cur = cm1.getCursor();
			return cm1.getRange({ line : cur.line, ch : cur.ch - 1},cur) == "<";
		});
	}
	,completeIfInTag: function(cm1) {
		return this.completeAfter(cm1,function() {
			var tok = cm1.getTokenAt(cm1.getCursor());
			if(tok.type == "string" && (!new EReg("['\"]","").match(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
			var inner = CodeMirror.innerMode(cm1.getMode(),tok.state).state;
			return inner.tagName;
		});
	}
	,__class__: cm_Xml
};
var cm_Zoom = function() {
};
$hxClasses["cm.Zoom"] = cm_Zoom;
cm_Zoom.__name__ = ["cm","Zoom"];
cm_Zoom.get = function() {
	if(cm_Zoom.instance == null) cm_Zoom.instance = new cm_Zoom();
	return cm_Zoom.instance;
};
cm_Zoom.prototype = {
	load: function() {
		var _g = this;
		window.document.addEventListener("mousewheel",function(e) {
			if(e.altKey || e.ctrlKey || e.metaKey) {
				if(e.deltaY < 0) {
					var fontSize = Std.parseInt($(".CodeMirror").css("font-size"));
					fontSize--;
					_g.setFontSize(fontSize);
					e.preventDefault();
					e.stopPropagation();
				} else if(e.deltaY > 0) {
					var fontSize1 = Std.parseInt($(".CodeMirror").css("font-size"));
					fontSize1++;
					_g.setFontSize(fontSize1);
					e.preventDefault();
					e.stopPropagation();
				}
			}
		});
		menu_BootstrapMenu.getMenu("View").addMenuItem("Increase Font Size",10001,function() {
			var fontSize2 = Std.parseInt($(".CodeMirror").css("font-size"));
			fontSize2++;
			_g.setFontSize(fontSize2);
		},"Ctrl-+");
		menu_BootstrapMenu.getMenu("View").addMenuItem("Decrease Font Size",10002,function() {
			var fontSize3 = Std.parseInt($(".CodeMirror").css("font-size"));
			fontSize3--;
			_g.setFontSize(fontSize3);
		},"Ctrl--");
	}
	,setFontSize: function(fontSize) {
		$(".CodeMirror").css("font-size",(fontSize == null?"null":"" + fontSize) + "px");
		$(".CodeMirror-hint").css("font-size",Std.string(fontSize - 2) + "px");
		$(".CodeMirror-hints").css("font-size",Std.string(fontSize - 2) + "px");
		cm_Editor.editor.refresh();
	}
	,__class__: cm_Zoom
};
var completion_Filter = function() { };
$hxClasses["completion.Filter"] = completion_Filter;
completion_Filter.__name__ = ["completion","Filter"];
completion_Filter.filter = function(completions,word,completionType) {
	var list = [];
	if(word != null) {
		var filtered_results = [];
		var sorted_results = [];
		word = word.toLowerCase();
		var _g = 0;
		while(_g < completions.length) {
			var completion1 = completions[_g];
			++_g;
			var n = completion1.text.toLowerCase();
			var b = true;
			var _g2 = 0;
			var _g1 = word.length;
			while(_g2 < _g1) {
				var j = _g2++;
				if(n.indexOf(word.charAt(j)) == -1) {
					b = false;
					break;
				}
			}
			if(b) filtered_results.push(completion1);
		}
		var results = [];
		var filtered_results2 = [];
		var filtered_results3 = [];
		var exactResults = [];
		var _g11 = 0;
		var _g3 = filtered_results.length;
		while(_g11 < _g3) {
			var i = _g11++;
			var str = filtered_results[i].text.toLowerCase();
			var index = str.indexOf(word);
			if(word == str) exactResults.push(filtered_results[i]); else if(index == 0) sorted_results.push(filtered_results[i]); else if(index == str.length) filtered_results3.push(filtered_results[i]); else if(index != -1) filtered_results2.push(filtered_results[i]); else results.push(filtered_results[i]);
		}
		var _g4 = 0;
		while(_g4 < exactResults.length) {
			var completion2 = exactResults[_g4];
			++_g4;
			list.push(completion2);
		}
		var _g5 = 0;
		while(_g5 < sorted_results.length) {
			var completion3 = sorted_results[_g5];
			++_g5;
			list.push(completion3);
		}
		var _g6 = 0;
		while(_g6 < filtered_results2.length) {
			var completion4 = filtered_results2[_g6];
			++_g6;
			list.push(completion4);
		}
		var _g7 = 0;
		while(_g7 < filtered_results3.length) {
			var completion5 = filtered_results3[_g7];
			++_g7;
			list.push(completion5);
		}
		var _g8 = 0;
		while(_g8 < results.length) {
			var completion6 = results[_g8];
			++_g8;
			list.push(completion6);
		}
	} else list = completions;
	return list;
};
completion_Filter.sortFileList = function(list) {
	list.sort(function(a,b) {
		var aCount;
		var bCount;
		var aHaxeFile = StringTools.endsWith(a.filename,".hx");
		var bHaxeFile = StringTools.endsWith(b.filename,".hx");
		if(aHaxeFile && !bHaxeFile) return -1;
		if(!aHaxeFile && bHaxeFile) return 1;
		aCount = a.path.split("\\").length + a.path.split("/").length;
		bCount = b.path.split("\\").length + b.path.split("/").length;
		if(aCount < bCount) return -1;
		if(aCount > bCount) return 1;
		return 0;
	});
	return list;
};
completion_Filter.filterFiles = function(fileList,word) {
	var list = [];
	var filtered_results = [];
	var sorted_results = [];
	word = word.toLowerCase();
	var _g = 0;
	while(_g < fileList.length) {
		var completion1 = fileList[_g];
		++_g;
		var n = completion1.path.toLowerCase();
		var b = true;
		var _g2 = 0;
		var _g1 = word.length;
		while(_g2 < _g1) {
			var j = _g2++;
			if(n.indexOf(word.charAt(j)) == -1) {
				b = false;
				break;
			}
		}
		if(b) filtered_results.push(completion1);
	}
	var results = [];
	var filtered_results2 = [];
	var filtered_results3 = [];
	var exactResults = [];
	var filenameResults = [];
	var _g11 = 0;
	var _g3 = filtered_results.length;
	while(_g11 < _g3) {
		var i = _g11++;
		var path = filtered_results[i].path.toLowerCase();
		var filename = filtered_results[i].filename.toLowerCase();
		var index = path.indexOf(word);
		if(word == filename) filenameResults.push(filtered_results[i]); else if(StringTools.startsWith(filename,word)) filenameResults.push(filtered_results[i]); else if(word == path) exactResults.push(filtered_results[i]); else if(index == 0) sorted_results.push(filtered_results[i]); else if(index == path.length) filtered_results3.push(filtered_results[i]); else if(index != -1) filtered_results2.push(filtered_results[i]); else results.push(filtered_results[i]);
	}
	var _g4 = 0;
	while(_g4 < filenameResults.length) {
		var completion2 = filenameResults[_g4];
		++_g4;
		list.push(completion2);
	}
	var _g5 = 0;
	while(_g5 < exactResults.length) {
		var completion3 = exactResults[_g5];
		++_g5;
		list.push(completion3);
	}
	var _g6 = 0;
	while(_g6 < sorted_results.length) {
		var completion4 = sorted_results[_g6];
		++_g6;
		list.push(completion4);
	}
	var _g7 = 0;
	while(_g7 < filtered_results2.length) {
		var completion5 = filtered_results2[_g7];
		++_g7;
		list.push(completion5);
	}
	var _g8 = 0;
	while(_g8 < filtered_results3.length) {
		var completion6 = filtered_results3[_g8];
		++_g8;
		list.push(completion6);
	}
	var _g9 = 0;
	while(_g9 < results.length) {
		var completion7 = results[_g9];
		++_g9;
		list.push(completion7);
	}
	return list;
};
var completion_GoToDeclaration = function() {
};
$hxClasses["completion.GoToDeclaration"] = completion_GoToDeclaration;
completion_GoToDeclaration.__name__ = ["completion","GoToDeclaration"];
completion_GoToDeclaration.get = function() {
	if(completion_GoToDeclaration.instance == null) completion_GoToDeclaration.instance = new completion_GoToDeclaration();
	return completion_GoToDeclaration.instance;
};
completion_GoToDeclaration.prototype = {
	start: function() {
		var ereg = new EReg("([^:\n\r]+):([0-9]+): (lines|characters) ([0-9]+)-([0-9]+)","g");
		var cm1 = cm_Editor.editor;
		var completionInstance = core_Completion.get();
		completionInstance.getCompletion(function() {
			if(completionInstance.declarationPositions.length > 0) {
				var posData = completionInstance.declarationPositions[0];
				if(ereg.match(posData)) {
					var path = ereg.matched(1);
					var line = Std.parseInt(ereg.matched(2)) - 1;
					var posType = ereg.matched(3);
					var from = Std.parseInt(ereg.matched(4));
					var to = Std.parseInt(ereg.matched(5));
					var from2 = null;
					var to2 = null;
					if(posType == "lines") {
						from2 = { line : from - 1, ch : 0};
						to2 = { line : to, ch : 0};
					} else if(posType == "characters") {
						from2 = { line : line, ch : from};
						to2 = { line : line, ch : to};
					}
					if(from2 != null && to2 != null) {
						var tabManagerInstance = tabmanager_TabManager.get();
						tabManagerInstance.openFileInNewTab(path,true,function() {
							var cm1 = cm_Editor.editor;
							cm1.centerOnLine(from2.line);
							var highlightRange = cm_HighlightRange.get();
							highlightRange.highlight(cm1,from2,to2);
						});
					} else alertify.error("Go To Declaration data parsing failed.");
				}
			}
		},cm1.getCursor(),"position",false);
	}
	,__class__: completion_GoToDeclaration
};
var completion_Hxml = function() { };
$hxClasses["completion.Hxml"] = completion_Hxml;
completion_Hxml.__name__ = ["completion","Hxml"];
completion_Hxml.load = function() {
	completion_Hxml.completions = [];
	completion_Hxml.getArguments(function() {
		completion_Hxml.getDefines(completion_Hxml.getHaxelibList);
	});
};
completion_Hxml.getHaxelibList = function(onComplete) {
	core_HaxeHelper.getInstalledHaxelibList(function(installedLibs) {
		var _g = 0;
		while(_g < installedLibs.length) {
			var item = installedLibs[_g];
			++_g;
			var completionItem = { };
			completionItem.text = "-lib " + item;
			completionItem.displayText = completionItem.text + " - installed";
			completionItem.className = "CodeMirror-Tern-completion" + " CodeMirror-Tern-completion-lib";
			completion_Hxml.completions.push(completionItem);
		}
		core_HaxeHelper.getHaxelibList(function(libs) {
			var _g1 = 0;
			while(_g1 < libs.length) {
				var item1 = libs[_g1];
				++_g1;
				if(HxOverrides.indexOf(installedLibs,item1,0) == -1) {
					var completionItem1 = { };
					completionItem1.text = "-lib " + item1;
					completionItem1.displayText = completionItem1.text + " - not installed";
					completionItem1.className = "CodeMirror-Tern-completion" + " CodeMirror-Tern-completion-lib";
					completion_Hxml.completions.push(completionItem1);
				}
			}
			if(onComplete != null) onComplete();
		});
	});
};
completion_Hxml.getDefines = function(onComplete) {
	core_HaxeHelper.getDefines(function(data) {
		var _g = 0;
		while(_g < data.length) {
			var item = data[_g];
			++_g;
			completion_Hxml.completions.push({ text : "-D " + item, className : "CodeMirror-Tern-completion" + " CodeMirror-Tern-completion-define"});
		}
		if(onComplete != null) onComplete();
	});
};
completion_Hxml.getArguments = function(onComplete) {
	core_HaxeHelper.getArguments(function(data) {
		var _g = 0;
		while(_g < data.length) {
			var item = data[_g];
			++_g;
			completion_Hxml.completions.push({ text : item, className : "CodeMirror-Tern-completion"});
			if(item == "-dce") {
				completion_Hxml.completions.push({ text : item + " " + "no", className : "CodeMirror-Tern-completion"});
				completion_Hxml.completions.push({ text : item + " " + "std", className : "CodeMirror-Tern-completion"});
				completion_Hxml.completions.push({ text : item + " " + "full", className : "CodeMirror-Tern-completion"});
			}
		}
		if(onComplete != null) onComplete();
	});
};
completion_Hxml.getCompletion = function() {
	return completion_Hxml.completions;
};
var completion_MetaTags = function() { };
$hxClasses["completion.MetaTags"] = completion_MetaTags;
completion_MetaTags.__name__ = ["completion","MetaTags"];
completion_MetaTags.load = function() {
	completion_MetaTags.completions = [];
	var processHelper = core_ProcessHelper.get();
	processHelper.runProcess("haxe",["--help-metas"],null,function(stdout,stderr) {
		var regex = new EReg("@:[A-Z]+ ","gim");
		regex.map(stdout,function(ereg) {
			completion_MetaTags.completions.push({ text : StringTools.trim(ereg.matched(0))});
			return ereg.matched(0);
		});
	});
};
completion_MetaTags.getCompletion = function() {
	return completion_MetaTags.completions;
};
var completion_SnippetsCompletion = function() {
};
$hxClasses["completion.SnippetsCompletion"] = completion_SnippetsCompletion;
completion_SnippetsCompletion.__name__ = ["completion","SnippetsCompletion"];
completion_SnippetsCompletion.get = function() {
	if(completion_SnippetsCompletion.instance == null) completion_SnippetsCompletion.instance = new completion_SnippetsCompletion();
	return completion_SnippetsCompletion.instance;
};
completion_SnippetsCompletion.prototype = {
	load: function() {
		var options = { };
		options.encoding = "utf8";
		js_Node.require("fs").readFile(js_Node.require("path").join("core","config","snippets.json"),options,function(error,data) {
			if(error == null) {
				var templates = tjson_TJSON.parse(data);
				var snippets = templates.snippets;
				var _g = 0;
				while(_g < snippets.length) {
					var template = snippets[_g];
					++_g;
					CodeMirror.templatesHint.addTemplates(template,true);
				}
			} else alertify.error("Can't open core/config/snippets.json");
		});
	}
	,getCompletion: function() {
		var completions = CodeMirror.templatesHint.getCompletions(cm_Editor.editor);
		return completions;
	}
	,__class__: completion_SnippetsCompletion
};
var core_AnnotationRuler = function() {
	this.positions = [];
};
$hxClasses["core.AnnotationRuler"] = core_AnnotationRuler;
core_AnnotationRuler.__name__ = ["core","AnnotationRuler"];
core_AnnotationRuler.get = function() {
	if(core_AnnotationRuler.instance == null) core_AnnotationRuler.instance = new core_AnnotationRuler();
	return core_AnnotationRuler.instance;
};
core_AnnotationRuler.prototype = {
	positions: null
	,addErrorMarker: function(pathToFile,line,ch,message) {
		var tabManagerInstance = tabmanager_TabManager.get();
		var a;
		var _this = window.document;
		a = _this.createElement("a");
		a.href = "#";
		a.onclick = function(e) {
			tabManagerInstance.openFileInNewTab(pathToFile,true,function() {
				var cm1 = cm_Editor.editor;
				cm1.centerOnLine(line);
			});
		};
		var div;
		var _this1 = window.document;
		div = _this1.createElement("div");
		div.className = "errorMarker";
		var lineCount = tabManagerInstance.getCurrentDocument().lineCount();
		var targetLine = line / lineCount * 100;
		while(HxOverrides.indexOf(this.positions,targetLine,0) != -1) targetLine++;
		div.style.top = (targetLine == null?"null":"" + targetLine) + "%";
		this.positions.push(targetLine);
		div.setAttribute("data-toggle","tooltip");
		div.setAttribute("data-placement","left");
		div.title = "Line: " + (line == null?"null":"" + line) + ":" + message;
		$(div).tooltip({ });
		a.appendChild(div);
		$("#annotationRuler").append(a);
	}
	,clearErrorMarkers: function() {
		$("#annotationRuler").children().remove();
		this.positions = [];
	}
	,__class__: core_AnnotationRuler
};
var core_CompilationOutput = function() { };
$hxClasses["core.CompilationOutput"] = core_CompilationOutput;
core_CompilationOutput.__name__ = ["core","CompilationOutput"];
core_CompilationOutput.load = function() {
	var output;
	var _this = window.document;
	output = _this.createElement("textarea");
	output.id = "outputTextArea";
	output.readOnly = true;
	$("#output").append(output);
};
var core_CompletionType = $hxClasses["core.CompletionType"] = { __ename__ : ["core","CompletionType"], __constructs__ : ["REGULAR","FILELIST","PASTEFOLDER","OPENFILE","CLASSLIST","HXML","METATAGS"] };
core_CompletionType.REGULAR = ["REGULAR",0];
core_CompletionType.REGULAR.__enum__ = core_CompletionType;
core_CompletionType.FILELIST = ["FILELIST",1];
core_CompletionType.FILELIST.__enum__ = core_CompletionType;
core_CompletionType.PASTEFOLDER = ["PASTEFOLDER",2];
core_CompletionType.PASTEFOLDER.__enum__ = core_CompletionType;
core_CompletionType.OPENFILE = ["OPENFILE",3];
core_CompletionType.OPENFILE.__enum__ = core_CompletionType;
core_CompletionType.CLASSLIST = ["CLASSLIST",4];
core_CompletionType.CLASSLIST.__enum__ = core_CompletionType;
core_CompletionType.HXML = ["HXML",5];
core_CompletionType.HXML.__enum__ = core_CompletionType;
core_CompletionType.METATAGS = ["METATAGS",6];
core_CompletionType.METATAGS.__enum__ = core_CompletionType;
var core_Completion = function() {
	this.completionType = core_CompletionType.REGULAR;
	this.declarationPositions = [];
	this.completions = [];
	this.RANGE = 500;
	this.WORD = new EReg("[A-Z_0-9]+$","i");
};
$hxClasses["core.Completion"] = core_Completion;
core_Completion.__name__ = ["core","Completion"];
core_Completion.get = function() {
	if(core_Completion.instance == null) core_Completion.instance = new core_Completion();
	return core_Completion.instance;
};
core_Completion.prototype = {
	list: null
	,word: null
	,range: null
	,cur: null
	,end: null
	,start: null
	,WORD: null
	,RANGE: null
	,curWord: null
	,completions: null
	,declarationPositions: null
	,completionType: null
	,completionActive: null
	,load: function() {
		var _g = this;
		completion_Hxml.load();
		completion_MetaTags.load();
		var snippetsCompletion = completion_SnippetsCompletion.get();
		snippetsCompletion.load();
		this.completionActive = false;
		cm_Editor.editor.on("endCompletion",function() {
			_g.completionActive = false;
		});
	}
	,getHints: function(cm1,options) {
		this.word = null;
		this.range = null;
		if(options != null && options.range != null) this.range = options.range; else if(this.RANGE != null) this.range = this.RANGE;
		this.list = [];
		var _g = this.completionType;
		switch(_g[1]) {
		case 0:
			var _g1 = 0;
			var _g2 = this.completions;
			while(_g1 < _g2.length) {
				var completion1 = _g2[_g1];
				++_g1;
				var completionItem = this.generateCompletionItem(completion1.n,completion1.t,completion1.d);
				this.list.push(completionItem);
			}
			this.getCurrentWord(cm1,{ word : new EReg("[A-Z_0-9.]+$","i")});
			var className = "CodeMirror-Tern-completion";
			if(this.curWord == null || this.curWord.indexOf(".") == -1) {
				var tabManagerInstance = tabmanager_TabManager.get();
				var doc = tabManagerInstance.getCurrentDocument();
				if(doc != null) {
					var data1 = doc.getRange({ line : 0, ch : 0},{ line : cm1.getCursor().line + 1, ch : 0});
					var functionParams = parser_RegexParser.getFunctionParameters(data1,doc.getCursor());
					var _g11 = 0;
					while(_g11 < functionParams.length) {
						var item = functionParams[_g11];
						++_g11;
						var completionItem1 = this.generateCompletionItem(item.name,item.type);
						this.list.push(completionItem1);
					}
					var variableDeclarations = parser_RegexParser.getVariableDeclarations(data1);
					var _g12 = 0;
					while(_g12 < variableDeclarations.length) {
						var item1 = variableDeclarations[_g12];
						++_g12;
						var completionItem2 = this.generateCompletionItem(item1.name,item1.type);
						this.list.push(completionItem2);
					}
					var functionDeclarations = parser_RegexParser.getFunctionDeclarations(doc.getValue());
					var _g13 = 0;
					while(_g13 < functionDeclarations.length) {
						var item2 = functionDeclarations[_g13];
						++_g13;
						if(item2.name != "") {
							var completionData = this.generateFunctionCompletionItem(item2.name,item2.params);
							var completionItem3 = this.createCompletionItem(item2.name,null,completionData);
							this.list.push(completionItem3);
						}
					}
				}
				var snippetsCompletion = completion_SnippetsCompletion.get();
				this.list = this.list.concat(snippetsCompletion.getCompletion());
				var classList = this.getClassList();
				var packages = [];
				var _g14 = 0;
				var _g21 = classList.topLevelClassList;
				while(_g14 < _g21.length) {
					var item3 = _g21[_g14];
					++_g14;
					var completion1 = { text : item3.name};
					completion1.className = className + " CodeMirror-Tern-completion-class";
					this.list.push(completion1);
				}
				var _g15 = 0;
				var _g22 = [parser_ClassParser.importsList,parser_ClassParser.haxeStdImports];
				while(_g15 < _g22.length) {
					var list = _g22[_g15];
					++_g15;
					var _g3 = 0;
					while(_g3 < list.length) {
						var item4 = list[_g3];
						++_g3;
						var str = item4.split(".")[0];
						if(HxOverrides.indexOf(packages,str,0) == -1 && str.charAt(0) == str.charAt(0).toLowerCase()) packages.push(str);
					}
				}
				var _g16 = 0;
				while(_g16 < packages.length) {
					var item5 = packages[_g16];
					++_g16;
					var completion2 = { text : item5};
					completion2.className = className + " CodeMirror-Tern-completion-package";
					this.list.push(completion2);
				}
			}
			break;
		case 6:
			this.list = completion_MetaTags.getCompletion();
			break;
		case 5:
			var _this = completion_Hxml.getCompletion();
			this.list = _this.slice();
			var _g17 = 0;
			var _g23 = [parser_ClassParser.topLevelClassList,parser_ClassParser.importsList,parser_ClassParser.haxeStdTopLevelClassList,parser_ClassParser.haxeStdImports];
			while(_g17 < _g23.length) {
				var list2 = _g23[_g17];
				++_g17;
				var _g31 = 0;
				while(_g31 < list2.length) {
					var item6 = list2[_g31];
					++_g31;
					this.list.push({ text : item6});
				}
			}
			break;
		case 1:
			var displayText;
			var _g18 = 0;
			var _g24 = [parser_ClassParser.filesList,parser_ClassParser.haxeStdFileList];
			while(_g18 < _g24.length) {
				var list21 = _g24[_g18];
				++_g18;
				var _g32 = 0;
				while(_g32 < list21.length) {
					var item7 = list21[_g32];
					++_g32;
					this.list.push({ text : item7.path, displayText : this.processDisplayText(item7.path)});
				}
			}
			break;
		case 2:
			var displayText1;
			var _g19 = 0;
			var _g25 = parser_ClassParser.filesList;
			while(_g19 < _g25.length) {
				var item8 = _g25[_g19];
				++_g19;
				this.list.push({ text : item8.directory, displayText : this.processDisplayText(item8.path)});
			}
			break;
		case 4:
			var classList1 = this.getClassList();
			var className1 = "CodeMirror-Tern-completion";
			var _g110 = 0;
			var _g26 = classList1.topLevelClassList;
			while(_g110 < _g26.length) {
				var item9 = _g26[_g110];
				++_g110;
				var completion3 = { text : item9.name};
				completion3.className = className1 + " CodeMirror-Tern-completion-class";
				this.list.push(completion3);
			}
			var _g111 = 0;
			var _g27 = classList1.importsList;
			while(_g111 < _g27.length) {
				var item10 = _g27[_g111];
				++_g111;
				var completion4 = { text : item10};
				completion4.className = className1 + " CodeMirror-Tern-completion-class";
				this.list.push(completion4);
			}
			break;
		default:
		}
		this.getCurrentWord(cm1,options);
		this.list = completion_Filter.filter(this.list,this.curWord,this.completionType);
		var data = { list : this.list, from : { line : this.cur.line, ch : this.start}, to : { line : this.cur.line, ch : this.end}};
		CodeMirror.attachContextInfo(cm_Editor.editor,data);
		var _g4 = this.completionType;
		switch(_g4[1]) {
		case 0:case 4:
			CodeMirror.on(data,"pick",$bind(this,this.searchForImport));
			break;
		default:
		}
		return data;
	}
	,searchForImport: function(completion) {
		var cm1 = cm_Editor.editor;
		var cursor = cm1.getCursor();
		var curLine = cm1.getLine(cursor.line);
		if(!StringTools.startsWith(curLine,"import ")) {
			var word = new EReg("[A-Z_0-9\\.]+$","i");
			var importStart = cursor.ch;
			var importEnd = importStart;
			while(importStart > 0 && word.match(curLine.charAt(importStart - 1))) --importStart;
			if(importStart != importEnd) {
				var fullImport = curLine.substring(importStart,importEnd);
				if(fullImport.indexOf(".") != -1) {
					var topLevelClassList = this.getClassList().topLevelClassList;
					core_ImportDefinition.searchImportByText(topLevelClassList,fullImport,{ line : cursor.line, ch : importStart},{ line : cursor.line, ch : importEnd},false);
				}
			}
		}
	}
	,processDisplayText: function(displayText) {
		if(displayText.length > 70) displayText = HxOverrides.substr(displayText,0,35) + " ... " + HxOverrides.substr(displayText,displayText.length - 35,null);
		return displayText;
	}
	,getCurrentWord: function(cm,options,pos) {
		if(options != null && options.word != null) this.word = options.word; else if(this.WORD != null) this.word = this.WORD;
		if(pos != null) this.cur = pos;
		var curLine = cm.getLine(this.cur.line);
		this.start = this.cur.ch;
		this.end = this.start;
		while(this.end < curLine.length && this.word.match(curLine.charAt(this.end))) ++this.end;
		while(this.start > 0 && this.word.match(curLine.charAt(this.start - 1))) --this.start;
		this.curWord = null;
		if(this.start != this.end) this.curWord = curLine.substring(this.start,this.end);
		return { word : this.curWord, from : { line : this.cur.line, ch : this.start}, to : { line : this.cur.line, ch : this.end}};
	}
	,getCompletion: function(onComplete,_pos,mode,moveCursorToStart) {
		if(moveCursorToStart == null) moveCursorToStart = true;
		var _g1 = this;
		if(projectaccess_ProjectAccess.path != null) {
			var projectArguments = [];
			var project = projectaccess_ProjectAccess.currentProject;
			var _g = project.type;
			switch(_g) {
			case 0:
				var pathToHxml = project.targetData[project.target].pathToHxml;
				projectArguments.push(pathToHxml);
				this.processArguments(projectArguments,onComplete,_pos,mode,moveCursorToStart);
				break;
			case 2:
				projectArguments.push(project.main);
				this.processArguments(projectArguments,onComplete,_pos,mode,moveCursorToStart);
				break;
			case 1:
				openproject_OpenFL.parseOpenFLDisplayParameters(projectaccess_ProjectAccess.path,project.openFLTarget,function(args) {
					projectArguments = args;
					_g1.processArguments(projectArguments,onComplete,_pos,mode,moveCursorToStart);
				});
				break;
			default:
			}
		}
	}
	,processArguments: function(projectArguments,onComplete,_pos,mode,moveCursorToStart) {
		var _g = this;
		haxe_Log.trace("processArguments",{ fileName : "Completion.hx", lineNumber : 385, className : "core.Completion", methodName : "processArguments"});
		projectArguments.push("--no-output");
		projectArguments.push("--display");
		var cm1 = cm_Editor.editor;
		this.cur = _pos;
		if(this.cur == null) this.cur = cm1.getCursor();
		this.getCurrentWord(cm1,null,this.cur);
		if(this.curWord != null) this.cur = { line : this.cur.line, ch : this.start};
		if(moveCursorToStart == false) {
			this.cur.ch = this.end;
			if(mode == "position") this.cur.ch += 1;
		}
		var tabManagerInstance = tabmanager_TabManager.get();
		var displayArgs = tabManagerInstance.getCurrentDocumentPath() + "@" + Std.string(cm1.indexFromPos(this.cur));
		if(mode != null) displayArgs += "@" + mode;
		projectArguments.push(displayArgs);
		this.completions = [];
		this.declarationPositions = [];
		var params = ["--connect","5000","--cwd",HIDE.surroundWithQuotes(projectaccess_ProjectAccess.path)].concat(projectArguments);
		haxe_Log.trace(params,{ fileName : "Completion.hx", lineNumber : 433, className : "core.Completion", methodName : "processArguments"});
		var pathToHaxe = core_HaxeHelper.getPathToHaxe();
		var processHelper = core_ProcessHelper.get();
		processHelper.runProcess(pathToHaxe,params,null,function(stdout,stderr) {
			var xml = Xml.parse(stderr);
			var fast = new haxe_xml_Fast(xml);
			if(fast.hasNode.resolve("list")) {
				var list = fast.node.resolve("list");
				var completion;
				if(list.hasNode.resolve("i")) {
					var _g1 = list.nodes.resolve("i").iterator();
					while(_g1.head != null) {
						var item;
						item = (function($this) {
							var $r;
							_g1.val = _g1.head[0];
							_g1.head = _g1.head[1];
							$r = _g1.val;
							return $r;
						}(this));
						if(item.has.resolve("n")) {
							completion = { n : item.att.resolve("n")};
							if(item.hasNode.resolve("d")) {
								var str = StringTools.trim(item.node.resolve("d").get_innerHTML());
								str = StringTools.replace(str,"\t","");
								str = StringTools.replace(str,"\n","");
								str = StringTools.replace(str,"*","");
								str = StringTools.replace(str,"&lt;","<");
								str = StringTools.replace(str,"&gt;",">");
								str = StringTools.trim(str);
								completion.d = str;
							}
							if(item.hasNode.resolve("t")) completion.t = item.node.resolve("t").get_innerData();
							_g.completions.push(completion);
						}
					}
				}
			} else if(fast.hasNode.resolve("pos")) {
				var _g2 = fast.nodes.resolve("pos").iterator();
				while(_g2.head != null) {
					var item1;
					item1 = (function($this) {
						var $r;
						_g2.val = _g2.head[0];
						_g2.head = _g2.head[1];
						$r = _g2.val;
						return $r;
					}(this));
					_g.declarationPositions.push(item1.get_innerData());
				}
			}
			onComplete();
		},function(code,stdout1,stderr1) {
			haxe_Log.trace(code,{ fileName : "Completion.hx", lineNumber : 492, className : "core.Completion", methodName : "processArguments"});
			haxe_Log.trace(stderr1,{ fileName : "Completion.hx", lineNumber : 493, className : "core.Completion", methodName : "processArguments"});
			onComplete();
		});
	}
	,getHintAsync: function(cm,c) {
		var _g = this;
		if(this.completionActive) c(this.getHints(cm)); else {
			this.getCompletion(function() {
				c(_g.getHints(cm));
			});
			this.completionActive = true;
		}
	}
	,isEditorVisible: function() {
		var editor;
		editor = js_Boot.__cast(window.document.getElementById("editor") , HTMLDivElement);
		return editor.style.display != "none";
	}
	,showRegularCompletion: function(getCompletionFromHaxeCompiler) {
		if(getCompletionFromHaxeCompiler == null) getCompletionFromHaxeCompiler = true;
		if(this.isEditorVisible()) {
			cm_Editor.regenerateCompletionOnDot = true;
			this.WORD = new EReg("[A-Z_0-9]+$","i");
			this.completionType = core_CompletionType.REGULAR;
			var cm1 = cm_Editor.editor;
			if(!getCompletionFromHaxeCompiler) this.completionActive = true;
			var hint = $bind(this,this.getHintAsync);
			hint.async = true;
			cm1.showHint({ hint : hint, completeSingle : false});
		}
	}
	,showMetaTagsCompletion: function() {
		if(this.isEditorVisible()) {
			this.cur = cm_Editor.editor.getCursor();
			cm_Editor.regenerateCompletionOnDot = false;
			this.WORD = new EReg("[A-Z_0-9@:]+$","i");
			this.completionType = core_CompletionType.METATAGS;
			CodeMirror.showHint(cm_Editor.editor,$bind(this,this.getHints),{ closeCharacters : /[\s()\[\]{};>,]/});
		}
	}
	,showHxmlCompletion: function() {
		if(this.isEditorVisible()) {
			this.cur = cm_Editor.editor.getCursor();
			cm_Editor.regenerateCompletionOnDot = false;
			this.WORD = new EReg("[A-Z_0-9- \\.\\\\/]+$","i");
			this.completionType = core_CompletionType.HXML;
			CodeMirror.showHint(cm_Editor.editor,$bind(this,this.getHints),{ closeCharacters : /[()\[\]{};:>,]/});
		}
	}
	,showFileList: function(openFile,insertDirectory) {
		if(insertDirectory == null) insertDirectory = false;
		if(openFile == null) openFile = true;
		if(openFile) {
			this.completionType = core_CompletionType.OPENFILE;
			var quickOpen = core_QuickOpen.get();
			quickOpen.show(parser_ClassParser.filesList.slice().concat(parser_ClassParser.haxeStdFileList));
		} else if(this.isEditorVisible()) {
			this.cur = cm_Editor.editor.getCursor();
			cm_Editor.regenerateCompletionOnDot = false;
			this.WORD = new EReg("[A-Z_0-9-\\.\\\\/]+$","i");
			if(insertDirectory == false) this.completionType = core_CompletionType.FILELIST; else this.completionType = core_CompletionType.PASTEFOLDER;
			CodeMirror.showHint(cm_Editor.editor,$bind(this,this.getHints));
		}
	}
	,showClassList: function(ignoreWhitespace) {
		if(ignoreWhitespace == null) ignoreWhitespace = false;
		if(this.isEditorVisible()) {
			this.cur = cm_Editor.editor.getCursor();
			cm_Editor.regenerateCompletionOnDot = true;
			this.WORD = new EReg("[A-Z_0-9\\.]+$","i");
			this.completionType = core_CompletionType.CLASSLIST;
			var closeCharacters = /[\s()\[\]{};>,]/;
			if(ignoreWhitespace) closeCharacters = /[()\[\]{};>,]/;
			CodeMirror.showHint(cm_Editor.editor,$bind(this,this.getHints),{ closeCharacters : closeCharacters});
		}
	}
	,searchImage: function(name,type,description) {
		var functionParametersHelper = core_FunctionParametersHelper.get();
		var functionData = functionParametersHelper.parseFunctionParams(name,type,description);
		var info = null;
		var className = "CodeMirror-Tern-completion";
		if(functionData.parameters != null) {
			var data = this.generateFunctionCompletionItem(name,functionData.parameters);
			className = data.className;
			info = data.info + ":" + functionData.retType;
		} else if(type != null) {
			info = type;
			switch(info) {
			case "Bool":
				className += " CodeMirror-Tern-completion-bool";
				break;
			case "Float":case "Int":case "UInt":
				className += " CodeMirror-Tern-completion-number";
				break;
			case "String":
				className += " CodeMirror-Tern-completion-string";
				break;
			default:
				if(info.indexOf("Array") != -1) className += " CodeMirror-Tern-completion-array"; else if(info.indexOf("Map") != -1 || info.indexOf("StringMap") != -1) className += " CodeMirror-Tern-completion-map"; else className += " CodeMirror-Tern-completion-object";
			}
		}
		return { className : className, info : info};
	}
	,generateFunctionCompletionItem: function(name,params) {
		var info = null;
		var className = "CodeMirror-Tern-completion";
		info = name + "(";
		if(params != null) info += params.join(", ");
		info += ")";
		className += " CodeMirror-Tern-completion-fn";
		return { className : className, info : info};
	}
	,generateCompletionItem: function(name,type,description) {
		var completionData = this.searchImage(name,type,description);
		return this.createCompletionItem(name,description,completionData);
	}
	,createCompletionItem: function(name,description,completionData) {
		var completionItem = { text : name};
		completionItem.className = completionData.className;
		var infoSpan;
		var _this = window.document;
		infoSpan = _this.createElement("span");
		if(completionData.info != null) {
			var infoTypeSpan;
			var _this1 = window.document;
			infoTypeSpan = _this1.createElement("span");
			infoTypeSpan.textContent = completionData.info;
			infoSpan.appendChild(infoTypeSpan);
			infoSpan.appendChild(window.document.createElement("br"));
			infoSpan.appendChild(window.document.createElement("br"));
		}
		if(description != null) {
			var infoDescriptionSpan;
			var _this2 = window.document;
			infoDescriptionSpan = _this2.createElement("span");
			infoDescriptionSpan.className = "completionDescription";
			infoDescriptionSpan.innerHTML = description;
			infoSpan.appendChild(infoDescriptionSpan);
		}
		if(completionData.info != null || description != null) completionItem.info = function(completionItem1) {
			return infoSpan;
		};
		return completionItem;
	}
	,showImportDefinition: function(importsSuggestions,from,to) {
		var cm1 = cm_Editor.editor;
		CodeMirror.showHint(cm1,function() {
			var completions = [];
			var completion;
			var _g = 0;
			while(_g < importsSuggestions.length) {
				var item = importsSuggestions[_g];
				++_g;
				completion = { };
				completion.text = item;
				completion.displayText = "import " + item;
				completion.hint = (function(f,a1,to1) {
					return function(cm,a2,a3) {
						f(a1,to1,cm,a2,a3);
					};
				})(core_ImportDefinition.importClassHint,from,to);
				completions.push(completion);
			}
			var pos = cm1.getCursor();
			var data = { list : completions, from : pos, to : pos};
			return data;
		},{ completeSingle : false});
	}
	,showActions: function(completions) {
		var cm1 = cm_Editor.editor;
		CodeMirror.showHint(cm1,function() {
			var pos = cm1.getCursor();
			var data = { list : completions, from : pos, to : pos};
			return data;
		},{ completeSingle : false});
	}
	,showCodeSuggestions: function(suggestions) {
		var _g = this;
		var cm1 = cm_Editor.editor;
		CodeMirror.showHint(cm1,function() {
			var completions = [];
			var completion;
			var pos = cm1.getCursor();
			var word = _g.getCurrentWord(cm1,{ word : new EReg("[A-Z_0-9]+$","i")},pos).word;
			var _g1 = 0;
			while(_g1 < suggestions.length) {
				var item = suggestions[_g1];
				++_g1;
				if(word == null || StringTools.startsWith(item,word)) {
					completion = { };
					completion.text = item;
					completions.push(completion);
				}
			}
			var data = { list : completions, from : { line : pos.line, ch : _g.start}, to : { line : pos.line, ch : _g.end}};
			return data;
		},{ completeSingle : false});
	}
	,getClassList: function() {
		var tabManagerInstance = tabmanager_TabManager.get();
		var value = tabManagerInstance.getCurrentDocument().getValue();
		var mainClass = js_Node.require("path").basename(tabManagerInstance.getCurrentDocumentPath(),".hx");
		var filePackage = parser_RegexParser.getFilePackage(value);
		var fileImports = parser_RegexParser.getFileImportsList(value);
		var topLevelClassList = [];
		var importsList = [];
		var relativeImport = null;
		var parentPackages = [];
		if(filePackage.filePackage != null && filePackage.filePackage != "") {
			var packages = filePackage.filePackage.split(".");
			var parentPackage;
			while(packages.length > 0) {
				parentPackage = packages.join(".");
				packages.pop();
				parentPackages.push(parentPackage);
			}
		}
		var found;
		var _g = 0;
		var _g1 = [parser_ClassParser.importsList,parser_ClassParser.haxeStdImports];
		while(_g < _g1.length) {
			var list2 = _g1[_g];
			++_g;
			var _g2 = 0;
			while(_g2 < list2.length) {
				var item = list2[_g2];
				++_g2;
				found = false;
				var _g3 = 0;
				while(_g3 < parentPackages.length) {
					var parentPackage1 = parentPackages[_g3];
					++_g3;
					if(StringTools.startsWith(item,parentPackage1 + ".") && item.indexOf(".",parentPackage1.length + 1) == -1) {
						relativeImport = HxOverrides.substr(item,parentPackage1.length + 1,null);
						topLevelClassList.push({ name : relativeImport, fullName : item});
						found = true;
						break;
					}
				}
				if(!found) {
					if(HxOverrides.indexOf(fileImports,item,0) != -1) {
						relativeImport = item.split(".").pop();
						topLevelClassList.push({ name : relativeImport, fullName : item});
					} else if(filePackage.filePackage != null && filePackage.filePackage != "" && StringTools.startsWith(item,filePackage.filePackage + ".")) {
						relativeImport = HxOverrides.substr(item,filePackage.filePackage.length + 1,null);
						haxe_Log.trace(relativeImport,{ fileName : "Completion.hx", lineNumber : 872, className : "core.Completion", methodName : "getClassList"});
						if(StringTools.startsWith(relativeImport,mainClass + ".")) {
							relativeImport = HxOverrides.substr(relativeImport,mainClass.length + 1,null);
							haxe_Log.trace(relativeImport,{ fileName : "Completion.hx", lineNumber : 877, className : "core.Completion", methodName : "getClassList"});
							topLevelClassList.push({ name : relativeImport, fullName : item});
						} else importsList.push(relativeImport);
					} else {
						relativeImport = item;
						importsList.push(relativeImport);
					}
				}
			}
		}
		var _g4 = 0;
		var _g11 = [parser_ClassParser.haxeStdTopLevelClassList,parser_ClassParser.topLevelClassList];
		while(_g4 < _g11.length) {
			var list21 = _g11[_g4];
			++_g4;
			var _g21 = 0;
			while(_g21 < list21.length) {
				var item1 = list21[_g21];
				++_g21;
				topLevelClassList.push({ name : item1});
			}
		}
		var _g5 = 0;
		while(_g5 < fileImports.length) {
			var item2 = fileImports[_g5];
			++_g5;
			found = false;
			relativeImport = item2.split(".").pop();
			var _g12 = 0;
			while(_g12 < topLevelClassList.length) {
				var topLevelItem = topLevelClassList[_g12];
				++_g12;
				if(topLevelItem.name == relativeImport) {
					found = true;
					break;
				}
			}
			if(!found) topLevelClassList.push({ name : relativeImport, fullName : item2});
		}
		return { topLevelClassList : topLevelClassList, importsList : importsList};
	}
	,getCompletionType: function() {
		return this.completionType;
	}
	,__class__: core_Completion
};
var core_DragAndDrop = function() { };
$hxClasses["core.DragAndDrop"] = core_DragAndDrop;
core_DragAndDrop.__name__ = ["core","DragAndDrop"];
core_DragAndDrop.prepare = function() {
	window.addEventListener("dragover",function(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	});
	window.addEventListener("drop",function(e1) {
		e1.preventDefault();
		e1.stopPropagation();
		var _g1 = 0;
		var _g = e1.dataTransfer.files.length;
		while(_g1 < _g) {
			var i = _g1++;
			var path = [e1.dataTransfer.files[i].path];
			js_Node.require("fs").stat(path[0],(function(path) {
				return function(err,stats) {
					var success = openproject_OpenProject.openProject(path[0]);
					if(!success) {
						var filetreeInstance = filetree_FileTree.get();
						filetreeInstance.load(js_Node.require("path").basename(path[0]),path[0]);
					}
				};
			})(path));
		}
		return false;
	});
};
var core_FileDialog = function() { };
$hxClasses["core.FileDialog"] = core_FileDialog;
core_FileDialog.__name__ = ["core","FileDialog"];
core_FileDialog.create = function() {
	var _this = window.document;
	core_FileDialog.input = _this.createElement("input");
	core_FileDialog.input.type = "file";
	core_FileDialog.input.style.display = "none";
	core_FileDialog.input.addEventListener("change",function(e) {
		var value = core_FileDialog.input.value;
		if(value != "") core_FileDialog.onClick(value);
	});
	window.document.body.appendChild(core_FileDialog.input);
};
core_FileDialog.openFile = function(_onClick,extensions) {
	core_FileDialog.input.value = "";
	core_FileDialog.onClick = _onClick;
	if(core_FileDialog.input.hasAttribute("nwsaveas")) core_FileDialog.input.removeAttribute("nwsaveas");
	if(core_FileDialog.input.hasAttribute("nwdirectory")) core_FileDialog.input.removeAttribute("nwdirectory");
	if(extensions != null) core_FileDialog.input.setAttribute("accept",extensions); else core_FileDialog.input.removeAttribute("accept");
	core_FileDialog.input.click();
};
core_FileDialog.saveFile = function(_onClick,_name) {
	core_FileDialog.input.value = "";
	core_FileDialog.onClick = _onClick;
	if(_name == null) _name = "";
	if(core_FileDialog.input.hasAttribute("nwdirectory")) core_FileDialog.input.removeAttribute("nwdirectory");
	core_FileDialog.input.setAttribute("nwsaveas",_name);
	core_FileDialog.input.click();
};
core_FileDialog.openFolder = function(_onClick) {
	core_FileDialog.input.value = "";
	core_FileDialog.onClick = _onClick;
	if(core_FileDialog.input.hasAttribute("nwsaveas")) core_FileDialog.input.removeAttribute("nwsaveas");
	core_FileDialog.input.setAttribute("nwdirectory","");
	core_FileDialog.input.click();
};
var core_FunctionParametersHelper = function() {
	this.widgets = [];
};
$hxClasses["core.FunctionParametersHelper"] = core_FunctionParametersHelper;
core_FunctionParametersHelper.__name__ = ["core","FunctionParametersHelper"];
core_FunctionParametersHelper.get = function() {
	if(core_FunctionParametersHelper.instance == null) core_FunctionParametersHelper.instance = new core_FunctionParametersHelper();
	return core_FunctionParametersHelper.instance;
};
core_FunctionParametersHelper.prototype = {
	widgets: null
	,lastPos: null
	,addWidget: function(type,name,parameters,retType,description,currentParameter,pos) {
		var lineWidget = new core_LineWidget(type,name,parameters,retType,description,currentParameter,pos);
		this.widgets.push(lineWidget);
	}
	,alreadyShown: function() {
		return this.widgets.length > 0;
	}
	,updateScroll: function() {
		var info = cm_Editor.editor.getScrollInfo();
		var after = cm_Editor.editor.charCoords({ line : cm_Editor.editor.getCursor().line + 1, ch : 0},"local").top;
		if(info.top + info.clientHeight < after) cm_Editor.editor.scrollTo(null,after - info.clientHeight + 3);
	}
	,clear: function() {
		var _g = 0;
		var _g1 = this.widgets;
		while(_g < _g1.length) {
			var widget = _g1[_g];
			++_g;
			cm_Editor.editor.removeLineWidget(widget.getWidget());
		}
		this.widgets = [];
	}
	,update: function(cm) {
		var tabManagerInstance = tabmanager_TabManager.get();
		var doc = tabManagerInstance.getCurrentDocument();
		if(doc != null) {
			var modeName = doc.getMode().name;
			if(modeName == "haxe" && !cm.state.completionActive) {
				var cursor = cm.getCursor();
				var data = cm.getLine(cursor.line);
				if(cursor != null && data.charAt(cursor.ch - 1) != ".") this.scanForBracket(cm,cursor);
			}
		}
	}
	,scanForBracket: function(cm,cursor) {
		var bracketsData = cm.scanForBracket(cursor,-1,null,{ bracketRegex : /[([\]]/});
		var pos = null;
		if(bracketsData != null && bracketsData.ch == "(") {
			pos = { line : bracketsData.pos.line, ch : bracketsData.pos.ch};
			var matchedBracket = cm.findMatchingBracket(pos,false,null).to;
			if(matchedBracket == null || cursor.line <= matchedBracket.line && cursor.ch <= matchedBracket.ch) {
				var range = cm.getRange(bracketsData.pos,cursor);
				var currentParameter = range.split(",").length - 1;
				if(this.lastPos == null || this.lastPos.ch != pos.ch || this.lastPos.line != pos.line) this.getFunctionParams(cm,pos,currentParameter); else if(this.alreadyShown()) {
					var _g = 0;
					var _g1 = this.widgets;
					while(_g < _g1.length) {
						var widget = _g1[_g];
						++_g;
						widget.updateParameters(currentParameter);
					}
				}
				this.lastPos = pos;
			} else {
				this.lastPos = null;
				this.clear();
			}
		} else {
			this.lastPos = null;
			this.clear();
		}
	}
	,getFunctionParams: function(cm,pos,currentParameter) {
		var _g = this;
		var posBeforeBracket = { line : pos.line, ch : pos.ch - 1};
		var completionInstance = core_Completion.get();
		var word = completionInstance.getCurrentWord(cm,{ },posBeforeBracket).word;
		completionInstance.getCompletion(function() {
			var found = false;
			_g.clear();
			var _g1 = 0;
			var _g2 = completionInstance.completions;
			while(_g1 < _g2.length) {
				var completion = _g2[_g1];
				++_g1;
				if(word == completion.n) {
					var functionData = _g.parseFunctionParams(completion.n,completion.t,completion.d);
					if(functionData.parameters != null) {
						var description = _g.parseDescription(completion.d);
						_g.addWidget("function",completion.n,functionData.parameters,functionData.retType,description,currentParameter,cm.getCursor());
						found = true;
					}
				}
			}
			_g.updateScroll();
		},posBeforeBracket);
	}
	,parseDescription: function(description) {
		if(description != null) {
			if(description.indexOf(".") != -1) description = description.split(".")[0];
		}
		return description;
	}
	,parseFunctionParams: function(name,type,description) {
		var parameters = null;
		var retType = null;
		if(type != null && type.indexOf("->") != -1) {
			var openBracketsCount = 0;
			var positions = [];
			var i = 0;
			var lastPos = 0;
			while(i < type.length) {
				var _g = type.charAt(i);
				switch(_g) {
				case "-":
					if(openBracketsCount == 0 && type.charAt(i + 1) == ">") {
						positions.push({ start : lastPos, end : i - 1});
						i++;
						i++;
						lastPos = i;
					}
					break;
				case "(":
					openBracketsCount++;
					break;
				case ")":
					openBracketsCount--;
					break;
				default:
				}
				i++;
			}
			positions.push({ start : lastPos, end : type.length});
			parameters = [];
			var _g1 = 0;
			var _g2 = positions.length;
			while(_g1 < _g2) {
				var j = _g1++;
				var param = StringTools.trim(type.substring(positions[j].start,positions[j].end));
				if(j < positions.length - 1) parameters.push(param); else retType = param;
			}
			if(parameters.length == 1 && parameters[0] == "Void") parameters = [];
		}
		return { parameters : parameters, retType : retType};
	}
	,__class__: core_FunctionParametersHelper
};
var core_GoToLine = function() {
};
$hxClasses["core.GoToLine"] = core_GoToLine;
core_GoToLine.__name__ = ["core","GoToLine"];
core_GoToLine.get = function() {
	if(core_GoToLine.instance == null) core_GoToLine.instance = new core_GoToLine();
	return core_GoToLine.instance;
};
core_GoToLine.prototype = {
	show: function() {
		var tabManagerInstance = tabmanager_TabManager.get();
		if(tabManagerInstance.selectedPath != null) alertify.prompt("Go to Line",function(e,str) {
			var cm2 = cm_Editor.editor;
			var lineNumber = Std.parseInt(str) - 1;
			cm2.centerOnLine(lineNumber);
			var highlightRange = cm_HighlightRange.get();
			var from = { line : lineNumber, ch : 0};
			var to = { line : lineNumber, ch : cm2.getLine(lineNumber).length};
			highlightRange.highlight(cm2,from,to);
			cm2.setCursor({ line : lineNumber, ch : 0});
			cm2.focus();
		});
	}
	,__class__: core_GoToLine
};
var core_HaxeHelper = function() { };
$hxClasses["core.HaxeHelper"] = core_HaxeHelper;
core_HaxeHelper.__name__ = ["core","HaxeHelper"];
core_HaxeHelper.getArguments = function(onComplete) {
	if(core_HaxeHelper.haxeArguments != null) onComplete(core_HaxeHelper.haxeArguments); else {
		var data = [];
		var processHelper = core_ProcessHelper.get();
		processHelper.runProcess(core_HaxeHelper.getPathToHaxe(),["--help"],null,function(stdout,stderr) {
			var regex = new EReg("-+[A-Z-]+ ","gim");
			regex.map(stderr,function(ereg) {
				var str = ereg.matched(0);
				data.push(HxOverrides.substr(str,0,str.length - 1));
				return str;
			});
			core_HaxeHelper.haxeArguments = data;
			onComplete(core_HaxeHelper.haxeArguments);
		});
	}
};
core_HaxeHelper.getDefines = function(onComplete) {
	if(core_HaxeHelper.haxeDefines != null) onComplete(core_HaxeHelper.haxeDefines); else {
		var processHelper = core_ProcessHelper.get();
		var data = [];
		processHelper.runProcess(core_HaxeHelper.getPathToHaxe(),["--help-defines"],null,function(stdout,stderr) {
			var regex = new EReg("[A-Z-]+ +:","gim");
			regex.map(stdout,function(ereg) {
				var str = ereg.matched(0);
				data.push(StringTools.trim(HxOverrides.substr(str,0,str.length - 1)));
				return ereg.matched(0);
			});
			core_HaxeHelper.haxeDefines = data;
			onComplete(core_HaxeHelper.haxeDefines);
		});
	}
};
core_HaxeHelper.getInstalledHaxelibList = function(onComplete) {
	if(core_HaxeHelper.installedHaxelibs != null) onComplete(core_HaxeHelper.installedHaxelibs); else {
		var processHelper = core_ProcessHelper.get();
		var data = [];
		processHelper.runProcess(core_HaxeHelper.getPathToHaxelib(),["list"],null,function(stdout,stderr) {
			var regex = new EReg("^[A-Z-]+:","gim");
			regex.map(stdout,function(ereg) {
				var str = ereg.matched(0);
				data.push(HxOverrides.substr(str,0,str.length - 1));
				return str;
			});
			core_HaxeHelper.installedHaxelibs = data;
			onComplete(core_HaxeHelper.installedHaxelibs);
		});
	}
};
core_HaxeHelper.getHaxelibList = function(onComplete) {
	if(core_HaxeHelper.haxelibHaxelibs != null) onComplete(core_HaxeHelper.haxelibHaxelibs); else {
		var processHelper = core_ProcessHelper.get();
		var data = [];
		processHelper.runProcess(core_HaxeHelper.getPathToHaxelib(),["search","\"\""],null,function(stdout,stderr) {
			var lines = stdout.split("\n");
			var _g = 0;
			while(_g < lines.length) {
				var line = lines[_g];
				++_g;
				line = StringTools.trim(line);
				if(line.length > 0 && line.indexOf(" ") == -1) data.push(line);
			}
			core_HaxeHelper.haxelibHaxelibs = data;
			onComplete(core_HaxeHelper.haxelibHaxelibs);
		});
	}
};
core_HaxeHelper.getPathToHaxe = function() {
	return core_HaxeHelper.pathToHaxe;
};
core_HaxeHelper.getPathToHaxelib = function() {
	return core_HaxeHelper.pathToHaxelib;
};
core_HaxeHelper.updatePathToHaxe = function() {
	core_HaxeHelper.pathToHaxe = "haxe";
	core_HaxeHelper.pathToHaxelib = "haxelib";
	var classpathWalker = parser_ClasspathWalker.get();
	var pathToHaxeDirectory = classpathWalker.pathToHaxe;
	if(pathToHaxeDirectory != null) {
		core_HaxeHelper.pathToHaxe = js_Node.require("path").join(pathToHaxeDirectory,core_HaxeHelper.pathToHaxe);
		core_HaxeHelper.pathToHaxelib = js_Node.require("path").join(pathToHaxeDirectory,core_HaxeHelper.pathToHaxelib);
	}
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	get: null
	,keys: null
	,__class__: haxe_IMap
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
	,rh: null
	,set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
	,__class__: haxe_ds_StringMap
};
var core_HaxeLint = function() { };
$hxClasses["core.HaxeLint"] = core_HaxeLint;
core_HaxeLint.__name__ = ["core","HaxeLint"];
core_HaxeLint.load = function() {
	CodeMirror.registerHelper("lint","haxe",function(text) {
		var found = [];
		var tabManagerInstance = tabmanager_TabManager.get();
		var path = tabManagerInstance.getCurrentDocumentPath();
		if(core_HaxeLint.fileData.exists(path)) {
			var data = core_HaxeLint.fileData.get(path);
			found = found.concat(data);
		}
		if(core_HaxeLint.parserData.exists(path)) {
			var data1 = core_HaxeLint.parserData.get(path);
			found = found.concat(data1);
		}
		return found;
	});
};
core_HaxeLint.updateLinting = function() {
	var annotationRuler = core_AnnotationRuler.get();
	annotationRuler.clearErrorMarkers();
	var tabManagerInstance = tabmanager_TabManager.get();
	var outlinePanel = core_OutlinePanel.get();
	var outlineHelper = parser_OutlineHelper.get();
	var xmlInstance = cm_Xml.get();
	var doc = tabManagerInstance.getCurrentDocument();
	if(doc != null) {
		if(doc.getMode().name == "haxe") {
			try {
				core_HaxeParserProvider.getClassName();
			} catch( e ) {
				if (e instanceof js__$Boot_HaxeError) e = e.val;
				haxe_Log.trace(e,{ fileName : "HaxeLint.hx", lineNumber : 73, className : "core.HaxeLint", methodName : "updateLinting"});
			}
			var path = tabManagerInstance.getCurrentDocumentPath();
			outlineHelper.getList(doc.getValue(),path);
			if(core_HaxeLint.fileData.exists(path)) {
				var data = core_HaxeLint.fileData.get(path);
				var _g = 0;
				while(_g < data.length) {
					var item = data[_g];
					++_g;
					annotationRuler.addErrorMarker(path,item.from.line,item.from.ch,item.message);
				}
			}
			cm_Editor.editor.setOption("lint",false);
			cm_Editor.editor.setOption("lint",true);
		} else if(doc.getMode().name == "xml") xmlInstance.generateXmlCompletion(); else {
			outlinePanel.clearFields();
			outlinePanel.update();
		}
	} else {
		outlinePanel.clearFields();
		outlinePanel.update();
	}
};
var core_FunctionScopeType = $hxClasses["core.FunctionScopeType"] = { __ename__ : ["core","FunctionScopeType"], __constructs__ : ["SClass","SStatic","SRegular"] };
core_FunctionScopeType.SClass = ["SClass",0];
core_FunctionScopeType.SClass.__enum__ = core_FunctionScopeType;
core_FunctionScopeType.SStatic = ["SStatic",1];
core_FunctionScopeType.SStatic.__enum__ = core_FunctionScopeType;
core_FunctionScopeType.SRegular = ["SRegular",2];
core_FunctionScopeType.SRegular.__enum__ = core_FunctionScopeType;
var core_HaxeParserProvider = function() { };
$hxClasses["core.HaxeParserProvider"] = core_HaxeParserProvider;
core_HaxeParserProvider.__name__ = ["core","HaxeParserProvider"];
core_HaxeParserProvider.processClass = function(type,pos) {
	var found = false;
	core_HaxeParserProvider.currentClass = type.name;
	core_HaxeParserProvider.currentFunctionScopeType = core_FunctionScopeType.SClass;
	var _g1 = 0;
	var _g = type.data.length;
	try {
		while(_g1 < _g) {
			var i = _g1++;
			if(pos > type.data[i].pos.min && pos < type.data[i].pos.max) {
				{
					var _g2 = type.data[i].kind;
					switch(_g2[1]) {
					case 1:
						var f = _g2[2];
						core_HaxeParserProvider.currentFunctionScopeType = core_HaxeParserProvider.getFunctionScope(type.data[i],f);
						if(pos > f.expr.pos.min && pos < f.expr.pos.max) {
							if(core_HaxeParserProvider.processExpression(f.expr.expr,pos)) throw "__break__";
						}
						break;
					case 0:
						var e = _g2[3];
						var t = _g2[2];
						core_HaxeParserProvider.currentFunctionScopeType = core_FunctionScopeType.SClass;
						break;
					case 2:
						var e1 = _g2[5];
						var t1 = _g2[4];
						var set = _g2[3];
						var get = _g2[2];
						core_HaxeParserProvider.currentFunctionScopeType = core_FunctionScopeType.SClass;
						break;
					}
				}
				found = true;
				throw "__break__";
			}
		}
	} catch( e ) { if( e != "__break__" ) throw e; }
	return found;
};
core_HaxeParserProvider.processExpression = function(expr,pos) {
	var found = false;
	switch(expr[1]) {
	case 16:
		var b = expr[4];
		var e = expr[3];
		var econd = expr[2];
		break;
	case 10:
		var vars = expr[2];
		break;
	case 22:
		var e1 = expr[2];
		break;
	case 9:
		var e2 = expr[4];
		var postFix = expr[3];
		var op = expr[2];
		break;
	case 18:
		var catches = expr[3];
		var e3 = expr[2];
		break;
	case 23:
		var e4 = expr[2];
		break;
	case 27:
		var eelse = expr[4];
		var eif = expr[3];
		var econd1 = expr[2];
		break;
	case 17:
		var edef = expr[4];
		var cases = expr[3];
		var e5 = expr[2];
		break;
	case 19:
		var e6 = expr[2];
		break;
	case 4:
		var e7 = expr[2];
		break;
	case 5:
		var fields = expr[2];
		break;
	case 8:
		var params = expr[3];
		var t = expr[2];
		break;
	case 29:
		var e8 = expr[3];
		var s = expr[2];
		break;
	case 14:
		var e21 = expr[3];
		var e11 = expr[2];
		break;
	case 15:
		var eelse1 = expr[4];
		var eif1 = expr[3];
		var econd2 = expr[2];
		break;
	case 11:
		var f = expr[3];
		var name = expr[2];
		break;
	case 13:
		var expr1 = expr[3];
		var it = expr[2];
		break;
	case 3:
		var field = expr[3];
		var e9 = expr[2];
		core_HaxeParserProvider.processExpression(e9.expr,pos);
		break;
	case 26:
		var t1 = expr[2];
		break;
	case 25:
		var isCall = expr[3];
		var e10 = expr[2];
		break;
	case 21:
		break;
	case 0:
		var c = expr[2];
		switch(c[1]) {
		case 3:
			var s1 = c[2];
			break;
		default:
		}
		break;
	case 28:
		var t2 = expr[3];
		var e12 = expr[2];
		break;
	case 24:
		var t3 = expr[3];
		var e13 = expr[2];
		break;
	case 7:
		var params1 = expr[3];
		var e14 = expr[2];
		core_HaxeParserProvider.processExpression(e14.expr,pos);
		var _g = 0;
		while(_g < params1.length) {
			var param = params1[_g];
			++_g;
			core_HaxeParserProvider.processExpression(param.expr,pos);
		}
		break;
	case 20:
		break;
	case 12:
		var exprs = expr[2];
		var _g1 = 0;
		while(_g1 < exprs.length) {
			var e15 = exprs[_g1];
			++_g1;
			if(pos > e15.pos.max) {
			}
			if(pos > e15.pos.min && pos <= e15.pos.max) {
				if(core_HaxeParserProvider.processExpression(e15.expr,pos)) {
					found = true;
					break;
				}
			}
		}
		break;
	case 2:
		var e22 = expr[4];
		var e16 = expr[3];
		var op1 = expr[2];
		break;
	case 6:
		var values = expr[2];
		break;
	case 1:
		var e23 = expr[3];
		var e17 = expr[2];
		break;
	}
	return found;
};
core_HaxeParserProvider.getFunctionScope = function(field,f) {
	var functionScopeType = core_FunctionScopeType.SRegular;
	var access = field.access;
	var _g = 0;
	while(_g < access.length) {
		var accessType = access[_g];
		++_g;
		switch(accessType[1]) {
		case 0:
			break;
		case 2:
			functionScopeType = core_FunctionScopeType.SStatic;
			break;
		case 6:
			break;
		case 5:
			break;
		case 4:
			break;
		case 3:
			break;
		case 1:
			break;
		}
	}
	return functionScopeType;
};
core_HaxeParserProvider.getClassName = function() {
	var cm1 = cm_Editor.editor;
	var pos = cm1.indexFromPos(cm1.getCursor());
	var tabManagerInstance = tabmanager_TabManager.get();
	var doc = tabManagerInstance.getCurrentDocument();
	var data = doc.getValue();
	var path = tabManagerInstance.getCurrentDocumentPath();
	var ast = core_HaxeParserProvider.parse(data,path);
	if(ast != null) {
		var classPackage = ast.pack;
		var _g = 0;
		var _g1 = ast.decls;
		try {
			while(_g < _g1.length) {
				var decl = _g1[_g];
				++_g;
				{
					var _g2 = decl.decl;
					switch(_g2[1]) {
					case 3:
						var mode = _g2[3];
						var sl = _g2[2];
						core_HaxeParserProvider.currentClass = null;
						if(core_HaxeParserProvider.processImport(sl,mode,pos)) throw "__break__";
						break;
					case 5:
						var path1 = _g2[2];
						core_HaxeParserProvider.currentClass = null;
						break;
					case 2:
						var data1 = _g2[2];
						core_HaxeParserProvider.currentClass = null;
						break;
					case 0:
						var data2 = _g2[2];
						if(core_HaxeParserProvider.processClass(data2,pos)) throw "__break__";
						break;
					case 1:
						var data3 = _g2[2];
						core_HaxeParserProvider.currentClass = null;
						break;
					case 4:
						var data4 = _g2[2];
						core_HaxeParserProvider.currentClass = null;
						break;
					}
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
	} else haxe_Log.trace("ast is null",{ fileName : "HaxeParserProvider.hx", lineNumber : 238, className : "core.HaxeParserProvider", methodName : "getClassName"});
};
core_HaxeParserProvider.parse = function(data,path) {
	var input = byte_js__$ByteData_ByteData_$Impl_$.ofString(data);
	var parser = new haxeparser_HaxeParser(input,path);
	var data1 = [];
	core_HaxeLint.parserData.set(path,data1);
	var ast = null;
	try {
		ast = parser.parse();
	} catch( $e0 ) {
		if ($e0 instanceof js__$Boot_HaxeError) $e0 = $e0.val;
		if( js_Boot.__instanceof($e0,hxparse_NoMatch) ) {
			var e = $e0;
			var pos = e.pos.getLinePosition(input);
			var info = { from : { line : pos.lineMin - 1, ch : pos.posMin}, to : { line : pos.lineMax - 1, ch : pos.posMax}, message : "Parser error:\nUnexpected " + Std.string(e.token.tok), severity : "warning"};
			data1.push(info);
		} else if( js_Boot.__instanceof($e0,hxparse_Unexpected) ) {
			var e1 = $e0;
			var pos1 = e1.pos.getLinePosition(input);
			var info1 = { from : { line : pos1.lineMin - 1, ch : pos1.posMin}, to : { line : pos1.lineMax - 1, ch : pos1.posMax}, message : "Parser error:\nUnexpected " + Std.string(e1.token.tok), severity : "warning"};
			data1.push(info1);
		} else {
		var e2 = $e0;
		if(e2 != null && e2.pos) {
			var cm1 = cm_Editor.editor;
			var message = "Parser error:\n";
			{
				var _g = e2.msg;
				switch(Type.enumIndex(_g)) {
				case 0:
					message += "Missing Semicolon";
					break;
				case 1:
					message += "Missing Type";
					break;
				case 2:
					message += "Duplicate Default";
					break;
				case 4:
					var s = _g[2];
					message += s;
					break;
				}
			}
			var info2 = { from : cm1.posFromIndex(e2.pos.min), to : cm1.posFromIndex(e2.pos.max), message : message, severity : "warning"};
			data1.push(info2);
		}
		}
	}
	return ast;
};
core_HaxeParserProvider.processImport = function(path,mode,currentPosition) {
	var found = false;
	var _g1 = 0;
	var _g = path.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(currentPosition > path[i].pos.min && currentPosition < path[i].pos.max) {
			found = true;
			break;
		}
	}
	return found;
};
var core_HaxeServer = function() { };
$hxClasses["core.HaxeServer"] = core_HaxeServer;
core_HaxeServer.__name__ = ["core","HaxeServer"];
core_HaxeServer.check = function() {
	var socket = js_Node.require("net").connect(5000,"localhost");
	socket.on("error",function(e) {
		haxe_Log.trace("Haxe server is not found at localhost:5000",{ fileName : "HaxeServer.hx", lineNumber : 24, className : "core.HaxeServer", methodName : "check"});
	});
	socket.on("close",function(e1) {
		if(e1) core_HaxeServer.start();
	});
};
core_HaxeServer.start = function() {
	haxe_Log.trace("Starting new Haxe server at localhost:5000",{ fileName : "HaxeServer.hx", lineNumber : 39, className : "core.HaxeServer", methodName : "start"});
	var processHelper = core_ProcessHelper.get();
	core_HaxeServer.haxeServer = processHelper.runPersistentProcess(core_HaxeHelper.getPathToHaxe(),["--wait","5000"],null,function(code,stdout,stderr) {
		haxe_Log.trace(stdout,{ fileName : "HaxeServer.hx", lineNumber : 45, className : "core.HaxeServer", methodName : "start"});
		haxe_Log.trace(stderr,{ fileName : "HaxeServer.hx", lineNumber : 46, className : "core.HaxeServer", methodName : "start"});
	});
	var $window = nodejs_webkit_Window.get();
	$window.on("close",function(e) {
		core_HaxeServer.terminate();
		$window.close();
	});
};
core_HaxeServer.terminate = function() {
	if(core_HaxeServer.haxeServer != null) core_HaxeServer.haxeServer.kill();
};
var core_Helper = function() { };
$hxClasses["core.Helper"] = core_Helper;
core_Helper.__name__ = ["core","Helper"];
core_Helper.debounce = function(type,onComplete,time_ms) {
	var timer = core_Helper.timers.get(type);
	if(timer != null) timer.stop();
	timer = new haxe_Timer(time_ms);
	timer.run = function() {
		timer.stop();
		onComplete();
	};
	core_Helper.timers.set(type,timer);
};
var core_Hotkeys = function() { };
$hxClasses["core.Hotkeys"] = core_Hotkeys;
core_Hotkeys.__name__ = ["core","Hotkeys"];
core_Hotkeys.prepare = function() {
	core_Hotkeys.commandKey = core_Utils.os == 2;
	haxe_Log.trace("Hotkeys adjusted for Mac OS X " + Std.string(core_Hotkeys.commandKey),{ fileName : "Hotkeys.hx", lineNumber : 38, className : "core.Hotkeys", methodName : "prepare"});
	core_Hotkeys.pathToData = js_Node.require("path").join(watchers_SettingsWatcher.pathToFolder,"hotkeys.json");
	core_Hotkeys.parseData();
	watchers_Watcher.watchFileForUpdates(core_Hotkeys.pathToData,function() {
		core_Hotkeys.parseData();
		core_Hotkeys.hotkeys = [];
		var $it0 = core_Hotkeys.commandMap.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			core_Hotkeys.addHotkey(key);
		}
	},1500);
	window.addEventListener("keydown",function(e) {
		var _g = 0;
		var _g1 = core_Hotkeys.hotkeys;
		while(_g < _g1.length) {
			var hotkey = _g1[_g];
			++_g;
			if(core_Hotkeys.isHotkeyEvent(hotkey,e)) hotkey.onKeyDown();
		}
	});
};
core_Hotkeys.add = function(menuItem,hotkeyText,span,onKeyDown) {
	core_Hotkeys.commandMap.set(menuItem,onKeyDown);
	if(span != null) core_Hotkeys.spanMap.set(menuItem,span);
	core_Hotkeys.addHotkey(menuItem,hotkeyText);
	if(menuItem == "Source->Show Code Completion") {
		var hotkey = core_Hotkeys.parseHotkey(hotkeyText);
		cm_Editor.editor.on("keypress",function(cm,e) {
			if(core_Hotkeys.isHotkeyEvent(hotkey,e)) e.preventDefault();
		});
	}
};
core_Hotkeys.getHotkeyCommandCallback = function(menuItem) {
	return core_Hotkeys.commandMap.get(menuItem);
};
core_Hotkeys.addHotkey = function(menuItem,hotkeyText) {
	if(hotkeyText == null) hotkeyText = "";
	if(Object.prototype.hasOwnProperty.call(core_Hotkeys.data,menuItem)) hotkeyText = Reflect.field(core_Hotkeys.data,menuItem); else {
		core_Hotkeys.data[menuItem] = hotkeyText;
		var data = tjson_TJSON.encode(core_Hotkeys.data,"fancy");
		js_Node.require("fs").writeFileSync(core_Hotkeys.pathToData,data,"utf8");
	}
	var keyCode = null;
	var ctrl = null;
	var shift = null;
	var alt = null;
	if(hotkeyText != "") {
		var hotkey = core_Hotkeys.parseHotkey(hotkeyText);
		if(hotkey.keyCode != 0) {
			keyCode = hotkey.keyCode;
			ctrl = hotkey.ctrl;
			shift = hotkey.shift;
			alt = hotkey.alt;
		} else window.console.warn("can't assign hotkey " + hotkeyText + " for " + menuItem);
		if(core_Hotkeys.spanMap.exists(menuItem)) {
			if(core_Hotkeys.commandKey) hotkeyText = StringTools.replace(hotkeyText,"Ctrl","Cmd");
			core_Hotkeys.spanMap.get(menuItem).innerText = hotkeyText;
		}
		if(keyCode != null) {
			hotkey.onKeyDown = core_Hotkeys.commandMap.get(menuItem);
			core_Hotkeys.hotkeys.push(hotkey);
		}
	}
};
core_Hotkeys.isHotkeyEvent = function(hotkey,e) {
	var isHotkey = hotkey.keyCode == e.keyCode && hotkey.ctrl == (e.ctrlKey || core_Hotkeys.commandKey && e.metaKey) && hotkey.shift == e.shiftKey && hotkey.alt == e.altKey;
	return isHotkey;
};
core_Hotkeys.parseData = function() {
	var options = { };
	options.encoding = "utf8";
	core_Hotkeys.data = tjson_TJSON.parse(js_Node.require("fs").readFileSync(core_Hotkeys.pathToData,options));
};
core_Hotkeys.parseHotkey = function(hotkey) {
	var keys = hotkey.split("-");
	var ctrl = false;
	var shift = false;
	var alt = false;
	var keyCode = 0;
	var _g = 0;
	while(_g < keys.length) {
		var key = keys[_g];
		++_g;
		var _g1 = key.toLowerCase();
		switch(_g1) {
		case "ctrl":
			ctrl = true;
			break;
		case "shift":
			shift = true;
			break;
		case "alt":
			alt = true;
			break;
		case "f1":
			keyCode = 112;
			break;
		case "f2":
			keyCode = 113;
			break;
		case "f3":
			keyCode = 114;
			break;
		case "f4":
			keyCode = 115;
			break;
		case "f5":
			keyCode = 116;
			break;
		case "f6":
			keyCode = 117;
			break;
		case "f7":
			keyCode = 118;
			break;
		case "f8":
			keyCode = 119;
			break;
		case "f9":
			keyCode = 120;
			break;
		case "f10":
			keyCode = 121;
			break;
		case "f11":
			keyCode = 122;
			break;
		case "f12":
			keyCode = 123;
			break;
		case "tab":
			keyCode = 9;
			break;
		case "enter":
			keyCode = 13;
			break;
		case "esc":
			keyCode = 27;
			break;
		case "space":
			keyCode = 32;
			break;
		case "+":
			keyCode = 187;
			break;
		case "pageup":
			keyCode = 33;
			break;
		case "pagedown":
			keyCode = 34;
			break;
		case "":
			keyCode = 189;
			break;
		default:
			if(key.length == 1) keyCode = HxOverrides.cca(key,0);
		}
	}
	return { keyCode : keyCode, ctrl : ctrl, shift : shift, alt : alt};
};
var core_ImportDefinition = function() { };
$hxClasses["core.ImportDefinition"] = core_ImportDefinition;
core_ImportDefinition.__name__ = ["core","ImportDefinition"];
core_ImportDefinition.searchImport = function(data,path) {
	var ast = parser_ClassParser.parse(data,path);
	var cm1 = cm_Editor.editor;
	var token = cm1.getTokenAt(cm1.getCursor());
	var topLevelClassList = [];
	var mode = null;
	var selectedText = null;
	var from = null;
	var to = null;
	if(cm1.somethingSelected()) {
		selectedText = cm1.getSelection();
		if(selectedText.indexOf(".") != -1) {
			mode = "selection";
			var selection = cm1.listSelections()[0];
			from = selection.anchor;
			to = selection.head;
			cm1.setSelection(to);
		}
	} else if(token.type != null && token.string != "") mode = "token";
	if(mode != null) {
		var completionInstance = core_Completion.get();
		topLevelClassList = completionInstance.getClassList().topLevelClassList;
		switch(mode) {
		case "token":
			core_ImportDefinition.checkImport(cm1,topLevelClassList,token);
			break;
		case "selection":
			core_ImportDefinition.searchImportByText(topLevelClassList,selectedText,from,to);
			break;
		default:
		}
	} else alertify.log("Place cursor on class name or select full class name to import it (for instance, you can select 'flash.display.Sprite' and it can be imported and selected text will be replaced to 'Sprite'");
};
core_ImportDefinition.searchImportByText = function(topLevelClassList,text,from,to,suggestImport) {
	if(suggestImport == null) suggestImport = true;
	var cm1 = cm_Editor.editor;
	var found = false;
	var alreadyAdded = false;
	var _g = 0;
	var _g1 = [parser_ClassParser.importsList,parser_ClassParser.haxeStdImports];
	while(_g < _g1.length) {
		var list = _g1[_g];
		++_g;
		if(HxOverrides.indexOf(list,text,0) != -1) {
			found = true;
			break;
		}
	}
	var _g2 = 0;
	while(_g2 < topLevelClassList.length) {
		var topLevelClass = topLevelClassList[_g2];
		++_g2;
		if(topLevelClass.fullName == text) {
			alreadyAdded = true;
			break;
		}
	}
	if(!alreadyAdded) {
		if(found) core_ImportDefinition.importClass(cm1,text,from,to); else if(suggestImport) {
			var completionInstance = core_Completion.get();
			completionInstance.showImportDefinition([text],from,to);
		}
	} else core_ImportDefinition.updateImport(cm1,text.split(".").pop(),from,to);
};
core_ImportDefinition.checkImport = function(cm,topLevelClassList,token) {
	var searchPattern = "." + token.string;
	var foundImports = [];
	var foundAtTopLevel = false;
	var alreadyImported = [];
	var _g = 0;
	while(_g < topLevelClassList.length) {
		var topLevelClass = topLevelClassList[_g];
		++_g;
		if(topLevelClass.name == token.string) {
			foundAtTopLevel = true;
			alreadyImported.push(topLevelClass.fullName);
			break;
		}
	}
	if(!foundAtTopLevel) {
		var found = false;
		var _g1 = 0;
		var _g11 = [parser_ClassParser.importsList,parser_ClassParser.haxeStdImports];
		while(_g1 < _g11.length) {
			var list = _g11[_g1];
			++_g1;
			var _g2 = 0;
			while(_g2 < list.length) {
				var item = list[_g2];
				++_g2;
				if(StringTools.endsWith(item,searchPattern)) {
					haxe_Log.trace(item,{ fileName : "ImportDefinition.hx", lineNumber : 161, className : "core.ImportDefinition", methodName : "checkImport"});
					var _g3 = 0;
					while(_g3 < topLevelClassList.length) {
						var topLevelClass1 = topLevelClassList[_g3];
						++_g3;
						if(topLevelClass1.fullName == item) {
							found = true;
							break;
						}
					}
					if(!found) foundImports.push(item); else alreadyImported.push(item);
				}
			}
		}
	}
	if(foundAtTopLevel) alertify.log("'" + token.string + "' doesn't needs to be imported, since it's already found at top level"); else if(foundImports.length > 0) {
		var completionInstance = core_Completion.get();
		completionInstance.showImportDefinition(foundImports);
	} else {
		var cursor = cm.getCursor();
		var lineData = cm.getLine(cursor.line);
		var ereg = new EReg("var[\t ]*([^ =]+):([^ =;\n]+)","gim");
		var ereg2 = new EReg("var[\t ]*([^ =:;\n]+)","gim");
		var pos = null;
		var len = null;
		var variableName = null;
		var variableDeclarationString = null;
		var matchedEreg = null;
		if(ereg.match(lineData)) matchedEreg = ereg; else if(ereg2.match(lineData)) matchedEreg = ereg2;
		if(matchedEreg != null) {
			pos = matchedEreg.matchedPos();
			variableName = matchedEreg.matched(1);
			variableDeclarationString = matchedEreg.matched(0);
			len = variableDeclarationString.length;
			variableDeclarationString = StringTools.trim(variableDeclarationString);
			if(!StringTools.endsWith(variableDeclarationString,";")) variableDeclarationString += ";";
		}
		var tabManagerInstance = tabmanager_TabManager.get();
		var classDeclarations = parser_RegexParser.getClassDeclarations(tabManagerInstance.getCurrentDocument().getValue());
		var currentClassDeclaration = null;
		var _g4 = 0;
		while(_g4 < classDeclarations.length) {
			var item1 = classDeclarations[_g4];
			++_g4;
			var classDeclarationPos = cm.posFromIndex(item1.pos.pos + item1.pos.len);
			if(cursor.line < classDeclarationPos.line || cursor.line == classDeclarationPos.line && cursor.ch < classDeclarationPos.ch) break;
			currentClassDeclaration = item1;
		}
		if(currentClassDeclaration != null && matchedEreg != null) {
			var completionItem = { };
			completionItem.displayText = "Move to the class scope";
			completionItem.hint = function(cm1,data,completion) {
				var classDeclarationPos1 = cm1.posFromIndex(currentClassDeclaration.pos.pos + currentClassDeclaration.pos.len);
				var index = cm1.indexFromPos({ line : cursor.line, ch : 0});
				classDeclarationPos1.line += 1;
				classDeclarationPos1.ch = 0;
				variableDeclarationString += "\n";
				cm1.replaceRange(variableDeclarationString,classDeclarationPos1,classDeclarationPos1);
				cm1.indentLine(classDeclarationPos1.line);
				var from = cm1.posFromIndex(index + pos.pos + variableDeclarationString.length + 1);
				var to = cm1.posFromIndex(index + pos.pos + pos.len + variableDeclarationString.length + 1);
				cm1.replaceRange(variableName,from,to);
			};
			var completionInstance1 = core_Completion.get();
			completionInstance1.showActions([completionItem]);
		} else {
			var info = "Unable to find additional imports for '" + token.string + "'.";
			if(alreadyImported.length > 0) info += " Already imported:\n" + Std.string(alreadyImported);
			alertify.log(info);
		}
	}
};
core_ImportDefinition.importClassHint = function(from,to,cm,data,completion) {
	core_ImportDefinition.importClass(cm,completion.text,from,to);
};
core_ImportDefinition.importClass = function(cm,text,from,to) {
	var tabManagerInstance = tabmanager_TabManager.get();
	var value = tabManagerInstance.getCurrentDocument().getValue();
	var filePackage = parser_RegexParser.getFilePackage(value);
	if(from != null && to != null) core_ImportDefinition.updateImport(cm,text,from,to);
	var pos;
	if(filePackage.filePackage != null) {
		pos = cm.posFromIndex(filePackage.pos);
		pos.ch = 0;
		pos.line++;
	} else pos = cm.posFromIndex(0);
	cm.replaceRange("import " + text + ";\n",pos,pos);
	alertify.success(text + " definition successfully imported");
};
core_ImportDefinition.updateImport = function(cm,text,from,to) {
	cm.replaceRange(text.split(".").pop(),from,to);
};
var core_LineWidget = function(type,name,parameters,retType,description,currentParameter,pos) {
	var _this = window.document;
	this.element = _this.createElement("div");
	this.element.className = "lint-error";
	var spanText;
	var _this1 = window.document;
	spanText = _this1.createElement("span");
	spanText.textContent = type + " " + name + "(";
	this.element.appendChild(spanText);
	var parametersSpan;
	var _this2 = window.document;
	parametersSpan = _this2.createElement("span");
	spanText.appendChild(parametersSpan);
	this.parametersSpanElements = [];
	var _g1 = 0;
	var _g = parameters.length;
	while(_g1 < _g) {
		var i = _g1++;
		var spanText2;
		var _this3 = window.document;
		spanText2 = _this3.createElement("span");
		spanText2.textContent = parameters[i];
		if(i == currentParameter) spanText2.className = "selectedParameter";
		parametersSpan.appendChild(spanText2);
		this.parametersSpanElements.push(spanText2);
		if(i != parameters.length - 1) {
			var spanCommaText;
			var _this4 = window.document;
			spanCommaText = _this4.createElement("span");
			spanCommaText.textContent = ", ";
			parametersSpan.appendChild(spanCommaText);
		}
	}
	this.updateParameters(currentParameter);
	var spanText3;
	var _this5 = window.document;
	spanText3 = _this5.createElement("span");
	spanText3.textContent = "):" + retType;
	this.element.appendChild(spanText3);
	if(description != null) {
		this.element.appendChild((function($this) {
			var $r;
			var _this6 = window.document;
			$r = _this6.createElement("br");
			return $r;
		}(this)));
		var spanDescription;
		var _this7 = window.document;
		spanDescription = _this7.createElement("span");
		spanDescription.textContent = description;
		this.element.appendChild(spanDescription);
	}
	this.widget = cm_Editor.editor.addLineWidget(pos.line,this.element,{ coverGutter : false, noHScroll : true});
};
$hxClasses["core.LineWidget"] = core_LineWidget;
core_LineWidget.__name__ = ["core","LineWidget"];
core_LineWidget.prototype = {
	element: null
	,parametersSpanElements: null
	,widget: null
	,updateParameters: function(currentParameter) {
		var _g1 = 0;
		var _g = this.parametersSpanElements.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(i == currentParameter) this.parametersSpanElements[i].className = "selectedParameter"; else this.parametersSpanElements[i].className = "";
		}
	}
	,getWidget: function() {
		return this.widget;
	}
	,__class__: core_LineWidget
};
var core_MenuCommands = function() { };
$hxClasses["core.MenuCommands"] = core_MenuCommands;
core_MenuCommands.__name__ = ["core","MenuCommands"];
core_MenuCommands.add = function() {
	var $window = nodejs_webkit_Window.get();
	menu_BootstrapMenu.getMenu("View").addMenuItem("Zoom In",2,function() {
		$window.zoomLevel += 1;
	},"Ctrl-Shift-+");
	menu_BootstrapMenu.getMenu("View").addMenuItem("Zoom Out",3,function() {
		$window.zoomLevel -= 1;
	},"Ctrl-Shift--");
	menu_BootstrapMenu.getMenu("View").addMenuItem("Reset",4,function() {
		$window.zoomLevel = 0;
	},"Ctrl-Shift-0");
	menu_BootstrapMenu.getMenu("View",3).addMenuItem("Toggle Fullscreen",1,function() {
		$window.toggleFullscreen();
	},"F11");
	var tabManagerInstance = tabmanager_TabManager.get();
	var completionInstance = core_Completion.get();
	var fileTreeInstance = filetree_FileTree.get();
	menu_BootstrapMenu.getMenu("Help").addMenuItem("changelog",1,(function(f,a1) {
		return function() {
			f(a1);
		};
	})($bind(tabManagerInstance,tabManagerInstance.openFileInNewTab),js_Node.require("path").join("core","changes.md")));
	menu_BootstrapMenu.getMenu("Developer Tools",100).addMenuItem("Reload IDE",1,$bind($window,$window.reloadIgnoringCache),"Ctrl-Shift-R");
	menu_BootstrapMenu.getMenu("Developer Tools").addMenuItem("Compile plugins and reload IDE",2,function() {
		HIDE.compilePlugins(function() {
			$window.reloadIgnoringCache();
		},function(data) {
		});
	},"Shift-F5");
	menu_BootstrapMenu.getMenu("Developer Tools").addMenuItem("Console",3,$bind($window,$window.showDevTools));
	menu_BootstrapMenu.getMenu("Help").addMenuItem("Show code editor key bindings",1,(function(f1,a11) {
		return function() {
			f1(a11);
		};
	})($bind(tabManagerInstance,tabManagerInstance.openFileInNewTab),js_Node.require("path").join("core","bindings.txt")));
	menu_BootstrapMenu.getMenu("Help").addMenuItem("View HIDE repository on GitHub",2,function() {
		nodejs_webkit_Shell.openExternal("https://github.com/as3boyan/HIDE");
	});
	menu_BootstrapMenu.getMenu("Help").addMenuItem("Report issue/request feature at GitHub issue tracker",3,function() {
		nodejs_webkit_Shell.openExternal("https://github.com/as3boyan/HIDE/issues/new");
	});
	menu_BootstrapMenu.getMenu("Help").addMenuItem("Open Haxe nightly build download URL",4,function() {
		var serverUrl = "http://hxbuilds.s3-website-us-east-1.amazonaws.com/builds/haxe/";
		var target;
		var _g = core_Utils.os;
		switch(_g) {
		case 0:
			target = "windows";
			break;
		case 1:
			target = "linux64";
			break;
		case 2:
			target = "mac";
			break;
		default:
			throw new js__$Boot_HaxeError("Utils class was not able to detect OS");
		}
		nodejs_webkit_Shell.openExternal(serverUrl + target + "/haxe_latest.tar.gz");
	});
	menu_BootstrapMenu.getMenu("Help").addMenuItem("About HIDE...",5,function() {
		return HIDE.openPageInNewWindow(null,"about.html",{ toolbar : false});
	});
	core_Hotkeys.add("Tab Manager->Show Next Tab","Ctrl-Tab",null,$bind(tabManagerInstance,tabManagerInstance.showNextTab));
	core_Hotkeys.add("Tab Manager->Show Previous Tab","Ctrl-Shift-Tab",null,$bind(tabManagerInstance,tabManagerInstance.showPreviousTab));
	core_Hotkeys.add("Tab Manager->Close File","Ctrl-W",null,$bind(tabManagerInstance,tabManagerInstance.closeActiveTab));
	core_Hotkeys.add("Tab Manager->Close All","Ctrl-Shift-W",null,$bind(tabManagerInstance,tabManagerInstance.closeAll));
	menu_BootstrapMenu.getMenu("File",1).addMenuItem("New Project...",1,newprojectdialog_NewProjectDialog.show,"Ctrl-Shift-N");
	menu_BootstrapMenu.getMenu("File").addMenuItem("New File...",2,$bind(tabManagerInstance,tabManagerInstance.createFileInNewTab),"Ctrl-N");
	menu_BootstrapMenu.getMenu("File").addSeparator();
	menu_BootstrapMenu.getMenu("File").addMenuItem("Open Project...",3,function() {
		return openproject_OpenProject.openProject(null,true);
	});
	menu_BootstrapMenu.getMenu("File").addSubmenu("Open Recent Project");
	menu_BootstrapMenu.getMenu("File").addMenuItem("Close Project",4,openproject_OpenProject.closeProject);
	menu_BootstrapMenu.getMenu("File").addMenuItem("Open File...",5,openproject_OpenProject.openProject,"Ctrl-O");
	menu_BootstrapMenu.getMenu("File").addSubmenu("Open Recent File");
	menu_BootstrapMenu.getMenu("File").addSeparator();
	menu_BootstrapMenu.getMenu("File").addMenuItem("Save",6,$bind(tabManagerInstance,tabManagerInstance.saveActiveFile),"Ctrl-S");
	menu_BootstrapMenu.getMenu("File").addMenuItem("Save As...",7,$bind(tabManagerInstance,tabManagerInstance.saveActiveFileAs),"Ctrl-Shift-S");
	menu_BootstrapMenu.getMenu("File").addMenuItem("Save All",8,$bind(tabManagerInstance,tabManagerInstance.saveAll));
	menu_BootstrapMenu.getMenu("File").addSeparator();
	menu_BootstrapMenu.getMenu("File").addMenuItem("Exit",9,nodejs_webkit_App.closeAllWindows);
	nodejs_webkit_Window.get().on("close",$bind(tabManagerInstance,tabManagerInstance.saveAll));
	menu_BootstrapMenu.getMenu("Options").addMenuItem("Open settings",1,(function(f2,a12) {
		return function() {
			f2(a12);
		};
	})($bind(tabManagerInstance,tabManagerInstance.openFileInNewTab),js_Node.require("path").join(watchers_SettingsWatcher.pathToFolder,"settings.json")));
	menu_BootstrapMenu.getMenu("Options").addMenuItem("Open stylesheet",1,function() {
		tabManagerInstance.openFileInNewTab(js_Node.require("path").join("core",watchers_SettingsWatcher.settings.theme));
	});
	var classpathWalker = parser_ClasspathWalker.get();
	menu_BootstrapMenu.getMenu("Options").addMenuItem("Open editor configuration file",1,(function(f3,a13) {
		return function() {
			f3(a13);
		};
	})($bind(tabManagerInstance,tabManagerInstance.openFileInNewTab),js_Node.require("path").join(watchers_SettingsWatcher.pathToFolder,"editor.json")));
	menu_BootstrapMenu.getMenu("Options").addMenuItem("Open templates folder",1,(function(f4,a14,a2) {
		return function() {
			f4(a14,a2);
		};
	})($bind(fileTreeInstance,fileTreeInstance.load),"templates",js_Node.require("path").join("core","templates")));
	menu_BootstrapMenu.getMenu("Options").addMenuItem("Open localization file",1,(function(f5,a15) {
		return function() {
			f5(a15);
		};
	})($bind(tabManagerInstance,tabManagerInstance.openFileInNewTab),js_Node.require("path").join("core","locale",watchers_SettingsWatcher.settings.locale)));
	menu_BootstrapMenu.getMenu("Options").addMenuItem("Open hotkey configuration file",1,(function(f6,a16) {
		return function() {
			f6(a16);
		};
	})($bind(tabManagerInstance,tabManagerInstance.openFileInNewTab),js_Node.require("path").join(watchers_SettingsWatcher.pathToFolder,"hotkeys.json")));
	menu_BootstrapMenu.getMenu("Options",90).addMenuItem("Open snippets configuration file",1,(function(f7,a17) {
		return function() {
			f7(a17);
		};
	})($bind(tabManagerInstance,tabManagerInstance.openFileInNewTab),js_Node.require("path").join(watchers_SettingsWatcher.pathToFolder,"snippets.json")));
	menu_BootstrapMenu.getMenu("Options").addMenuItem("Configure Haxe toolkit",100,$bind(classpathWalker,classpathWalker.showHaxeDirectoryDialog));
	menu_BootstrapMenu.getMenu("Edit",2).addMenuItem("Undo",1,function() {
		cm_Editor.editor.execCommand("undo");
	});
	menu_BootstrapMenu.getMenu("Edit").addMenuItem("Redo",1,function() {
		cm_Editor.editor.execCommand("redo");
	});
	menu_BootstrapMenu.getMenu("Edit").addSeparator();
	menu_BootstrapMenu.getMenu("Edit").addMenuItem("Cut",1,function() {
		nodejs_webkit_Clipboard.get().set(cm_Editor.editor.getSelection());
		cm_Editor.editor.replaceSelection("");
	});
	menu_BootstrapMenu.getMenu("Edit").addMenuItem("Copy",1,function() {
		nodejs_webkit_Clipboard.get().set(cm_Editor.editor.getSelection());
	});
	menu_BootstrapMenu.getMenu("Edit").addMenuItem("Paste",1,function() {
		cm_Editor.editor.replaceSelection(nodejs_webkit_Clipboard.get().get());
	});
	menu_BootstrapMenu.getMenu("Edit").addSeparator();
	menu_BootstrapMenu.getMenu("Edit").addMenuItem("Find...",1,function() {
		cm_Editor.editor.execCommand("find");
	});
	menu_BootstrapMenu.getMenu("Edit").addMenuItem("Replace...",1,function() {
		cm_Editor.editor.execCommand("replace");
	});
	var goToLine = core_GoToLine.get();
	menu_BootstrapMenu.getMenu("Navigate",4).addMenuItem("Go to Line",2,$bind(goToLine,goToLine.show),"Ctrl-G");
	menu_BootstrapMenu.getMenu("Navigate").addMenuItem("Open File",3,function() {
		haxe_Timer.delay(function() {
			completionInstance.showFileList();
		},10);
	},"Ctrl-Shift-O");
	menu_BootstrapMenu.getMenu("Navigate").addMenuItem("Go To Declaration",4,function() {
		var goToDeclaration = completion_GoToDeclaration.get();
		goToDeclaration.start();
	},"Ctrl-B");
	menu_BootstrapMenu.getMenu("Source").addMenuItem("Show Class List",4,$bind(completionInstance,completionInstance.showClassList),"Ctrl-Shift-P");
	menu_BootstrapMenu.getMenu("Source").addMenuItem("Show Code Completion",5,function() {
		cm_Editor.triggerCompletion(cm_Editor.editor);
	},"Ctrl-Space");
	menu_BootstrapMenu.getMenu("Source").addMenuItem("Toggle Comment",5,function() {
		cm_Editor.editor.execCommand("toggleComment");
	},"Ctrl-Q");
	menu_BootstrapMenu.getMenu("Source").addMenuItem("Import Class Definition",6,function() {
		var selectedPath = tabManagerInstance.getCurrentDocumentPath();
		if(selectedPath != null) core_ImportDefinition.searchImport(tabManagerInstance.getCurrentDocument().getValue(),selectedPath);
	},"Ctrl-Shift-1");
	menu_BootstrapMenu.getMenu("Project",80).addMenuItem("Run",1,core_RunProject.runProject,"F5");
	menu_BootstrapMenu.getMenu("Project").addMenuItem("Build",2,core_RunProject.buildProject,"F8");
	menu_BootstrapMenu.getMenu("Project").addMenuItem("Clean",3,core_RunProject.cleanProject,"Shift-F8");
	menu_BootstrapMenu.getMenu("Project").addMenuItem("Project Options...",5,function() {
		if(projectaccess_ProjectAccess.path != null) dialogs_DialogManager.showProjectOptions(); else alertify.error("Open or create project first");
	});
};
var core_OutlinePanel = function() {
	this.source = [];
	this.useSorting = false;
	this.addSortButton();
};
$hxClasses["core.OutlinePanel"] = core_OutlinePanel;
core_OutlinePanel.__name__ = ["core","OutlinePanel"];
core_OutlinePanel.get = function() {
	if(core_OutlinePanel.instance == null) core_OutlinePanel.instance = new core_OutlinePanel();
	return core_OutlinePanel.instance;
};
core_OutlinePanel.prototype = {
	useSorting: null
	,sortButton: null
	,outlineOptionsPanel: null
	,addSortButton: function() {
		var _g = this;
		this.outlineOptionsPanel = window.document.createElement("div");
		this.outlineOptionsPanel.setAttribute("class","panelOptionsBar");
		this.outlineOptionsPanel.setAttribute("id","outlineOptionsPanel");
		this.sortButton = bootstrap_ButtonManager.get().createButton("Sort");
		this.sortButton.classList.add("panelOptionsButton");
		this.sortButton.onclick = function(e) {
			e.stopPropagation();
			e.preventDefault();
			if(_g.useSorting) _g.useSorting = false; else _g.useSorting = true;
			core_HaxeLint.updateLinting();
		};
	}
	,source: null
	,update: function() {
		$("#outline").jqxTree({ source : this.source});
		$("#outline").dblclick(function(event) {
			var item = $("#outline").jqxTree("getSelectedItem");
			var value = item.value;
			var cm2 = cm_Editor.editor;
			if(value != null) {
				var pos = cm2.posFromIndex(value.min);
				var pos2 = cm2.posFromIndex(value.max);
				var line = pos.line;
				cm2.centerOnLine(line);
				cm2.focus();
				cm2.setCursor(pos2);
				var highlightRange = cm_HighlightRange.get();
				highlightRange.highlight(cm2,pos,pos2);
			}
		});
		$("#paneloutlineverticalScrollBar").before(this.outlineOptionsPanel);
		$("#outlineOptionsPanel").append(this.sortButton);
	}
	,addField: function(item) {
		this.source.push(item);
	}
	,clearFields: function() {
		this.source = [];
	}
	,__class__: core_OutlinePanel
};
var nodejs_webkit_Window = require("nw.gui").Window;
var core_PreserveWindowState = function() { };
$hxClasses["core.PreserveWindowState"] = core_PreserveWindowState;
core_PreserveWindowState.__name__ = ["core","PreserveWindowState"];
core_PreserveWindowState.init = function() {
	core_PreserveWindowState.initWindowState();
	core_PreserveWindowState.window.on("maximize",function() {
		core_PreserveWindowState.isMaximizationEvent = true;
		core_PreserveWindowState.currWinMode = "maximized";
	});
	core_PreserveWindowState.window.on("unmaximize",function() {
		core_PreserveWindowState.currWinMode = "normal";
		core_PreserveWindowState.restoreWindowState();
	});
	core_PreserveWindowState.window.on("minimize",function() {
		core_PreserveWindowState.currWinMode = "minimized";
	});
	core_PreserveWindowState.window.on("restore",function() {
		core_PreserveWindowState.currWinMode = "normal";
	});
	core_PreserveWindowState.window.window.addEventListener("resize",function(e) {
		if(core_PreserveWindowState.resizeTimeout != null) core_PreserveWindowState.resizeTimeout.stop();
		core_PreserveWindowState.resizeTimeout = new haxe_Timer(500);
		core_PreserveWindowState.resizeTimeout.run = function() {
			if(core_PreserveWindowState.isMaximizationEvent) core_PreserveWindowState.isMaximizationEvent = false; else if(core_PreserveWindowState.currWinMode == "maximized") core_PreserveWindowState.currWinMode = "normal";
			core_PreserveWindowState.resizeTimeout.stop();
			core_PreserveWindowState.dumpWindowState();
		};
	},false);
	core_PreserveWindowState.window.on("close",function(e1) {
		core_PreserveWindowState.saveWindowState();
		core_PreserveWindowState.window.close(true);
	});
};
core_PreserveWindowState.initWindowState = function() {
	var windowState = js_Browser.getLocalStorage().getItem("windowState");
	if(windowState != null) core_PreserveWindowState.winState = js_Node.parse(windowState);
	if(core_PreserveWindowState.winState != null) {
		core_PreserveWindowState.currWinMode = core_PreserveWindowState.winState.mode;
		if(core_PreserveWindowState.currWinMode == "maximized") core_PreserveWindowState.window.maximize(); else core_PreserveWindowState.restoreWindowState();
	} else {
		core_PreserveWindowState.currWinMode = "normal";
		core_PreserveWindowState.dumpWindowState();
	}
};
core_PreserveWindowState.dumpWindowState = function() {
	if(core_PreserveWindowState.winState == null) core_PreserveWindowState.winState = { };
	if(core_PreserveWindowState.currWinMode == "maximized") core_PreserveWindowState.winState.mode = "maximized"; else core_PreserveWindowState.winState.mode = "normal";
	if(core_PreserveWindowState.currWinMode == "normal") {
		core_PreserveWindowState.winState.x = core_PreserveWindowState.window.x;
		core_PreserveWindowState.winState.y = core_PreserveWindowState.window.y;
		core_PreserveWindowState.winState.width = core_PreserveWindowState.window.width;
		core_PreserveWindowState.winState.height = core_PreserveWindowState.window.height;
	}
};
core_PreserveWindowState.restoreWindowState = function() {
	var x = core_PreserveWindowState.winState.x;
	var y = core_PreserveWindowState.winState.y;
	core_PreserveWindowState.window.resizeTo(core_PreserveWindowState.winState.width,core_PreserveWindowState.winState.height);
	core_PreserveWindowState.window.moveTo(x,y);
};
core_PreserveWindowState.saveWindowState = function() {
	core_PreserveWindowState.dumpWindowState();
	js_Browser.getLocalStorage().setItem("windowState",js_Node.stringify(core_PreserveWindowState.winState));
};
var core_ProcessHelper = function() {
};
$hxClasses["core.ProcessHelper"] = core_ProcessHelper;
core_ProcessHelper.__name__ = ["core","ProcessHelper"];
core_ProcessHelper.get = function() {
	if(core_ProcessHelper.instance == null) core_ProcessHelper.instance = new core_ProcessHelper();
	return core_ProcessHelper.instance;
};
core_ProcessHelper.prototype = {
	processStdout: null
	,processStderr: null
	,runProcess: function(process,params,path,onComplete,onFailed) {
		var command = this.processParamsToCommand(process,params);
		var options = { };
		if(path != null) options.cwd = path;
		var process1 = js_Node.require("child_process").exec(command,options,function(error,stdout,stderr) {
			if(error == null) onComplete(stdout,stderr); else if(onFailed != null) onFailed(error.code,stdout,stderr);
		});
		return process1;
	}
	,runProcessAndPrintOutputToConsole: function(process,params,cwd,onComplete) {
		var _g = this;
		var command = this.processParamsToCommand(process,params);
		$("#outputTab").click();
		var textarea;
		textarea = js_Boot.__cast(window.document.getElementById("outputTextArea") , HTMLTextAreaElement);
		textarea.value = "Build started\n";
		textarea.value += command + "\n";
		this.clearErrors();
		var process1 = this.runPersistentProcess(process,params,cwd,function(code,stdout,stderr) {
			_g.processOutput(code,_g.processStdout,_g.processStderr,onComplete);
		});
		return process1;
	}
	,clearErrors: function() {
		var div;
		div = js_Boot.__cast(window.document.getElementById("errors") , HTMLDivElement);
		while(div.lastChild != null) div.removeChild(div.lastChild);
	}
	,processOutput: function(code,stdout,stderr,onComplete) {
		var textarea;
		textarea = js_Boot.__cast(window.document.getElementById("outputTextArea") , HTMLTextAreaElement);
		if(StringTools.trim(stdout) != "") {
			textarea.value += "stdout:\n" + stdout;
			haxe_Log.trace("stdout:\n" + stdout,{ fileName : "ProcessHelper.hx", lineNumber : 120, className : "core.ProcessHelper", methodName : "processOutput"});
		}
		core_HaxeLint.fileData = new haxe_ds_StringMap();
		var switchToResultsTab = false;
		if(stderr != "") {
			var lines = stderr.split("\n");
			var _g = 0;
			while(_g < lines.length) {
				var line = lines[_g];
				++_g;
				line = StringTools.trim(line);
				if(line.indexOf("Error:") == 0) {
					alertify.error(line);
					if(line.indexOf("unknown option `-python'") != -1) alertify.log("You may need to install latest version of Haxe to compile to Python target","",10000);
				} else if(line.indexOf(":") != 0) {
					var args = line.split(":");
					if(args.length > 3) {
						var relativePath = args[0];
						var fullPath = [js_Node.require("path").join(projectaccess_ProjectAccess.path,relativePath)];
						if(!core_HaxeLint.fileData.exists(fullPath[0])) core_HaxeLint.fileData.set(fullPath[0],[]);
						var data = core_HaxeLint.fileData.get(fullPath[0]);
						core_HaxeLint.fileData.set(fullPath[0],data);
						var lineNumber = [Std.parseInt(args[1]) - 1];
						var charsData = null;
						if(args[2].indexOf(" ") != -1) {
							var data1 = StringTools.trim(args[2]).split(" ");
							if(data1.length > 1 && data1[1].indexOf("-") != -1) charsData = data1[1].split("-");
						}
						if(charsData != null) {
							var start = Std.parseInt(charsData[0]);
							var end = Std.parseInt(charsData[1]);
							var message = "";
							var _g2 = 3;
							var _g1 = args.length;
							while(_g2 < _g1) {
								var i = _g2++;
								message += args[i];
								if(i != args.length - 1) message += ":";
							}
							var tabManagerInstance = [tabmanager_TabManager.get()];
							var a;
							var _this = window.document;
							a = _this.createElement("a");
							a.href = "#";
							a.className = "list-group-item";
							a.innerText = line;
							a.onclick = (function(tabManagerInstance,lineNumber,fullPath) {
								return function(e) {
									tabManagerInstance[0].openFileInNewTab(fullPath[0],true,(function(lineNumber) {
										return function() {
											var cm1 = cm_Editor.editor;
											cm1.centerOnLine(lineNumber[0]);
										};
									})(lineNumber));
								};
							})(tabManagerInstance,lineNumber,fullPath);
							$("#errors").append(a);
							var info = { from : { line : lineNumber[0], ch : start}, to : { line : lineNumber[0], ch : end}, message : message, severity : "error"};
							data.push(info);
							switchToResultsTab = true;
							tabManagerInstance[0].openFileInNewTab(fullPath[0],false);
						}
					}
				}
				var lib = null;
				var ereg = new EReg("haxelib install ([^']+)","gim");
				if(ereg.match(line)) lib = ereg.matched(1);
				var ereg2 = new EReg("library ([^ ]+) is not installed","gim");
				if(ereg2.match(line)) lib = ereg2.matched(1);
				if(lib != null) {
					var pathToHxml = projectaccess_ProjectAccess.getPathToHxml();
					dialogs_DialogManager.showInstallHaxelibDialog(lib,pathToHxml);
				}
			}
			textarea.value += "stderr:\n" + stderr;
			haxe_Log.trace("stderr:\n" + stderr,{ fileName : "ProcessHelper.hx", lineNumber : 245, className : "core.ProcessHelper", methodName : "processOutput"});
		}
		if(code == 0) {
			alertify.success("Build complete!");
			textarea.value += "Build complete\n";
			if(onComplete != null) onComplete();
			$("#buildStatus").fadeIn(250);
		} else {
			if(switchToResultsTab) $("#resultsTab").click();
			alertify.error("Build failed");
			textarea.value += "Build failed (exit code: " + (code == null?"null":"" + code) + ")\n";
			$("#buildStatus").fadeOut(250);
		}
		core_HaxeLint.updateLinting();
	}
	,runPersistentProcess: function(process,params,cwd,onClose,redirectToOutput) {
		if(redirectToOutput == null) redirectToOutput = false;
		var _g = this;
		var textarea;
		textarea = js_Boot.__cast(window.document.getElementById("outputTextArea") , HTMLTextAreaElement);
		this.processStdout = "";
		this.processStderr = "";
		var process1 = js_Node.require("child_process").spawn(process,params,{ cwd : cwd});
		process1.stdout.setEncoding("utf8");
		process1.stdout.on("data",function(data) {
			_g.processStdout += data;
			if(redirectToOutput) {
				textarea.value += data;
				textarea.scrollTop = textarea.scrollHeight;
			}
		});
		process1.stderr.setEncoding("utf8");
		process1.stderr.on("data",function(data1) {
			_g.processStderr += data1;
			if(redirectToOutput) {
				textarea.value += data1;
				textarea.scrollTop = textarea.scrollHeight;
			}
		});
		process1.on("error",function(e) {
			haxe_Log.trace(e,{ fileName : "ProcessHelper.hx", lineNumber : 320, className : "core.ProcessHelper", methodName : "runPersistentProcess"});
		});
		process1.on("close",function(code) {
			haxe_Log.trace(_g.processStdout,{ fileName : "ProcessHelper.hx", lineNumber : 326, className : "core.ProcessHelper", methodName : "runPersistentProcess"});
			haxe_Log.trace(_g.processStderr,{ fileName : "ProcessHelper.hx", lineNumber : 327, className : "core.ProcessHelper", methodName : "runPersistentProcess"});
			if(onClose != null) onClose(code,_g.processStdout,_g.processStderr);
			if(code != 0) process1 = null;
			haxe_Log.trace("started process quit with exit code " + code,{ fileName : "ProcessHelper.hx", lineNumber : 339, className : "core.ProcessHelper", methodName : "runPersistentProcess"});
		});
		return process1;
	}
	,checkProcessInstalled: function(process,params,onComplete) {
		var installed;
		js_Node.require("child_process").exec(this.processParamsToCommand(process,params),{ },function(error,stdout,stderr) {
			if(error == null) installed = true; else {
				haxe_Log.trace(error,{ fileName : "ProcessHelper.hx", lineNumber : 363, className : "core.ProcessHelper", methodName : "checkProcessInstalled"});
				haxe_Log.trace(stdout,{ fileName : "ProcessHelper.hx", lineNumber : 364, className : "core.ProcessHelper", methodName : "checkProcessInstalled"});
				haxe_Log.trace(stderr,{ fileName : "ProcessHelper.hx", lineNumber : 365, className : "core.ProcessHelper", methodName : "checkProcessInstalled"});
				installed = false;
			}
			onComplete(installed);
		});
	}
	,processParamsToCommand: function(process,params) {
		return [process].concat(params).join(" ");
	}
	,__class__: core_ProcessHelper
};
var core_QuickOpen = function() {
	var _this = window.document;
	this.panel = _this.createElement("div");
	this.panel.className = "panel panel-default";
	this.panel.id = "quickOpen";
	var _this1 = window.document;
	this.panelBody = _this1.createElement("div");
	this.panelBody.className = "panel-body";
	this.panel.appendChild(this.panelBody);
	var _this2 = window.document;
	this.div = _this2.createElement("div");
	this.inputGroup = new bootstrap_InputGroup();
	this.inputGroup.getElement().id = "quickOpenInputGroup";
	this.input = this.inputGroup.getInput();
	this.listGroup = new bootstrap_ListGroup();
	this.listGroup.getElement().id = "quickOpenListGroup";
	this.div.appendChild(this.inputGroup.getElement());
	this.div.appendChild(this.listGroup.getElement());
	this.panel.style.display = "none";
	this.panelBody.appendChild(this.div);
	$(window.document.body).append(this.panel);
};
$hxClasses["core.QuickOpen"] = core_QuickOpen;
core_QuickOpen.__name__ = ["core","QuickOpen"];
core_QuickOpen.get = function() {
	if(core_QuickOpen.instance == null) core_QuickOpen.instance = new core_QuickOpen();
	return core_QuickOpen.instance;
};
core_QuickOpen.prototype = {
	div: null
	,panel: null
	,panelBody: null
	,inputGroup: null
	,listGroup: null
	,input: null
	,activeItemIndex: null
	,fileList: null
	,currentList: null
	,show: function(list) {
		this.activeItemIndex = 0;
		this.fileList = completion_Filter.sortFileList(list);
		this.currentList = this.fileList;
		this.input.value = "";
		this.update();
		this.panel.style.display = "";
		this.input.focus();
		this.registerListeners();
	}
	,onKeyUp: function(e) {
		var _g = e.keyCode;
		switch(_g) {
		case 27:
			this.hide();
			break;
		default:
		}
	}
	,onInput: function(e) {
		var _g = this;
		this.activeItemIndex = 0;
		core_Helper.debounce("openfilecompletion",function() {
			var value = StringTools.trim(_g.input.value);
			var values = value.split(" ");
			_g.currentList = _g.fileList;
			var _g1 = 0;
			while(_g1 < values.length) {
				var item = values[_g1];
				++_g1;
				_g.currentList = completion_Filter.filterFiles(_g.currentList,item);
			}
			_g.update();
		},100);
	}
	,onKeyDown: function(e) {
		var _g = e.keyCode;
		switch(_g) {
		case 38:
			e.preventDefault();
			this.activeItemIndex--;
			if(this.activeItemIndex < 0) this.activeItemIndex = this.currentList.length - 1;
			this.makeSureActiveItemVisible();
			break;
		case 40:
			e.preventDefault();
			this.activeItemIndex++;
			if(this.activeItemIndex >= this.currentList.length) this.activeItemIndex = 0;
			this.makeSureActiveItemVisible();
			break;
		case 33:
			e.preventDefault();
			this.activeItemIndex += -5;
			if(this.activeItemIndex < 0) this.activeItemIndex = 0;
			this.makeSureActiveItemVisible();
			break;
		case 34:
			e.preventDefault();
			this.activeItemIndex += 5;
			if(this.activeItemIndex >= this.currentList.length) this.activeItemIndex = this.currentList.length - 1;
			this.makeSureActiveItemVisible();
			break;
		case 35:
			if(!e.shiftKey) {
				e.preventDefault();
				this.activeItemIndex = this.currentList.length - 1;
				this.makeSureActiveItemVisible();
			}
			break;
		case 36:
			if(!e.shiftKey) {
				e.preventDefault();
				this.activeItemIndex = 0;
				this.makeSureActiveItemVisible();
			}
			break;
		case 13:
			e.preventDefault();
			if(this.activeItemIndex < this.currentList.length) this.listGroup.getItems()[this.activeItemIndex].click();
			break;
		}
	}
	,onClick: function(e) {
		this.hide();
	}
	,registerListeners: function() {
		window.document.addEventListener("keyup",$bind(this,this.onKeyUp));
		window.document.addEventListener("click",$bind(this,this.onClick));
		this.input.addEventListener("input",$bind(this,this.onInput));
		this.input.addEventListener("keydown",$bind(this,this.onKeyDown));
	}
	,unregisterListeners: function() {
		window.document.removeEventListener("keyup",$bind(this,this.onKeyUp));
		window.document.removeEventListener("click",$bind(this,this.onClick));
		this.input.removeEventListener("input",$bind(this,this.onInput));
		this.input.removeEventListener("keydown",$bind(this,this.onKeyDown));
	}
	,hide: function() {
		this.panel.style.display = "none";
		this.unregisterListeners();
		var tabManagerInstance = tabmanager_TabManager.get();
		if(tabManagerInstance.selectedPath != null) cm_Editor.editor.focus();
	}
	,update: function() {
		this.listGroup.clear();
		var _g = 0;
		var _g1 = this.currentList;
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			this.listGroup.addItem(item.filename,item.displayText,(function(f,a1) {
				return function() {
					f(a1);
				};
			})($bind(this,this.openFile),item.path));
		}
		this.makeSureActiveItemVisible();
	}
	,makeSureActiveItemVisible: function() {
		var items = this.listGroup.getItems();
		var _g1 = 0;
		var _g = items.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(i != this.activeItemIndex) {
				if(items[i].classList.contains("active")) items[i].classList.remove("active");
			} else if(!items[i].classList.contains("active")) items[i].classList.add("active");
		}
		var container = this.listGroup.getElement();
		if(this.activeItemIndex > 0) {
			var node = items[this.activeItemIndex];
			if(node.offsetTop - node.offsetHeight < container.scrollTop) container.scrollTop = node.offsetTop - 48; else if(node.offsetTop > container.scrollTop + container.clientHeight) container.scrollTop = node.offsetTop - container.clientHeight;
		} else container.scrollTop = 0;
	}
	,openFile: function(path) {
		var tabManagerInstance = tabmanager_TabManager.get();
		if(projectaccess_ProjectAccess.path != null) path = js_Node.require("path").resolve(projectaccess_ProjectAccess.path,path);
		tabManagerInstance.openFileInNewTab(path);
	}
	,__class__: core_QuickOpen
};
var core_RecentProjectsList = function() {
	this.fileList = [];
	this.projectList = [];
	var _g = this;
	var localStorage2 = js_Browser.getLocalStorage();
	if(localStorage2 != null) {
		var recentProjectsData = localStorage2.getItem("recentProjects");
		var recentFilesData = localStorage2.getItem("recentFiles");
		var recentFilesData1 = localStorage2.getItem("recentFiles");
		if(recentProjectsData != null) try {
			this.projectList = tjson_TJSON.parse(recentProjectsData);
		} catch( unknown ) {
			if (unknown instanceof js__$Boot_HaxeError) unknown = unknown.val;
			haxe_Log.trace(unknown,{ fileName : "RecentProjectsList.hx", lineNumber : 52, className : "core.RecentProjectsList", methodName : "new"});
		}
		if(recentFilesData1 != null) try {
			this.fileList = tjson_TJSON.parse(recentFilesData1);
		} catch( unknown1 ) {
			if (unknown1 instanceof js__$Boot_HaxeError) unknown1 = unknown1.val;
			haxe_Log.trace(unknown1,{ fileName : "RecentProjectsList.hx", lineNumber : 64, className : "core.RecentProjectsList", methodName : "new"});
		}
	}
	nodejs_webkit_Window.get().on("close",function() {
		localStorage2.setItem("recentProjects",tjson_TJSON.encode(_g.projectList));
		localStorage2.setItem("recentFiles",tjson_TJSON.encode(_g.fileList));
	});
	this.updateMenu();
	this.updateWelcomeScreen();
	this.updateRecentFileMenu();
};
$hxClasses["core.RecentProjectsList"] = core_RecentProjectsList;
core_RecentProjectsList.__name__ = ["core","RecentProjectsList"];
core_RecentProjectsList.get = function() {
	if(core_RecentProjectsList.instance == null) core_RecentProjectsList.instance = new core_RecentProjectsList();
	return core_RecentProjectsList.instance;
};
core_RecentProjectsList.prototype = {
	projectList: null
	,fileList: null
	,add: function(path) {
		this.addItemToList(this.projectList,path);
		this.updateMenu();
		this.updateWelcomeScreen();
	}
	,addFile: function(path) {
		this.addItemToList(this.fileList,path);
		this.updateRecentFileMenu();
	}
	,addItemToList: function(list,item) {
		if(HxOverrides.indexOf(list,item,0) == -1) {
			if(list.length >= 10) list.pop();
		} else HxOverrides.remove(list,item);
		list.splice(0,0,item);
	}
	,updateMenu: function() {
		var submenu = menu_BootstrapMenu.getMenu("File").getSubmenu("Open Recent Project");
		submenu.clear();
		var _g1 = 0;
		var _g = this.projectList.length;
		while(_g1 < _g) {
			var i = _g1++;
			submenu.addMenuItem(this.projectList[i],i + 1,(function(f,a1) {
				return function() {
					return f(a1);
				};
			})(openproject_OpenProject.openProject,this.projectList[i]));
		}
	}
	,updateWelcomeScreen: function() {
		var _g2 = this;
		var listGroup;
		listGroup = js_Boot.__cast(window.document.getElementById("recentProjectsList") , HTMLDivElement);
		while(listGroup.firstChild != null) listGroup.removeChild(listGroup.firstChild);
		var _g1 = 0;
		var _g = this.projectList.length;
		while(_g1 < _g) {
			var i = [_g1++];
			var a;
			var _this = window.document;
			a = _this.createElement("a");
			a.href = "#";
			a.className = "list-group-item recentProject";
			a.textContent = this.projectList[i[0]];
			a.onclick = (function(i) {
				return function(e) {
					openproject_OpenProject.openProject(_g2.projectList[i[0]]);
				};
			})(i);
			listGroup.appendChild(a);
		}
	}
	,updateRecentFileMenu: function() {
		var submenu = menu_BootstrapMenu.getMenu("File").getSubmenu("Open Recent File");
		submenu.clear();
		var _g1 = 0;
		var _g = this.fileList.length;
		while(_g1 < _g) {
			var i = _g1++;
			var tabManagerInstance = tabmanager_TabManager.get();
			submenu.addMenuItem(this.fileList[i],i + 1,(function(f,a1) {
				return function() {
					f(a1);
				};
			})($bind(tabManagerInstance,tabManagerInstance.openFileInNewTab),this.fileList[i]));
		}
	}
	,__class__: core_RecentProjectsList
};
var core_RunProject = function() { };
$hxClasses["core.RunProject"] = core_RunProject;
core_RunProject.__name__ = ["core","RunProject"];
core_RunProject.cleanProject = function() {
	if(projectaccess_ProjectAccess.path != null) {
		var project = projectaccess_ProjectAccess.currentProject;
		var _g = project.type;
		switch(_g) {
		case 0:
			var pathToHxml = js_Node.require("path").join(projectaccess_ProjectAccess.path,project.targetData[project.target].pathToHxml);
			break;
		case 1:
			core_RunProject.runProcess = core_RunProject.killRunningProcessAndRunNew("haxelib",["run","lime","clean",project.openFLTarget],projectaccess_ProjectAccess.path);
			break;
		case 2:
			var pathToHxml1 = js_Node.require("path").join(projectaccess_ProjectAccess.path,project.main);
			break;
		default:
		}
	} else alertify.error("Open or create project first");
};
core_RunProject.setHxmlAsProjectBuildFile = function(pathToHxml) {
	var success = false;
	var path = pathToHxml;
	var tabManagerInstance = tabmanager_TabManager.get();
	if(path == null) path = tabManagerInstance.getCurrentDocumentPath();
	var extname = js_Node.require("path").extname(path);
	var isHxml = extname == ".hxml";
	if(isHxml) {
		var noproject = projectaccess_ProjectAccess.path == null;
		var pathToProject = js_Node.require("path").basename(path);
		var project = projectaccess_ProjectAccess.currentProject;
		project.type = 2;
		if(noproject) {
			project.main = pathToProject;
			projectaccess_ProjectAccess.path = js_Node.require("path").dirname(path);
		} else project.main = js_Node.require("path").relative(projectaccess_ProjectAccess.path,path);
		projectaccess_ProjectAccess.save(function() {
			if(noproject) openproject_OpenProject.openProject(js_Node.require("path").join(projectaccess_ProjectAccess.path,"project.hide"));
		});
		alertify.success(watchers_LocaleWatcher.getStringSync("Done"));
		success = true;
	} else alertify.error(watchers_LocaleWatcher.getStringSync("Currently selected document is not a hxml file"));
	return success;
};
core_RunProject.runProject = function() {
	core_RunProject.buildProject(null,function() {
		var project = projectaccess_ProjectAccess.currentProject;
		var runActionType;
		var runActionText;
		var _g = project.type;
		switch(_g) {
		case 0:
			var targetData = project.targetData[project.target];
			runActionType = targetData.runActionType;
			runActionText = targetData.runActionText;
			break;
		default:
			runActionType = project.runActionType;
			runActionText = project.runActionText;
		}
		if(runActionType != null) switch(runActionType) {
		case 0:
			var url = runActionText;
			if(core_RunProject.isValidCommand(url)) nodejs_webkit_Shell.openExternal(url);
			break;
		case 1:
			var path = runActionText;
			if(core_RunProject.isValidCommand(path)) js_Node.require("fs").exists(path,function(exists) {
				if(!exists) path = js_Node.require("path").join(projectaccess_ProjectAccess.path,path);
				nodejs_webkit_Shell.openItem(path);
			});
			break;
		case 2:
			var command = runActionText;
			if(core_RunProject.isValidCommand(command)) {
				var params = build_CommandPreprocessor.preprocess(command,projectaccess_ProjectAccess.path).split(" ");
				var $process = params.shift();
				var cwd = projectaccess_ProjectAccess.path;
				core_RunProject.runProcess = core_RunProject.killRunningProcessAndRunNew($process,params,cwd);
				var $window = nodejs_webkit_Window.get();
				$window.on("close",function(e) {
					core_RunProject.killRunProcess();
					$window.close();
				});
			}
			break;
		default:
		} else {
		}
	});
};
core_RunProject.killRunningProcessAndRunNew = function(process,params,cwd) {
	core_RunProject.killRunProcess();
	var processHelper = core_ProcessHelper.get();
	return processHelper.runPersistentProcess(process,params,cwd,null,true);
};
core_RunProject.killRunProcess = function() {
	haxe_Log.trace(core_RunProject.runProcess,{ fileName : "RunProject.hx", lineNumber : 193, className : "core.RunProject", methodName : "killRunProcess"});
	if(core_RunProject.runProcess != null) {
		haxe_Log.trace("kill",{ fileName : "RunProject.hx", lineNumber : 197, className : "core.RunProject", methodName : "killRunProcess"});
		core_RunProject.runProcess.kill();
	}
};
core_RunProject.isValidCommand = function(command) {
	var valid = false;
	if(command != null && StringTools.trim(command) != "") valid = true;
	return valid;
};
core_RunProject.buildProject = function(pathToProject,onComplete) {
	var project;
	if(pathToProject != null) {
		var options = { };
		options.encoding = "utf8";
		var data = js_Node.require("fs").readFileSync(pathToProject,options);
		project = tjson_TJSON.parse(data);
		pathToProject = js_Node.require("path").dirname(pathToProject);
	} else {
		project = projectaccess_ProjectAccess.currentProject;
		pathToProject = projectaccess_ProjectAccess.path;
	}
	core_RunProject.buildSpecifiedProject(project,pathToProject,onComplete);
};
core_RunProject.buildSpecifiedProject = function(project,pathToProject,onComplete) {
	var tabManagerInstance = tabmanager_TabManager.get();
	var projectOptions = projectaccess_ProjectOptions.get();
	var processHelper = core_ProcessHelper.get();
	if(pathToProject == null) alertify.error(watchers_LocaleWatcher.getStringSync("Please open or create project first!")); else tabManagerInstance.saveAll(function() {
		var path = tabManagerInstance.getCurrentDocumentPath();
		var extname = js_Node.require("path").extname(path);
		var buildHxml = extname == ".hxml";
		var dirname = js_Node.require("path").dirname(path);
		var filename = js_Node.require("path").basename(path);
		if(buildHxml || project.type == 2 || project.type == 0 || project.type == 3) {
			var hxmlData;
			if(!buildHxml) {
				dirname = pathToProject;
				var _g = project.type;
				switch(_g) {
				case 2:
					filename = project.main;
					break;
				case 0:
					filename = project.targetData[project.target].pathToHxml;
					break;
				default:
				}
				var options = { };
				options.encoding = "utf8";
				js_Node.require("fs").readFile(js_Node.require("path").join(dirname,filename),options,function(err,data) {
					if(err == null) {
						hxmlData = data;
						build_Hxml.checkHxml(dirname,filename,hxmlData,onComplete);
					} else haxe_Log.trace(err,{ fileName : "RunProject.hx", lineNumber : 288, className : "core.RunProject", methodName : "buildSpecifiedProject"});
				});
			} else {
				hxmlData = cm_Editor.editor.getValue();
				build_Hxml.checkHxml(dirname,filename,hxmlData,onComplete);
			}
		} else {
			projectOptions.updateOpenFLBuildCommand();
			var command = project.buildActionCommand;
			command = build_CommandPreprocessor.preprocess(command,pathToProject);
			var params = build_CommandPreprocessor.preprocess(command,pathToProject).split(" ");
			var $process = params.shift();
			var cwd = projectaccess_ProjectAccess.path;
			processHelper.runProcessAndPrintOutputToConsole($process,params,cwd,onComplete);
		}
	});
};
var core_Splitter = function() {
};
$hxClasses["core.Splitter"] = core_Splitter;
core_Splitter.__name__ = ["core","Splitter"];
core_Splitter.get = function() {
	if(core_Splitter.instance == null) core_Splitter.instance = new core_Splitter();
	return core_Splitter.instance;
};
core_Splitter.prototype = {
	visible: null
	,load: function() {
		this.hide();
	}
	,show: function() {
		if(this.visible == false) {
			this.visible = true;
			$("#mainSplitter").jqxSplitter({ resizable : true});
			$("#mainSplitter").jqxSplitter("expand");
			$("#mainSplitter").jqxSplitter({ showSplitBar : true});
			$("#thirdNested").jqxSplitter({ resizable : true});
			var panels = [{ size : "85%"},{ size : "15%"}];
			panels[0].collapsible = false;
			panels[1].collapsible = true;
			$("#thirdNested").jqxSplitter({ panels : panels});
			$("#thirdNested").jqxSplitter("expand");
			$("#thirdNested").jqxSplitter({ showSplitBar : true});
			$("#annotationRuler").fadeIn(250);
			var welcomeScreen = core_WelcomeScreen.get();
			welcomeScreen.hide();
		}
	}
	,hide: function() {
		this.visible = false;
		var panels = [{ size : 170},{ size : 170}];
		panels[0].collapsible = true;
		panels[1].collapsible = false;
		$("#mainSplitter").jqxSplitter({ panels : panels});
		$("#mainSplitter").jqxSplitter("collapse");
		$("#mainSplitter").jqxSplitter({ resizable : false});
		$("#mainSplitter").jqxSplitter({ showSplitBar : false});
		var panels1 = [{ size : "85%"},{ size : "15%"}];
		panels1[0].collapsible = false;
		panels1[1].collapsible = true;
		$("#thirdNested").jqxSplitter({ panels : panels1});
		$("#thirdNested").jqxSplitter("collapse");
		$("#thirdNested").jqxSplitter({ resizable : false});
		$("#thirdNested").jqxSplitter({ showSplitBar : false});
		$("#annotationRuler").fadeOut(250);
		var tabManagerInstance = tabmanager_TabManager.get();
		if(tabManagerInstance.tabMap != null && tabManagerInstance.tabMap.getTabs().length == 0) {
			var welcomeScreen = core_WelcomeScreen.get();
			welcomeScreen.show();
		}
	}
	,__class__: core_Splitter
};
var core_Utils = function() { };
$hxClasses["core.Utils"] = core_Utils;
core_Utils.__name__ = ["core","Utils"];
core_Utils.prepare = function() {
	var platform = js_Node.require("os").platform();
	core_Utils.os = 3;
	if(platform == "linux") core_Utils.os = 1; else if(platform == "darwin") core_Utils.os = 2; else if(platform.indexOf("win") == 0) core_Utils.os = 0;
	haxe_Log.trace("platform is " + (platform == null?"null":"" + platform),{ fileName : "Utils.hx", lineNumber : 37, className : "core.Utils", methodName : "prepare"});
};
var core_WelcomeScreen = function() {
};
$hxClasses["core.WelcomeScreen"] = core_WelcomeScreen;
core_WelcomeScreen.__name__ = ["core","WelcomeScreen"];
core_WelcomeScreen.get = function() {
	if(core_WelcomeScreen.instance == null) core_WelcomeScreen.instance = new core_WelcomeScreen();
	return core_WelcomeScreen.instance;
};
core_WelcomeScreen.prototype = {
	div: null
	,load: function() {
		this.div = js_Boot.__cast(window.document.getElementById("welcomeScreen") , HTMLDivElement);
		$("#createNewProject").on("click",null,newprojectdialog_NewProjectDialog.show);
		$("#openProject").on("click",null,function() {
			return openproject_OpenProject.openProject(null,true);
		});
		var links = window.document.getElementsByClassName("welcome-screen-link");
		var _g1 = 0;
		var _g = links.length;
		while(_g1 < _g) {
			var i = _g1++;
			var link = [js_Boot.__cast(links.item(i) , HTMLLIElement)];
			link[0].onclick = (function(link) {
				return function(e) {
					var _g3 = 0;
					var _g2 = links.length;
					while(_g3 < _g2) {
						var j = _g3++;
						var link2;
						link2 = js_Boot.__cast(links.item(j) , HTMLLIElement);
						if(link2 != link[0]) {
							link2.classList.remove("active");
							$("#welcomeScreenPage" + Std.string(j + 1)).hide(0);
						} else {
							link2.classList.add("active");
							$("#welcomeScreenPage" + Std.string(j + 1)).fadeIn(250);
						}
					}
				};
			})(link);
		}
		$("#github").on("click",null,function() {
			nodejs_webkit_Shell.openExternal("https://github.com/as3boyan/HIDE");
		});
		$("#as3boyan").on("click",null,function() {
			nodejs_webkit_Shell.openExternal("http://twitter.com/As3Boyan");
		});
	}
	,show: function() {
		$(this.div).fadeIn(250);
	}
	,hide: function() {
		$(this.div).fadeOut(250);
	}
	,__class__: core_WelcomeScreen
};
var dialogs_ModalDialog = function(title) {
	var _g = this;
	var _this = window.document;
	this.modal = _this.createElement("div");
	this.modal.className = "modal fade";
	var dialog;
	var _this1 = window.document;
	dialog = _this1.createElement("div");
	dialog.className = "modal-dialog";
	this.modal.appendChild(dialog);
	var content;
	var _this2 = window.document;
	content = _this2.createElement("div");
	content.className = "modal-content";
	dialog.appendChild(content);
	var _this3 = window.document;
	this.header = _this3.createElement("div");
	this.header.className = "modal-header";
	content.appendChild(this.header);
	this.h4 = js_Boot.__cast(window.document.createElement("h4") , HTMLHeadingElement);
	this.h4.className = "modal-title";
	if(title != null) this.setTitle(title);
	this.header.appendChild(this.h4);
	var _this4 = window.document;
	this.body = _this4.createElement("div");
	this.body.className = "modal-body";
	this.body.style.overflow = "hidden";
	content.appendChild(this.body);
	var _this5 = window.document;
	this.footer = _this5.createElement("div");
	this.footer.className = "modal-footer";
	content.appendChild(this.footer);
	window.addEventListener("keyup",function(e) {
		if(e.keyCode == 27) _g.hide();
	});
	window.document.body.appendChild(this.modal);
};
$hxClasses["dialogs.ModalDialog"] = dialogs_ModalDialog;
dialogs_ModalDialog.__name__ = ["dialogs","ModalDialog"];
dialogs_ModalDialog.prototype = {
	modal: null
	,header: null
	,body: null
	,footer: null
	,h4: null
	,setTitle: function(title) {
		this.h4.textContent = title;
	}
	,getHeader: function() {
		return this.header;
	}
	,getBody: function() {
		return this.body;
	}
	,getFooter: function() {
		return this.footer;
	}
	,getModal: function() {
		return this.modal;
	}
	,show: function() {
		$(this.modal).modal("show");
	}
	,hide: function() {
		$(this.modal).modal("hide");
	}
	,__class__: dialogs_ModalDialog
};
var dialogs_BrowseDirectoryDialog = function(title) {
	var _g = this;
	dialogs_ModalDialog.call(this,title);
	this.inputGroupButton = new bootstrap_InputGroupButton("Browse...");
	this.input = this.inputGroupButton.getInput();
	var browseButton = this.inputGroupButton.getButton();
	browseButton.onclick = function(e) {
		core_FileDialog.openFolder(function(path) {
			_g.input.value = path;
		});
	};
	this.getBody().appendChild(this.inputGroupButton.getElement());
	var buttonManager = bootstrap_ButtonManager.get();
	var okButton = buttonManager.createButton("OK",false,false,true);
	okButton.onclick = function(e1) {
		if(_g.onComplete != null) _g.onComplete(_g.input.value);
	};
	this.getFooter().appendChild(okButton);
	this.getFooter().appendChild(buttonManager.createButton("Cancel",false,true));
};
$hxClasses["dialogs.BrowseDirectoryDialog"] = dialogs_BrowseDirectoryDialog;
dialogs_BrowseDirectoryDialog.__name__ = ["dialogs","BrowseDirectoryDialog"];
dialogs_BrowseDirectoryDialog.__super__ = dialogs_ModalDialog;
dialogs_BrowseDirectoryDialog.prototype = $extend(dialogs_ModalDialog.prototype,{
	onComplete: null
	,input: null
	,inputGroupButton: null
	,setDefaultValue: function(_value) {
		this.input.value = _value;
	}
	,setCallback: function(_onComplete) {
		this.onComplete = _onComplete;
	}
	,__class__: dialogs_BrowseDirectoryDialog
});
var dialogs_BrowseDirectoryWithDownloadButtonDialog = function(title) {
	dialogs_BrowseDirectoryDialog.call(this,title);
	var buttonManager = bootstrap_ButtonManager.get();
	this.downloadButton = buttonManager.createButton("Download");
	this.inputGroupButton.getSpan().appendChild(this.downloadButton);
};
$hxClasses["dialogs.BrowseDirectoryWithDownloadButtonDialog"] = dialogs_BrowseDirectoryWithDownloadButtonDialog;
dialogs_BrowseDirectoryWithDownloadButtonDialog.__name__ = ["dialogs","BrowseDirectoryWithDownloadButtonDialog"];
dialogs_BrowseDirectoryWithDownloadButtonDialog.__super__ = dialogs_BrowseDirectoryDialog;
dialogs_BrowseDirectoryWithDownloadButtonDialog.prototype = $extend(dialogs_BrowseDirectoryDialog.prototype,{
	downloadButton: null
	,setDownloadButtonOptions: function(text,url) {
		this.downloadButton.textContent = text;
		this.downloadButton.onclick = function(e) {
			nodejs_webkit_Shell.openExternal(url);
		};
	}
	,__class__: dialogs_BrowseDirectoryWithDownloadButtonDialog
});
var dialogs_DialogManager = function() { };
$hxClasses["dialogs.DialogManager"] = dialogs_DialogManager;
dialogs_DialogManager.__name__ = ["dialogs","DialogManager"];
dialogs_DialogManager.load = function() {
	dialogs_DialogManager.browseDirectoryDialog = new dialogs_BrowseDirectoryDialog();
	dialogs_DialogManager.browseDirectoryWithDownloadButtonDialog = new dialogs_BrowseDirectoryWithDownloadButtonDialog();
	dialogs_DialogManager.haxelibManagerDialog = new dialogs_HaxelibManagerDialog();
	dialogs_DialogManager.projectOptionsDialog = new dialogs_ProjectOptionsDialog();
	dialogs_DialogManager.installHaxelibDialog = new dialogs_InstallHaxelibDialog();
	dialogs_DialogManager.reloadFileDialogs = [];
};
dialogs_DialogManager.showBrowseFolderDialog = function(title,onComplete,defaultValue,downloadButtonText,downloadButtonURL) {
	if(defaultValue == null) defaultValue = "";
	var dialog = dialogs_DialogManager.browseDirectoryDialog;
	if(downloadButtonText != null && downloadButtonURL != null) {
		dialog = dialogs_DialogManager.browseDirectoryWithDownloadButtonDialog;
		dialogs_DialogManager.browseDirectoryWithDownloadButtonDialog.setDownloadButtonOptions(downloadButtonText,downloadButtonURL);
	}
	dialog.setTitle(title);
	dialog.setCallback(onComplete);
	dialog.setDefaultValue(defaultValue);
	dialog.show();
};
dialogs_DialogManager.showProjectOptions = function() {
	dialogs_DialogManager.projectOptionsDialog.show();
};
dialogs_DialogManager.showInstallHaxelibDialog = function(lib,pathToHxml) {
	dialogs_DialogManager.installHaxelibDialog.setLib(lib);
	dialogs_DialogManager.installHaxelibDialog.setPathToHxml(pathToHxml);
	dialogs_DialogManager.installHaxelibDialog.show();
};
dialogs_DialogManager.showReloadFileDialog = function(path,onConfirm) {
	if(HxOverrides.indexOf(dialogs_DialogManager.reloadFileDialogs,path,0) == -1) {
		alertify.confirm(watchers_LocaleWatcher.getStringSync("File ") + path + watchers_LocaleWatcher.getStringSync(" was changed. Reload?"),function(e) {
			if(e) onConfirm();
			HxOverrides.remove(dialogs_DialogManager.reloadFileDialogs,path);
		});
		dialogs_DialogManager.reloadFileDialogs.push(path);
	}
};
dialogs_DialogManager.hide = function() {
	dialogs_DialogManager.browseDirectoryDialog.hide();
	dialogs_DialogManager.browseDirectoryWithDownloadButtonDialog.hide();
	dialogs_DialogManager.haxelibManagerDialog.hide();
};
var dialogs_HaxelibManagerDialog = function() {
	var _g1 = this;
	dialogs_ModalDialog.call(this,"haxelib manager");
	var inputGroupButton = new bootstrap_InputGroupButton("Search");
	this.getBody().appendChild(inputGroupButton.getElement());
	this.listGroup = new bootstrap_ListGroup();
	this.listGroup.getElement().id = "haxelibsList";
	core_HaxeHelper.getInstalledHaxelibList(function(data) {
		var _g = 0;
		while(_g < data.length) {
			var item = data[_g];
			++_g;
			_g1.listGroup.addItem(item,"");
		}
	});
	this.getBody().appendChild(this.listGroup.getElement());
	window.addEventListener("resize",function(e) {
		_g1.updateSize();
	});
	var buttonManager = bootstrap_ButtonManager.get();
	this.getFooter().appendChild(buttonManager.createButton("OK",false,true,true));
	this.updateSize();
};
$hxClasses["dialogs.HaxelibManagerDialog"] = dialogs_HaxelibManagerDialog;
dialogs_HaxelibManagerDialog.__name__ = ["dialogs","HaxelibManagerDialog"];
dialogs_HaxelibManagerDialog.__super__ = dialogs_ModalDialog;
dialogs_HaxelibManagerDialog.prototype = $extend(dialogs_ModalDialog.prototype,{
	listGroup: null
	,updateSize: function() {
		this.listGroup.getElement().style.height = window.innerHeight / 2 + "px";
	}
	,__class__: dialogs_HaxelibManagerDialog
});
var dialogs_InstallHaxelibDialog = function() {
	var _g = this;
	dialogs_ModalDialog.call(this,"Missing haxelib");
	var form;
	var _this = window.document;
	form = _this.createElement("form");
	form.setAttribute("role","form");
	var inputGroup = new bootstrap_InputGroup();
	inputGroup.getElement().id = "commandInputElement";
	inputGroup.getElement().style.display = "none";
	this.input = inputGroup.getInput();
	this.installLibRadio = new bootstrap_RadioElement("haxelibInstallOptions","installLib","install from haxelib",function() {
		_g.input.value = "haxelib install " + _g.lib;
		_g.input.onchange(null);
		inputGroup.getElement().style.display = "none";
	});
	this.installLibRadio.getInput().checked = true;
	form.appendChild(this.installLibRadio.getElement());
	this.installHxmlLibsRadio = new bootstrap_RadioElement("haxelibInstallOptions","installHxmlLibs","install all libs for hxml from haxelib",function() {
		_g.input.value = "haxelib install " + _g.pathToHxml;
		_g.input.onchange(null);
		inputGroup.getElement().style.display = "none";
	});
	this.installHxmlLibsRadio.getInput().checked = true;
	form.appendChild(this.installHxmlLibsRadio.getElement());
	this.installAllHxmlLibsRadio = new bootstrap_RadioElement("haxelibInstallOptions","installHxmlLibs","install all libs for all hxml from haxelib",function() {
		_g.input.value = "haxelib install all";
		_g.input.onchange(null);
		inputGroup.getElement().style.display = "none";
	});
	this.installAllHxmlLibsRadio.getInput().checked = true;
	form.appendChild(this.installAllHxmlLibsRadio.getElement());
	var installLibFromGitRadio = new bootstrap_RadioElement("haxelibInstallOptions","installLibFromGit","install from git",function() {
		_g.input.value = "haxelib git " + _g.lib + " <git-clone-path> <branch> <subdirectory>";
		_g.input.onchange(null);
		inputGroup.getElement().style.display = "";
	});
	installLibFromGitRadio.getInput().checked = true;
	form.appendChild(installLibFromGitRadio.getElement());
	var installLibFromDevRadio = new bootstrap_RadioElement("haxelibInstallOptions","installLibFromDev","set development directory",function() {
		_g.input.value = "haxelib dev " + _g.lib + " <directory>";
		_g.input.onchange(null);
		inputGroup.getElement().style.display = "";
	});
	installLibFromDevRadio.getInput().checked = true;
	form.appendChild(installLibFromDevRadio.getElement());
	this.getBody().appendChild(form);
	this.getBody().appendChild(inputGroup.getElement());
	var _this1 = window.document;
	this.commandPreviewP = _this1.createElement("p");
	this.commandPreviewP.id = "commandPreviewText";
	this.input.onchange = function(e) {
		_g.commandPreviewP.textContent = "Run command: " + _g.input.value;
	};
	this.getBody().appendChild(this.commandPreviewP);
	var buttonManager = bootstrap_ButtonManager.get();
	var cancelButton = buttonManager.createButton("Cancel",false,true);
	this.getFooter().appendChild(cancelButton);
	var okButton = buttonManager.createButton("OK",false,false,true);
	okButton.onclick = function(e1) {
		alertify.log("Running command: " + _g.input.value);
		var params = StringTools.trim(_g.input.value).split(" ");
		var cwd = projectaccess_ProjectAccess.path;
		var processHelper = core_ProcessHelper.get();
		processHelper.runPersistentProcess(params.shift(),params,cwd,function(code,stdout,stderr) {
			if(code == 0) alertify.success(_g.lib + " install complete(" + _g.input.value + ")."); else {
				alertify.error("Error on running command " + _g.input.value);
				alertify.error(stdout);
				alertify.error(stderr);
			}
		},true);
		_g.hide();
	};
	this.getFooter().appendChild(okButton);
	window.document.addEventListener("keyup",function(e2) {
		if(e2.keyCode == 13 && $(_g.getModal())["is"](":visible")) okButton.click();
	});
};
$hxClasses["dialogs.InstallHaxelibDialog"] = dialogs_InstallHaxelibDialog;
dialogs_InstallHaxelibDialog.__name__ = ["dialogs","InstallHaxelibDialog"];
dialogs_InstallHaxelibDialog.__super__ = dialogs_ModalDialog;
dialogs_InstallHaxelibDialog.prototype = $extend(dialogs_ModalDialog.prototype,{
	lib: null
	,pathToHxml: null
	,input: null
	,installHxmlLibsRadio: null
	,commandPreviewP: null
	,installLibRadio: null
	,installAllHxmlLibsRadio: null
	,setLib: function(name) {
		this.lib = name;
		this.setTitle("Missing \"" + this.lib + "\" haxelib");
	}
	,setPathToHxml: function(path) {
		this.pathToHxml = path;
		if(path != null) {
			this.installHxmlLibsRadio.getInput().disabled = false;
			this.installAllHxmlLibsRadio.getInput().disabled = false;
		} else {
			this.installHxmlLibsRadio.getInput().disabled = true;
			this.installAllHxmlLibsRadio.getInput().disabled = true;
		}
	}
	,show: function() {
		dialogs_ModalDialog.prototype.show.call(this);
		this.installLibRadio.getInput().checked = true;
		this.input.value = "haxelib install " + this.lib;
		this.input.onchange(null);
	}
	,__class__: dialogs_InstallHaxelibDialog
});
var dialogs_ProjectOptionsDialog = function() {
	dialogs_ModalDialog.call(this,"Project Options");
	var projectOptions = projectaccess_ProjectOptions.get();
	var buttonManager = bootstrap_ButtonManager.get();
	this.getBody().appendChild(projectOptions.page);
	this.getFooter().appendChild(buttonManager.createButton("OK",false,true,true));
};
$hxClasses["dialogs.ProjectOptionsDialog"] = dialogs_ProjectOptionsDialog;
dialogs_ProjectOptionsDialog.__name__ = ["dialogs","ProjectOptionsDialog"];
dialogs_ProjectOptionsDialog.__super__ = dialogs_ModalDialog;
dialogs_ProjectOptionsDialog.prototype = $extend(dialogs_ModalDialog.prototype,{
	__class__: dialogs_ProjectOptionsDialog
});
var filetree_FileTree = function() {
};
$hxClasses["filetree.FileTree"] = filetree_FileTree;
filetree_FileTree.__name__ = ["filetree","FileTree"];
filetree_FileTree.get = function() {
	if(filetree_FileTree.instance == null) filetree_FileTree.instance = new filetree_FileTree();
	return filetree_FileTree.instance;
};
filetree_FileTree.updateProjectMainHxml = function() {
	var project = projectaccess_ProjectAccess.currentProject;
	var noproject = projectaccess_ProjectAccess.path == null;
	var main = null;
	var _g = project.type;
	switch(_g) {
	case 0:
		if(!noproject) main = js_Node.require("path").resolve(projectaccess_ProjectAccess.path,project.targetData[project.target].pathToHxml);
		break;
	case 2:
		if(!noproject && project.main != null) main = js_Node.require("path").resolve(projectaccess_ProjectAccess.path,project.main);
		break;
	case 1:
		break;
	default:
	}
	var items = $("#filetree").jqxTree("getItems");
	var _g1 = 0;
	while(_g1 < items.length) {
		var item = items[_g1];
		++_g1;
		var li;
		li = js_Boot.__cast(item.element , HTMLLIElement);
		if(!noproject && main != null && item.value.path == main) li.classList.add("mainHxml"); else li.classList.remove("mainHxml");
	}
};
filetree_FileTree.readDirItems = function(path,onComplete,root) {
	if(root == null) root = false;
	var source = filetree_FileTree.createFolderItem(path,[]);
	source.expanded = true;
	source.items = filetree_FileTree.readDir2(path);
	onComplete(source);
};
filetree_FileTree.readDir2 = function(path) {
	var items = [];
	var pathToFolders = [];
	var pathToFiles = [];
	var fullPath;
	var stat;
	var _g = 0;
	var _g1 = js_Node.require("fs").readdirSync(path);
	while(_g < _g1.length) {
		var pathToItem = _g1[_g];
		++_g;
		if(!watchers_SettingsWatcher.isItemInIgnoreList(pathToItem) && !projectaccess_ProjectAccess.isItemInIgnoreList(pathToItem)) {
			fullPath = js_Node.require("path").join(path,pathToItem);
			stat = js_Node.require("fs").statSync(fullPath);
			if(stat.isDirectory()) pathToFolders.push(fullPath); else if(stat.isFile()) pathToFiles.push(fullPath);
		}
	}
	var type = null;
	type = "folder";
	var item = null;
	var _g2 = 0;
	while(_g2 < pathToFolders.length) {
		var pathToItem1 = pathToFolders[_g2];
		++_g2;
		item = filetree_FileTree.createFolderItem(pathToItem1,[]);
		item.items = [];
		item.items.push({ label : "Loading...", value : pathToItem1});
		items.push(item);
	}
	type = "file";
	var _g3 = 0;
	while(_g3 < pathToFiles.length) {
		var pathToItem2 = pathToFiles[_g3];
		++_g3;
		item = filetree_FileTree.createFileItem(pathToItem2);
		items.push(item);
	}
	return items;
};
filetree_FileTree.createFileItem = function(path) {
	var basename = js_Node.require("path").basename(path);
	var extname = js_Node.require("path").extname(basename);
	var data = { label : basename, value : { path : path, type : "file"}};
	return data;
};
filetree_FileTree.createFolderItem = function(path,items) {
	return { label : js_Node.require("path").basename(path), items : items, value : { path : path, type : "folder"}};
};
filetree_FileTree.prototype = {
	lastProjectName: null
	,lastProjectPath: null
	,contextMenu: null
	,contextMenuCommandsMap: null
	,watcher: null
	,init: function() {
		var _g = this;
		this.contextMenuCommandsMap = new haxe_ds_StringMap();
		this.appendToContextMenu("New File...",function(selectedItem) {
			var path;
			if(selectedItem.value.type == "folder") path = selectedItem.value.path; else path = js_Node.require("path").dirname(selectedItem.value.path);
			alertify.prompt(watchers_LocaleWatcher.getStringSync("Filename:"),function(e,str) {
				if(e) {
					var pathToFile = js_Node.require("path").join(path,str);
					var tabManager = tabmanager_TabManager.get();
					tabManager.createFileInNewTab(pathToFile);
					$("#filetree").jqxTree("addTo",filetree_FileTree.createFileItem(pathToFile),selectedItem.element);
					_g.attachContextMenu();
				}
			},"New.hx");
		});
		this.appendToContextMenu("New Folder...",function(selectedItem1) {
			var path1;
			if(selectedItem1.value.type == "folder") path1 = selectedItem1.value.path; else path1 = js_Node.require("path").dirname(selectedItem1.value.path);
			alertify.prompt("Folder name:",function(e1,str1) {
				if(e1) {
					var dirname = str1;
					if(dirname != null) {
						var pathToFolder = js_Node.require("path").join(path1,dirname);
						js_Node.require("fs").mkdir(pathToFolder,null,function(error) {
							if(error == null) {
								$("#filetree").jqxTree("addTo",{ label : str1, value : { type : "folder", path : pathToFolder}},selectedItem1.element);
								_g.attachContextMenu();
							} else alertify.error(error);
						});
					}
				}
			},"New Folder");
		});
		this.appendToContextMenu("Edit",function(selectedItem2) {
			var tabManager1 = tabmanager_TabManager.get();
			if(selectedItem2.value.type == "file") tabManager1.openFileInNewTab(selectedItem2.value.path); else $("#filetree").jqxTree("expandItem",selectedItem2.element);
		});
		this.appendToContextMenu("Execute",function(selectedItem3) {
			nodejs_webkit_Shell.openItem(selectedItem3.value.path);
		});
		this.appendToContextMenu("Show Item In Folder",function(selectedItem4) {
			nodejs_webkit_Shell.showItemInFolder(selectedItem4.value.path);
		});
		this.appendToContextMenu("Rename...",function(selectedItem5) {
			var path2 = selectedItem5.value.path;
			alertify.prompt(watchers_LocaleWatcher.getStringSync("Please enter new name for ") + path2,function(e2,str2) {
				if(e2) {
					var currentDirectory = js_Node.require("path").dirname(path2);
					js_node_Mv.move(path2,js_Node.require("path").join(currentDirectory,str2),function(error1) {
						if(error1 == null) _g.load(); else alertify.error(error1);
					});
				}
			},js_Node.require("path").basename(path2));
		});
		this.appendToContextMenu("Delete...",function(selectedItem6) {
			var path3 = selectedItem6.value.path;
			var _g1 = selectedItem6.value.type;
			switch(_g1) {
			case "file":
				alertify.confirm(watchers_LocaleWatcher.getStringSync("Remove file ") + path3 + " ?",function(e3) {
					if(e3) js_Node.require("fs").unlink(path3,function(error2) {
						if(error2 == null) {
							$("#filetree").jqxTree("removeItem",selectedItem6.element);
							_g.attachContextMenu();
						} else alertify.error(error2);
					});
				});
				break;
			case "folder":
				alertify.confirm(watchers_LocaleWatcher.getStringSync("Remove folder ") + path3 + " ?",function(e4) {
					if(e4) js_node_Remove.removeAsync(path3,{ },function(error3) {
						if(error3 == null) {
							$("#filetree").jqxTree("removeItem",selectedItem6.element);
							_g.attachContextMenu();
						} else alertify.error(error3);
					});
				});
				break;
			default:
			}
		});
		this.appendToContextMenu("Hide/Unhide All",function(selectedItem7) {
			if(projectaccess_ProjectAccess.path != null) {
				projectaccess_ProjectAccess.currentProject.showHiddenItems = !projectaccess_ProjectAccess.currentProject.showHiddenItems;
				alertify.success(watchers_LocaleWatcher.getStringSync("Hidden Items Visible: ") + Std.string(projectaccess_ProjectAccess.currentProject.showHiddenItems));
				if(!projectaccess_ProjectAccess.currentProject.showHiddenItems) alertify.log("Hidden Items: \n" + Std.string(projectaccess_ProjectAccess.currentProject.hiddenItems));
			}
			_g.load();
		});
		this.appendToContextMenu("Hide/Unhide",function(selectedItem8) {
			if(projectaccess_ProjectAccess.path != null) {
				var path4 = selectedItem8.value.path;
				if(!projectaccess_ProjectAccess.isItemHidden(path4)) {
					projectaccess_ProjectAccess.hideItem(path4);
					$("#filetree").jqxTree("removeItem",selectedItem8.element);
					_g.attachContextMenu();
				} else {
					projectaccess_ProjectAccess.unhideItem(path4);
					_g.load();
				}
			} else $("#filetree").jqxTree("removeItem",selectedItem8.element);
		});
		this.appendToContextMenu("Set As Compile Main",function(selectedItem9) {
			var path5 = selectedItem9.value.path;
			if(core_RunProject.setHxmlAsProjectBuildFile(path5)) {
			}
		});
		this.contextMenu = $("#jqxMenu").jqxMenu({ autoOpenPopup : false, mode : "popup"});
		this.attachContextMenu();
		$(window.document).on("contextmenu",null,function(e5) {
			if($(e5.target).parents(".jqx-tree").length > 0) return false;
			return true;
		});
		$("#jqxMenu").on("itemclick",null,function(event) {
			var item = Lambda.find(_g.contextMenuCommandsMap,function(contextMenuItem) {
				return event.args == contextMenuItem.element;
			});
			item.cb();
		});
		$("#filetree").dblclick(function(event1) {
			var item1 = $("#filetree").jqxTree("getSelectedItem");
			if(item1 != null) {
				var value = item1.value;
				if(value != null && value.type == "file") {
					var tabManager2 = tabmanager_TabManager.get();
					tabManager2.openFileInNewTab(item1.value.path);
				}
			}
		});
		$("#filetree").bind("dragEnd",function(event2) {
			var target = event2.args.originalEvent.target;
			var targetParents = $(target).parents();
			var item2 = null;
			$.each($("#filetree").jqxTree("getItems"),function(index,value1) {
				if(value1.label == event2.args.label && value1.value == event2.args.value) {
					item2 = value1;
					return false;
				}
			});
			if(item2) {
				var parents = $(item2.element).parents("li");
				var path6 = "";
				$.each(parents,function(index1,value2) {
					var item3 = $("#filetree").jqxTree("getItem",value2);
					if(item3.level > 0) path6 = item3.label + "/" + path6;
				});
				var topDirectory = $("#filetree").jqxTree("getItems")[0].value.path;
				var selectedItem10 = $("#filetree").jqxTree("getSelectedItem");
				var previousPath = selectedItem10.value.path;
				var newPath = js_Node.require("path").join(topDirectory,path6,selectedItem10.label);
				js_node_Mv.move(previousPath,newPath,function(error4) {
					if(error4 == null) {
						alertify.success("File were successfully moved to " + newPath);
						selectedItem10.value.path = newPath;
						_g.attachContextMenu();
					} else {
						alertify.error("Can't move file from " + previousPath + " to " + newPath);
						_g.load();
					}
				});
			}
		});
	}
	,appendToContextMenu: function(name,onClick) {
		var li;
		var _this = window.document;
		li = _this.createElement("li");
		li.textContent = name;
		$("#filetreemenu").append(li);
		var contextMenuItem = { };
		contextMenuItem.cb = function() {
			var selectedItem = $("#filetree").jqxTree("getSelectedItem");
			if(selectedItem != null) onClick(selectedItem);
		};
		contextMenuItem.element = li;
		this.contextMenuCommandsMap.set(name,contextMenuItem);
	}
	,attachContextMenu: function() {
		var _g = this;
		$("#filetree li").on("mousedown",null,function(event) {
			var target = $(event.target).parents("li:first")[0];
			var rightClick = _g.isRightClick(event);
			if(rightClick && target != null) {
				$("#filetree").jqxTree("selectItem",target);
				var scrollTop = $(window).scrollTop();
				var scrollLeft = $(window).scrollLeft();
				var selectedItem = $("#filetree").jqxTree("getSelectedItem");
				var extname = js_Node.require("path").extname(selectedItem.value.path);
				var editElement = _g.contextMenuCommandsMap.get("Edit").element;
				if(selectedItem.value.type == "file") editElement.textContent = "Edit"; else if(selectedItem.value.type == "folder") editElement.textContent = "Open Folder";
				var setAsCompileMainelement = _g.contextMenuCommandsMap.get("Set As Compile Main").element;
				if(extname != ".hxml") $(setAsCompileMainelement).hide(); else $(setAsCompileMainelement).show();
				if(projectaccess_ProjectAccess.path != null) {
					var hideUnhideItemElement = _g.contextMenuCommandsMap.get("Hide/Unhide").element;
					if(!projectaccess_ProjectAccess.isItemHidden(selectedItem.value.path)) hideUnhideItemElement.textContent = "Hide"; else hideUnhideItemElement.textContent = "Unhide";
					var showHiddenItemsElement = _g.contextMenuCommandsMap.get("Hide/Unhide All").element;
					if(projectaccess_ProjectAccess.currentProject.showHiddenItems) showHiddenItemsElement.textContent = "Hide All"; else showHiddenItemsElement.textContent = "Unhide All";
				}
				_g.contextMenu.jqxMenu("open",Std.parseInt(event.clientX) + 5 + scrollLeft,Std.parseInt(event.clientY) + 5 + scrollTop);
				return false;
			} else return true;
		});
	}
	,isRightClick: function(event) {
		var rightclick = null;
		if(!event) {
			var event1 = window.event;
		}
		if(event.which) rightclick = event.which == 3; else if(event.button) rightclick = event.button == 2;
		return rightclick;
	}
	,load: function(projectName,path) {
		var _g = this;
		if(projectName == null) projectName = this.lastProjectName;
		if(path == null) path = this.lastProjectPath;
		var filetree1 = $("#filetree");
		filetree1.on("expand",function(event) {
			var label = filetree1.jqxTree("getItem",event.args.element).label;
			var element2 = $(event.args.element);
			var loader = false;
			var loaderItem = null;
			var children = element2.find("ul:first").children();
			$.each(children,function(index,value) {
				var item = filetree1.jqxTree("getItem",value);
				if(item != null && item.label == "Loading...") {
					loaderItem = item;
					loader = true;
					return false;
				}
			});
			if(loader) {
				var pathToItem = loaderItem.value;
				var items = filetree_FileTree.readDir2(pathToItem);
				filetree1.jqxTree("addTo",items,element2[0]);
				filetree1.jqxTree("removeItem",loaderItem.element);
				_g.attachContextMenu();
			}
		});
		filetree_FileTree.readDirItems(path,function(source) {
			$("#filetree").jqxTree({ source : [source]});
			_g.attachContextMenu();
		},true);
		if(this.watcher != null) {
			this.watcher.close();
			this.watcher = null;
		}
		var classpathWalker = parser_ClasspathWalker.get();
		var config = { path : path, listener : function(changeType,filePath,fileCurrentStat,filePreviousStat) {
			switch(changeType) {
			case "create":
				js_Node.require("fs").stat(filePath,function(error,stat) {
					if(error == null) {
						if(stat.isFile()) {
							if(changeType == "create") classpathWalker.addFile(filePath); else classpathWalker.removeFile(filePath);
						} else if(stat.isDirectory()) {
							haxe_Log.trace("stat.isDirectory()",{ fileName : "FileTree.hx", lineNumber : 633, className : "filetree.FileTree", methodName : "load", customParams : [changeType,filePath]});
							haxe_Log.trace(changeType,{ fileName : "FileTree.hx", lineNumber : 634, className : "filetree.FileTree", methodName : "load"});
							haxe_Log.trace(filePath,{ fileName : "FileTree.hx", lineNumber : 635, className : "filetree.FileTree", methodName : "load"});
						}
					} else haxe_Log.trace("error->",{ fileName : "FileTree.hx", lineNumber : 641, className : "filetree.FileTree", methodName : "load", customParams : [error]});
				});
				break;
			case "delete":
				if(js_Node.require("path").extname(filePath) != "") classpathWalker.removeFile(filePath);
				break;
			default:
			}
		}};
		config.interval = 3000;
		this.watcher = Watchr.watch(config);
		this.lastProjectName = projectName;
		this.lastProjectPath = path;
		filetree_FileTree.updateProjectMainHxml();
	}
	,__class__: filetree_FileTree
};
var flambeproject_CreateFlambeProject = function() { };
$hxClasses["flambeproject.CreateFlambeProject"] = flambeproject_CreateFlambeProject;
flambeproject_CreateFlambeProject.__name__ = ["flambeproject","CreateFlambeProject"];
flambeproject_CreateFlambeProject.createProject = function(__data,__callback) {
	var pathToProject = js_Node.require("path").join(__data.projectLocation,__data.projectName);
	flambeproject_FlambeAlert.action();
	alertify.log("Running command: flambe new ");
	var processHelper = core_ProcessHelper.get();
	var localComplete = function(__stdout,__stderr) {
		flambeproject_CreateFlambeProject.onNewFlambeComplete(__stdout,__stderr);
		__callback();
	};
	processHelper.runProcess("flambe",["new",pathToProject],__data.projectLocation,localComplete,flambeproject_CreateFlambeProject.onNewFlambeFail);
};
flambeproject_CreateFlambeProject.onNewFlambeComplete = function(__stdout,__stderr) {
	haxe_Log.trace("onNewFlambeComplete",{ fileName : "CreateFlambeProject.hx", lineNumber : 33, className : "flambeproject.CreateFlambeProject", methodName : "onNewFlambeComplete"});
	flambeproject_CreateFlambeProject.parseYaml(function(success) {
		flambeproject_CreateFlambeProject.stdAlert(alertify.success,__stdout,__stderr);
	});
};
flambeproject_CreateFlambeProject.onNewFlambeFail = function(__code,__stdout,__stderr) {
	haxe_Log.trace("onNewFlambeFail",{ fileName : "CreateFlambeProject.hx", lineNumber : 42, className : "flambeproject.CreateFlambeProject", methodName : "onNewFlambeFail"});
	flambeproject_CreateFlambeProject.stdAlert(alertify.error,__stdout,__stderr);
};
flambeproject_CreateFlambeProject.stdAlert = function(__function,__stdout,__stderr) {
	if(__stdout != "") __function("stdout:\n" + __stdout);
	if(__stderr != "") __function("stderr:\n" + __stderr);
};
flambeproject_CreateFlambeProject.parseYaml = function(__calback) {
	flambeproject_FlambeYamlParser.get().openFile(__calback);
};
var flambeproject_FlambeAlert = function() { };
$hxClasses["flambeproject.FlambeAlert"] = flambeproject_FlambeAlert;
flambeproject_FlambeAlert.__name__ = ["flambeproject","FlambeAlert"];
flambeproject_FlambeAlert.creteCSS = function() {
	var cssStyleSheet = window.document.createElement("style");
	cssStyleSheet.innerText = ".alertify-log-" + "doing" + " {\tcolor: #0eb5b5;\t\tbackground: #a0dede;\t\tborder: 1px solid #c6e9e9;\t}";
	window.document.head.appendChild(cssStyleSheet);
};
flambeproject_FlambeAlert.action = function() {
	alertify.log("Doing...","doing");
};
var flambeproject_FlambeBuild = function() { };
$hxClasses["flambeproject.FlambeBuild"] = flambeproject_FlambeBuild;
flambeproject_FlambeBuild.__name__ = ["flambeproject","FlambeBuild"];
flambeproject_FlambeBuild.buildDebug = function() {
	flambeproject_FlambeAlert.action();
	flambeproject_FlambeBuild.runFlambeProcess(["build","--debug"]);
	flambeproject_FlambeBuild.lastAction = flambeproject_FlambeBuild.buildDebug;
};
flambeproject_FlambeBuild.runBuild = function() {
	flambeproject_FlambeAlert.action();
	flambeproject_FlambeBuild.runFlambeProcess(["run","--debug","--no-build"]);
	flambeproject_FlambeBuild.lastAction = flambeproject_FlambeBuild.runBuild;
};
flambeproject_FlambeBuild.runServer = function() {
	flambeproject_FlambeBuild.output = window.document.getElementById("output");
	flambeproject_FlambeBuild.output.click();
	flambeproject_FlambeBuild.output.innerText = "Running...";
	flambeproject_FlambeAlert.action();
	var processHelper = core_ProcessHelper.get();
	if(flambeproject_FlambeBuild.serverNodeChildProcess != null) {
		flambeproject_FlambeBuild.serverNodeChildProcess.stderr.destroy();
		flambeproject_FlambeBuild.serverNodeChildProcess.stderr.destroy();
		flambeproject_FlambeBuild.serverNodeChildProcess.kill();
	}
	flambeproject_FlambeBuild.serverNodeChildProcess = js_Node.require("child_process").spawn("cmd.exe",["/s","/C","flambe","server"],{ cwd : projectaccess_ProjectAccess.path});
	flambeproject_FlambeBuild.serverNodeChildProcess.stdout.setEncoding("utf8");
	flambeproject_FlambeBuild.serverNodeChildProcess.stderr.setEncoding("utf8");
	flambeproject_FlambeBuild.serverNodeChildProcess.stdout.on("data",function(data) {
		if(data.indexOf("Serving on") != -1) flambeproject_FlambeBuild.stdAlert(alertify.success,data == null?"null":"" + data,""); else haxe_Log.trace("Server ->",{ fileName : "FlambeBuild.hx", lineNumber : 85, className : "flambeproject.FlambeBuild", methodName : "runServer", customParams : [data == null?"null":"" + data]});
	});
	flambeproject_FlambeBuild.serverNodeChildProcess.stderr.on("data",function(data1) {
		flambeproject_FlambeBuild.stdAlert(alertify.error,"",data1);
	});
	flambeproject_FlambeBuild.serverNodeChildProcess.on("close",function(data2) {
		alertify.error("Server close:" + data2);
		flambeproject_FlambeBuild.output.innerText += "Server close:" + data2;
	});
	flambeproject_FlambeBuild.lastAction = flambeproject_FlambeBuild.runServer;
};
flambeproject_FlambeBuild.buildDebugAnRun = function() {
	flambeproject_FlambeBuild.runFlambeProcess(["run","--debug"]);
	flambeproject_FlambeBuild.lastAction = flambeproject_FlambeBuild.buildDebugAnRun;
};
flambeproject_FlambeBuild.runFlambeProcess = function(params,onComplete,onFailed) {
	flambeproject_FlambeBuild.output = window.document.getElementById("output");
	flambeproject_FlambeBuild.output.click();
	$("#buildStatus").fadeOut(250);
	haxe_Log.trace("Pre",{ fileName : "FlambeBuild.hx", lineNumber : 123, className : "flambeproject.FlambeBuild", methodName : "runFlambeProcess", customParams : [params]});
	if(flambeproject_FlambeBuild.enableFlashTarget == true) params.splice(1,0,"flash");
	if(flambeproject_FlambeBuild.enabledHtmlTarget == true) params.splice(1,0,"html");
	if(flambeproject_FlambeBuild.enabledFirefoxTarget == true) params.splice(1,0,"firefox");
	if(flambeproject_FlambeBuild.enabledAndroidTarget == true) params.splice(1,0,"android");
	haxe_Log.trace("Pos",{ fileName : "FlambeBuild.hx", lineNumber : 141, className : "flambeproject.FlambeBuild", methodName : "runFlambeProcess", customParams : [params]});
	var processHelper = core_ProcessHelper.get();
	return processHelper.runProcess("flambe",params,projectaccess_ProjectAccess.path,onComplete == null?flambeproject_FlambeBuild.onProcessComplete:onComplete,onFailed == null?flambeproject_FlambeBuild.onProcessFail:onFailed);
};
flambeproject_FlambeBuild.openWiki = function() {
	flambeproject_FlambeAlert.action();
	HIDE.openPageInNewWindow(null,"https://github.com/markknol/flambe-guide/wiki/",{ toolbar : false});
};
flambeproject_FlambeBuild.activeFirefox = function(menuItem) {
	flambeproject_FlambeBuild.enabledFirefoxTarget = menuItem.checked;
};
flambeproject_FlambeBuild.activeHtml = function(menuItem) {
	flambeproject_FlambeBuild.enabledHtmlTarget = menuItem.checked;
};
flambeproject_FlambeBuild.activeFlash = function(menuItem) {
	flambeproject_FlambeBuild.enableFlashTarget = menuItem.checked;
};
flambeproject_FlambeBuild.activeAndroid = function(menuItem) {
	flambeproject_FlambeBuild.enabledAndroidTarget = menuItem.checked;
};
flambeproject_FlambeBuild.onProcessComplete = function(__stdout,__stderr) {
	flambeproject_FlambeBuild.stdAlert(alertify.success,__stdout,__stderr);
};
flambeproject_FlambeBuild.onProcessFail = function(__code,__stdout,__stderr) {
	flambeproject_FlambeBuild.stdAlert(alertify.error,__stdout,__stderr);
};
flambeproject_FlambeBuild.stdAlert = function(__function,__stdout,__stderr) {
	flambeproject_FlambeBuild.output.innerText = "";
	if(__stdout.length > 0) flambeproject_FlambeBuild.successResultAlert(__function,__stdout);
	if(__stderr.length > 0) flambeproject_FlambeBuild.errorResultAlert(__function,__stderr);
	if(__stdout.length == 0 && __stderr.length == 0) flambeproject_FlambeBuild.unknownErrorResultAlert(__function);
};
flambeproject_FlambeBuild.successResultAlert = function(alertFunction,stdout) {
	$("#buildStatus").fadeIn(250);
	flambeproject_FlambeBuild.retriesMax = 10;
	flambeproject_FlambeBuild.output.innerText += "Success:\n\t" + stdout;
	alertFunction(stdout);
};
flambeproject_FlambeBuild.errorResultAlert = function(alertFunction,stderr) {
	alertFunction("Error:\n" + stderr);
	if(stderr.indexOf("Development server not found") != -1) {
		flambeproject_FlambeBuild.output.innerText = "Run Server\n";
		var delay = new haxe_Timer(300);
		delay.run = function() {
			delay.stop();
			flambeproject_FlambeBuild.runServer();
		};
	}
	flambeproject_FlambeBuild.retriesMax = 10;
	flambeproject_FlambeBuild.output.innerText += "Error:\n\t" + stderr;
};
flambeproject_FlambeBuild.unknownErrorResultAlert = function(alertFunction) {
	flambeproject_FlambeBuild.output.innerText = "Error:\n\t" + "unknown error";
	alertFunction("Error:\n" + "unknown error");
	if(flambeproject_FlambeBuild.lastAction != null) {
		flambeproject_FlambeBuild.retriesMax--;
		if(flambeproject_FlambeBuild.retriesMax > 0) {
			flambeproject_FlambeBuild.output.innerText += "\nTrying again!" + "(" + flambeproject_FlambeBuild.retriesMax + ")";
			var delay = new haxe_Timer(300);
			delay.run = function() {
				delay.stop();
				flambeproject_FlambeBuild.lastAction();
			};
		} else {
			flambeproject_FlambeBuild.lastAction = null;
			flambeproject_FlambeBuild.retriesMax = 10;
		}
	}
};
var flambeproject_FlambeHeaderMenu = function() {
};
$hxClasses["flambeproject.FlambeHeaderMenu"] = flambeproject_FlambeHeaderMenu;
flambeproject_FlambeHeaderMenu.__name__ = ["flambeproject","FlambeHeaderMenu"];
flambeproject_FlambeHeaderMenu.get = function() {
	if(flambeproject_FlambeHeaderMenu.instance == null) flambeproject_FlambeHeaderMenu.instance = new flambeproject_FlambeHeaderMenu();
	return flambeproject_FlambeHeaderMenu.instance;
};
flambeproject_FlambeHeaderMenu.prototype = {
	create: function() {
		this.destroy();
		var flambeMenu = menu_BootstrapMenu.getMenu("Flambe");
		var i = 0;
		flambeMenu.addMenuItem("Build and run",++i,flambeproject_FlambeBuild.buildDebugAnRun);
		flambeMenu.addMenuItem("Build",++i,flambeproject_FlambeBuild.buildDebug);
		flambeMenu.addMenuItem("Run",++i,flambeproject_FlambeBuild.runBuild);
		flambeMenu.addMenuItem("Run server",++i,flambeproject_FlambeBuild.runServer);
		flambeMenu.addMenuItem("Wiki",++i,flambeproject_FlambeBuild.openWiki);
		this.createSubMenu(flambeMenu);
		flambeMenu.addMenuItem("HotkeyPanel",++i,($_=new flambeproject_FlambeHotkeyPanel(flambeMenu),$bind($_,$_.show)),"Ctrl-Alt-F");
	}
	,createSubMenu: function(menu) {
		var i = 0;
		var submenu = menu.addSubmenu("Target");
		submenu.addMenuCheckItem("FLASH",++i,flambeproject_FlambeBuild.activeFlash);
		submenu.addMenuCheckItem("HTML",++i,flambeproject_FlambeBuild.activeHtml);
		submenu.addMenuCheckItem("FIREFOX",++i,flambeproject_FlambeBuild.activeFirefox);
		submenu.addMenuCheckItem("ANDROID",++i,flambeproject_FlambeBuild.activeAndroid);
		return submenu;
	}
	,destroy: function() {
		menu_BootstrapMenu.removeMenu("Flambe");
	}
	,__class__: flambeproject_FlambeHeaderMenu
};
var flambeproject_HeaderHotkeyPanel = function(__menu) {
	this.qickHotkeyPanel = flambeproject_QuickHotkeyPanel.get();
	this.menu = __menu;
	this.listGroup = new bootstrap_ListGroup();
};
$hxClasses["flambeproject.HeaderHotkeyPanel"] = flambeproject_HeaderHotkeyPanel;
flambeproject_HeaderHotkeyPanel.__name__ = ["flambeproject","HeaderHotkeyPanel"];
flambeproject_HeaderHotkeyPanel.prototype = {
	qickHotkeyPanel: null
	,menu: null
	,listGroup: null
	,__class__: flambeproject_HeaderHotkeyPanel
};
var flambeproject_FlambeHotkeyPanel = function(__menu) {
	flambeproject_HeaderHotkeyPanel.call(this,__menu);
};
$hxClasses["flambeproject.FlambeHotkeyPanel"] = flambeproject_FlambeHotkeyPanel;
flambeproject_FlambeHotkeyPanel.__name__ = ["flambeproject","FlambeHotkeyPanel"];
flambeproject_FlambeHotkeyPanel.__super__ = flambeproject_HeaderHotkeyPanel;
flambeproject_FlambeHotkeyPanel.prototype = $extend(flambeproject_HeaderHotkeyPanel.prototype,{
	show: function() {
		this.setupList();
		this.qickHotkeyPanel.show("Flambe",this.listGroup,true);
	}
	,setupList: function() {
		this.listGroup.clear();
		var items = this.menu.getItems();
		var item;
		var length = items.length - 3;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			item = items[i];
			this.listGroup.addItem(item.menuItem,Std.string(i + 1),core_Hotkeys.getHotkeyCommandCallback(item.menuItem));
		}
	}
	,__class__: flambeproject_FlambeHotkeyPanel
});
var flambeproject_FlambePage = function() { };
$hxClasses["flambeproject.FlambePage"] = flambeproject_FlambePage;
flambeproject_FlambePage.__name__ = ["flambeproject","FlambePage"];
flambeproject_FlambePage.hide = function() {
	flambeproject_FlambePage.options.style.display = "none";
};
flambeproject_FlambePage.show = function() {
	flambeproject_FlambePage.options.style.display = "";
};
flambeproject_FlambePage.createPage2 = function(page2) {
	flambeproject_FlambePage.textfields = new haxe_ds_StringMap();
	flambeproject_FlambePage.checkboxes = new haxe_ds_StringMap();
	var _this = window.document;
	flambeproject_FlambePage.options = _this.createElement("div");
	flambeproject_FlambePage.options.className = "options flmabe";
	flambeproject_FlambePage.createTextWithCheckbox(page2,"GameName");
	flambeproject_FlambePage.createTextWithCheckbox(page2,"DevName");
	flambeproject_FlambePage.createTextWithCheckbox(page2,"Platform");
	flambeproject_FlambePage.createTextWithCheckbox(page2,"GameID");
	page2.appendChild(flambeproject_FlambePage.options);
};
flambeproject_FlambePage.createTextWithCheckbox = function(_page2,_text) {
	var row;
	var _this = window.document;
	row = _this.createElement("div");
	row.className = "row";
	var inputGroup;
	var _this1 = window.document;
	inputGroup = _this1.createElement("div");
	inputGroup.className = "input-group";
	row.appendChild(inputGroup);
	var inputGroupAddon;
	var _this2 = window.document;
	inputGroupAddon = _this2.createElement("span");
	inputGroupAddon.className = "input-group-addon";
	inputGroup.appendChild(inputGroupAddon);
	var checkbox;
	var _this3 = window.document;
	checkbox = _this3.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = true;
	inputGroupAddon.appendChild(checkbox);
	flambeproject_FlambePage.checkboxes.set(_text + "checkbox",checkbox);
	var text;
	var _this4 = window.document;
	text = _this4.createElement("input");
	text.type = "text";
	text.className = "form-control";
	text.id = _text;
	text.placeholder = watchers_LocaleWatcher.getStringSync(_text);
	flambeproject_FlambePage.textfields.set(_text,text);
	checkbox.onchange = function(e) {
		if(checkbox.checked) text.disabled = false; else text.disabled = true;
	};
	inputGroup.appendChild(text);
	flambeproject_FlambePage.options.appendChild(row);
};
flambeproject_FlambePage.loadData = function() {
	flambeproject_FlambePage.setDefaultData("GameName",flambeproject_FlambePage.textfields);
	flambeproject_FlambePage.setDefaultData("DevName",flambeproject_FlambePage.textfields);
	flambeproject_FlambePage.setDefaultData("Platform",flambeproject_FlambePage.textfields);
	flambeproject_FlambePage.setDefaultData("GameID",flambeproject_FlambePage.textfields);
	flambeproject_FlambePage.setDefaultData("GameName" + "checkbox",flambeproject_FlambePage.checkboxes);
	flambeproject_FlambePage.setDefaultData("DevName" + "checkbox",flambeproject_FlambePage.checkboxes);
	flambeproject_FlambePage.setDefaultData("Platform" + "checkbox",flambeproject_FlambePage.checkboxes);
	flambeproject_FlambePage.setDefaultData("GameID" + "checkbox",flambeproject_FlambePage.checkboxes);
};
flambeproject_FlambePage.setDefaultData = function(__text,__map) {
	var element;
	element = __map_reserved[__text] != null?__map.getReserved(__text):__map.h[__text];
	var value;
	if(element.type == "checkbox") {
		value = js_Browser.getLocalStorage().getItem(__text);
		if(value != null && value != "") element.value = value;
	} else {
		value = js_Browser.getLocalStorage().getItem(__text);
		if(value != null && value != "") element.checked = value;
	}
};
flambeproject_FlambePage.saveData = function(__text,__map) {
	var element;
	element = __map_reserved[__text] != null?__map.getReserved(__text):__map.h[__text];
	var value;
	if(element.type == "checkbox") value = element.checked; else value = element.value;
	if(value != null && value != "") js_Browser.getLocalStorage().setItem(__text,value);
};
flambeproject_FlambePage.saveAllData = function() {
	flambeproject_FlambePage.saveData("GameName",flambeproject_FlambePage.textfields);
	flambeproject_FlambePage.saveData("DevName",flambeproject_FlambePage.textfields);
	flambeproject_FlambePage.saveData("Platform",flambeproject_FlambePage.textfields);
	flambeproject_FlambePage.saveData("GameID",flambeproject_FlambePage.textfields);
	flambeproject_FlambePage.saveData("GameName" + "checkbox",flambeproject_FlambePage.checkboxes);
	flambeproject_FlambePage.saveData("DevName" + "checkbox",flambeproject_FlambePage.checkboxes);
	flambeproject_FlambePage.saveData("Platform" + "checkbox",flambeproject_FlambePage.checkboxes);
	flambeproject_FlambePage.saveData("GameID" + "checkbox",flambeproject_FlambePage.checkboxes);
};
var flambeproject_FlambeProject = function() {
	flambeproject_FlambeAlert.creteCSS();
	newprojectdialog_NewProjectDialog.getCategory("Flambe",3).addItem("Flambe Project",$bind(this,this.createFlambeProject));
	flambeproject_FlambeHeaderMenu.get().destroy();
};
$hxClasses["flambeproject.FlambeProject"] = flambeproject_FlambeProject;
flambeproject_FlambeProject.__name__ = ["flambeproject","FlambeProject"];
flambeproject_FlambeProject.get = function() {
	if(flambeproject_FlambeProject.instance == null) flambeproject_FlambeProject.instance = new flambeproject_FlambeProject();
	return flambeproject_FlambeProject.instance;
};
flambeproject_FlambeProject.prototype = {
	createFlambeProject: function(data) {
		var _g = this;
		this.setupData(data);
		this.runNewFlambe(data,function() {
			_g.openProject(data);
		});
	}
	,setupData: function(__data) {
		var pathToProject = js_Node.require("path").join(__data.projectLocation,__data.projectName);
		var project = new projectaccess_Project();
		project.name = __data.projectName;
		project.projectPackage = __data.projectPackage;
		project.company = __data.projectCompany;
		project.license = __data.projectLicense;
		project.url = __data.projectURL;
		project.type = 3;
		project.target = 3;
		projectaccess_ProjectAccess.path = pathToProject;
		project.runActionType = 2;
		projectaccess_ProjectAccess.currentProject = project;
	}
	,runNewFlambe: function(__data,__callback) {
		flambeproject_CreateFlambeProject.createProject(__data,__callback);
	}
	,openProject: function(__data) {
		var _g = this;
		var path = js_Node.require("path").join(projectaccess_ProjectAccess.path,"project.hide");
		var onOpenProjectHadler = function() {
			openproject_OpenProject.openProject(path);
			var pathToSrc = js_Node.require("path").join(__data.projectLocation,__data.projectName,"src");
			var pathToMain = js_Node.require("path").join(pathToSrc,"urgame","Main.hx");
			var tabManagerInstance = tabmanager_TabManager.get();
			tabManagerInstance.openFileInNewTab(pathToMain,true,$bind(_g,_g.onCompleteOpenProject));
		};
		projectaccess_ProjectAccess.currentProject.main = "urgame" + "/Main.hx";
		projectaccess_ProjectAccess.save(onOpenProjectHadler);
	}
	,onCompleteOpenProject: function(__code) {
		alertify.success("OpenProjectCompleted");
		this.setup();
	}
	,setup: function() {
		flambeproject_FlambeHeaderMenu.get().create();
		flambeproject_FlambeYamlParser.get().openFile();
	}
	,__class__: flambeproject_FlambeProject
};
var flambeproject_FlambeYamlParser = function() {
	this.haxeFlagList = [];
	this.yamlFile = "";
};
$hxClasses["flambeproject.FlambeYamlParser"] = flambeproject_FlambeYamlParser;
flambeproject_FlambeYamlParser.__name__ = ["flambeproject","FlambeYamlParser"];
flambeproject_FlambeYamlParser.get = function() {
	if(flambeproject_FlambeYamlParser.instance == null) flambeproject_FlambeYamlParser.instance = new flambeproject_FlambeYamlParser();
	return flambeproject_FlambeYamlParser.instance;
};
flambeproject_FlambeYamlParser.prototype = {
	yamlFile: null
	,haxeFlagList: null
	,validLines: null
	,mainFile: null
	,openFile: function(calback) {
		var _g = this;
		var file = projectaccess_ProjectAccess.path + "/flambe.yaml";
		var exist = js_Node.require("fs").existsSync(file);
		if(exist == false) {
			calback(false);
			return;
		}
		var openFileHandle = function(file1) {
			_g.yamlFile = file1;
			_g.yamlFile = _g.setStorageText(_g.yamlFile);
			_g.getValidLines(file1);
			_g.getHaxeFlags();
			_g.getMainFile();
			if(calback != null) calback(true);
		};
		tabmanager_TabManager.get().openFile(file,openFileHandle);
	}
	,getValidLines: function(file) {
		this.validLines = [];
		var lines = file.split("\n");
		var currentLine;
		var length = lines.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			currentLine = lines[i];
			if(currentLine.length <= 1 || currentLine.charAt(0) == "#") continue;
			this.validLines[this.validLines.length] = currentLine;
		}
	}
	,getMainFile: function() {
		var lines = this.validLines;
		var currentLine;
		var length = lines.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			currentLine = lines[i];
			var indexOf = currentLine.indexOf("main:");
			if(indexOf == -1) continue;
			this.mainFile = StringTools.replace(currentLine,"main: ","");
			this.mainFile = StringTools.trim(this.mainFile);
			break;
		}
	}
	,getHaxeFlags: function() {
		this.haxeFlagList = [];
		var lines = this.validLines;
		var currentLine;
		var length = lines.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			currentLine = lines[i];
			var indexOf = currentLine.indexOf("haxe_flags");
			if(indexOf == -1) continue;
			this.haxeFlagList.push(StringTools.replace(currentLine,"haxe_flags:",""));
		}
	}
	,setStorageText: function(code) {
		var devNameValue = js_Browser.getLocalStorage().getItem("DevName");
		var gameNameValue = js_Browser.getLocalStorage().getItem("GameName");
		var gameIdValue = js_Browser.getLocalStorage().getItem("GameID");
		var platformValue = js_Browser.getLocalStorage().getItem("Platform");
		if(devNameValue != null && devNameValue != "") code = StringTools.replace(code,"name: Your Company Name","name: " + devNameValue);
		if(gameNameValue != null && gameNameValue != "") code = StringTools.replace(code,"name: Your Game","name: " + gameNameValue);
		if(gameIdValue != null && gameIdValue != "") code = StringTools.replace(code,"id: com.yourdomain.yourgame","id: " + gameIdValue);
		if(platformValue != null && platformValue != "") code = StringTools.replace(code,"default_platform: flash","default_platform: " + platformValue);
		return code;
	}
	,__class__: flambeproject_FlambeYamlParser
};
var flambeproject_QuickHotkeyPanel = function() {
	this.setup();
};
$hxClasses["flambeproject.QuickHotkeyPanel"] = flambeproject_QuickHotkeyPanel;
flambeproject_QuickHotkeyPanel.__name__ = ["flambeproject","QuickHotkeyPanel"];
flambeproject_QuickHotkeyPanel.get = function() {
	if(flambeproject_QuickHotkeyPanel.instance == null) flambeproject_QuickHotkeyPanel.instance = new flambeproject_QuickHotkeyPanel();
	return flambeproject_QuickHotkeyPanel.instance;
};
flambeproject_QuickHotkeyPanel.prototype = {
	div: null
	,panel: null
	,panelBody: null
	,inputGroup: null
	,listGroup: null
	,input: null
	,activeItemIndex: null
	,title: null
	,visible: null
	,setup: function() {
		this.visible = false;
		this.activeItemIndex = 0;
		var _this = window.document;
		this.panel = _this.createElement("div");
		this.panel.className = "panel panel-default";
		this.panel.id = "quickOpen";
		var _this1 = window.document;
		this.panelBody = _this1.createElement("div");
		this.panelBody.className = "panel-body";
		this.panel.appendChild(this.panelBody);
		var _this2 = window.document;
		this.div = _this2.createElement("div");
		this.inputGroup = new bootstrap_InputGroup();
		this.inputGroup.getElement().id = "quickOpenInputGroup";
		this.input = this.inputGroup.getInput();
		this.input.disabled = true;
		this.div.appendChild(this.inputGroup.getElement());
		this.panel.style.display = "none";
		this.panelBody.appendChild(this.div);
		$(window.document.body).append(this.panel);
	}
	,show: function(__title,__listGroup,__enabeAutoAction) {
		var _g = this;
		if(this.visible == true) return;
		this.visible = true;
		this.title = __title;
		this.updateList(__listGroup);
		this.makeSureActiveItemVisible();
		this.input.value = "";
		this.panel.style.display = "";
		this.input.focus();
		var t = new haxe_Timer(300);
		t.run = function() {
			_g.input.disabled = false;
			_g.input.focus();
			_g.registerListeners();
			_g.makeSureActiveItemVisible();
			_g.onInput(null);
			t.stop();
		};
	}
	,updateList: function(__listGroup) {
		this.listGroup = __listGroup;
		this.listGroup.getElement().id = "quickOpenListGroup";
		this.div.appendChild(this.listGroup.getElement());
	}
	,onKeyUp: function(e) {
		var _g = e.keyCode;
		switch(_g) {
		case 27:
			this.hide();
			break;
		default:
		}
	}
	,onInput: function(e) {
		var _g = this;
		this.activeItemIndex = 0;
		core_Helper.debounce("actioncompletion",function() {
			var valueList = StringTools.trim(_g.input.value);
			valueList = valueList.split(" ")[0];
			var value = Std.parseInt(valueList);
			var length = _g.listGroup.length;
			if(value == null || value < 0 || value >= length) return;
			var anchorElementList = _g.listGroup.getItems();
			var anchorElement;
			var paragraphElement;
			var _g1 = 0;
			while(_g1 < length) {
				var i = _g1++;
				anchorElement = anchorElementList[i];
				paragraphElement = anchorElement.getElementsByClassName("list-group-item-text").item(0);
				if(Std.parseInt(paragraphElement.textContent) == value) {
					anchorElement.click();
					_g.hide();
					break;
				}
			}
		},100);
	}
	,onKeyDown: function(e) {
		var _g = e.keyCode;
		switch(_g) {
		case 38:
			e.preventDefault();
			this.activeItemIndex--;
			if(this.activeItemIndex < 0) this.activeItemIndex = this.listGroup.length - 1;
			this.makeSureActiveItemVisible();
			break;
		case 40:
			e.preventDefault();
			this.activeItemIndex++;
			if(this.activeItemIndex >= this.listGroup.length) this.activeItemIndex = 0;
			this.makeSureActiveItemVisible();
			break;
		case 33:
			e.preventDefault();
			this.activeItemIndex += -5;
			if(this.activeItemIndex < 0) this.activeItemIndex = 0;
			this.makeSureActiveItemVisible();
			break;
		case 34:
			e.preventDefault();
			this.activeItemIndex += 5;
			if(this.activeItemIndex >= this.listGroup.length) this.activeItemIndex = this.listGroup.length - 1;
			this.makeSureActiveItemVisible();
			break;
		case 35:
			if(!e.shiftKey) {
				e.preventDefault();
				this.activeItemIndex = this.listGroup.length - 1;
				this.makeSureActiveItemVisible();
			}
			break;
		case 36:
			if(!e.shiftKey) {
				e.preventDefault();
				this.activeItemIndex = 0;
				this.makeSureActiveItemVisible();
			}
			break;
		case 13:
			e.preventDefault();
			this.listGroup.getItems()[this.activeItemIndex].click();
			break;
		}
	}
	,onClick: function(e) {
		this.hide();
	}
	,registerListeners: function() {
		window.document.addEventListener("keyup",$bind(this,this.onKeyUp));
		window.document.addEventListener("click",$bind(this,this.onClick));
		this.input.addEventListener("input",$bind(this,this.onInput));
		this.input.addEventListener("keydown",$bind(this,this.onKeyDown));
	}
	,unregisterListeners: function() {
		window.document.removeEventListener("keyup",$bind(this,this.onKeyUp));
		window.document.removeEventListener("click",$bind(this,this.onClick));
		this.input.removeEventListener("input",$bind(this,this.onInput));
		this.input.removeEventListener("keydown",$bind(this,this.onKeyDown));
	}
	,hide: function() {
		if(this.visible == false) return;
		this.onInput(null);
		this.visible = false;
		this.panel.style.display = "none";
		this.unregisterListeners();
		var tabManagerInstance = tabmanager_TabManager.get();
		if(tabManagerInstance.selectedPath != null) cm_Editor.editor.focus();
		if(this.listGroup != null) this.listGroup.getElement().remove();
		this.input.disabled = true;
		this.input.value = "";
	}
	,makeSureActiveItemVisible: function() {
		var items = this.listGroup.getItems();
		var _g1 = 0;
		var _g = items.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(i != this.activeItemIndex) {
				if(items[i].classList.contains("active")) items[i].classList.remove("active");
			} else if(!items[i].classList.contains("active")) items[i].classList.add("active");
		}
		var container = this.listGroup.getElement();
		if(this.activeItemIndex > 0) {
			var node = items[this.activeItemIndex];
			if(node.offsetTop - node.offsetHeight < container.scrollTop) container.scrollTop = node.offsetTop - 48; else if(node.offsetTop > container.scrollTop + container.clientHeight) container.scrollTop = node.offsetTop - container.clientHeight;
		} else container.scrollTop = 0;
	}
	,__class__: flambeproject_QuickHotkeyPanel
};
var haxe_Json = function() { };
$hxClasses["haxe.Json"] = haxe_Json;
haxe_Json.__name__ = ["haxe","Json"];
haxe_Json.parse = function(jsonString) {
	return JSON.parse(jsonString);
};
var haxe_Log = function() { };
$hxClasses["haxe.Log"] = haxe_Log;
haxe_Log.__name__ = ["haxe","Log"];
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_Resource = function() { };
$hxClasses["haxe.Resource"] = haxe_Resource;
haxe_Resource.__name__ = ["haxe","Resource"];
haxe_Resource.getString = function(name) {
	var _g = 0;
	var _g1 = haxe_Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) return x.str;
			var b = haxe_crypto_Base64.decode(x.data);
			return b.toString();
		}
	}
	return null;
};
var haxe_Serializer = function() {
	this.buf = new StringBuf();
	this.cache = [];
	this.useCache = haxe_Serializer.USE_CACHE;
	this.useEnumIndex = haxe_Serializer.USE_ENUM_INDEX;
	this.shash = new haxe_ds_StringMap();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe_Serializer;
haxe_Serializer.__name__ = ["haxe","Serializer"];
haxe_Serializer.run = function(v) {
	var s = new haxe_Serializer();
	s.serialize(v);
	return s.toString();
};
haxe_Serializer.prototype = {
	buf: null
	,cache: null
	,shash: null
	,scount: null
	,useCache: null
	,useEnumIndex: null
	,toString: function() {
		return this.buf.b;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += "R";
			if(x == null) this.buf.b += "null"; else this.buf.b += "" + x;
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += "y";
		s = encodeURIComponent(s);
		if(s.length == null) this.buf.b += "null"; else this.buf.b += "" + s.length;
		this.buf.b += ":";
		if(s == null) this.buf.b += "null"; else this.buf.b += "" + s;
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0;
		var _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
				if(i == null) this.buf.b += "null"; else this.buf.b += "" + i;
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeFields: function(v) {
		var _g = 0;
		var _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += "g";
	}
	,serialize: function(v) {
		{
			var _g = Type["typeof"](v);
			switch(_g[1]) {
			case 0:
				this.buf.b += "n";
				break;
			case 1:
				var v1 = v;
				if(v1 == 0) {
					this.buf.b += "z";
					return;
				}
				this.buf.b += "i";
				if(v1 == null) this.buf.b += "null"; else this.buf.b += "" + v1;
				break;
			case 2:
				var v2 = v;
				if(isNaN(v2)) this.buf.b += "k"; else if(!isFinite(v2)) if(v2 < 0) this.buf.b += "m"; else this.buf.b += "p"; else {
					this.buf.b += "d";
					if(v2 == null) this.buf.b += "null"; else this.buf.b += "" + v2;
				}
				break;
			case 3:
				if(v) this.buf.b += "t"; else this.buf.b += "f";
				break;
			case 6:
				var c = _g[2];
				if(c == String) {
					this.serializeString(v);
					return;
				}
				if(this.useCache && this.serializeRef(v)) return;
				switch(c) {
				case Array:
					var ucount = 0;
					this.buf.b += "a";
					var l = v.length;
					var _g1 = 0;
					while(_g1 < l) {
						var i = _g1++;
						if(v[i] == null) ucount++; else {
							if(ucount > 0) {
								if(ucount == 1) this.buf.b += "n"; else {
									this.buf.b += "u";
									if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
								}
								ucount = 0;
							}
							this.serialize(v[i]);
						}
					}
					if(ucount > 0) {
						if(ucount == 1) this.buf.b += "n"; else {
							this.buf.b += "u";
							if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
						}
					}
					this.buf.b += "h";
					break;
				case List:
					this.buf.b += "l";
					var v3 = v;
					var _g1_head = v3.h;
					var _g1_val = null;
					while(_g1_head != null) {
						var i1;
						_g1_val = _g1_head[0];
						_g1_head = _g1_head[1];
						i1 = _g1_val;
						this.serialize(i1);
					}
					this.buf.b += "h";
					break;
				case Date:
					var d = v;
					this.buf.b += "v";
					this.buf.add(d.getTime());
					break;
				case haxe_ds_StringMap:
					this.buf.b += "b";
					var v4 = v;
					var $it0 = v4.keys();
					while( $it0.hasNext() ) {
						var k = $it0.next();
						this.serializeString(k);
						this.serialize(__map_reserved[k] != null?v4.getReserved(k):v4.h[k]);
					}
					this.buf.b += "h";
					break;
				case haxe_ds_IntMap:
					this.buf.b += "q";
					var v5 = v;
					var $it1 = v5.keys();
					while( $it1.hasNext() ) {
						var k1 = $it1.next();
						this.buf.b += ":";
						if(k1 == null) this.buf.b += "null"; else this.buf.b += "" + k1;
						this.serialize(v5.h[k1]);
					}
					this.buf.b += "h";
					break;
				case haxe_ds_ObjectMap:
					this.buf.b += "M";
					var v6 = v;
					var $it2 = v6.keys();
					while( $it2.hasNext() ) {
						var k2 = $it2.next();
						var id = Reflect.field(k2,"__id__");
						Reflect.deleteField(k2,"__id__");
						this.serialize(k2);
						k2.__id__ = id;
						this.serialize(v6.h[k2.__id__]);
					}
					this.buf.b += "h";
					break;
				case haxe_io_Bytes:
					var v7 = v;
					var i2 = 0;
					var max = v7.length - 2;
					var charsBuf = new StringBuf();
					var b64 = haxe_Serializer.BASE64;
					while(i2 < max) {
						var b1 = v7.get(i2++);
						var b2 = v7.get(i2++);
						var b3 = v7.get(i2++);
						charsBuf.add(b64.charAt(b1 >> 2));
						charsBuf.add(b64.charAt((b1 << 4 | b2 >> 4) & 63));
						charsBuf.add(b64.charAt((b2 << 2 | b3 >> 6) & 63));
						charsBuf.add(b64.charAt(b3 & 63));
					}
					if(i2 == max) {
						var b11 = v7.get(i2++);
						var b21 = v7.get(i2++);
						charsBuf.add(b64.charAt(b11 >> 2));
						charsBuf.add(b64.charAt((b11 << 4 | b21 >> 4) & 63));
						charsBuf.add(b64.charAt(b21 << 2 & 63));
					} else if(i2 == max + 1) {
						var b12 = v7.get(i2++);
						charsBuf.add(b64.charAt(b12 >> 2));
						charsBuf.add(b64.charAt(b12 << 4 & 63));
					}
					var chars = charsBuf.b;
					this.buf.b += "s";
					if(chars.length == null) this.buf.b += "null"; else this.buf.b += "" + chars.length;
					this.buf.b += ":";
					if(chars == null) this.buf.b += "null"; else this.buf.b += "" + chars;
					break;
				default:
					if(this.useCache) this.cache.pop();
					if(v.hxSerialize != null) {
						this.buf.b += "C";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						v.hxSerialize(this);
						this.buf.b += "g";
					} else {
						this.buf.b += "c";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						this.serializeFields(v);
					}
				}
				break;
			case 4:
				if(js_Boot.__instanceof(v,Class)) {
					var className = Type.getClassName(v);
					this.buf.b += "A";
					this.serializeString(className);
				} else if(js_Boot.__instanceof(v,Enum)) {
					this.buf.b += "B";
					this.serializeString(Type.getEnumName(v));
				} else {
					if(this.useCache && this.serializeRef(v)) return;
					this.buf.b += "o";
					this.serializeFields(v);
				}
				break;
			case 7:
				var e = _g[2];
				if(this.useCache) {
					if(this.serializeRef(v)) return;
					this.cache.pop();
				}
				if(this.useEnumIndex) this.buf.b += "j"; else this.buf.b += "w";
				this.serializeString(Type.getEnumName(e));
				if(this.useEnumIndex) {
					this.buf.b += ":";
					this.buf.b += Std.string(v[1]);
				} else this.serializeString(v[0]);
				this.buf.b += ":";
				var l1 = v.length;
				this.buf.b += Std.string(l1 - 2);
				var _g11 = 2;
				while(_g11 < l1) {
					var i3 = _g11++;
					this.serialize(v[i3]);
				}
				if(this.useCache) this.cache.push(v);
				break;
			case 5:
				throw new js__$Boot_HaxeError("Cannot serialize function");
				break;
			default:
				throw new js__$Boot_HaxeError("Cannot serialize " + Std.string(v));
			}
		}
	}
	,__class__: haxe_Serializer
};
var haxe__$Template_TemplateExpr = $hxClasses["haxe._Template.TemplateExpr"] = { __ename__ : ["haxe","_Template","TemplateExpr"], __constructs__ : ["OpVar","OpExpr","OpIf","OpStr","OpBlock","OpForeach","OpMacro"] };
haxe__$Template_TemplateExpr.OpVar = function(v) { var $x = ["OpVar",0,v]; $x.__enum__ = haxe__$Template_TemplateExpr; return $x; };
haxe__$Template_TemplateExpr.OpExpr = function(expr) { var $x = ["OpExpr",1,expr]; $x.__enum__ = haxe__$Template_TemplateExpr; return $x; };
haxe__$Template_TemplateExpr.OpIf = function(expr,eif,eelse) { var $x = ["OpIf",2,expr,eif,eelse]; $x.__enum__ = haxe__$Template_TemplateExpr; return $x; };
haxe__$Template_TemplateExpr.OpStr = function(str) { var $x = ["OpStr",3,str]; $x.__enum__ = haxe__$Template_TemplateExpr; return $x; };
haxe__$Template_TemplateExpr.OpBlock = function(l) { var $x = ["OpBlock",4,l]; $x.__enum__ = haxe__$Template_TemplateExpr; return $x; };
haxe__$Template_TemplateExpr.OpForeach = function(expr,loop) { var $x = ["OpForeach",5,expr,loop]; $x.__enum__ = haxe__$Template_TemplateExpr; return $x; };
haxe__$Template_TemplateExpr.OpMacro = function(name,params) { var $x = ["OpMacro",6,name,params]; $x.__enum__ = haxe__$Template_TemplateExpr; return $x; };
var haxe_Template = function(str) {
	var tokens = this.parseTokens(str);
	this.expr = this.parseBlock(tokens);
	if(!tokens.isEmpty()) throw new js__$Boot_HaxeError("Unexpected '" + Std.string(tokens.first().s) + "'");
};
$hxClasses["haxe.Template"] = haxe_Template;
haxe_Template.__name__ = ["haxe","Template"];
haxe_Template.prototype = {
	expr: null
	,context: null
	,macros: null
	,stack: null
	,buf: null
	,execute: function(context,macros) {
		if(macros == null) this.macros = { }; else this.macros = macros;
		this.context = context;
		this.stack = new List();
		this.buf = new StringBuf();
		this.run(this.expr);
		return this.buf.b;
	}
	,resolve: function(v) {
		if(Object.prototype.hasOwnProperty.call(this.context,v)) return Reflect.field(this.context,v);
		var _g_head = this.stack.h;
		var _g_val = null;
		while(_g_head != null) {
			var ctx;
			_g_val = _g_head[0];
			_g_head = _g_head[1];
			ctx = _g_val;
			if(Object.prototype.hasOwnProperty.call(ctx,v)) return Reflect.field(ctx,v);
		}
		if(v == "__current__") return this.context;
		return Reflect.field(haxe_Template.globals,v);
	}
	,parseTokens: function(data) {
		var tokens = new List();
		while(haxe_Template.splitter.match(data)) {
			var p = haxe_Template.splitter.matchedPos();
			if(p.pos > 0) tokens.add({ p : HxOverrides.substr(data,0,p.pos), s : true, l : null});
			if(HxOverrides.cca(data,p.pos) == 58) {
				tokens.add({ p : HxOverrides.substr(data,p.pos + 2,p.len - 4), s : false, l : null});
				data = haxe_Template.splitter.matchedRight();
				continue;
			}
			var parp = p.pos + p.len;
			var npar = 1;
			var params = [];
			var part = "";
			while(true) {
				var c = HxOverrides.cca(data,parp);
				parp++;
				if(c == 40) npar++; else if(c == 41) {
					npar--;
					if(npar <= 0) break;
				} else if(c == null) throw new js__$Boot_HaxeError("Unclosed macro parenthesis");
				if(c == 44 && npar == 1) {
					params.push(part);
					part = "";
				} else part += String.fromCharCode(c);
			}
			params.push(part);
			tokens.add({ p : haxe_Template.splitter.matched(2), s : false, l : params});
			data = HxOverrides.substr(data,parp,data.length - parp);
		}
		if(data.length > 0) tokens.add({ p : data, s : true, l : null});
		return tokens;
	}
	,parseBlock: function(tokens) {
		var l = new List();
		while(true) {
			var t = tokens.first();
			if(t == null) break;
			if(!t.s && (t.p == "end" || t.p == "else" || HxOverrides.substr(t.p,0,7) == "elseif ")) break;
			l.add(this.parse(tokens));
		}
		if(l.length == 1) return l.first();
		return haxe__$Template_TemplateExpr.OpBlock(l);
	}
	,parse: function(tokens) {
		var t = tokens.pop();
		var p = t.p;
		if(t.s) return haxe__$Template_TemplateExpr.OpStr(p);
		if(t.l != null) {
			var pe = new List();
			var _g = 0;
			var _g1 = t.l;
			while(_g < _g1.length) {
				var p1 = _g1[_g];
				++_g;
				pe.add(this.parseBlock(this.parseTokens(p1)));
			}
			return haxe__$Template_TemplateExpr.OpMacro(p,pe);
		}
		if(HxOverrides.substr(p,0,3) == "if ") {
			p = HxOverrides.substr(p,3,p.length - 3);
			var e = this.parseExpr(p);
			var eif = this.parseBlock(tokens);
			var t1 = tokens.first();
			var eelse;
			if(t1 == null) throw new js__$Boot_HaxeError("Unclosed 'if'");
			if(t1.p == "end") {
				tokens.pop();
				eelse = null;
			} else if(t1.p == "else") {
				tokens.pop();
				eelse = this.parseBlock(tokens);
				t1 = tokens.pop();
				if(t1 == null || t1.p != "end") throw new js__$Boot_HaxeError("Unclosed 'else'");
			} else {
				t1.p = HxOverrides.substr(t1.p,4,t1.p.length - 4);
				eelse = this.parse(tokens);
			}
			return haxe__$Template_TemplateExpr.OpIf(e,eif,eelse);
		}
		if(HxOverrides.substr(p,0,8) == "foreach ") {
			p = HxOverrides.substr(p,8,p.length - 8);
			var e1 = this.parseExpr(p);
			var efor = this.parseBlock(tokens);
			var t2 = tokens.pop();
			if(t2 == null || t2.p != "end") throw new js__$Boot_HaxeError("Unclosed 'foreach'");
			return haxe__$Template_TemplateExpr.OpForeach(e1,efor);
		}
		if(haxe_Template.expr_splitter.match(p)) return haxe__$Template_TemplateExpr.OpExpr(this.parseExpr(p));
		return haxe__$Template_TemplateExpr.OpVar(p);
	}
	,parseExpr: function(data) {
		var l = new List();
		var expr = data;
		while(haxe_Template.expr_splitter.match(data)) {
			var p = haxe_Template.expr_splitter.matchedPos();
			var k = p.pos + p.len;
			if(p.pos != 0) l.add({ p : HxOverrides.substr(data,0,p.pos), s : true});
			var p1 = haxe_Template.expr_splitter.matched(0);
			l.add({ p : p1, s : p1.indexOf("\"") >= 0});
			data = haxe_Template.expr_splitter.matchedRight();
		}
		if(data.length != 0) l.add({ p : data, s : true});
		var e;
		try {
			e = this.makeExpr(l);
			if(!l.isEmpty()) throw new js__$Boot_HaxeError(l.first().p);
		} catch( s ) {
			if (s instanceof js__$Boot_HaxeError) s = s.val;
			if( js_Boot.__instanceof(s,String) ) {
				throw new js__$Boot_HaxeError("Unexpected '" + s + "' in " + expr);
			} else throw(s);
		}
		return function() {
			try {
				return e();
			} catch( exc ) {
				if (exc instanceof js__$Boot_HaxeError) exc = exc.val;
				throw new js__$Boot_HaxeError("Error : " + Std.string(exc) + " in " + expr);
			}
		};
	}
	,makeConst: function(v) {
		haxe_Template.expr_trim.match(v);
		v = haxe_Template.expr_trim.matched(1);
		if(HxOverrides.cca(v,0) == 34) {
			var str = HxOverrides.substr(v,1,v.length - 2);
			return function() {
				return str;
			};
		}
		if(haxe_Template.expr_int.match(v)) {
			var i = Std.parseInt(v);
			return function() {
				return i;
			};
		}
		if(haxe_Template.expr_float.match(v)) {
			var f = parseFloat(v);
			return function() {
				return f;
			};
		}
		var me = this;
		return function() {
			return me.resolve(v);
		};
	}
	,makePath: function(e,l) {
		var p = l.first();
		if(p == null || p.p != ".") return e;
		l.pop();
		var field = l.pop();
		if(field == null || !field.s) throw new js__$Boot_HaxeError(field.p);
		var f = field.p;
		haxe_Template.expr_trim.match(f);
		f = haxe_Template.expr_trim.matched(1);
		return this.makePath(function() {
			return Reflect.field(e(),f);
		},l);
	}
	,makeExpr: function(l) {
		return this.makePath(this.makeExpr2(l),l);
	}
	,makeExpr2: function(l) {
		var p = l.pop();
		if(p == null) throw new js__$Boot_HaxeError("<eof>");
		if(p.s) return this.makeConst(p.p);
		var _g = p.p;
		switch(_g) {
		case "(":
			var e1 = this.makeExpr(l);
			var p1 = l.pop();
			if(p1 == null || p1.s) throw new js__$Boot_HaxeError(p1.p);
			if(p1.p == ")") return e1;
			var e2 = this.makeExpr(l);
			var p2 = l.pop();
			if(p2 == null || p2.p != ")") throw new js__$Boot_HaxeError(p2.p);
			var _g1 = p1.p;
			switch(_g1) {
			case "+":
				return function() {
					return e1() + e2();
				};
			case "-":
				return function() {
					return e1() - e2();
				};
			case "*":
				return function() {
					return e1() * e2();
				};
			case "/":
				return function() {
					return e1() / e2();
				};
			case ">":
				return function() {
					return e1() > e2();
				};
			case "<":
				return function() {
					return e1() < e2();
				};
			case ">=":
				return function() {
					return e1() >= e2();
				};
			case "<=":
				return function() {
					return e1() <= e2();
				};
			case "==":
				return function() {
					return e1() == e2();
				};
			case "!=":
				return function() {
					return e1() != e2();
				};
			case "&&":
				return function() {
					return e1() && e2();
				};
			case "||":
				return function() {
					return e1() || e2();
				};
			default:
				throw new js__$Boot_HaxeError("Unknown operation " + p1.p);
			}
			break;
		case "!":
			var e = this.makeExpr(l);
			return function() {
				var v = e();
				return v == null || v == false;
			};
		case "-":
			var e3 = this.makeExpr(l);
			return function() {
				return -e3();
			};
		}
		throw new js__$Boot_HaxeError(p.p);
	}
	,run: function(e) {
		switch(e[1]) {
		case 0:
			var v = e[2];
			this.buf.add(Std.string(this.resolve(v)));
			break;
		case 1:
			var e1 = e[2];
			this.buf.add(Std.string(e1()));
			break;
		case 2:
			var eelse = e[4];
			var eif = e[3];
			var e2 = e[2];
			var v1 = e2();
			if(v1 == null || v1 == false) {
				if(eelse != null) this.run(eelse);
			} else this.run(eif);
			break;
		case 3:
			var str = e[2];
			if(str == null) this.buf.b += "null"; else this.buf.b += "" + str;
			break;
		case 4:
			var l = e[2];
			var _g_head = l.h;
			var _g_val = null;
			while(_g_head != null) {
				var e3;
				e3 = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				this.run(e3);
			}
			break;
		case 5:
			var loop = e[3];
			var e4 = e[2];
			var v2 = e4();
			try {
				var x = $iterator(v2)();
				if(x.hasNext == null) throw new js__$Boot_HaxeError(null);
				v2 = x;
			} catch( e5 ) {
				if (e5 instanceof js__$Boot_HaxeError) e5 = e5.val;
				try {
					if(v2.hasNext == null) throw new js__$Boot_HaxeError(null);
				} catch( e6 ) {
					if (e6 instanceof js__$Boot_HaxeError) e6 = e6.val;
					throw new js__$Boot_HaxeError("Cannot iter on " + Std.string(v2));
				}
			}
			this.stack.push(this.context);
			var v3 = v2;
			while( v3.hasNext() ) {
				var ctx = v3.next();
				this.context = ctx;
				this.run(loop);
			}
			this.context = this.stack.pop();
			break;
		case 6:
			var params = e[3];
			var m = e[2];
			var v4 = Reflect.field(this.macros,m);
			var pl = [];
			var old = this.buf;
			pl.push($bind(this,this.resolve));
			var _g_head1 = params.h;
			var _g_val1 = null;
			while(_g_head1 != null) {
				var p;
				p = (function($this) {
					var $r;
					_g_val1 = _g_head1[0];
					_g_head1 = _g_head1[1];
					$r = _g_val1;
					return $r;
				}(this));
				switch(p[1]) {
				case 0:
					var v5 = p[2];
					pl.push(this.resolve(v5));
					break;
				default:
					this.buf = new StringBuf();
					this.run(p);
					pl.push(this.buf.b);
				}
			}
			this.buf = old;
			try {
				this.buf.add(Std.string(Reflect.callMethod(this.macros,v4,pl)));
			} catch( e7 ) {
				if (e7 instanceof js__$Boot_HaxeError) e7 = e7.val;
				var plstr;
				try {
					plstr = pl.join(",");
				} catch( e8 ) {
					if (e8 instanceof js__$Boot_HaxeError) e8 = e8.val;
					plstr = "???";
				}
				var msg = "Macro call " + m + "(" + plstr + ") failed (" + Std.string(e7) + ")";
				throw new js__$Boot_HaxeError(msg);
			}
			break;
		}
	}
	,__class__: haxe_Template
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe_Timer;
haxe_Timer.__name__ = ["haxe","Timer"];
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	id: null
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = [];
	this.cache = [];
	var r = haxe_Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe_Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe_Unserializer;
haxe_Unserializer.__name__ = ["haxe","Unserializer"];
haxe_Unserializer.initCodes = function() {
	var codes = [];
	var _g1 = 0;
	var _g = haxe_Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe_Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe_Unserializer.run = function(v) {
	return new haxe_Unserializer(v).unserialize();
};
haxe_Unserializer.prototype = {
	buf: null
	,pos: null
	,length: null
	,cache: null
	,scache: null
	,resolver: null
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,readFloat: function() {
		var p1 = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
		}
		return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw new js__$Boot_HaxeError("Invalid object");
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!(typeof(k) == "string")) throw new js__$Boot_HaxeError("Invalid object key");
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw new js__$Boot_HaxeError("Invalid enum format");
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = [];
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			return this.readFloat();
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw new js__$Boot_HaxeError("Invalid string length");
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 107:
			return NaN;
		case 109:
			return -Infinity;
		case 112:
			return Infinity;
		case 97:
			var buf = this.buf;
			var a = [];
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw new js__$Boot_HaxeError("Invalid reference");
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw new js__$Boot_HaxeError("Invalid string reference");
			return this.scache[n2];
		case 120:
			throw new js__$Boot_HaxeError(this.unserialize());
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw new js__$Boot_HaxeError("Class not found " + name);
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw new js__$Boot_HaxeError("Enum not found " + name1);
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw new js__$Boot_HaxeError("Enum not found " + name2);
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw new js__$Boot_HaxeError("Unknown enum index " + name2 + "@" + index);
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe_ds_StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe_ds_IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c1 = this.get(this.pos++);
			while(c1 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c1 = this.get(this.pos++);
			}
			if(c1 != 104) throw new js__$Boot_HaxeError("Invalid IntMap format");
			return h1;
		case 77:
			var h2 = new haxe_ds_ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			if(this.buf.charCodeAt(this.pos) >= 48 && this.buf.charCodeAt(this.pos) <= 57 && this.buf.charCodeAt(this.pos + 1) >= 48 && this.buf.charCodeAt(this.pos + 1) <= 57 && this.buf.charCodeAt(this.pos + 2) >= 48 && this.buf.charCodeAt(this.pos + 2) <= 57 && this.buf.charCodeAt(this.pos + 3) >= 48 && this.buf.charCodeAt(this.pos + 3) <= 57 && this.buf.charCodeAt(this.pos + 4) == 45) {
				var s3 = HxOverrides.substr(this.buf,this.pos,19);
				d = HxOverrides.strDate(s3);
				this.pos += 19;
			} else {
				var t = this.readFloat();
				var d1 = new Date();
				d1.setTime(t);
				d = d1;
			}
			this.cache.push(d);
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw new js__$Boot_HaxeError("Invalid bytes length");
			var codes = haxe_Unserializer.CODES;
			if(codes == null) {
				codes = haxe_Unserializer.initCodes();
				haxe_Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe_io_Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c2 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c2 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c2 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c21 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c21 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw new js__$Boot_HaxeError("Class not found " + name3);
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw new js__$Boot_HaxeError("Invalid custom data");
			return o2;
		case 65:
			var name4 = this.unserialize();
			var cl2 = this.resolver.resolveClass(name4);
			if(cl2 == null) throw new js__$Boot_HaxeError("Class not found " + name4);
			return cl2;
		case 66:
			var name5 = this.unserialize();
			var e2 = this.resolver.resolveEnum(name5);
			if(e2 == null) throw new js__$Boot_HaxeError("Enum not found " + name5);
			return e2;
		default:
		}
		this.pos--;
		throw new js__$Boot_HaxeError("Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos);
	}
	,__class__: haxe_Unserializer
};
var haxe_Utf8 = function(size) {
	this.__b = "";
};
$hxClasses["haxe.Utf8"] = haxe_Utf8;
haxe_Utf8.__name__ = ["haxe","Utf8"];
haxe_Utf8.prototype = {
	__b: null
	,__class__: haxe_Utf8
};
var haxe_io_Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
haxe_io_Bytes.__name__ = ["haxe","io","Bytes"];
haxe_io_Bytes.alloc = function(length) {
	return new haxe_io_Bytes(length,new Buffer(length));
};
haxe_io_Bytes.ofString = function(s) {
	var nb = new Buffer(s,"utf8");
	return new haxe_io_Bytes(nb.length,nb);
};
haxe_io_Bytes.prototype = {
	length: null
	,b: null
	,get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v;
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c21 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,__class__: haxe_io_Bytes
};
var haxe_crypto_Base64 = function() { };
$hxClasses["haxe.crypto.Base64"] = haxe_crypto_Base64;
haxe_crypto_Base64.__name__ = ["haxe","crypto","Base64"];
haxe_crypto_Base64.decode = function(str,complement) {
	if(complement == null) complement = true;
	if(complement) while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	return new haxe_crypto_BaseCode(haxe_crypto_Base64.BYTES).decodeBytes(haxe_io_Bytes.ofString(str));
};
var haxe_crypto_BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) nbits++;
	if(nbits > 8 || len != 1 << nbits) throw new js__$Boot_HaxeError("BaseCode : base length must be a power of two.");
	this.base = base;
	this.nbits = nbits;
};
$hxClasses["haxe.crypto.BaseCode"] = haxe_crypto_BaseCode;
haxe_crypto_BaseCode.__name__ = ["haxe","crypto","BaseCode"];
haxe_crypto_BaseCode.prototype = {
	base: null
	,nbits: null
	,tbl: null
	,initTable: function() {
		var tbl = [];
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g1 = 0;
		var _g2 = this.base.length;
		while(_g1 < _g2) {
			var i1 = _g1++;
			tbl[this.base.b[i1]] = i1;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) this.initTable();
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = haxe_io_Bytes.alloc(size);
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.get(pin++)];
				if(i == -1) throw new js__$Boot_HaxeError("BaseCode : invalid encoded char");
				buf |= i;
			}
			curbits -= 8;
			out.set(pout++,buf >> curbits & 255);
		}
		return out;
	}
	,__class__: haxe_crypto_BaseCode
};
var haxe_ds_GenericCell = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
$hxClasses["haxe.ds.GenericCell"] = haxe_ds_GenericCell;
haxe_ds_GenericCell.__name__ = ["haxe","ds","GenericCell"];
haxe_ds_GenericCell.prototype = {
	elt: null
	,next: null
	,__class__: haxe_ds_GenericCell
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = ["haxe","ds","IntMap"];
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
haxe_ds_ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe_ds_ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds_Option = $hxClasses["haxe.ds.Option"] = { __ename__ : ["haxe","ds","Option"], __constructs__ : ["Some","None"] };
haxe_ds_Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe_ds_Option; return $x; };
haxe_ds_Option.None = ["None",1];
haxe_ds_Option.None.__enum__ = haxe_ds_Option;
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
$hxClasses["haxe.ds._StringMap.StringMapIterator"] = haxe_ds__$StringMap_StringMapIterator;
haxe_ds__$StringMap_StringMapIterator.__name__ = ["haxe","ds","_StringMap","StringMapIterator"];
haxe_ds__$StringMap_StringMapIterator.prototype = {
	map: null
	,keys: null
	,index: null
	,count: null
	,hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: haxe_ds__$StringMap_StringMapIterator
};
var haxe_io_Eof = function() {
};
$hxClasses["haxe.io.Eof"] = haxe_io_Eof;
haxe_io_Eof.__name__ = ["haxe","io","Eof"];
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_io_Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; return $x; };
var haxe_macro_Constant = $hxClasses["haxe.macro.Constant"] = { __ename__ : ["haxe","macro","Constant"], __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp"] };
haxe_macro_Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe_macro_Constant; return $x; };
haxe_macro_Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe_macro_Constant; return $x; };
haxe_macro_Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe_macro_Constant; return $x; };
haxe_macro_Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe_macro_Constant; return $x; };
haxe_macro_Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe_macro_Constant; return $x; };
var haxe_macro_Binop = $hxClasses["haxe.macro.Binop"] = { __ename__ : ["haxe","macro","Binop"], __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval","OpArrow"] };
haxe_macro_Binop.OpAdd = ["OpAdd",0];
haxe_macro_Binop.OpAdd.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpMult = ["OpMult",1];
haxe_macro_Binop.OpMult.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpDiv = ["OpDiv",2];
haxe_macro_Binop.OpDiv.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpSub = ["OpSub",3];
haxe_macro_Binop.OpSub.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpAssign = ["OpAssign",4];
haxe_macro_Binop.OpAssign.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpEq = ["OpEq",5];
haxe_macro_Binop.OpEq.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpNotEq = ["OpNotEq",6];
haxe_macro_Binop.OpNotEq.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpGt = ["OpGt",7];
haxe_macro_Binop.OpGt.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpGte = ["OpGte",8];
haxe_macro_Binop.OpGte.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpLt = ["OpLt",9];
haxe_macro_Binop.OpLt.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpLte = ["OpLte",10];
haxe_macro_Binop.OpLte.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpAnd = ["OpAnd",11];
haxe_macro_Binop.OpAnd.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpOr = ["OpOr",12];
haxe_macro_Binop.OpOr.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpXor = ["OpXor",13];
haxe_macro_Binop.OpXor.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe_macro_Binop.OpBoolAnd.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpBoolOr = ["OpBoolOr",15];
haxe_macro_Binop.OpBoolOr.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpShl = ["OpShl",16];
haxe_macro_Binop.OpShl.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpShr = ["OpShr",17];
haxe_macro_Binop.OpShr.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpUShr = ["OpUShr",18];
haxe_macro_Binop.OpUShr.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpMod = ["OpMod",19];
haxe_macro_Binop.OpMod.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe_macro_Binop; return $x; };
haxe_macro_Binop.OpInterval = ["OpInterval",21];
haxe_macro_Binop.OpInterval.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpArrow = ["OpArrow",22];
haxe_macro_Binop.OpArrow.__enum__ = haxe_macro_Binop;
var haxe_macro_Unop = $hxClasses["haxe.macro.Unop"] = { __ename__ : ["haxe","macro","Unop"], __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] };
haxe_macro_Unop.OpIncrement = ["OpIncrement",0];
haxe_macro_Unop.OpIncrement.__enum__ = haxe_macro_Unop;
haxe_macro_Unop.OpDecrement = ["OpDecrement",1];
haxe_macro_Unop.OpDecrement.__enum__ = haxe_macro_Unop;
haxe_macro_Unop.OpNot = ["OpNot",2];
haxe_macro_Unop.OpNot.__enum__ = haxe_macro_Unop;
haxe_macro_Unop.OpNeg = ["OpNeg",3];
haxe_macro_Unop.OpNeg.__enum__ = haxe_macro_Unop;
haxe_macro_Unop.OpNegBits = ["OpNegBits",4];
haxe_macro_Unop.OpNegBits.__enum__ = haxe_macro_Unop;
var haxe_macro_ExprDef = $hxClasses["haxe.macro.ExprDef"] = { __ename__ : ["haxe","macro","ExprDef"], __constructs__ : ["EConst","EArray","EBinop","EField","EParenthesis","EObjectDecl","EArrayDecl","ECall","ENew","EUnop","EVars","EFunction","EBlock","EFor","EIn","EIf","EWhile","ESwitch","ETry","EReturn","EBreak","EContinue","EUntyped","EThrow","ECast","EDisplay","EDisplayNew","ETernary","ECheckType","EMeta"] };
haxe_macro_ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EArray = function(e1,e2) { var $x = ["EArray",1,e1,e2]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",2,op,e1,e2]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EField = function(e,field) { var $x = ["EField",3,e,field]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EParenthesis = function(e) { var $x = ["EParenthesis",4,e]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EObjectDecl = function(fields) { var $x = ["EObjectDecl",5,fields]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EArrayDecl = function(values) { var $x = ["EArrayDecl",6,values]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.ECall = function(e,params) { var $x = ["ECall",7,e,params]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.ENew = function(t,params) { var $x = ["ENew",8,t,params]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EUnop = function(op,postFix,e) { var $x = ["EUnop",9,op,postFix,e]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EVars = function(vars) { var $x = ["EVars",10,vars]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EFunction = function(name,f) { var $x = ["EFunction",11,name,f]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EBlock = function(exprs) { var $x = ["EBlock",12,exprs]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EFor = function(it,expr) { var $x = ["EFor",13,it,expr]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EIn = function(e1,e2) { var $x = ["EIn",14,e1,e2]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EIf = function(econd,eif,eelse) { var $x = ["EIf",15,econd,eif,eelse]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EWhile = function(econd,e,normalWhile) { var $x = ["EWhile",16,econd,e,normalWhile]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",17,e,cases,edef]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.ETry = function(e,catches) { var $x = ["ETry",18,e,catches]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EReturn = function(e) { var $x = ["EReturn",19,e]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EBreak = ["EBreak",20];
haxe_macro_ExprDef.EBreak.__enum__ = haxe_macro_ExprDef;
haxe_macro_ExprDef.EContinue = ["EContinue",21];
haxe_macro_ExprDef.EContinue.__enum__ = haxe_macro_ExprDef;
haxe_macro_ExprDef.EUntyped = function(e) { var $x = ["EUntyped",22,e]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EThrow = function(e) { var $x = ["EThrow",23,e]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.ECast = function(e,t) { var $x = ["ECast",24,e,t]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EDisplay = function(e,isCall) { var $x = ["EDisplay",25,e,isCall]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EDisplayNew = function(t) { var $x = ["EDisplayNew",26,t]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.ETernary = function(econd,eif,eelse) { var $x = ["ETernary",27,econd,eif,eelse]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.ECheckType = function(e,t) { var $x = ["ECheckType",28,e,t]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
haxe_macro_ExprDef.EMeta = function(s,e) { var $x = ["EMeta",29,s,e]; $x.__enum__ = haxe_macro_ExprDef; return $x; };
var haxe_macro_ComplexType = $hxClasses["haxe.macro.ComplexType"] = { __ename__ : ["haxe","macro","ComplexType"], __constructs__ : ["TPath","TFunction","TAnonymous","TParent","TExtend","TOptional"] };
haxe_macro_ComplexType.TPath = function(p) { var $x = ["TPath",0,p]; $x.__enum__ = haxe_macro_ComplexType; return $x; };
haxe_macro_ComplexType.TFunction = function(args,ret) { var $x = ["TFunction",1,args,ret]; $x.__enum__ = haxe_macro_ComplexType; return $x; };
haxe_macro_ComplexType.TAnonymous = function(fields) { var $x = ["TAnonymous",2,fields]; $x.__enum__ = haxe_macro_ComplexType; return $x; };
haxe_macro_ComplexType.TParent = function(t) { var $x = ["TParent",3,t]; $x.__enum__ = haxe_macro_ComplexType; return $x; };
haxe_macro_ComplexType.TExtend = function(p,fields) { var $x = ["TExtend",4,p,fields]; $x.__enum__ = haxe_macro_ComplexType; return $x; };
haxe_macro_ComplexType.TOptional = function(t) { var $x = ["TOptional",5,t]; $x.__enum__ = haxe_macro_ComplexType; return $x; };
var haxe_macro_TypeParam = $hxClasses["haxe.macro.TypeParam"] = { __ename__ : ["haxe","macro","TypeParam"], __constructs__ : ["TPType","TPExpr"] };
haxe_macro_TypeParam.TPType = function(t) { var $x = ["TPType",0,t]; $x.__enum__ = haxe_macro_TypeParam; return $x; };
haxe_macro_TypeParam.TPExpr = function(e) { var $x = ["TPExpr",1,e]; $x.__enum__ = haxe_macro_TypeParam; return $x; };
var haxe_macro_Access = $hxClasses["haxe.macro.Access"] = { __ename__ : ["haxe","macro","Access"], __constructs__ : ["APublic","APrivate","AStatic","AOverride","ADynamic","AInline","AMacro"] };
haxe_macro_Access.APublic = ["APublic",0];
haxe_macro_Access.APublic.__enum__ = haxe_macro_Access;
haxe_macro_Access.APrivate = ["APrivate",1];
haxe_macro_Access.APrivate.__enum__ = haxe_macro_Access;
haxe_macro_Access.AStatic = ["AStatic",2];
haxe_macro_Access.AStatic.__enum__ = haxe_macro_Access;
haxe_macro_Access.AOverride = ["AOverride",3];
haxe_macro_Access.AOverride.__enum__ = haxe_macro_Access;
haxe_macro_Access.ADynamic = ["ADynamic",4];
haxe_macro_Access.ADynamic.__enum__ = haxe_macro_Access;
haxe_macro_Access.AInline = ["AInline",5];
haxe_macro_Access.AInline.__enum__ = haxe_macro_Access;
haxe_macro_Access.AMacro = ["AMacro",6];
haxe_macro_Access.AMacro.__enum__ = haxe_macro_Access;
var haxe_macro_FieldType = $hxClasses["haxe.macro.FieldType"] = { __ename__ : ["haxe","macro","FieldType"], __constructs__ : ["FVar","FFun","FProp"] };
haxe_macro_FieldType.FVar = function(t,e) { var $x = ["FVar",0,t,e]; $x.__enum__ = haxe_macro_FieldType; return $x; };
haxe_macro_FieldType.FFun = function(f) { var $x = ["FFun",1,f]; $x.__enum__ = haxe_macro_FieldType; return $x; };
haxe_macro_FieldType.FProp = function(get,set,t,e) { var $x = ["FProp",2,get,set,t,e]; $x.__enum__ = haxe_macro_FieldType; return $x; };
var haxe_macro_ExprTools = function() { };
$hxClasses["haxe.macro.ExprTools"] = haxe_macro_ExprTools;
haxe_macro_ExprTools.__name__ = ["haxe","macro","ExprTools"];
haxe_macro_ExprTools.toString = function(e) {
	return new haxe_macro_Printer().printExpr(e);
};
var haxe_macro_Printer = function(tabString) {
	if(tabString == null) tabString = "\t";
	this.tabs = "";
	this.tabString = tabString;
};
$hxClasses["haxe.macro.Printer"] = haxe_macro_Printer;
haxe_macro_Printer.__name__ = ["haxe","macro","Printer"];
haxe_macro_Printer.prototype = {
	tabs: null
	,tabString: null
	,printUnop: function(op) {
		switch(op[1]) {
		case 0:
			return "++";
		case 1:
			return "--";
		case 2:
			return "!";
		case 3:
			return "-";
		case 4:
			return "~";
		}
	}
	,printBinop: function(op) {
		switch(op[1]) {
		case 0:
			return "+";
		case 1:
			return "*";
		case 2:
			return "/";
		case 3:
			return "-";
		case 4:
			return "=";
		case 5:
			return "==";
		case 6:
			return "!=";
		case 7:
			return ">";
		case 8:
			return ">=";
		case 9:
			return "<";
		case 10:
			return "<=";
		case 11:
			return "&";
		case 12:
			return "|";
		case 13:
			return "^";
		case 14:
			return "&&";
		case 15:
			return "||";
		case 16:
			return "<<";
		case 17:
			return ">>";
		case 18:
			return ">>>";
		case 19:
			return "%";
		case 21:
			return "...";
		case 22:
			return "=>";
		case 20:
			var op1 = op[2];
			return this.printBinop(op1) + "=";
		}
	}
	,escapeString: function(s,delim) {
		return delim + StringTools.replace(StringTools.replace(StringTools.replace(StringTools.replace(s,"\n","\\n"),"\t","\\t"),"'","\\'"),"\"","\\\"") + delim;
	}
	,printString: function(s) {
		return this.escapeString(s,"\"");
	}
	,printConstant: function(c) {
		switch(c[1]) {
		case 2:
			var s = c[2];
			return this.printString(s);
		case 3:
			var s1 = c[2];
			return s1;
		case 0:
			var s2 = c[2];
			return s2;
		case 1:
			var s3 = c[2];
			return s3;
		case 4:
			var opt = c[3];
			var s4 = c[2];
			return "~/" + s4 + "/" + opt;
		}
	}
	,printTypeParam: function(param) {
		switch(param[1]) {
		case 0:
			var ct = param[2];
			return this.printComplexType(ct);
		case 1:
			var e = param[2];
			return this.printExpr(e);
		}
	}
	,printTypePath: function(tp) {
		return (tp.pack.length > 0?tp.pack.join(".") + ".":"") + tp.name + (tp.sub != null?"." + tp.sub:"") + (tp.params == null?"":tp.params.length > 0?"<" + tp.params.map($bind(this,this.printTypeParam)).join(", ") + ">":"");
	}
	,printComplexType: function(ct) {
		switch(ct[1]) {
		case 0:
			var tp = ct[2];
			return this.printTypePath(tp);
		case 1:
			var ret = ct[3];
			var args = ct[2];
			return (args.length > 0?args.map($bind(this,this.printComplexType)).join(" -> "):"Void") + " -> " + this.printComplexType(ret);
		case 2:
			var fields = ct[2];
			return "{ " + ((function($this) {
				var $r;
				var _g = [];
				{
					var _g1 = 0;
					while(_g1 < fields.length) {
						var f = fields[_g1];
						++_g1;
						_g.push($this.printField(f) + "; ");
					}
				}
				$r = _g;
				return $r;
			}(this))).join("") + "}";
		case 3:
			var ct1 = ct[2];
			return "(" + this.printComplexType(ct1) + ")";
		case 5:
			var ct2 = ct[2];
			return "?" + this.printComplexType(ct2);
		case 4:
			var fields1 = ct[3];
			var tpl = ct[2];
			return "{> " + tpl.map($bind(this,this.printTypePath)).join(" >, ") + ", " + fields1.map($bind(this,this.printField)).join(", ") + " }";
		}
	}
	,printMetadata: function(meta) {
		return "@" + meta.name + (meta.params != null && meta.params.length > 0?"(" + this.printExprs(meta.params,", ") + ")":"");
	}
	,printAccess: function(access) {
		switch(access[1]) {
		case 2:
			return "static";
		case 0:
			return "public";
		case 1:
			return "private";
		case 3:
			return "override";
		case 5:
			return "inline";
		case 4:
			return "dynamic";
		case 6:
			return "macro";
		}
	}
	,printField: function(field) {
		return (field.doc != null && field.doc != ""?"/**\n" + this.tabs + this.tabString + StringTools.replace(field.doc,"\n","\n" + this.tabs + this.tabString) + "\n" + this.tabs + "**/\n" + this.tabs:"") + (field.meta != null && field.meta.length > 0?field.meta.map($bind(this,this.printMetadata)).join("\n" + this.tabs) + ("\n" + this.tabs):"") + (field.access != null && field.access.length > 0?field.access.map($bind(this,this.printAccess)).join(" ") + " ":"") + (function($this) {
			var $r;
			var _g = field.kind;
			$r = (function($this) {
				var $r;
				switch(_g[1]) {
				case 0:
					$r = (function($this) {
						var $r;
						var eo = _g[3];
						var t = _g[2];
						$r = "var " + field.name + $this.opt(t,$bind($this,$this.printComplexType)," : ") + $this.opt(eo,$bind($this,$this.printExpr)," = ");
						return $r;
					}($this));
					break;
				case 2:
					$r = (function($this) {
						var $r;
						var eo1 = _g[5];
						var t1 = _g[4];
						var set = _g[3];
						var get = _g[2];
						$r = "var " + field.name + "(" + get + ", " + set + ")" + $this.opt(t1,$bind($this,$this.printComplexType)," : ") + $this.opt(eo1,$bind($this,$this.printExpr)," = ");
						return $r;
					}($this));
					break;
				case 1:
					$r = (function($this) {
						var $r;
						var func = _g[2];
						$r = "function " + field.name + $this.printFunction(func);
						return $r;
					}($this));
					break;
				}
				return $r;
			}($this));
			return $r;
		}(this));
	}
	,printTypeParamDecl: function(tpd) {
		return tpd.name + (tpd.params != null && tpd.params.length > 0?"<" + tpd.params.map($bind(this,this.printTypeParamDecl)).join(", ") + ">":"") + (tpd.constraints != null && tpd.constraints.length > 0?":(" + tpd.constraints.map($bind(this,this.printComplexType)).join(", ") + ")":"");
	}
	,printFunctionArg: function(arg) {
		return (arg.opt?"?":"") + arg.name + this.opt(arg.type,$bind(this,this.printComplexType),":") + this.opt(arg.value,$bind(this,this.printExpr)," = ");
	}
	,printFunction: function(func) {
		return (func.params == null?"":func.params.length > 0?"<" + func.params.map($bind(this,this.printTypeParamDecl)).join(", ") + ">":"") + "(" + func.args.map($bind(this,this.printFunctionArg)).join(", ") + ")" + this.opt(func.ret,$bind(this,this.printComplexType),":") + this.opt(func.expr,$bind(this,this.printExpr)," ");
	}
	,printVar: function(v) {
		return v.name + this.opt(v.type,$bind(this,this.printComplexType),":") + this.opt(v.expr,$bind(this,this.printExpr)," = ");
	}
	,printExpr: function(e) {
		var _g1 = this;
		if(e == null) return "#NULL"; else {
			var _g = e.expr;
			switch(_g[1]) {
			case 0:
				var c = _g[2];
				return this.printConstant(c);
			case 1:
				var e2 = _g[3];
				var e1 = _g[2];
				return "" + this.printExpr(e1) + "[" + this.printExpr(e2) + "]";
			case 2:
				var e21 = _g[4];
				var e11 = _g[3];
				var op = _g[2];
				return "" + this.printExpr(e11) + " " + this.printBinop(op) + " " + this.printExpr(e21);
			case 3:
				var n = _g[3];
				var e12 = _g[2];
				return "" + this.printExpr(e12) + "." + n;
			case 4:
				var e13 = _g[2];
				return "(" + this.printExpr(e13) + ")";
			case 5:
				var fl = _g[2];
				return "{ " + fl.map(function(fld) {
					return "" + fld.field + " : " + _g1.printExpr(fld.expr);
				}).join(", ") + " }";
			case 6:
				var el = _g[2];
				return "[" + this.printExprs(el,", ") + "]";
			case 7:
				var el1 = _g[3];
				var e14 = _g[2];
				return "" + this.printExpr(e14) + "(" + this.printExprs(el1,", ") + ")";
			case 8:
				var el2 = _g[3];
				var tp = _g[2];
				return "new " + this.printTypePath(tp) + "(" + this.printExprs(el2,", ") + ")";
			case 9:
				switch(_g[3]) {
				case true:
					var e15 = _g[4];
					var op1 = _g[2];
					return this.printExpr(e15) + this.printUnop(op1);
				case false:
					var e16 = _g[4];
					var op2 = _g[2];
					return this.printUnop(op2) + this.printExpr(e16);
				}
				break;
			case 11:
				var func = _g[3];
				var no = _g[2];
				if(no != null) return "function " + no + this.printFunction(func); else {
					var func1 = _g[3];
					return "function" + this.printFunction(func1);
				}
				break;
			case 10:
				var vl = _g[2];
				return "var " + vl.map($bind(this,this.printVar)).join(", ");
			case 12:
				var el3 = _g[2];
				switch(_g[2].length) {
				case 0:
					return "{ }";
				default:
					var old = this.tabs;
					this.tabs += this.tabString;
					var s = "{\n" + this.tabs + this.printExprs(el3,";\n" + this.tabs);
					this.tabs = old;
					return s + (";\n" + this.tabs + "}");
				}
				break;
			case 13:
				var e22 = _g[3];
				var e17 = _g[2];
				return "for (" + this.printExpr(e17) + ") " + this.printExpr(e22);
			case 14:
				var e23 = _g[3];
				var e18 = _g[2];
				return "" + this.printExpr(e18) + " in " + this.printExpr(e23);
			case 15:
				var eelse = _g[4];
				if(_g[4] == null) {
					var econd = _g[2];
					var eif = _g[3];
					return "if (" + this.printExpr(econd) + ") " + this.printExpr(eif);
				} else switch(_g[4]) {
				default:
					var econd1 = _g[2];
					var eif1 = _g[3];
					return "if (" + this.printExpr(econd1) + ") " + this.printExpr(eif1) + " else " + this.printExpr(eelse);
				}
				break;
			case 16:
				switch(_g[4]) {
				case true:
					var econd2 = _g[2];
					var e19 = _g[3];
					return "while (" + this.printExpr(econd2) + ") " + this.printExpr(e19);
				case false:
					var econd3 = _g[2];
					var e110 = _g[3];
					return "do " + this.printExpr(e110) + " while (" + this.printExpr(econd3) + ")";
				}
				break;
			case 17:
				var edef = _g[4];
				var cl = _g[3];
				var e111 = _g[2];
				var old1 = this.tabs;
				this.tabs += this.tabString;
				var s1 = "switch " + this.printExpr(e111) + " {\n" + this.tabs + cl.map(function(c1) {
					return "case " + _g1.printExprs(c1.values,", ") + (c1.guard != null?" if (" + _g1.printExpr(c1.guard) + "):":":") + (c1.expr != null?_g1.opt(c1.expr,$bind(_g1,_g1.printExpr)) + ";":"");
				}).join("\n" + this.tabs);
				if(edef != null) s1 += "\n" + this.tabs + "default:" + (edef.expr == null?"":this.printExpr(edef) + ";");
				this.tabs = old1;
				return s1 + ("\n" + this.tabs + "}");
			case 18:
				var cl1 = _g[3];
				var e112 = _g[2];
				return "try " + this.printExpr(e112) + cl1.map(function(c2) {
					return " catch(" + c2.name + ":" + _g1.printComplexType(c2.type) + ") " + _g1.printExpr(c2.expr);
				}).join("");
			case 19:
				var eo = _g[2];
				return "return" + this.opt(eo,$bind(this,this.printExpr)," ");
			case 20:
				return "break";
			case 21:
				return "continue";
			case 22:
				var e113 = _g[2];
				return "untyped " + this.printExpr(e113);
			case 23:
				var e114 = _g[2];
				return "throw " + this.printExpr(e114);
			case 24:
				var cto = _g[3];
				var e115 = _g[2];
				if(cto != null) return "cast(" + this.printExpr(e115) + ", " + this.printComplexType(cto) + ")"; else {
					var e116 = _g[2];
					return "cast " + this.printExpr(e116);
				}
				break;
			case 25:
				var e117 = _g[2];
				return "#DISPLAY(" + this.printExpr(e117) + ")";
			case 26:
				var tp1 = _g[2];
				return "#DISPLAY(" + this.printTypePath(tp1) + ")";
			case 27:
				var eelse1 = _g[4];
				var eif2 = _g[3];
				var econd4 = _g[2];
				return "" + this.printExpr(econd4) + " ? " + this.printExpr(eif2) + " : " + this.printExpr(eelse1);
			case 28:
				var ct = _g[3];
				var e118 = _g[2];
				return "(" + this.printExpr(e118) + " : " + this.printComplexType(ct) + ")";
			case 29:
				var e119 = _g[3];
				var meta = _g[2];
				return this.printMetadata(meta) + " " + this.printExpr(e119);
			}
		}
	}
	,printExprs: function(el,sep) {
		return el.map($bind(this,this.printExpr)).join(sep);
	}
	,opt: function(v,f,prefix) {
		if(prefix == null) prefix = "";
		if(v == null) return ""; else return prefix + f(v);
	}
	,__class__: haxe_macro_Printer
};
var haxe_xml__$Fast_NodeAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.NodeAccess"] = haxe_xml__$Fast_NodeAccess;
haxe_xml__$Fast_NodeAccess.__name__ = ["haxe","xml","_Fast","NodeAccess"];
haxe_xml__$Fast_NodeAccess.prototype = {
	__x: null
	,resolve: function(name) {
		var x = this.__x.elementsNamed(name).next();
		if(x == null) {
			var xname;
			if(this.__x.nodeType == Xml.Document) xname = "Document"; else xname = this.__x.get_nodeName();
			throw new js__$Boot_HaxeError(xname + " is missing element " + name);
		}
		return new haxe_xml_Fast(x);
	}
	,__class__: haxe_xml__$Fast_NodeAccess
};
var haxe_xml__$Fast_AttribAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.AttribAccess"] = haxe_xml__$Fast_AttribAccess;
haxe_xml__$Fast_AttribAccess.__name__ = ["haxe","xml","_Fast","AttribAccess"];
haxe_xml__$Fast_AttribAccess.prototype = {
	__x: null
	,resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw new js__$Boot_HaxeError("Cannot access document attribute " + name);
		var v = this.__x.get(name);
		if(v == null) throw new js__$Boot_HaxeError(this.__x.get_nodeName() + " is missing attribute " + name);
		return v;
	}
	,__class__: haxe_xml__$Fast_AttribAccess
};
var haxe_xml__$Fast_HasAttribAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.HasAttribAccess"] = haxe_xml__$Fast_HasAttribAccess;
haxe_xml__$Fast_HasAttribAccess.__name__ = ["haxe","xml","_Fast","HasAttribAccess"];
haxe_xml__$Fast_HasAttribAccess.prototype = {
	__x: null
	,resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw new js__$Boot_HaxeError("Cannot access document attribute " + name);
		return this.__x.exists(name);
	}
	,__class__: haxe_xml__$Fast_HasAttribAccess
};
var haxe_xml__$Fast_HasNodeAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.HasNodeAccess"] = haxe_xml__$Fast_HasNodeAccess;
haxe_xml__$Fast_HasNodeAccess.__name__ = ["haxe","xml","_Fast","HasNodeAccess"];
haxe_xml__$Fast_HasNodeAccess.prototype = {
	__x: null
	,resolve: function(name) {
		return this.__x.elementsNamed(name).hasNext();
	}
	,__class__: haxe_xml__$Fast_HasNodeAccess
};
var haxe_xml__$Fast_NodeListAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.NodeListAccess"] = haxe_xml__$Fast_NodeListAccess;
haxe_xml__$Fast_NodeListAccess.__name__ = ["haxe","xml","_Fast","NodeListAccess"];
haxe_xml__$Fast_NodeListAccess.prototype = {
	__x: null
	,resolve: function(name) {
		var l = new List();
		var $it0 = this.__x.elementsNamed(name);
		while( $it0.hasNext() ) {
			var x = $it0.next();
			l.add(new haxe_xml_Fast(x));
		}
		return l;
	}
	,__class__: haxe_xml__$Fast_NodeListAccess
};
var haxe_xml_Fast = function(x) {
	if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Invalid nodeType " + x.nodeType);
	this.x = x;
	this.node = new haxe_xml__$Fast_NodeAccess(x);
	this.nodes = new haxe_xml__$Fast_NodeListAccess(x);
	this.att = new haxe_xml__$Fast_AttribAccess(x);
	this.has = new haxe_xml__$Fast_HasAttribAccess(x);
	this.hasNode = new haxe_xml__$Fast_HasNodeAccess(x);
};
$hxClasses["haxe.xml.Fast"] = haxe_xml_Fast;
haxe_xml_Fast.__name__ = ["haxe","xml","Fast"];
haxe_xml_Fast.prototype = {
	x: null
	,node: null
	,nodes: null
	,att: null
	,has: null
	,hasNode: null
	,get_name: function() {
		if(this.x.nodeType == Xml.Document) return "Document"; else return this.x.get_nodeName();
	}
	,get_innerData: function() {
		var it = this.x.iterator();
		if(!it.hasNext()) throw new js__$Boot_HaxeError(this.get_name() + " does not have data");
		var v = it.next();
		var n = it.next();
		if(n != null) {
			if(v.nodeType == Xml.PCData && n.nodeType == Xml.CData && StringTools.trim((function($this) {
				var $r;
				if(v.nodeType == Xml.Document || v.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + v.nodeType);
				$r = v.nodeValue;
				return $r;
			}(this))) == "") {
				var n2 = it.next();
				if(n2 == null || n2.nodeType == Xml.PCData && StringTools.trim((function($this) {
					var $r;
					if(n2.nodeType == Xml.Document || n2.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + n2.nodeType);
					$r = n2.nodeValue;
					return $r;
				}(this))) == "" && it.next() == null) {
					if(n.nodeType == Xml.Document || n.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + n.nodeType);
					return n.nodeValue;
				}
			}
			throw new js__$Boot_HaxeError(this.get_name() + " does not only have data");
		}
		if(v.nodeType != Xml.PCData && v.nodeType != Xml.CData) throw new js__$Boot_HaxeError(this.get_name() + " does not have data");
		if(v.nodeType == Xml.Document || v.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + v.nodeType);
		return v.nodeValue;
	}
	,get_innerHTML: function() {
		var s = new StringBuf();
		var $it0 = this.x.iterator();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			s.add(haxe_xml_Printer.print(x));
		}
		return s.b;
	}
	,get_elements: function() {
		var it = this.x.elements();
		return { hasNext : $bind(it,it.hasNext), next : function() {
			var x = it.next();
			if(x == null) return null;
			return new haxe_xml_Fast(x);
		}};
	}
	,__class__: haxe_xml_Fast
};
var haxe_xml_Parser = function() { };
$hxClasses["haxe.xml.Parser"] = haxe_xml_Parser;
haxe_xml_Parser.__name__ = ["haxe","xml","Parser"];
haxe_xml_Parser.parse = function(str,strict) {
	if(strict == null) strict = false;
	var doc = Xml.createDocument();
	haxe_xml_Parser.doParse(str,strict,0,doc);
	return doc;
};
haxe_xml_Parser.doParse = function(str,strict,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	var buf = new StringBuf();
	var escapeNext = 1;
	var attrValQuote = -1;
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				buf.addSub(str,start,p - start);
				var child = Xml.createPCData(buf.b);
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				escapeNext = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child1 = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child1);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw new js__$Boot_HaxeError("Expected <![CDATA[");
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw new js__$Boot_HaxeError("Expected <!DOCTYPE");
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw new js__$Boot_HaxeError("Expected <!--"); else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw new js__$Boot_HaxeError("Expected node name");
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw new js__$Boot_HaxeError("Expected node name");
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				nsubs++;
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				break;
			case 62:
				state = 9;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw new js__$Boot_HaxeError("Expected attribute name");
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw new js__$Boot_HaxeError("Duplicate attribute");
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw new js__$Boot_HaxeError("Expected =");
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				buf = new StringBuf();
				state = 8;
				start = p + 1;
				attrValQuote = c;
				break;
			default:
				throw new js__$Boot_HaxeError("Expected \"");
			}
			break;
		case 8:
			switch(c) {
			case 38:
				buf.addSub(str,start,p - start);
				state = 18;
				escapeNext = 8;
				start = p + 1;
				break;
			case 62:
				if(strict) throw new js__$Boot_HaxeError("Invalid unescaped " + String.fromCharCode(c) + " in attribute value"); else if(c == attrValQuote) {
					buf.addSub(str,start,p - start);
					var val = buf.b;
					buf = new StringBuf();
					xml.set(aname,val);
					state = 0;
					next = 4;
				}
				break;
			case 60:
				if(strict) throw new js__$Boot_HaxeError("Invalid unescaped " + String.fromCharCode(c) + " in attribute value"); else if(c == attrValQuote) {
					buf.addSub(str,start,p - start);
					var val1 = buf.b;
					buf = new StringBuf();
					xml.set(aname,val1);
					state = 0;
					next = 4;
				}
				break;
			default:
				if(c == attrValQuote) {
					buf.addSub(str,start,p - start);
					var val2 = buf.b;
					buf = new StringBuf();
					xml.set(aname,val2);
					state = 0;
					next = 4;
				}
			}
			break;
		case 9:
			p = haxe_xml_Parser.doParse(str,strict,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw new js__$Boot_HaxeError("Expected >");
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw new js__$Boot_HaxeError("Expected >");
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw new js__$Boot_HaxeError("Expected node name");
				var v = HxOverrides.substr(str,start,p - start);
				if(v != (function($this) {
					var $r;
					if(parent.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + parent.nodeType);
					$r = parent.nodeName;
					return $r;
				}(this))) throw new js__$Boot_HaxeError("Expected </" + (function($this) {
					var $r;
					if(parent.nodeType != Xml.Element) throw "Bad node type, expected Element but found " + parent.nodeType;
					$r = parent.nodeName;
					return $r;
				}(this)) + ">");
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				var xml1 = Xml.createComment(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml1);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				var xml2 = Xml.createDocType(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml2);
				nsubs++;
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				var xml3 = Xml.createProcessingInstruction(str1);
				parent.addChild(xml3);
				nsubs++;
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var c1;
					if(s.charCodeAt(1) == 120) c1 = Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)); else c1 = Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.b += String.fromCharCode(c1);
				} else if(!haxe_xml_Parser.escapes.exists(s)) {
					if(strict) throw new js__$Boot_HaxeError("Undefined entity: " + s);
					buf.b += Std.string("&" + s + ";");
				} else buf.add(haxe_xml_Parser.escapes.get(s));
				start = p + 1;
				state = escapeNext;
			} else if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45) && c != 35) {
				if(strict) throw new js__$Boot_HaxeError("Invalid character in entity: " + String.fromCharCode(c));
				buf.b += "&";
				buf.addSub(str,start,p - start);
				p--;
				start = p + 1;
				state = escapeNext;
			}
			break;
		}
		c = StringTools.fastCodeAt(str,++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) {
			buf.addSub(str,start,p - start);
			var xml4 = Xml.createPCData(buf.b);
			parent.addChild(xml4);
			nsubs++;
		}
		return p;
	}
	if(!strict && state == 18 && escapeNext == 13) {
		buf.b += "&";
		buf.addSub(str,start,p - start);
		var xml5 = Xml.createPCData(buf.b);
		parent.addChild(xml5);
		nsubs++;
		return p;
	}
	throw new js__$Boot_HaxeError("Unexpected end");
};
var haxe_xml_Printer = function(pretty) {
	this.output = new StringBuf();
	this.pretty = pretty;
};
$hxClasses["haxe.xml.Printer"] = haxe_xml_Printer;
haxe_xml_Printer.__name__ = ["haxe","xml","Printer"];
haxe_xml_Printer.print = function(xml,pretty) {
	if(pretty == null) pretty = false;
	var printer = new haxe_xml_Printer(pretty);
	printer.writeNode(xml,"");
	return printer.output.b;
};
haxe_xml_Printer.prototype = {
	output: null
	,pretty: null
	,writeNode: function(value,tabs) {
		var _g = value.nodeType;
		switch(_g) {
		case 2:
			this.output.b += Std.string(tabs + "<![CDATA[");
			this.write(StringTools.trim((function($this) {
				var $r;
				if(value.nodeType == Xml.Document || value.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + value.nodeType);
				$r = value.nodeValue;
				return $r;
			}(this))));
			this.output.b += "]]>";
			if(this.pretty) this.output.b += "";
			break;
		case 3:
			var commentContent;
			if(value.nodeType == Xml.Document || value.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + value.nodeType);
			commentContent = value.nodeValue;
			commentContent = new EReg("[\n\r\t]+","g").replace(commentContent,"");
			commentContent = "<!--" + commentContent + "-->";
			if(tabs == null) this.output.b += "null"; else this.output.b += "" + tabs;
			this.write(StringTools.trim(commentContent));
			if(this.pretty) this.output.b += "";
			break;
		case 6:
			var $it0 = (function($this) {
				var $r;
				if(value.nodeType != Xml.Document && value.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element or Document but found " + value.nodeType);
				$r = HxOverrides.iter(value.children);
				return $r;
			}(this));
			while( $it0.hasNext() ) {
				var child = $it0.next();
				this.writeNode(child,tabs);
			}
			break;
		case 0:
			this.output.b += Std.string(tabs + "<");
			this.write((function($this) {
				var $r;
				if(value.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + value.nodeType);
				$r = value.nodeName;
				return $r;
			}(this)));
			var $it1 = value.attributes();
			while( $it1.hasNext() ) {
				var attribute = $it1.next();
				this.output.b += Std.string(" " + attribute + "=\"");
				this.write(StringTools.htmlEscape(value.get(attribute),true));
				this.output.b += "\"";
			}
			if(this.hasChildren(value)) {
				this.output.b += ">";
				if(this.pretty) this.output.b += "";
				var $it2 = (function($this) {
					var $r;
					if(value.nodeType != Xml.Document && value.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element or Document but found " + value.nodeType);
					$r = HxOverrides.iter(value.children);
					return $r;
				}(this));
				while( $it2.hasNext() ) {
					var child1 = $it2.next();
					this.writeNode(child1,this.pretty?tabs + "\t":tabs);
				}
				this.output.b += Std.string(tabs + "</");
				this.write((function($this) {
					var $r;
					if(value.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + value.nodeType);
					$r = value.nodeName;
					return $r;
				}(this)));
				this.output.b += ">";
				if(this.pretty) this.output.b += "";
			} else {
				this.output.b += "/>";
				if(this.pretty) this.output.b += "";
			}
			break;
		case 1:
			var nodeValue;
			if(value.nodeType == Xml.Document || value.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + value.nodeType);
			nodeValue = value.nodeValue;
			if(nodeValue.length != 0) {
				this.write(tabs + StringTools.htmlEscape(nodeValue));
				if(this.pretty) this.output.b += "";
			}
			break;
		case 5:
			this.write("<?" + (function($this) {
				var $r;
				if(value.nodeType == Xml.Document || value.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + value.nodeType);
				$r = value.nodeValue;
				return $r;
			}(this)) + "?>");
			break;
		case 4:
			this.write("<!DOCTYPE " + (function($this) {
				var $r;
				if(value.nodeType == Xml.Document || value.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + value.nodeType);
				$r = value.nodeValue;
				return $r;
			}(this)) + ">");
			break;
		}
	}
	,write: function(input) {
		if(input == null) this.output.b += "null"; else this.output.b += "" + input;
	}
	,hasChildren: function(value) {
		var $it0 = (function($this) {
			var $r;
			if(value.nodeType != Xml.Document && value.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element or Document but found " + value.nodeType);
			$r = HxOverrides.iter(value.children);
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var child = $it0.next();
			var _g = child.nodeType;
			switch(_g) {
			case 0:case 1:
				return true;
			case 2:case 3:
				if(StringTools.ltrim((function($this) {
					var $r;
					if(child.nodeType == Xml.Document || child.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + child.nodeType);
					$r = child.nodeValue;
					return $r;
				}(this))).length != 0) return true;
				break;
			default:
			}
		}
		return false;
	}
	,__class__: haxe_xml_Printer
};
var haxeparser_Keyword = $hxClasses["haxeparser.Keyword"] = { __ename__ : ["haxeparser","Keyword"], __constructs__ : ["KwdFunction","KwdClass","KwdVar","KwdIf","KwdElse","KwdWhile","KwdDo","KwdFor","KwdBreak","KwdContinue","KwdReturn","KwdExtends","KwdImplements","KwdImport","KwdSwitch","KwdCase","KwdDefault","KwdStatic","KwdPublic","KwdPrivate","KwdTry","KwdCatch","KwdNew","KwdThis","KwdThrow","KwdExtern","KwdEnum","KwdIn","KwdInterface","KwdUntyped","KwdCast","KwdOverride","KwdTypedef","KwdDynamic","KwdPackage","KwdInline","KwdUsing","KwdNull","KwdTrue","KwdFalse","KwdAbstract","KwdMacro"] };
haxeparser_Keyword.KwdFunction = ["KwdFunction",0];
haxeparser_Keyword.KwdFunction.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdClass = ["KwdClass",1];
haxeparser_Keyword.KwdClass.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdVar = ["KwdVar",2];
haxeparser_Keyword.KwdVar.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdIf = ["KwdIf",3];
haxeparser_Keyword.KwdIf.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdElse = ["KwdElse",4];
haxeparser_Keyword.KwdElse.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdWhile = ["KwdWhile",5];
haxeparser_Keyword.KwdWhile.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdDo = ["KwdDo",6];
haxeparser_Keyword.KwdDo.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdFor = ["KwdFor",7];
haxeparser_Keyword.KwdFor.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdBreak = ["KwdBreak",8];
haxeparser_Keyword.KwdBreak.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdContinue = ["KwdContinue",9];
haxeparser_Keyword.KwdContinue.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdReturn = ["KwdReturn",10];
haxeparser_Keyword.KwdReturn.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdExtends = ["KwdExtends",11];
haxeparser_Keyword.KwdExtends.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdImplements = ["KwdImplements",12];
haxeparser_Keyword.KwdImplements.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdImport = ["KwdImport",13];
haxeparser_Keyword.KwdImport.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdSwitch = ["KwdSwitch",14];
haxeparser_Keyword.KwdSwitch.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdCase = ["KwdCase",15];
haxeparser_Keyword.KwdCase.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdDefault = ["KwdDefault",16];
haxeparser_Keyword.KwdDefault.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdStatic = ["KwdStatic",17];
haxeparser_Keyword.KwdStatic.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdPublic = ["KwdPublic",18];
haxeparser_Keyword.KwdPublic.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdPrivate = ["KwdPrivate",19];
haxeparser_Keyword.KwdPrivate.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdTry = ["KwdTry",20];
haxeparser_Keyword.KwdTry.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdCatch = ["KwdCatch",21];
haxeparser_Keyword.KwdCatch.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdNew = ["KwdNew",22];
haxeparser_Keyword.KwdNew.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdThis = ["KwdThis",23];
haxeparser_Keyword.KwdThis.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdThrow = ["KwdThrow",24];
haxeparser_Keyword.KwdThrow.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdExtern = ["KwdExtern",25];
haxeparser_Keyword.KwdExtern.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdEnum = ["KwdEnum",26];
haxeparser_Keyword.KwdEnum.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdIn = ["KwdIn",27];
haxeparser_Keyword.KwdIn.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdInterface = ["KwdInterface",28];
haxeparser_Keyword.KwdInterface.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdUntyped = ["KwdUntyped",29];
haxeparser_Keyword.KwdUntyped.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdCast = ["KwdCast",30];
haxeparser_Keyword.KwdCast.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdOverride = ["KwdOverride",31];
haxeparser_Keyword.KwdOverride.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdTypedef = ["KwdTypedef",32];
haxeparser_Keyword.KwdTypedef.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdDynamic = ["KwdDynamic",33];
haxeparser_Keyword.KwdDynamic.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdPackage = ["KwdPackage",34];
haxeparser_Keyword.KwdPackage.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdInline = ["KwdInline",35];
haxeparser_Keyword.KwdInline.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdUsing = ["KwdUsing",36];
haxeparser_Keyword.KwdUsing.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdNull = ["KwdNull",37];
haxeparser_Keyword.KwdNull.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdTrue = ["KwdTrue",38];
haxeparser_Keyword.KwdTrue.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdFalse = ["KwdFalse",39];
haxeparser_Keyword.KwdFalse.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdAbstract = ["KwdAbstract",40];
haxeparser_Keyword.KwdAbstract.__enum__ = haxeparser_Keyword;
haxeparser_Keyword.KwdMacro = ["KwdMacro",41];
haxeparser_Keyword.KwdMacro.__enum__ = haxeparser_Keyword;
var haxeparser_TokenDef = $hxClasses["haxeparser.TokenDef"] = { __ename__ : ["haxeparser","TokenDef"], __constructs__ : ["Kwd","Const","Sharp","Dollar","Unop","Binop","Comment","CommentLine","IntInterval","Semicolon","Dot","DblDot","Arrow","Comma","BkOpen","BkClose","BrOpen","BrClose","POpen","PClose","Question","At","Eof"] };
haxeparser_TokenDef.Kwd = function(k) { var $x = ["Kwd",0,k]; $x.__enum__ = haxeparser_TokenDef; return $x; };
haxeparser_TokenDef.Const = function(c) { var $x = ["Const",1,c]; $x.__enum__ = haxeparser_TokenDef; return $x; };
haxeparser_TokenDef.Sharp = function(s) { var $x = ["Sharp",2,s]; $x.__enum__ = haxeparser_TokenDef; return $x; };
haxeparser_TokenDef.Dollar = function(s) { var $x = ["Dollar",3,s]; $x.__enum__ = haxeparser_TokenDef; return $x; };
haxeparser_TokenDef.Unop = function(op) { var $x = ["Unop",4,op]; $x.__enum__ = haxeparser_TokenDef; return $x; };
haxeparser_TokenDef.Binop = function(op) { var $x = ["Binop",5,op]; $x.__enum__ = haxeparser_TokenDef; return $x; };
haxeparser_TokenDef.Comment = function(s) { var $x = ["Comment",6,s]; $x.__enum__ = haxeparser_TokenDef; return $x; };
haxeparser_TokenDef.CommentLine = function(s) { var $x = ["CommentLine",7,s]; $x.__enum__ = haxeparser_TokenDef; return $x; };
haxeparser_TokenDef.IntInterval = function(s) { var $x = ["IntInterval",8,s]; $x.__enum__ = haxeparser_TokenDef; return $x; };
haxeparser_TokenDef.Semicolon = ["Semicolon",9];
haxeparser_TokenDef.Semicolon.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.Dot = ["Dot",10];
haxeparser_TokenDef.Dot.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.DblDot = ["DblDot",11];
haxeparser_TokenDef.DblDot.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.Arrow = ["Arrow",12];
haxeparser_TokenDef.Arrow.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.Comma = ["Comma",13];
haxeparser_TokenDef.Comma.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.BkOpen = ["BkOpen",14];
haxeparser_TokenDef.BkOpen.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.BkClose = ["BkClose",15];
haxeparser_TokenDef.BkClose.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.BrOpen = ["BrOpen",16];
haxeparser_TokenDef.BrOpen.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.BrClose = ["BrClose",17];
haxeparser_TokenDef.BrClose.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.POpen = ["POpen",18];
haxeparser_TokenDef.POpen.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.PClose = ["PClose",19];
haxeparser_TokenDef.PClose.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.Question = ["Question",20];
haxeparser_TokenDef.Question.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.At = ["At",21];
haxeparser_TokenDef.At.__enum__ = haxeparser_TokenDef;
haxeparser_TokenDef.Eof = ["Eof",22];
haxeparser_TokenDef.Eof.__enum__ = haxeparser_TokenDef;
var haxeparser_Token = function(tok,pos) {
	this.tok = tok;
	this.pos = pos;
};
$hxClasses["haxeparser.Token"] = haxeparser_Token;
haxeparser_Token.__name__ = ["haxeparser","Token"];
haxeparser_Token.prototype = {
	tok: null
	,pos: null
	,__class__: haxeparser_Token
};
var haxeparser_TypeDef = $hxClasses["haxeparser.TypeDef"] = { __ename__ : ["haxeparser","TypeDef"], __constructs__ : ["EClass","EEnum","EAbstract","EImport","ETypedef","EUsing"] };
haxeparser_TypeDef.EClass = function(d) { var $x = ["EClass",0,d]; $x.__enum__ = haxeparser_TypeDef; return $x; };
haxeparser_TypeDef.EEnum = function(d) { var $x = ["EEnum",1,d]; $x.__enum__ = haxeparser_TypeDef; return $x; };
haxeparser_TypeDef.EAbstract = function(a) { var $x = ["EAbstract",2,a]; $x.__enum__ = haxeparser_TypeDef; return $x; };
haxeparser_TypeDef.EImport = function(sl,mode) { var $x = ["EImport",3,sl,mode]; $x.__enum__ = haxeparser_TypeDef; return $x; };
haxeparser_TypeDef.ETypedef = function(d) { var $x = ["ETypedef",4,d]; $x.__enum__ = haxeparser_TypeDef; return $x; };
haxeparser_TypeDef.EUsing = function(path) { var $x = ["EUsing",5,path]; $x.__enum__ = haxeparser_TypeDef; return $x; };
var haxeparser_ClassFlag = $hxClasses["haxeparser.ClassFlag"] = { __ename__ : ["haxeparser","ClassFlag"], __constructs__ : ["HInterface","HExtern","HPrivate","HExtends","HImplements"] };
haxeparser_ClassFlag.HInterface = ["HInterface",0];
haxeparser_ClassFlag.HInterface.__enum__ = haxeparser_ClassFlag;
haxeparser_ClassFlag.HExtern = ["HExtern",1];
haxeparser_ClassFlag.HExtern.__enum__ = haxeparser_ClassFlag;
haxeparser_ClassFlag.HPrivate = ["HPrivate",2];
haxeparser_ClassFlag.HPrivate.__enum__ = haxeparser_ClassFlag;
haxeparser_ClassFlag.HExtends = function(t) { var $x = ["HExtends",3,t]; $x.__enum__ = haxeparser_ClassFlag; return $x; };
haxeparser_ClassFlag.HImplements = function(t) { var $x = ["HImplements",4,t]; $x.__enum__ = haxeparser_ClassFlag; return $x; };
var haxeparser_AbstractFlag = $hxClasses["haxeparser.AbstractFlag"] = { __ename__ : ["haxeparser","AbstractFlag"], __constructs__ : ["APrivAbstract","AFromType","AToType","AIsType"] };
haxeparser_AbstractFlag.APrivAbstract = ["APrivAbstract",0];
haxeparser_AbstractFlag.APrivAbstract.__enum__ = haxeparser_AbstractFlag;
haxeparser_AbstractFlag.AFromType = function(ct) { var $x = ["AFromType",1,ct]; $x.__enum__ = haxeparser_AbstractFlag; return $x; };
haxeparser_AbstractFlag.AToType = function(ct) { var $x = ["AToType",2,ct]; $x.__enum__ = haxeparser_AbstractFlag; return $x; };
haxeparser_AbstractFlag.AIsType = function(ct) { var $x = ["AIsType",3,ct]; $x.__enum__ = haxeparser_AbstractFlag; return $x; };
var haxeparser_EnumFlag = $hxClasses["haxeparser.EnumFlag"] = { __ename__ : ["haxeparser","EnumFlag"], __constructs__ : ["EPrivate","EExtern"] };
haxeparser_EnumFlag.EPrivate = ["EPrivate",0];
haxeparser_EnumFlag.EPrivate.__enum__ = haxeparser_EnumFlag;
haxeparser_EnumFlag.EExtern = ["EExtern",1];
haxeparser_EnumFlag.EExtern.__enum__ = haxeparser_EnumFlag;
var haxeparser_ImportMode = $hxClasses["haxeparser.ImportMode"] = { __ename__ : ["haxeparser","ImportMode"], __constructs__ : ["INormal","IAsName","IAll"] };
haxeparser_ImportMode.INormal = ["INormal",0];
haxeparser_ImportMode.INormal.__enum__ = haxeparser_ImportMode;
haxeparser_ImportMode.IAsName = function(s) { var $x = ["IAsName",1,s]; $x.__enum__ = haxeparser_ImportMode; return $x; };
haxeparser_ImportMode.IAll = ["IAll",2];
haxeparser_ImportMode.IAll.__enum__ = haxeparser_ImportMode;
var haxeparser_LexerErrorMsg = $hxClasses["haxeparser.LexerErrorMsg"] = { __ename__ : ["haxeparser","LexerErrorMsg"], __constructs__ : ["UnterminatedString","UnterminatedRegExp","UnclosedComment","UnterminatedEscapeSequence","InvalidEscapeSequence","UnknownEscapeSequence"] };
haxeparser_LexerErrorMsg.UnterminatedString = ["UnterminatedString",0];
haxeparser_LexerErrorMsg.UnterminatedString.__enum__ = haxeparser_LexerErrorMsg;
haxeparser_LexerErrorMsg.UnterminatedRegExp = ["UnterminatedRegExp",1];
haxeparser_LexerErrorMsg.UnterminatedRegExp.__enum__ = haxeparser_LexerErrorMsg;
haxeparser_LexerErrorMsg.UnclosedComment = ["UnclosedComment",2];
haxeparser_LexerErrorMsg.UnclosedComment.__enum__ = haxeparser_LexerErrorMsg;
haxeparser_LexerErrorMsg.UnterminatedEscapeSequence = ["UnterminatedEscapeSequence",3];
haxeparser_LexerErrorMsg.UnterminatedEscapeSequence.__enum__ = haxeparser_LexerErrorMsg;
haxeparser_LexerErrorMsg.InvalidEscapeSequence = function(c) { var $x = ["InvalidEscapeSequence",4,c]; $x.__enum__ = haxeparser_LexerErrorMsg; return $x; };
haxeparser_LexerErrorMsg.UnknownEscapeSequence = function(c) { var $x = ["UnknownEscapeSequence",5,c]; $x.__enum__ = haxeparser_LexerErrorMsg; return $x; };
var haxeparser_LexerError = function(msg,pos) {
	this.msg = msg;
	this.pos = pos;
};
$hxClasses["haxeparser.LexerError"] = haxeparser_LexerError;
haxeparser_LexerError.__name__ = ["haxeparser","LexerError"];
haxeparser_LexerError.prototype = {
	msg: null
	,pos: null
	,__class__: haxeparser_LexerError
};
var hxparse_Lexer = function(input,sourceName) {
	if(sourceName == null) sourceName = "<null>";
	this.current = "";
	this.input = input;
	this.source = sourceName;
	this.pos = 0;
};
$hxClasses["hxparse.Lexer"] = hxparse_Lexer;
hxparse_Lexer.__name__ = ["hxparse","Lexer"];
hxparse_Lexer.buildRuleset = function(rules,name) {
	if(name == null) name = "";
	var cases = [];
	var functions = [];
	var eofFunction = null;
	var _g = 0;
	while(_g < rules.length) {
		var rule = rules[_g];
		++_g;
		if(rule.rule == "") eofFunction = rule.func; else {
			cases.push(hxparse_LexEngine.parse(rule.rule));
			functions.push(rule.func);
		}
	}
	return new hxparse_Ruleset(new hxparse_LexEngine(cases).firstState(),functions,eofFunction,name);
};
hxparse_Lexer.prototype = {
	current: null
	,input: null
	,source: null
	,pos: null
	,curPos: function() {
		return new hxparse_Position(this.source,this.pos - this.current.length,this.pos);
	}
	,token: function(ruleset) {
		if(this.pos == byte_js__$ByteData_ByteData_$Impl_$.get_length(this.input)) {
			if(ruleset.eofFunction != null) return ruleset.eofFunction(this); else throw new js__$Boot_HaxeError(new haxe_io_Eof());
		}
		var state = ruleset.state;
		var lastMatch = null;
		var lastMatchPos = this.pos;
		var start = this.pos;
		while(true) {
			if(state["final"] > -1) {
				lastMatch = state;
				lastMatchPos = this.pos;
			}
			if(this.pos == byte_js__$ByteData_ByteData_$Impl_$.get_length(this.input)) break;
			var i = this.input[this.pos];
			++this.pos;
			state = state.trans[i];
			if(state == null) break;
		}
		this.pos = lastMatchPos;
		this.current = byte_js__$ByteData_ByteData_$Impl_$.readString(this.input,start,this.pos - start);
		if(lastMatch == null || lastMatch["final"] == -1) throw new js__$Boot_HaxeError(new hxparse_UnexpectedChar(String.fromCharCode(this.input[this.pos]),new hxparse_Position(this.source,this.pos - this.current.length,this.pos)));
		return ruleset.functions[lastMatch["final"]](this);
	}
	,__class__: hxparse_Lexer
};
var hxparse_RuleBuilder = function() { };
$hxClasses["hxparse.RuleBuilder"] = hxparse_RuleBuilder;
hxparse_RuleBuilder.__name__ = ["hxparse","RuleBuilder"];
var hxparse_LexEngine = function(patterns) {
	this.nodes = [];
	this.finals = [];
	this.states = [];
	this.hstates = new haxe_ds_StringMap();
	this.uid = 0;
	var pid = 0;
	var _g = 0;
	while(_g < patterns.length) {
		var p = patterns[_g];
		++_g;
		var id = pid++;
		var f = new hxparse__$LexEngine_Node(this.uid++,id);
		var n = this.initNode(p,f,id);
		this.nodes.push(n);
		this.finals.push(f);
	}
	this.makeState(this.addNodes([],this.nodes));
};
$hxClasses["hxparse.LexEngine"] = hxparse_LexEngine;
hxparse_LexEngine.__name__ = ["hxparse","LexEngine"];
hxparse_LexEngine.parse = function(pattern) {
	var p = hxparse_LexEngine.parseInner(byte_js__$ByteData_ByteData_$Impl_$.ofString(pattern));
	if(p == null) throw new js__$Boot_HaxeError("Invalid pattern '" + pattern + "'");
	return p.pattern;
};
hxparse_LexEngine.next = function(a,b) {
	if(a == hxparse__$LexEngine_Pattern.Empty) return b; else return hxparse__$LexEngine_Pattern.Next(a,b);
};
hxparse_LexEngine.plus = function(r) {
	switch(r[1]) {
	case 4:
		var r2 = r[3];
		var r1 = r[2];
		return hxparse__$LexEngine_Pattern.Next(r1,hxparse_LexEngine.plus(r2));
	default:
		return hxparse__$LexEngine_Pattern.Plus(r);
	}
};
hxparse_LexEngine.star = function(r) {
	switch(r[1]) {
	case 4:
		var r2 = r[3];
		var r1 = r[2];
		return hxparse__$LexEngine_Pattern.Next(r1,hxparse_LexEngine.star(r2));
	default:
		return hxparse__$LexEngine_Pattern.Star(r);
	}
};
hxparse_LexEngine.opt = function(r) {
	switch(r[1]) {
	case 4:
		var r2 = r[3];
		var r1 = r[2];
		return hxparse__$LexEngine_Pattern.Next(r1,hxparse_LexEngine.opt(r2));
	default:
		return hxparse__$LexEngine_Pattern.Choice(r,hxparse__$LexEngine_Pattern.Empty);
	}
};
hxparse_LexEngine.cinter = function(c1,c2) {
	return hxparse_LexEngine.ccomplement(hxparse_LexEngine.cunion(hxparse_LexEngine.ccomplement(c1),hxparse_LexEngine.ccomplement(c2)));
};
hxparse_LexEngine.cdiff = function(c1,c2) {
	return hxparse_LexEngine.ccomplement(hxparse_LexEngine.cunion(hxparse_LexEngine.ccomplement(c1),c2));
};
hxparse_LexEngine.ccomplement = function(c) {
	var first = c[0];
	var start;
	if(first != null && first.min == -1) start = c.shift().max + 1; else start = -1;
	var out = [];
	var _g = 0;
	while(_g < c.length) {
		var k = c[_g];
		++_g;
		out.push({ min : start, max : k.min - 1});
		start = k.max + 1;
	}
	if(start <= 255) out.push({ min : start, max : 255});
	return out;
};
hxparse_LexEngine.cunion = function(ca,cb) {
	var i = 0;
	var j = 0;
	var out = [];
	var a = ca[i++];
	var b = cb[j++];
	while(true) {
		if(a == null) {
			out.push(b);
			while(j < cb.length) out.push(cb[j++]);
			break;
		}
		if(b == null) {
			out.push(a);
			while(i < ca.length) out.push(ca[i++]);
			break;
		}
		if(a.min <= b.min) {
			if(a.max + 1 < b.min) {
				out.push(a);
				a = ca[i++];
			} else if(a.max < b.max) {
				b = { min : a.min, max : b.max};
				a = ca[i++];
			} else b = cb[j++];
		} else {
			var tmp = ca;
			ca = cb;
			cb = tmp;
			var tmp1 = j;
			j = i;
			i = tmp1;
			var tmp2 = a;
			a = b;
			b = tmp2;
		}
	}
	return out;
};
hxparse_LexEngine.parseInner = function(pattern,i,pDepth) {
	if(pDepth == null) pDepth = 0;
	if(i == null) i = 0;
	var r = hxparse__$LexEngine_Pattern.Empty;
	var l = byte_js__$ByteData_ByteData_$Impl_$.get_length(pattern);
	while(i < l) {
		var c;
		var pos = i++;
		c = pattern[pos];
		if(c > 255) throw new js__$Boot_HaxeError(c);
		switch(c) {
		case 43:
			if(r != hxparse__$LexEngine_Pattern.Empty) r = hxparse_LexEngine.plus(r); else r = hxparse_LexEngine.next(r,hxparse__$LexEngine_Pattern.Match([{ min : c, max : c}]));
			break;
		case 42:
			if(r != hxparse__$LexEngine_Pattern.Empty) r = hxparse_LexEngine.star(r); else r = hxparse_LexEngine.next(r,hxparse__$LexEngine_Pattern.Match([{ min : c, max : c}]));
			break;
		case 63:
			if(r != hxparse__$LexEngine_Pattern.Empty) r = hxparse_LexEngine.opt(r); else r = hxparse_LexEngine.next(r,hxparse__$LexEngine_Pattern.Match([{ min : c, max : c}]));
			break;
		case 124:
			if(r != hxparse__$LexEngine_Pattern.Empty) {
				var r2 = hxparse_LexEngine.parseInner(pattern,i);
				return { pattern : hxparse__$LexEngine_Pattern.Choice(r,r2.pattern), pos : r2.pos};
			} else r = hxparse_LexEngine.next(r,hxparse__$LexEngine_Pattern.Match([{ min : c, max : c}]));
			break;
		case 46:
			r = hxparse_LexEngine.next(r,hxparse__$LexEngine_Pattern.Match(hxparse_LexEngine.ALL_CHARS));
			break;
		case 40:
			var r21 = hxparse_LexEngine.parseInner(pattern,i,pDepth + 1);
			i = r21.pos;
			r = hxparse_LexEngine.next(r,r21.pattern);
			break;
		case 41:
			if(r == hxparse__$LexEngine_Pattern.Empty) throw new js__$Boot_HaxeError("Empty group");
			return { pattern : hxparse__$LexEngine_Pattern.Group(r), pos : i};
		case 91:
			if(byte_js__$ByteData_ByteData_$Impl_$.get_length(pattern) > 1) {
				var range = 0;
				var acc = [];
				var not = pattern[i] == 94;
				if(not) i++;
				while(true) {
					var c1;
					var pos1 = i++;
					c1 = pattern[pos1];
					if(c1 == 93) {
						if(range != 0) return null;
						break;
					} else if(c1 == 45) {
						if(range != 0) return null;
						var last = acc.pop();
						if(last == null) acc.push({ min : c1, max : c1}); else {
							if(last.min != last.max) return null;
							range = last.min;
						}
					} else {
						if(c1 == 92) {
							var pos2 = i++;
							c1 = pattern[pos2];
						}
						if(range == 0) acc.push({ min : c1, max : c1}); else {
							acc.push({ min : range, max : c1});
							range = 0;
						}
					}
				}
				var g = [];
				var _g = 0;
				while(_g < acc.length) {
					var k = acc[_g];
					++_g;
					g = hxparse_LexEngine.cunion(g,[k]);
				}
				if(not) g = hxparse_LexEngine.cdiff(hxparse_LexEngine.ALL_CHARS,g);
				r = hxparse_LexEngine.next(r,hxparse__$LexEngine_Pattern.Match(g));
			} else r = hxparse_LexEngine.next(r,hxparse__$LexEngine_Pattern.Match([{ min : c, max : c}]));
			break;
		case 92:
			var pos3 = i++;
			c = pattern[pos3];
			if(c != c) c = 92; else if(c >= 48 && c <= 57) {
				var v = c - 48;
				while(true) {
					var cNext = pattern[i];
					if(cNext >= 48 && cNext <= 57) {
						v = v * 10 + (cNext - 48);
						++i;
					} else break;
				}
				c = v;
			}
			r = hxparse_LexEngine.next(r,hxparse__$LexEngine_Pattern.Match([{ min : c, max : c}]));
			break;
		default:
			r = hxparse_LexEngine.next(r,hxparse__$LexEngine_Pattern.Match([{ min : c, max : c}]));
		}
	}
	if(pDepth != 0) throw new js__$Boot_HaxeError("Found unclosed parenthesis while parsing \"" + Std.string(pattern) + "\"");
	return { pattern : r, pos : i};
};
hxparse_LexEngine.prototype = {
	uid: null
	,nodes: null
	,finals: null
	,states: null
	,hstates: null
	,firstState: function() {
		return this.states[0];
	}
	,makeState: function(nodes) {
		var _g = this;
		var buf_b = "";
		var _g4 = 0;
		while(_g4 < nodes.length) {
			var n1 = nodes[_g4];
			++_g4;
			if(n1.id == null) buf_b += "null"; else buf_b += "" + n1.id;
			buf_b += "-";
		}
		var key = buf_b;
		var s = this.hstates.get(key);
		if(s != null) return s;
		s = new hxparse_State();
		this.states.push(s);
		this.hstates.set(key,s);
		var trans = this.getTransitions(nodes);
		var _g5 = 0;
		while(_g5 < trans.length) {
			var t = trans[_g5];
			++_g5;
			var target = this.makeState(t.n);
			var _g11 = 0;
			var _g21 = t.chars;
			while(_g11 < _g21.length) {
				var chr = _g21[_g11];
				++_g11;
				var _g41 = chr.min;
				var _g31 = chr.max + 1;
				while(_g41 < _g31) {
					var i = _g41++;
					s.trans[i] = target;
				}
			}
		}
		var setFinal = function() {
			var _g1 = 0;
			var _g2 = _g.finals;
			while(_g1 < _g2.length) {
				var f = _g2[_g1];
				++_g1;
				var _g3 = 0;
				while(_g3 < nodes.length) {
					var n = nodes[_g3];
					++_g3;
					if(n == f) {
						s["final"] = n.pid;
						return;
					}
				}
			}
		};
		if(s["final"] == -1) setFinal();
		return s;
	}
	,getTransitions: function(nodes) {
		var tl = [];
		var _g = 0;
		while(_g < nodes.length) {
			var n = nodes[_g];
			++_g;
			var _g1 = 0;
			var _g2 = n.trans;
			while(_g1 < _g2.length) {
				var t = _g2[_g1];
				++_g1;
				tl.push(t);
			}
		}
		tl.sort(function(t1,t2) {
			return t1.n.id - t2.n.id;
		});
		var t0 = tl[0];
		var _g11 = 1;
		var _g3 = tl.length;
		while(_g11 < _g3) {
			var i = _g11++;
			var t11 = tl[i];
			if(t0.n == t11.n) {
				tl[i - 1] = null;
				t11 = { chars : hxparse_LexEngine.cunion(t0.chars,t11.chars), n : t11.n};
				tl[i] = t11;
			}
			t0 = t11;
		}
		while(HxOverrides.remove(tl,null)) {
		}
		var allChars = hxparse_LexEngine.EMPTY;
		var allStates = new List();
		var _g4 = 0;
		while(_g4 < tl.length) {
			var t3 = tl[_g4];
			++_g4;
			var states1 = new List();
			states1.push({ chars : hxparse_LexEngine.cdiff(t3.chars,allChars), n : [t3.n]});
			var _g1_head = allStates.h;
			var _g1_val = null;
			while(_g1_head != null) {
				var s;
				s = (function($this) {
					var $r;
					_g1_val = _g1_head[0];
					_g1_head = _g1_head[1];
					$r = _g1_val;
					return $r;
				}(this));
				var nodes1 = s.n.slice();
				nodes1.push(t3.n);
				states1.push({ chars : hxparse_LexEngine.cinter(s.chars,t3.chars), n : nodes1});
				states1.push({ chars : hxparse_LexEngine.cdiff(s.chars,t3.chars), n : s.n});
			}
			var _g1_head1 = states1.h;
			var _g1_val1 = null;
			while(_g1_head1 != null) {
				var s1;
				s1 = (function($this) {
					var $r;
					_g1_val1 = _g1_head1[0];
					_g1_head1 = _g1_head1[1];
					$r = _g1_val1;
					return $r;
				}(this));
				if(s1.chars.length == 0) states1.remove(s1);
			}
			allChars = hxparse_LexEngine.cunion(allChars,t3.chars);
			allStates = states1;
		}
		var states = [];
		var _g_head = allStates.h;
		var _g_val = null;
		while(_g_head != null) {
			var s2;
			s2 = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			states.push({ chars : s2.chars, n : this.addNodes([],s2.n)});
		}
		states.sort(function(s11,s21) {
			var a = s11.chars.length;
			var b = s21.chars.length;
			var _g12 = 0;
			var _g5;
			if(a < b) _g5 = a; else _g5 = b;
			while(_g12 < _g5) {
				var i1 = _g12++;
				var a1 = s11.chars[i1];
				var b1 = s21.chars[i1];
				if(a1.min != b1.min) return b1.min - a1.min;
				if(a1.max != b1.max) return b1.max - a1.max;
			}
			if(a < b) return b - a;
			return 0;
		});
		return states;
	}
	,addNode: function(nodes,n) {
		var _g = 0;
		while(_g < nodes.length) {
			var n2 = nodes[_g];
			++_g;
			if(n == n2) return;
		}
		nodes.push(n);
		this.addNodes(nodes,n.epsilon);
	}
	,addNodes: function(nodes,add) {
		var _g = 0;
		while(_g < add.length) {
			var n = add[_g];
			++_g;
			this.addNode(nodes,n);
		}
		return nodes;
	}
	,initNode: function(p,$final,pid) {
		switch(p[1]) {
		case 0:
			return $final;
		case 1:
			var c = p[2];
			var n = new hxparse__$LexEngine_Node(this.uid++,pid);
			n.trans.push({ chars : c, n : $final});
			return n;
		case 2:
			var p1 = p[2];
			var n1 = new hxparse__$LexEngine_Node(this.uid++,pid);
			var an = this.initNode(p1,n1,pid);
			n1.epsilon.push(an);
			n1.epsilon.push($final);
			return n1;
		case 3:
			var p2 = p[2];
			var n2 = new hxparse__$LexEngine_Node(this.uid++,pid);
			var an1 = this.initNode(p2,n2,pid);
			n2.epsilon.push(an1);
			n2.epsilon.push($final);
			return an1;
		case 4:
			var b = p[3];
			var a = p[2];
			return this.initNode(a,this.initNode(b,$final,pid),pid);
		case 5:
			var b1 = p[3];
			var a1 = p[2];
			var n3 = new hxparse__$LexEngine_Node(this.uid++,pid);
			n3.epsilon.push(this.initNode(a1,$final,pid));
			n3.epsilon.push(this.initNode(b1,$final,pid));
			return n3;
		case 6:
			var p3 = p[2];
			return this.initNode(p3,$final,pid);
		}
	}
	,__class__: hxparse_LexEngine
};
var hxparse__$LexEngine_Pattern = $hxClasses["hxparse._LexEngine.Pattern"] = { __ename__ : ["hxparse","_LexEngine","Pattern"], __constructs__ : ["Empty","Match","Star","Plus","Next","Choice","Group"] };
hxparse__$LexEngine_Pattern.Empty = ["Empty",0];
hxparse__$LexEngine_Pattern.Empty.__enum__ = hxparse__$LexEngine_Pattern;
hxparse__$LexEngine_Pattern.Match = function(c) { var $x = ["Match",1,c]; $x.__enum__ = hxparse__$LexEngine_Pattern; return $x; };
hxparse__$LexEngine_Pattern.Star = function(p) { var $x = ["Star",2,p]; $x.__enum__ = hxparse__$LexEngine_Pattern; return $x; };
hxparse__$LexEngine_Pattern.Plus = function(p) { var $x = ["Plus",3,p]; $x.__enum__ = hxparse__$LexEngine_Pattern; return $x; };
hxparse__$LexEngine_Pattern.Next = function(p1,p2) { var $x = ["Next",4,p1,p2]; $x.__enum__ = hxparse__$LexEngine_Pattern; return $x; };
hxparse__$LexEngine_Pattern.Choice = function(p1,p2) { var $x = ["Choice",5,p1,p2]; $x.__enum__ = hxparse__$LexEngine_Pattern; return $x; };
hxparse__$LexEngine_Pattern.Group = function(p) { var $x = ["Group",6,p]; $x.__enum__ = hxparse__$LexEngine_Pattern; return $x; };
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
$hxClasses["js._Boot.HaxeError"] = js__$Boot_HaxeError;
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	val: null
	,__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = ["js","Boot"];
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var hxparse__$LexEngine_Node = function(id,pid) {
	this.id = id;
	this.pid = pid;
	this.trans = [];
	this.epsilon = [];
};
$hxClasses["hxparse._LexEngine.Node"] = hxparse__$LexEngine_Node;
hxparse__$LexEngine_Node.__name__ = ["hxparse","_LexEngine","Node"];
hxparse__$LexEngine_Node.prototype = {
	id: null
	,pid: null
	,trans: null
	,epsilon: null
	,__class__: hxparse__$LexEngine_Node
};
var hxparse_Ruleset = function(state,functions,eofFunction,name) {
	if(name == null) name = "";
	this.state = state;
	this.functions = functions;
	this.eofFunction = eofFunction;
	this.name = name;
};
$hxClasses["hxparse.Ruleset"] = hxparse_Ruleset;
hxparse_Ruleset.__name__ = ["hxparse","Ruleset"];
hxparse_Ruleset.prototype = {
	state: null
	,functions: null
	,eofFunction: null
	,name: null
	,__class__: hxparse_Ruleset
};
var hxparse_Position = function(source,min,max) {
	this.psource = source;
	this.pmin = min;
	this.pmax = max;
};
$hxClasses["hxparse.Position"] = hxparse_Position;
hxparse_Position.__name__ = ["hxparse","Position"];
hxparse_Position.prototype = {
	psource: null
	,pmin: null
	,pmax: null
	,toString: function() {
		return "" + this.psource + ":characters " + this.pmin + "-" + this.pmax;
	}
	,getLinePosition: function(input) {
		var lineMin = 1;
		var lineMax = 1;
		var posMin = 0;
		var posMax = 0;
		var cur = 0;
		while(cur < this.pmin) {
			if(input[cur] == 10) {
				lineMin++;
				posMin = cur;
			}
			cur++;
		}
		lineMax = lineMin;
		posMax = posMin;
		posMin = cur - posMin;
		while(cur < this.pmax) {
			if(input[cur] == 10) {
				lineMax++;
				posMax = cur;
			}
			cur++;
		}
		posMax = cur - posMax;
		return { lineMin : lineMin, lineMax : lineMax, posMin : posMin, posMax : posMax};
	}
	,format: function(input) {
		var linePos = this.getLinePosition(input);
		if(linePos.lineMin != linePos.lineMax) return "" + this.psource + ":lines " + linePos.lineMin + "-" + linePos.lineMax; else return "" + this.psource + ":line " + linePos.lineMin + ":characters " + linePos.posMin + "-" + linePos.posMax;
	}
	,__class__: hxparse_Position
};
var haxeparser_HaxeLexer = function(input,sourceName) {
	hxparse_Lexer.call(this,input,sourceName);
};
$hxClasses["haxeparser.HaxeLexer"] = haxeparser_HaxeLexer;
haxeparser_HaxeLexer.__name__ = ["haxeparser","HaxeLexer"];
haxeparser_HaxeLexer.__interfaces__ = [hxparse_RuleBuilder];
haxeparser_HaxeLexer.mkPos = function(p) {
	return { file : p.psource, min : p.pmin, max : p.pmax};
};
haxeparser_HaxeLexer.mk = function(lexer,td) {
	return new haxeparser_Token(td,haxeparser_HaxeLexer.mkPos(new hxparse_Position(lexer.source,lexer.pos - lexer.current.length,lexer.pos)));
};
haxeparser_HaxeLexer.unescape = function(s,pos) {
	var b_b = "";
	var i = 0;
	var esc = false;
	while(true) {
		if(s.length == i) break;
		var c = HxOverrides.cca(s,i);
		if(esc) {
			var iNext = i + 1;
			var __ex0 = c;
			if(c != null) switch(c) {
			case 110:
				b_b += "\n";
				break;
			case 114:
				b_b += "\r";
				break;
			case 116:
				b_b += "\t";
				break;
			case 34:case 39:case 92:
				b_b += String.fromCharCode(c);
				break;
			default:
				{
					var _g = __ex0 >= 48 && __ex0 <= 51;
					switch(_g) {
					case true:
						iNext += 2;
						break;
					default:
						var c1 = c;
						if(c != null) switch(c) {
						case 120:
							var chars = HxOverrides.substr(s,i + 1,2);
							if(!new EReg("^[0-9a-fA-F]{2}$","").match(chars)) throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.InvalidEscapeSequence("\\x" + chars),{ file : pos.file, min : pos.min + i, max : pos.min + i + 3}));
							var c2 = Std.parseInt("0x" + chars);
							b_b += String.fromCharCode(c2);
							iNext += 2;
							break;
						case 117:
							var c3;
							if(s.charAt(i + 1) == "{") {
								var endIndex = s.indexOf("}",i + 3);
								if(endIndex == -1) throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.UnterminatedEscapeSequence,{ file : pos.file, min : pos.min + i, max : pos.min + i + 2}));
								var l = endIndex - (i + 2);
								var chars1 = HxOverrides.substr(s,i + 2,l);
								if(!new EReg("^[0-9a-fA-F]+$","").match(chars1)) throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.InvalidEscapeSequence("\\u{" + chars1 + "}"),{ file : pos.file, min : pos.min + i, max : pos.min + i + (3 + l)}));
								c3 = Std.parseInt("0x" + chars1);
								if(c3 > 1114111) throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.InvalidEscapeSequence("\\u{" + chars1 + "}"),{ file : pos.file, min : pos.min + i, max : pos.min + i + (3 + l)}));
								iNext += 2 + l;
							} else {
								var chars2 = HxOverrides.substr(s,i + 1,4);
								if(!new EReg("^[0-9a-fA-F]{4}$","").match(chars2)) throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.InvalidEscapeSequence("\\u" + chars2),{ file : pos.file, min : pos.min + i, max : pos.min + i + 5}));
								c3 = Std.parseInt("0x" + chars2);
								iNext += 4;
							}
							b_b += String.fromCharCode(c3);
							break;
						default:
							throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.UnknownEscapeSequence("\\" + String.fromCharCode(c1)),{ file : pos.file, min : pos.min + i, max : pos.min + i + 1}));
						} else throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.UnknownEscapeSequence("\\" + String.fromCharCode(c1)),{ file : pos.file, min : pos.min + i, max : pos.min + i + 1}));
					}
				}
			} else {
				var _g = __ex0 >= 48 && __ex0 <= 51;
				switch(_g) {
				case true:
					iNext += 2;
					break;
				default:
					var c1 = c;
					if(c != null) switch(c) {
					case 120:
						var chars = HxOverrides.substr(s,i + 1,2);
						if(!new EReg("^[0-9a-fA-F]{2}$","").match(chars)) throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.InvalidEscapeSequence("\\x" + chars),{ file : pos.file, min : pos.min + i, max : pos.min + i + 3}));
						var c2 = Std.parseInt("0x" + chars);
						b_b += String.fromCharCode(c2);
						iNext += 2;
						break;
					case 117:
						var c3;
						if(s.charAt(i + 1) == "{") {
							var endIndex = s.indexOf("}",i + 3);
							if(endIndex == -1) throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.UnterminatedEscapeSequence,{ file : pos.file, min : pos.min + i, max : pos.min + i + 2}));
							var l = endIndex - (i + 2);
							var chars1 = HxOverrides.substr(s,i + 2,l);
							if(!new EReg("^[0-9a-fA-F]+$","").match(chars1)) throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.InvalidEscapeSequence("\\u{" + chars1 + "}"),{ file : pos.file, min : pos.min + i, max : pos.min + i + (3 + l)}));
							c3 = Std.parseInt("0x" + chars1);
							if(c3 > 1114111) throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.InvalidEscapeSequence("\\u{" + chars1 + "}"),{ file : pos.file, min : pos.min + i, max : pos.min + i + (3 + l)}));
							iNext += 2 + l;
						} else {
							var chars2 = HxOverrides.substr(s,i + 1,4);
							if(!new EReg("^[0-9a-fA-F]{4}$","").match(chars2)) throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.InvalidEscapeSequence("\\u" + chars2),{ file : pos.file, min : pos.min + i, max : pos.min + i + 5}));
							c3 = Std.parseInt("0x" + chars2);
							iNext += 4;
						}
						b_b += String.fromCharCode(c3);
						break;
					default:
						throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.UnknownEscapeSequence("\\" + String.fromCharCode(c1)),{ file : pos.file, min : pos.min + i, max : pos.min + i + 1}));
					} else throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.UnknownEscapeSequence("\\" + String.fromCharCode(c1)),{ file : pos.file, min : pos.min + i, max : pos.min + i + 1}));
				}
			}
			esc = false;
			i = iNext;
		} else if(c != null) switch(c) {
		case 92:
			++i;
			esc = true;
			break;
		default:
			b_b += String.fromCharCode(c);
			++i;
		} else {
			b_b += String.fromCharCode(c);
			++i;
		}
	}
	return b_b;
};
haxeparser_HaxeLexer.__super__ = hxparse_Lexer;
haxeparser_HaxeLexer.prototype = $extend(hxparse_Lexer.prototype,{
	__class__: haxeparser_HaxeLexer
});
var haxeparser_ParserErrorMsg = $hxClasses["haxeparser.ParserErrorMsg"] = { __ename__ : ["haxeparser","ParserErrorMsg"], __constructs__ : ["MissingSemicolon","MissingType","DuplicateDefault","UnclosedMacro","Custom"] };
haxeparser_ParserErrorMsg.MissingSemicolon = ["MissingSemicolon",0];
haxeparser_ParserErrorMsg.MissingSemicolon.__enum__ = haxeparser_ParserErrorMsg;
haxeparser_ParserErrorMsg.MissingType = ["MissingType",1];
haxeparser_ParserErrorMsg.MissingType.__enum__ = haxeparser_ParserErrorMsg;
haxeparser_ParserErrorMsg.DuplicateDefault = ["DuplicateDefault",2];
haxeparser_ParserErrorMsg.DuplicateDefault.__enum__ = haxeparser_ParserErrorMsg;
haxeparser_ParserErrorMsg.UnclosedMacro = ["UnclosedMacro",3];
haxeparser_ParserErrorMsg.UnclosedMacro.__enum__ = haxeparser_ParserErrorMsg;
haxeparser_ParserErrorMsg.Custom = function(s) { var $x = ["Custom",4,s]; $x.__enum__ = haxeparser_ParserErrorMsg; return $x; };
var haxeparser_ParserError = function(message,pos) {
	this.msg = message;
	this.pos = pos;
};
$hxClasses["haxeparser.ParserError"] = haxeparser_ParserError;
haxeparser_ParserError.__name__ = ["haxeparser","ParserError"];
haxeparser_ParserError.prototype = {
	msg: null
	,pos: null
	,__class__: haxeparser_ParserError
};
var haxeparser_SmallType = $hxClasses["haxeparser.SmallType"] = { __ename__ : ["haxeparser","SmallType"], __constructs__ : ["SNull","SBool","SFloat","SString"] };
haxeparser_SmallType.SNull = ["SNull",0];
haxeparser_SmallType.SNull.__enum__ = haxeparser_SmallType;
haxeparser_SmallType.SBool = function(b) { var $x = ["SBool",1,b]; $x.__enum__ = haxeparser_SmallType; return $x; };
haxeparser_SmallType.SFloat = function(f) { var $x = ["SFloat",2,f]; $x.__enum__ = haxeparser_SmallType; return $x; };
haxeparser_SmallType.SString = function(s) { var $x = ["SString",3,s]; $x.__enum__ = haxeparser_SmallType; return $x; };
var hxparse_Parser_$hxparse_$LexerTokenSource_$haxeparser_$Token_$haxeparser_$Token = function(stream) {
	this.stream = stream;
};
$hxClasses["hxparse.Parser_hxparse_LexerTokenSource_haxeparser_Token_haxeparser_Token"] = hxparse_Parser_$hxparse_$LexerTokenSource_$haxeparser_$Token_$haxeparser_$Token;
hxparse_Parser_$hxparse_$LexerTokenSource_$haxeparser_$Token_$haxeparser_$Token.__name__ = ["hxparse","Parser_hxparse_LexerTokenSource_haxeparser_Token_haxeparser_Token"];
hxparse_Parser_$hxparse_$LexerTokenSource_$haxeparser_$Token_$haxeparser_$Token.prototype = {
	last: null
	,stream: null
	,token: null
	,peek: function(n) {
		if(this.token == null) {
			this.token = new haxe_ds_GenericCell(this.stream.token(),null);
			n--;
		}
		var tok = this.token;
		while(n > 0) {
			if(tok.next == null) tok.next = new haxe_ds_GenericCell(this.stream.token(),null);
			tok = tok.next;
			n--;
		}
		return tok.elt;
	}
	,__class__: hxparse_Parser_$hxparse_$LexerTokenSource_$haxeparser_$Token_$haxeparser_$Token
};
var hxparse_ParserBuilder = function() { };
$hxClasses["hxparse.ParserBuilder"] = hxparse_ParserBuilder;
hxparse_ParserBuilder.__name__ = ["hxparse","ParserBuilder"];
var haxeparser_HaxeCondParser = function(stream) {
	hxparse_Parser_$hxparse_$LexerTokenSource_$haxeparser_$Token_$haxeparser_$Token.call(this,stream);
};
$hxClasses["haxeparser.HaxeCondParser"] = haxeparser_HaxeCondParser;
haxeparser_HaxeCondParser.__name__ = ["haxeparser","HaxeCondParser"];
haxeparser_HaxeCondParser.__interfaces__ = [hxparse_ParserBuilder];
haxeparser_HaxeCondParser.__super__ = hxparse_Parser_$hxparse_$LexerTokenSource_$haxeparser_$Token_$haxeparser_$Token;
haxeparser_HaxeCondParser.prototype = $extend(hxparse_Parser_$hxparse_$LexerTokenSource_$haxeparser_$Token_$haxeparser_$Token.prototype,{
	parseMacroCond: function(allowOp) {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var t = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return this.parseMacroIdent(allowOp,t,p);
				case 2:
					var p1 = _g.pos;
					var s = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { tk : haxe_ds_Option.None, expr : { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CString(s)), pos : p1}};
				case 0:
					var p2 = _g.pos;
					var s1 = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { tk : haxe_ds_Option.None, expr : { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CInt(s1)), pos : p2}};
				case 1:
					var p3 = _g.pos;
					var s2 = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { tk : haxe_ds_Option.None, expr : { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CFloat(s2)), pos : p3}};
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			case 0:
				var p4 = _g.pos;
				var k = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				return this.parseMacroIdent(allowOp,haxeparser_HaxeParser.keywordString(k),p4);
			case 18:
				var p11 = _g.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				var o = this.parseMacroCond(true);
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 19:
						var p21 = _g1.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						var e = { expr : haxe_macro_ExprDef.EParenthesis(o.expr), pos : haxeparser_HaxeParser.punion(p11,p21)};
						if(allowOp) return this.parseMacroOp(e); else return { tk : haxe_ds_Option.None, expr : e};
						break;
					default:
						return (function($this) {
							var $r;
							throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
							return $r;
						}(this));
					}
				}
				break;
			case 4:
				var p5 = _g.pos;
				var op = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				var o1 = this.parseMacroCond(allowOp);
				return { tk : o1.tk, expr : haxeparser_HaxeParser.makeUnop(op,o1.expr,p5)};
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,parseMacroIdent: function(allowOp,t,p) {
		var e = { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent(t)), pos : p};
		if(!allowOp) return { tk : haxe_ds_Option.None, expr : e}; else return this.parseMacroOp(e);
	}
	,parseMacroOp: function(e) {
		{
			var _g = this.peek(0);
			var tk = _g;
			switch(_g.tok[1]) {
			case 5:
				var op = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 5:
						switch(_g1.tok[2][1]) {
						case 4:
							if(op == haxe_macro_Binop.OpGt) {
								this.last = this.token.elt;
								this.token = this.token.next;
								op = haxe_macro_Binop.OpGte;
							} else op = op;
							break;
						default:
							op = op;
						}
						break;
					default:
						op = op;
					}
				}
				var o = this.parseMacroCond(true);
				return { tk : o.tk, expr : haxeparser_HaxeParser.makeBinop(op,e,o.expr)};
			default:
				return { tk : haxe_ds_Option.Some(tk), expr : e};
			}
		}
	}
	,__class__: haxeparser_HaxeCondParser
});
var haxeparser_HaxeTokenSource = function(lexer,defines) {
	this.lexer = lexer;
	this.mstack = [];
	this.defines = defines;
	this.skipstates = [0];
	this.rawSource = new hxparse_LexerTokenSource(lexer,haxeparser_HaxeLexer.tok);
	this.condParser = new haxeparser_HaxeCondParser(this.rawSource);
};
$hxClasses["haxeparser.HaxeTokenSource"] = haxeparser_HaxeTokenSource;
haxeparser_HaxeTokenSource.__name__ = ["haxeparser","HaxeTokenSource"];
haxeparser_HaxeTokenSource.prototype = {
	lexer: null
	,mstack: null
	,skipstates: null
	,defines: null
	,rawSource: null
	,condParser: null
	,lexerToken: function() {
		return this.lexer.token(haxeparser_HaxeLexer.tok);
	}
	,setSt: function(s) {
		this.skipstates[this.skipstates.length - 1] = s;
	}
	,pushSt: function(s) {
		this.skipstates.push(s);
	}
	,token: function() {
		while(true) {
			var tk = this.lexerToken();
			var state = this.skipstates[this.skipstates.length - 1];
			{
				var _g = tk.tok;
				switch(_g[1]) {
				case 7:case 6:
					break;
				case 2:
					switch(_g[2]) {
					case "line":
						break;
					case "error":
						tk = this.condParser.peek(0);
						{
							var _g1 = tk.tok;
							switch(_g1[1]) {
							case 1:
								switch(_g1[2][1]) {
								case 2:
									tk = this.lexerToken();
									break;
								default:
								}
								break;
							default:
							}
						}
						break;
					case "if":
						switch(state) {
						case 0:
							this.mstack.push(tk.pos);
							this.pushSt(this.enterMacro()?0:1);
							break;
						case 1:case 2:
							this.deepSkip();
							break;
						default:
						}
						break;
					case "end":
						this.mstack.pop();
						if(this.skipstates.length > 1) this.skipstates.pop(); else throw new js__$Boot_HaxeError("unexpected #end");
						break;
					case "elseif":
						switch(state) {
						case 0:
							this.skipstates[this.skipstates.length - 1] = 2;
							break;
						case 1:
							this.setSt(this.enterMacro()?0:1);
							break;
						case 2:
							break;
						default:
						}
						break;
					case "else":
						switch(state) {
						case 1:
							this.skipstates[this.skipstates.length - 1] = 0;
							break;
						case 0:
							this.skipstates[this.skipstates.length - 1] = 2;
							break;
						case 2:
							break;
						default:
						}
						break;
					default:
						switch(state) {
						case 2:
							break;
						case 0:
							return tk;
						default:
						}
					}
					break;
				case 22:
					switch(state) {
					case 0:
						return tk;
					default:
						return tk;
					}
					break;
				default:
					switch(state) {
					case 0:
						return tk;
					default:
					}
				}
			}
		}
	}
	,enterMacro: function() {
		var o = this.condParser.parseMacroCond(false);
		return this.isTrue(this["eval"](o.expr));
	}
	,deepSkip: function() {
		var lvl = 1;
		while(true) {
			var tk = this.lexerToken();
			{
				var _g = tk.tok;
				switch(_g[1]) {
				case 2:
					switch(_g[2]) {
					case "if":
						lvl += 1;
						break;
					case "end":
						lvl -= 1;
						if(lvl == 0) return;
						break;
					default:
					}
					break;
				case 22:
					throw new js__$Boot_HaxeError("unclosed macro");
					break;
				default:
				}
			}
		}
	}
	,isTrue: function(a) {
		switch(a[1]) {
		case 1:
			switch(a[2]) {
			case false:
				return false;
			default:
				return true;
			}
			break;
		case 0:
			return false;
		case 2:
			switch(a[2]) {
			case 0.0:
				return false;
			default:
				return true;
			}
			break;
		case 3:
			switch(a[2]) {
			case "":
				return false;
			default:
				return true;
			}
			break;
		}
	}
	,compare: function(a,b) {
		switch(a[1]) {
		case 0:
			switch(b[1]) {
			case 0:
				return 0;
			default:
				return 0;
			}
			break;
		case 2:
			switch(b[1]) {
			case 2:
				var a1 = a[2];
				var b1 = b[2];
				return Reflect.compare(a1,b1);
			case 3:
				var a2 = a[2];
				var b2 = b[2];
				return Reflect.compare(a2,parseFloat(b2));
			default:
				return 0;
			}
			break;
		case 3:
			switch(b[1]) {
			case 3:
				var a3 = a[2];
				var b3 = b[2];
				return Reflect.compare(a3,b3);
			case 2:
				var a4 = a[2];
				var b4 = b[2];
				return Reflect.compare(parseFloat(a4),b4);
			default:
				return 0;
			}
			break;
		case 1:
			switch(b[1]) {
			case 1:
				var a5 = a[2];
				var b5 = b[2];
				return Reflect.compare(a5,b5);
			default:
				return 0;
			}
			break;
		}
	}
	,'eval': function(e) {
		{
			var _g = e.expr;
			switch(_g[1]) {
			case 0:
				switch(_g[2][1]) {
				case 3:
					var s = _g[2][2];
					if(this.defines.exists(s)) return haxeparser_SmallType.SString(s); else return haxeparser_SmallType.SNull;
					break;
				case 2:
					var s1 = _g[2][2];
					return haxeparser_SmallType.SString(s1);
				case 0:
					var f = _g[2][2];
					return haxeparser_SmallType.SFloat(parseFloat(f));
				case 1:
					var f1 = _g[2][2];
					return haxeparser_SmallType.SFloat(parseFloat(f1));
				default:
					throw new js__$Boot_HaxeError("Invalid condition expression");
				}
				break;
			case 2:
				var op = _g[2];
				switch(_g[2][1]) {
				case 14:
					var e2 = _g[4];
					var e1 = _g[3];
					return haxeparser_SmallType.SBool(this.isTrue(this["eval"](e1)) && this.isTrue(this["eval"](e2)));
				case 15:
					var e21 = _g[4];
					var e11 = _g[3];
					return haxeparser_SmallType.SBool(this.isTrue(this["eval"](e11)) || this.isTrue(this["eval"](e21)));
				default:
					var e22 = _g[4];
					var e12 = _g[3];
					var v1 = this["eval"](e12);
					var v2 = this["eval"](e22);
					var cmp = this.compare(v1,v2);
					var val;
					switch(op[1]) {
					case 5:
						val = cmp == 0;
						break;
					case 6:
						val = cmp != 0;
						break;
					case 7:
						val = cmp > 0;
						break;
					case 8:
						val = cmp >= 0;
						break;
					case 9:
						val = cmp < 0;
						break;
					case 10:
						val = cmp <= 0;
						break;
					default:
						throw new js__$Boot_HaxeError("Unsupported operation");
					}
					return haxeparser_SmallType.SBool(val);
				}
				break;
			case 9:
				switch(_g[2][1]) {
				case 2:
					var e3 = _g[4];
					return haxeparser_SmallType.SBool(!this.isTrue(this["eval"](e3)));
				default:
					throw new js__$Boot_HaxeError("Invalid condition expression");
				}
				break;
			case 4:
				var e4 = _g[2];
				return this["eval"](e4);
			default:
				throw new js__$Boot_HaxeError("Invalid condition expression");
			}
		}
	}
	,curPos: function() {
		return this.lexer.curPos();
	}
	,__class__: haxeparser_HaxeTokenSource
};
var hxparse_Parser_$haxeparser_$HaxeTokenSource_$haxeparser_$Token = function(stream) {
	this.stream = stream;
};
$hxClasses["hxparse.Parser_haxeparser_HaxeTokenSource_haxeparser_Token"] = hxparse_Parser_$haxeparser_$HaxeTokenSource_$haxeparser_$Token;
hxparse_Parser_$haxeparser_$HaxeTokenSource_$haxeparser_$Token.__name__ = ["hxparse","Parser_haxeparser_HaxeTokenSource_haxeparser_Token"];
hxparse_Parser_$haxeparser_$HaxeTokenSource_$haxeparser_$Token.prototype = {
	last: null
	,stream: null
	,token: null
	,peek: function(n) {
		if(this.token == null) {
			this.token = new haxe_ds_GenericCell(this.stream.token(),null);
			n--;
		}
		var tok = this.token;
		while(n > 0) {
			if(tok.next == null) tok.next = new haxe_ds_GenericCell(this.stream.token(),null);
			tok = tok.next;
			n--;
		}
		return tok.elt;
	}
	,parseOptional: function(f) {
		try {
			return f();
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			if( js_Boot.__instanceof(e,hxparse_NoMatch) ) {
				return null;
			} else throw(e);
		}
	}
	,parseRepeat: function(f) {
		var acc = [];
		while(true) try {
			acc.push(f());
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			if( js_Boot.__instanceof(e,hxparse_NoMatch) ) {
				return acc;
			} else throw(e);
		}
	}
	,__class__: hxparse_Parser_$haxeparser_$HaxeTokenSource_$haxeparser_$Token
};
var haxeparser_HaxeParser = function(input,sourceName) {
	this.doResume = false;
	this.defines = new haxe_ds_StringMap();
	this.defines.set("true",true);
	var lexer = new haxeparser_HaxeLexer(input,sourceName);
	var ts = new haxeparser_HaxeTokenSource(lexer,this.defines);
	hxparse_Parser_$haxeparser_$HaxeTokenSource_$haxeparser_$Token.call(this,ts);
	this.inMacro = false;
	this.doc = "";
};
$hxClasses["haxeparser.HaxeParser"] = haxeparser_HaxeParser;
haxeparser_HaxeParser.__name__ = ["haxeparser","HaxeParser"];
haxeparser_HaxeParser.__interfaces__ = [hxparse_ParserBuilder];
haxeparser_HaxeParser.keywordString = function(k) {
	return HxOverrides.substr(Std.string(k),3,null).toLowerCase();
};
haxeparser_HaxeParser.punion = function(p1,p2) {
	return { file : p1.file, min : p1.min < p2.min?p1.min:p2.min, max : p1.max > p2.max?p1.max:p2.max};
};
haxeparser_HaxeParser.quoteIdent = function(s) {
	return s;
};
haxeparser_HaxeParser.isLowerIdent = function(s) {
	var loop;
	var loop1 = null;
	loop1 = function(p) {
		var c = HxOverrides.cca(s,p);
		if(c >= 97 && c <= 122) return true; else if(c == 95) {
			if(p + 1 < s.length) return loop1(p + 1); else return true;
		} else return false;
	};
	loop = loop1;
	return loop(0);
};
haxeparser_HaxeParser.isPostfix = function(e,u) {
	switch(u[1]) {
	case 0:case 1:
		{
			var _g = e.expr;
			switch(_g[1]) {
			case 0:case 3:case 1:
				return true;
			default:
				return false;
			}
		}
		break;
	case 2:case 3:case 4:
		return false;
	}
};
haxeparser_HaxeParser.precedence = function(op) {
	var left = true;
	var right = false;
	switch(op[1]) {
	case 19:
		return { p : 0, left : left};
	case 1:case 2:
		return { p : 0, left : left};
	case 0:case 3:
		return { p : 0, left : left};
	case 16:case 17:case 18:
		return { p : 0, left : left};
	case 12:case 11:case 13:
		return { p : 0, left : left};
	case 5:case 6:case 7:case 9:case 8:case 10:
		return { p : 0, left : left};
	case 21:
		return { p : 0, left : left};
	case 14:
		return { p : 0, left : left};
	case 15:
		return { p : 0, left : left};
	case 22:
		return { p : 0, left : left};
	case 4:case 20:
		return { p : 10, left : right};
	}
};
haxeparser_HaxeParser.isNotAssign = function(op) {
	switch(op[1]) {
	case 4:case 20:
		return false;
	default:
		return true;
	}
};
haxeparser_HaxeParser.isDollarIdent = function(e) {
	{
		var _g = e.expr;
		switch(_g[1]) {
		case 0:
			switch(_g[2][1]) {
			case 3:
				var n = _g[2][2];
				if(HxOverrides.cca(n,0) == 36) return true; else return false;
				break;
			default:
				return false;
			}
			break;
		default:
			return false;
		}
	}
};
haxeparser_HaxeParser.swap = function(op1,op2) {
	var i1 = haxeparser_HaxeParser.precedence(op1);
	var i2 = haxeparser_HaxeParser.precedence(op2);
	return i1.left && i1.p <= i2.p;
};
haxeparser_HaxeParser.makeBinop = function(op,e,e2) {
	{
		var _g = e2.expr;
		switch(_g[1]) {
		case 2:
			var _e2 = _g[4];
			var _e = _g[3];
			var _op = _g[2];
			if(haxeparser_HaxeParser.swap(op,_op)) {
				var _e1 = haxeparser_HaxeParser.makeBinop(op,e,_e);
				return { expr : haxe_macro_ExprDef.EBinop(_op,_e1,_e2), pos : haxeparser_HaxeParser.punion(_e1.pos,_e2.pos)};
			} else return { expr : haxe_macro_ExprDef.EBinop(op,e,e2), pos : haxeparser_HaxeParser.punion(e.pos,e2.pos)};
			break;
		case 27:
			var e3 = _g[4];
			var e21 = _g[3];
			var e1 = _g[2];
			if(haxeparser_HaxeParser.isNotAssign(op)) {
				var e4 = haxeparser_HaxeParser.makeBinop(op,e,e1);
				return { expr : haxe_macro_ExprDef.ETernary(e4,e21,e3), pos : haxeparser_HaxeParser.punion(e4.pos,e3.pos)};
			} else return { expr : haxe_macro_ExprDef.EBinop(op,e,e2), pos : haxeparser_HaxeParser.punion(e.pos,e2.pos)};
			break;
		default:
			return { expr : haxe_macro_ExprDef.EBinop(op,e,e2), pos : haxeparser_HaxeParser.punion(e.pos,e2.pos)};
		}
	}
};
haxeparser_HaxeParser.makeUnop = function(op,e,p1) {
	{
		var _g = e.expr;
		switch(_g[1]) {
		case 2:
			var e2 = _g[4];
			var e1 = _g[3];
			var bop = _g[2];
			return { expr : haxe_macro_ExprDef.EBinop(bop,haxeparser_HaxeParser.makeUnop(op,e1,p1),e2), pos : haxeparser_HaxeParser.punion(p1,e1.pos)};
		case 27:
			var e3 = _g[4];
			var e21 = _g[3];
			var e11 = _g[2];
			return { expr : haxe_macro_ExprDef.ETernary(haxeparser_HaxeParser.makeUnop(op,e11,p1),e21,e3), pos : haxeparser_HaxeParser.punion(p1,e.pos)};
		default:
			return { expr : haxe_macro_ExprDef.EUnop(op,false,e), pos : haxeparser_HaxeParser.punion(p1,e.pos)};
		}
	}
};
haxeparser_HaxeParser.makeMeta = function(name,params,e,p1) {
	{
		var _g = e.expr;
		switch(_g[1]) {
		case 2:
			var e2 = _g[4];
			var e1 = _g[3];
			var bop = _g[2];
			return { expr : haxe_macro_ExprDef.EBinop(bop,haxeparser_HaxeParser.makeMeta(name,params,e1,p1),e2), pos : haxeparser_HaxeParser.punion(p1,e1.pos)};
		case 27:
			var e3 = _g[4];
			var e21 = _g[3];
			var e11 = _g[2];
			return { expr : haxe_macro_ExprDef.ETernary(haxeparser_HaxeParser.makeMeta(name,params,e11,p1),e21,e3), pos : haxeparser_HaxeParser.punion(p1,e.pos)};
		default:
			return { expr : haxe_macro_ExprDef.EMeta({ name : name, params : params, pos : p1},e), pos : haxeparser_HaxeParser.punion(p1,e.pos)};
		}
	}
};
haxeparser_HaxeParser.aadd = function(a,t) {
	a.push(t);
	return a;
};
haxeparser_HaxeParser.__super__ = hxparse_Parser_$haxeparser_$HaxeTokenSource_$haxeparser_$Token;
haxeparser_HaxeParser.prototype = $extend(hxparse_Parser_$haxeparser_$HaxeTokenSource_$haxeparser_$Token.prototype,{
	defines: null
	,doResume: null
	,doc: null
	,inMacro: null
	,parse: function() {
		var res = this.parseFile();
		if(this.stream.mstack.length != 0) throw new js__$Boot_HaxeError(new haxeparser_ParserError(haxeparser_ParserErrorMsg.UnclosedMacro,this.stream.mstack[this.stream.mstack.length - 1]));
		return res;
	}
	,psep: function(sep,f) {
		var _g = this;
		var acc = [];
		while(true) try {
			acc.push(f());
			var def = function() {
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(_g.stream.curPos(),_g.peek(0)));
			};
			{
				var _g1 = this.peek(0);
				var sep2 = _g1.tok;
				if(sep2 == sep) {
					this.last = this.token.elt;
					this.token = this.token.next;
					null;
				} else def();
			}
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			if( js_Boot.__instanceof(e,hxparse_NoMatch) ) {
				break;
			} else throw(e);
		}
		return acc;
	}
	,ident: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var i = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { name : i, pos : p};
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,dollarIdent: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var i = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { name : i, pos : p};
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			case 3:
				var p1 = _g.pos;
				var i1 = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				return { name : "$" + i1, pos : p1};
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,dollarIdentMacro: function(pack) {
		var _g1 = this;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var i = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { name : i, pos : p};
				default:
					var def = function() {
						throw new js__$Boot_HaxeError(new hxparse_NoMatch(_g1.stream.curPos(),_g1.peek(0)));
					};
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 0:
							switch(_g11.tok[2][1]) {
							case 41:
								var p1 = _g11.pos;
								if(pack.length > 0) {
									this.last = this.token.elt;
									this.token = this.token.next;
									return { name : "macro", pos : p1};
								} else return def();
								break;
							default:
								return def();
							}
							break;
						default:
							return def();
						}
					}
				}
				break;
			case 3:
				var p2 = _g.pos;
				var i1 = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				return { name : "$" + i1, pos : p2};
			default:
				var def1 = function() {
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(_g1.stream.curPos(),_g1.peek(0)));
				};
				{
					var _g12 = this.peek(0);
					switch(_g12.tok[1]) {
					case 0:
						switch(_g12.tok[2][1]) {
						case 41:
							var p3 = _g12.pos;
							if(pack.length > 0) {
								this.last = this.token.elt;
								this.token = this.token.next;
								return { name : "macro", pos : p3};
							} else return def1();
							break;
						default:
							return def1();
						}
						break;
					default:
						return def1();
					}
				}
			}
		}
	}
	,lowerIdentOrMacro: function() {
		var _g = this;
		var def = function() {
			{
				var _g1 = _g.peek(0);
				switch(_g1.tok[1]) {
				case 0:
					switch(_g1.tok[2][1]) {
					case 41:
						_g.last = _g.token.elt;
						_g.token = _g.token.next;
						return "macro";
					default:
						throw new js__$Boot_HaxeError(new hxparse_NoMatch(_g.stream.curPos(),_g.peek(0)));
					}
					break;
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(_g.stream.curPos(),_g.peek(0)));
				}
			}
		};
		{
			var _g2 = this.peek(0);
			switch(_g2.tok[1]) {
			case 1:
				switch(_g2.tok[2][1]) {
				case 3:
					var i = _g2.tok[2][2];
					if(haxeparser_HaxeParser.isLowerIdent(i)) {
						this.last = this.token.elt;
						this.token = this.token.next;
						return i;
					} else return def();
					break;
				default:
					return def();
				}
				break;
			default:
				return def();
			}
		}
	}
	,anyEnumIdent: function() {
		try {
			var i = this.ident();
			return i;
		} catch( _ ) {
			if (_ instanceof js__$Boot_HaxeError) _ = _.val;
			if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
				{
					var _g = this.peek(0);
					switch(_g.tok[1]) {
					case 0:
						var p = _g.pos;
						var k = _g.tok[2];
						this.last = this.token.elt;
						this.token = this.token.next;
						return { name : k[0].toLowerCase(), pos : p};
					default:
						throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
					}
				}
			} else throw(_);
		}
	}
	,propertyIdent: function() {
		try {
			var i = this.ident();
			return i.name;
		} catch( _ ) {
			if (_ instanceof js__$Boot_HaxeError) _ = _.val;
			if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
				{
					var _g = this.peek(0);
					switch(_g.tok[1]) {
					case 0:
						switch(_g.tok[2][1]) {
						case 33:
							this.last = this.token.elt;
							this.token = this.token.next;
							return "dynamic";
						case 16:
							this.last = this.token.elt;
							this.token = this.token.next;
							return "default";
						case 37:
							this.last = this.token.elt;
							this.token = this.token.next;
							return "null";
						default:
							throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
						}
						break;
					default:
						throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
					}
				}
			} else throw(_);
		}
	}
	,getDoc: function() {
		return "";
	}
	,semicolon: function() {
		if(this.last.tok == haxeparser_TokenDef.BrClose) {
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 9:
				var p = _g.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				return p;
			default:
				return this.last.pos;
			}
		} else {
			var _g1 = this.peek(0);
			switch(_g1.tok[1]) {
			case 9:
				var p1 = _g1.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				return p1;
			default:
				var pos = this.last.pos;
				if(this.doResume) return pos; else throw new js__$Boot_HaxeError(new haxeparser_ParserError(haxeparser_ParserErrorMsg.MissingSemicolon,pos));
			}
		}
	}
	,parseFile: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 34:
					this.last = this.token.elt;
					this.token = this.token.next;
					var p = this.parsePackage();
					this.semicolon();
					var l = this.parseTypeDecls(p,[]);
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 22:
							this.last = this.token.elt;
							this.token = this.token.next;
							return { pack : p, decls : l};
						default:
							return (function($this) {
								var $r;
								throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
								return $r;
							}(this));
						}
					}
					break;
				default:
					var l1 = this.parseTypeDecls([],[]);
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 22:
							this.last = this.token.elt;
							this.token = this.token.next;
							return { pack : [], decls : l1};
						default:
							return (function($this) {
								var $r;
								throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
								return $r;
							}(this));
						}
					}
				}
				break;
			default:
				var l2 = this.parseTypeDecls([],[]);
				{
					var _g12 = this.peek(0);
					switch(_g12.tok[1]) {
					case 22:
						this.last = this.token.elt;
						this.token = this.token.next;
						return { pack : [], decls : l2};
					default:
						return (function($this) {
							var $r;
							throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
							return $r;
						}(this));
					}
				}
			}
		}
	}
	,parseTypeDecls: function(pack,acc) {
		try {
			var v = this.parseTypeDecl();
			var l = this.parseTypeDecls(pack,haxeparser_HaxeParser.aadd(acc,v));
			return l;
		} catch( _ ) {
			if (_ instanceof js__$Boot_HaxeError) _ = _.val;
			if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
				return acc;
			} else throw(_);
		}
	}
	,parseTypeDecl: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 13:
					var p1 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					return this.parseImport(p1);
				case 36:
					var p11 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					var t = this.parseTypePath();
					var p2 = this.semicolon();
					return { decl : haxeparser_TypeDef.EUsing(t), pos : haxeparser_HaxeParser.punion(p11,p2)};
				default:
					var meta = this.parseMeta();
					var c = this.parseCommonFlags();
					try {
						var flags = this.parseEnumFlags();
						var doc = this.getDoc();
						var name = this.typeName();
						var tl = this.parseConstraintParams();
						{
							var _g1 = this.peek(0);
							switch(_g1.tok[1]) {
							case 16:
								this.last = this.token.elt;
								this.token = this.token.next;
								var l = this.parseRepeat($bind(this,this.parseEnum));
								{
									var _g2 = this.peek(0);
									switch(_g2.tok[1]) {
									case 17:
										var p21 = _g2.pos;
										this.last = this.token.elt;
										this.token = this.token.next;
										return { decl : haxeparser_TypeDef.EEnum({ name : name, doc : doc, meta : meta, params : tl, flags : c.map(function(i) {
											return i.e;
										}).concat(flags.flags), data : l}), pos : haxeparser_HaxeParser.punion(flags.pos,p21)};
									default:
										return (function($this) {
											var $r;
											throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
											return $r;
										}(this));
									}
								}
								break;
							default:
								return (function($this) {
									var $r;
									throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
									return $r;
								}(this));
							}
						}
					} catch( _ ) {
						if (_ instanceof js__$Boot_HaxeError) _ = _.val;
						if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
							try {
								var flags1 = this.parseClassFlags();
								var doc1 = this.getDoc();
								var name1 = this.typeName();
								var tl1 = this.parseConstraintParams();
								var hl = this.parseRepeat($bind(this,this.parseClassHerit));
								{
									var _g11 = this.peek(0);
									switch(_g11.tok[1]) {
									case 16:
										this.last = this.token.elt;
										this.token = this.token.next;
										var fl = this.parseClassFields(false,flags1.pos);
										return { decl : haxeparser_TypeDef.EClass({ name : name1, doc : doc1, meta : meta, params : tl1, flags : c.map(function(i1) {
											return i1.c;
										}).concat(flags1.flags).concat(hl), data : fl.fields}), pos : haxeparser_HaxeParser.punion(flags1.pos,fl.pos)};
									default:
										return (function($this) {
											var $r;
											throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
											return $r;
										}(this));
									}
								}
							} catch( _1 ) {
								if (_1 instanceof js__$Boot_HaxeError) _1 = _1.val;
								if( js_Boot.__instanceof(_1,hxparse_NoMatch) ) {
									{
										var _g12 = this.peek(0);
										switch(_g12.tok[1]) {
										case 0:
											switch(_g12.tok[2][1]) {
											case 32:
												var p12 = _g12.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var doc2 = this.getDoc();
												var name2 = this.typeName();
												var tl2 = this.parseConstraintParams();
												{
													var _g21 = this.peek(0);
													switch(_g21.tok[1]) {
													case 5:
														switch(_g21.tok[2][1]) {
														case 4:
															var p22 = _g21.pos;
															this.last = this.token.elt;
															this.token = this.token.next;
															var t1 = this.parseComplexType();
															{
																var _g3 = this.peek(0);
																switch(_g3.tok[1]) {
																case 9:
																	this.last = this.token.elt;
																	this.token = this.token.next;
																	null;
																	break;
																default:
																	null;
																}
															}
															return { decl : haxeparser_TypeDef.ETypedef({ name : name2, doc : doc2, meta : meta, params : tl2, flags : c.map(function(i2) {
																return i2.e;
															}), data : t1}), pos : haxeparser_HaxeParser.punion(p12,p22)};
														default:
															return (function($this) {
																var $r;
																throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																return $r;
															}(this));
														}
														break;
													default:
														return (function($this) {
															var $r;
															throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
															return $r;
														}(this));
													}
												}
												break;
											case 40:
												var p13 = _g12.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var name3 = this.typeName();
												var tl3 = this.parseConstraintParams();
												var st = this.parseAbstractSubtype();
												var sl = this.parseRepeat($bind(this,this.parseAbstractRelations));
												{
													var _g22 = this.peek(0);
													switch(_g22.tok[1]) {
													case 16:
														this.last = this.token.elt;
														this.token = this.token.next;
														var fl1 = this.parseClassFields(false,p13);
														var flags2 = c.map(function(flag) {
															var _g31 = flag.e;
															switch(_g31[1]) {
															case 0:
																return haxeparser_AbstractFlag.APrivAbstract;
															case 1:
																throw new js__$Boot_HaxeError("extern abstract is not allowed");
																break;
															}
														});
														if(st != null) flags2.push(haxeparser_AbstractFlag.AIsType(st));
														return { decl : haxeparser_TypeDef.EAbstract({ name : name3, doc : this.doc, meta : meta, params : tl3, flags : flags2.concat(sl), data : fl1.fields}), pos : haxeparser_HaxeParser.punion(p13,fl1.pos)};
													default:
														return (function($this) {
															var $r;
															throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
															return $r;
														}(this));
													}
												}
												break;
											default:
												throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
											}
											break;
										default:
											throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
										}
									}
								} else throw(_1);
							}
						} else throw(_);
					}
				}
				break;
			default:
				var meta1 = this.parseMeta();
				var c1 = this.parseCommonFlags();
				try {
					var flags3 = this.parseEnumFlags();
					var doc3 = this.getDoc();
					var name4 = this.typeName();
					var tl4 = this.parseConstraintParams();
					{
						var _g13 = this.peek(0);
						switch(_g13.tok[1]) {
						case 16:
							this.last = this.token.elt;
							this.token = this.token.next;
							var l1 = this.parseRepeat($bind(this,this.parseEnum));
							{
								var _g23 = this.peek(0);
								switch(_g23.tok[1]) {
								case 17:
									var p23 = _g23.pos;
									this.last = this.token.elt;
									this.token = this.token.next;
									return { decl : haxeparser_TypeDef.EEnum({ name : name4, doc : doc3, meta : meta1, params : tl4, flags : c1.map(function(i) {
										return i.e;
									}).concat(flags3.flags), data : l1}), pos : haxeparser_HaxeParser.punion(flags3.pos,p23)};
								default:
									return (function($this) {
										var $r;
										throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
										return $r;
									}(this));
								}
							}
							break;
						default:
							return (function($this) {
								var $r;
								throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
								return $r;
							}(this));
						}
					}
				} catch( _2 ) {
					if (_2 instanceof js__$Boot_HaxeError) _2 = _2.val;
					if( js_Boot.__instanceof(_2,hxparse_NoMatch) ) {
						try {
							var flags4 = this.parseClassFlags();
							var doc4 = this.getDoc();
							var name5 = this.typeName();
							var tl5 = this.parseConstraintParams();
							var hl1 = this.parseRepeat($bind(this,this.parseClassHerit));
							{
								var _g14 = this.peek(0);
								switch(_g14.tok[1]) {
								case 16:
									this.last = this.token.elt;
									this.token = this.token.next;
									var fl2 = this.parseClassFields(false,flags4.pos);
									return { decl : haxeparser_TypeDef.EClass({ name : name5, doc : doc4, meta : meta1, params : tl5, flags : c1.map(function(i1) {
										return i1.c;
									}).concat(flags4.flags).concat(hl1), data : fl2.fields}), pos : haxeparser_HaxeParser.punion(flags4.pos,fl2.pos)};
								default:
									return (function($this) {
										var $r;
										throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
										return $r;
									}(this));
								}
							}
						} catch( _3 ) {
							if (_3 instanceof js__$Boot_HaxeError) _3 = _3.val;
							if( js_Boot.__instanceof(_3,hxparse_NoMatch) ) {
								{
									var _g15 = this.peek(0);
									switch(_g15.tok[1]) {
									case 0:
										switch(_g15.tok[2][1]) {
										case 32:
											var p14 = _g15.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var doc5 = this.getDoc();
											var name6 = this.typeName();
											var tl6 = this.parseConstraintParams();
											{
												var _g24 = this.peek(0);
												switch(_g24.tok[1]) {
												case 5:
													switch(_g24.tok[2][1]) {
													case 4:
														var p24 = _g24.pos;
														this.last = this.token.elt;
														this.token = this.token.next;
														var t2 = this.parseComplexType();
														{
															var _g32 = this.peek(0);
															switch(_g32.tok[1]) {
															case 9:
																this.last = this.token.elt;
																this.token = this.token.next;
																null;
																break;
															default:
																null;
															}
														}
														return { decl : haxeparser_TypeDef.ETypedef({ name : name6, doc : doc5, meta : meta1, params : tl6, flags : c1.map(function(i2) {
															return i2.e;
														}), data : t2}), pos : haxeparser_HaxeParser.punion(p14,p24)};
													default:
														return (function($this) {
															var $r;
															throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
															return $r;
														}(this));
													}
													break;
												default:
													return (function($this) {
														var $r;
														throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
														return $r;
													}(this));
												}
											}
											break;
										case 40:
											var p15 = _g15.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var name7 = this.typeName();
											var tl7 = this.parseConstraintParams();
											var st1 = this.parseAbstractSubtype();
											var sl1 = this.parseRepeat($bind(this,this.parseAbstractRelations));
											{
												var _g25 = this.peek(0);
												switch(_g25.tok[1]) {
												case 16:
													this.last = this.token.elt;
													this.token = this.token.next;
													var fl3 = this.parseClassFields(false,p15);
													var flags5 = c1.map(function(flag) {
														var _g33 = flag.e;
														switch(_g33[1]) {
														case 0:
															return haxeparser_AbstractFlag.APrivAbstract;
														case 1:
															throw new js__$Boot_HaxeError("extern abstract is not allowed");
															break;
														}
													});
													if(st1 != null) flags5.push(haxeparser_AbstractFlag.AIsType(st1));
													return { decl : haxeparser_TypeDef.EAbstract({ name : name7, doc : this.doc, meta : meta1, params : tl7, flags : flags5.concat(sl1), data : fl3.fields}), pos : haxeparser_HaxeParser.punion(p15,fl3.pos)};
												default:
													return (function($this) {
														var $r;
														throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
														return $r;
													}(this));
												}
											}
											break;
										default:
											throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
										}
										break;
									default:
										throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
									}
								}
							} else throw(_3);
						}
					} else throw(_2);
				}
			}
		}
	}
	,parseClass: function(meta,cflags,needName) {
		var _g = this;
		var optName;
		if(needName) optName = $bind(this,this.typeName); else optName = function() {
			var t = _g.parseOptional($bind(_g,_g.typeName));
			if(t == null) return ""; else return t;
		};
		var flags = this.parseClassFlags();
		var doc = this.getDoc();
		var name = optName();
		var tl = this.parseConstraintParams();
		var hl = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.parseClassHerit));
		{
			var _g1 = this.peek(0);
			switch(_g1.tok[1]) {
			case 16:
				this.last = this.token.elt;
				this.token = this.token.next;
				var fl = this.parseClassFields(false,flags.pos);
				return { decl : haxeparser_TypeDef.EClass({ name : name, doc : doc, meta : meta, params : tl, flags : cflags.map(function(i) {
					return i.fst;
				}).concat(flags.flags).concat(hl), data : fl.fields}), pos : haxeparser_HaxeParser.punion(flags.pos,fl.pos)};
			default:
				return (function($this) {
					var $r;
					throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
					return $r;
				}(this));
			}
		}
	}
	,parseImport: function(p1) {
		var acc;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var name = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					acc = [{ pack : name, pos : p}];
					break;
				default:
					acc = (function($this) {
						var $r;
						throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
						return $r;
					}(this));
				}
				break;
			default:
				acc = (function($this) {
					var $r;
					throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
					return $r;
				}(this));
			}
		}
		while(true) {
			var _g1 = this.peek(0);
			switch(_g1.tok[1]) {
			case 10:
				this.last = this.token.elt;
				this.token = this.token.next;
				{
					var _g11 = this.peek(0);
					switch(_g11.tok[1]) {
					case 1:
						switch(_g11.tok[2][1]) {
						case 3:
							var p2 = _g11.pos;
							var k = _g11.tok[2][2];
							this.last = this.token.elt;
							this.token = this.token.next;
							acc.push({ pack : k, pos : p2});
							break;
						default:
							throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
						}
						break;
					case 0:
						switch(_g11.tok[2][1]) {
						case 41:
							var p3 = _g11.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							acc.push({ pack : "macro", pos : p3});
							break;
						default:
							throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
						}
						break;
					case 5:
						switch(_g11.tok[2][1]) {
						case 1:
							this.last = this.token.elt;
							this.token = this.token.next;
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 9:
									var p21 = _g2.pos;
									this.last = this.token.elt;
									this.token = this.token.next;
									return { decl : haxeparser_TypeDef.EImport(acc,haxeparser_ImportMode.IAll), pos : p21};
								default:
									throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
								}
							}
							break;
						default:
							throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
						}
						break;
					default:
						throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
					}
				}
				break;
			case 9:
				var p22 = _g1.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				return { decl : haxeparser_TypeDef.EImport(acc,haxeparser_ImportMode.INormal), pos : p22};
			case 0:
				switch(_g1.tok[2][1]) {
				case 27:
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g12 = this.peek(0);
						switch(_g12.tok[1]) {
						case 1:
							switch(_g12.tok[2][1]) {
							case 3:
								var name1 = _g12.tok[2][2];
								this.last = this.token.elt;
								this.token = this.token.next;
								{
									var _g21 = this.peek(0);
									switch(_g21.tok[1]) {
									case 9:
										var p23 = _g21.pos;
										this.last = this.token.elt;
										this.token = this.token.next;
										return { decl : haxeparser_TypeDef.EImport(acc,haxeparser_ImportMode.IAsName(name1)), pos : p23};
									default:
										throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
									}
								}
								break;
							default:
								throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
							}
							break;
						default:
							throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
						}
					}
					break;
				default:
					throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
				}
				break;
			default:
				throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
			}
		}
	}
	,parseAbstractRelations: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					switch(_g.tok[2][2]) {
					case "to":
						this.last = this.token.elt;
						this.token = this.token.next;
						var t = this.parseComplexType();
						return haxeparser_AbstractFlag.AToType(t);
					case "from":
						this.last = this.token.elt;
						this.token = this.token.next;
						var t1 = this.parseComplexType();
						return haxeparser_AbstractFlag.AFromType(t1);
					default:
						throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
					}
					break;
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,parseAbstractSubtype: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t = this.parseComplexType();
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 19:
						this.last = this.token.elt;
						this.token = this.token.next;
						return t;
					default:
						return (function($this) {
							var $r;
							throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
							return $r;
						}(this));
					}
				}
				break;
			default:
				return null;
			}
		}
	}
	,parsePackage: function() {
		return this.psep(haxeparser_TokenDef.Dot,$bind(this,this.lowerIdentOrMacro));
	}
	,parseClassFields: function(tdecl,p1) {
		var l = this.parseClassFieldResume(tdecl);
		var p2;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 17:
				var p21 = _g.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				p2 = p21;
				break;
			default:
				p2 = (function($this) {
					var $r;
					throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
					return $r;
				}(this));
			}
		}
		return { fields : l, pos : p2};
	}
	,parseClassFieldResume: function(tdecl) {
		return this.parseRepeat($bind(this,this.parseClassField));
	}
	,parseCommonFlags: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 19:
					this.last = this.token.elt;
					this.token = this.token.next;
					var l = this.parseCommonFlags();
					return haxeparser_HaxeParser.aadd(l,{ c : haxeparser_ClassFlag.HPrivate, e : haxeparser_EnumFlag.EPrivate});
				case 25:
					this.last = this.token.elt;
					this.token = this.token.next;
					var l1 = this.parseCommonFlags();
					return haxeparser_HaxeParser.aadd(l1,{ c : haxeparser_ClassFlag.HExtern, e : haxeparser_EnumFlag.EExtern});
				default:
					return [];
				}
				break;
			default:
				return [];
			}
		}
	}
	,parseMetaParams: function(pname) {
		var def = function() {
			return [];
		};
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 18:
				var p = _g.pos;
				if(p.min == pname.max) {
					this.last = this.token.elt;
					this.token = this.token.next;
					var params = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.expr));
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 19:
							this.last = this.token.elt;
							this.token = this.token.next;
							return params;
						default:
							return (function($this) {
								var $r;
								throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
								return $r;
							}(this));
						}
					}
				} else return def();
				break;
			default:
				return def();
			}
		}
	}
	,parseMetaEntry: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 21:
				this.last = this.token.elt;
				this.token = this.token.next;
				var name = this.metaName();
				var params = this.parseMetaParams(name.pos);
				return { name : name.name, params : params, pos : name.pos};
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,parseMeta: function() {
		try {
			var entry = this.parseMetaEntry();
			return haxeparser_HaxeParser.aadd(this.parseMeta(),entry);
		} catch( _ ) {
			if (_ instanceof js__$Boot_HaxeError) _ = _.val;
			if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
				return [];
			} else throw(_);
		}
	}
	,metaName: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var i = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { name : i, pos : p};
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			case 0:
				var p1 = _g.pos;
				var k = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				return { name : k[0].toLowerCase(), pos : p1};
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 1:
						switch(_g1.tok[2][1]) {
						case 3:
							var p2 = _g1.pos;
							var i1 = _g1.tok[2][2];
							this.last = this.token.elt;
							this.token = this.token.next;
							return { name : ":" + i1, pos : p2};
						default:
							throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
						}
						break;
					case 0:
						var p3 = _g1.pos;
						var k1 = _g1.tok[2];
						this.last = this.token.elt;
						this.token = this.token.next;
						return { name : ":" + k1[0].toLowerCase(), pos : p3};
					default:
						throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
					}
				}
				break;
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,parseEnumFlags: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 26:
					var p = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					return { flags : [], pos : p};
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,parseClassFlags: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 1:
					var p = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					return { flags : [], pos : p};
				case 28:
					var p1 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					return { flags : haxeparser_HaxeParser.aadd([],haxeparser_ClassFlag.HInterface), pos : p1};
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,parseTypeOpt: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t = this.parseComplexType();
				return t;
			default:
				return null;
			}
		}
	}
	,parseComplexType: function() {
		var t = this.parseComplexTypeInner();
		return this.parseComplexTypeNext(t);
	}
	,parseComplexTypeInner: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t = this.parseComplexType();
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 19:
						this.last = this.token.elt;
						this.token = this.token.next;
						return haxe_macro_ComplexType.TParent(t);
					default:
						return (function($this) {
							var $r;
							throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
							return $r;
						}(this));
					}
				}
				break;
			case 16:
				var p1 = _g.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				try {
					var l = this.parseTypeAnonymous(false);
					return haxe_macro_ComplexType.TAnonymous(l);
				} catch( _ ) {
					if (_ instanceof js__$Boot_HaxeError) _ = _.val;
					if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
						{
							var _g11 = this.peek(0);
							switch(_g11.tok[1]) {
							case 5:
								switch(_g11.tok[2][1]) {
								case 7:
									this.last = this.token.elt;
									this.token = this.token.next;
									var t1 = this.parseTypePath();
									{
										var _g2 = this.peek(0);
										switch(_g2.tok[1]) {
										case 13:
											this.last = this.token.elt;
											this.token = this.token.next;
											try {
												var l1 = this.parseTypeAnonymous(false);
												return haxe_macro_ComplexType.TExtend([t1],l1);
											} catch( _1 ) {
												if (_1 instanceof js__$Boot_HaxeError) _1 = _1.val;
												if( js_Boot.__instanceof(_1,hxparse_NoMatch) ) {
													try {
														var fl = this.parseClassFields(true,p1);
														return haxe_macro_ComplexType.TExtend([t1],fl.fields);
													} catch( _2 ) {
														if (_2 instanceof js__$Boot_HaxeError) _2 = _2.val;
														if( js_Boot.__instanceof(_2,hxparse_NoMatch) ) {
															return (function($this) {
																var $r;
																throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																return $r;
															}(this));
														} else throw(_2);
													}
												} else throw(_1);
											}
											break;
										default:
											return (function($this) {
												var $r;
												throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
												return $r;
											}(this));
										}
									}
									break;
								default:
									try {
										var l2 = this.parseClassFields(true,p1);
										return haxe_macro_ComplexType.TAnonymous(l2.fields);
									} catch( _3 ) {
										if (_3 instanceof js__$Boot_HaxeError) _3 = _3.val;
										if( js_Boot.__instanceof(_3,hxparse_NoMatch) ) {
											return (function($this) {
												var $r;
												throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
												return $r;
											}(this));
										} else throw(_3);
									}
								}
								break;
							default:
								try {
									var l3 = this.parseClassFields(true,p1);
									return haxe_macro_ComplexType.TAnonymous(l3.fields);
								} catch( _4 ) {
									if (_4 instanceof js__$Boot_HaxeError) _4 = _4.val;
									if( js_Boot.__instanceof(_4,hxparse_NoMatch) ) {
										return (function($this) {
											var $r;
											throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
											return $r;
										}(this));
									} else throw(_4);
								}
							}
						}
					} else throw(_);
				}
				break;
			case 20:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t2 = this.parseComplexTypeInner();
				return haxe_macro_ComplexType.TOptional(t2);
			default:
				var t3 = this.parseTypePath();
				return haxe_macro_ComplexType.TPath(t3);
			}
		}
	}
	,parseTypePath: function() {
		return this.parseTypePath1([]);
	}
	,parseTypePath1: function(pack) {
		var _g1 = this;
		var ident = this.dollarIdentMacro(pack);
		if(haxeparser_HaxeParser.isLowerIdent(ident.name)) {
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 10:
				this.last = this.token.elt;
				this.token = this.token.next;
				return this.parseTypePath1(haxeparser_HaxeParser.aadd(pack,ident.name));
			case 9:
				this.last = this.token.elt;
				this.token = this.token.next;
				throw new js__$Boot_HaxeError(new haxeparser_ParserError(haxeparser_ParserErrorMsg.Custom("Type name should start with an uppercase letter"),ident.pos));
				break;
			default:
				return (function($this) {
					var $r;
					throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
					return $r;
				}(this));
			}
		} else {
			var sub;
			{
				var _g2 = this.peek(0);
				switch(_g2.tok[1]) {
				case 10:
					this.last = this.token.elt;
					this.token = this.token.next;
					var def = function() {
						return (function($this) {
							var $r;
							throw new js__$Boot_HaxeError(new hxparse_Unexpected(_g1.peek(0),_g1.stream.curPos()));
							return $r;
						}(this));
					};
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 1:
							switch(_g11.tok[2][1]) {
							case 3:
								var name = _g11.tok[2][2];
								if(!haxeparser_HaxeParser.isLowerIdent(name)) {
									this.last = this.token.elt;
									this.token = this.token.next;
									sub = name;
								} else sub = def();
								break;
							default:
								sub = def();
							}
							break;
						default:
							sub = def();
						}
					}
					break;
				default:
					sub = null;
				}
			}
			var params;
			{
				var _g3 = this.peek(0);
				switch(_g3.tok[1]) {
				case 5:
					switch(_g3.tok[2][1]) {
					case 9:
						this.last = this.token.elt;
						this.token = this.token.next;
						var l = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.parseTypePathOrConst));
						{
							var _g12 = this.peek(0);
							switch(_g12.tok[1]) {
							case 5:
								switch(_g12.tok[2][1]) {
								case 7:
									this.last = this.token.elt;
									this.token = this.token.next;
									params = l;
									break;
								default:
									params = (function($this) {
										var $r;
										throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
										return $r;
									}(this));
								}
								break;
							default:
								params = (function($this) {
									var $r;
									throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
									return $r;
								}(this));
							}
						}
						break;
					default:
						params = [];
					}
					break;
				default:
					params = [];
				}
			}
			return { pack : pack, name : ident.name, params : params, sub : sub};
		}
	}
	,typeName: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var name = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					if(haxeparser_HaxeParser.isLowerIdent(name)) throw new js__$Boot_HaxeError(new haxeparser_ParserError(haxeparser_ParserErrorMsg.Custom("Type name should start with an uppercase letter"),p)); else return name;
					break;
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,parseTypePathOrConst: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 14:
				var p1 = _g.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				var l = this.parseArrayDecl();
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 15:
						var p2 = _g1.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						return haxe_macro_TypeParam.TPExpr({ expr : haxe_macro_ExprDef.EArrayDecl(l), pos : haxeparser_HaxeParser.punion(p1,p2)});
					default:
						return (function($this) {
							var $r;
							throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
							return $r;
						}(this));
					}
				}
				break;
			default:
				try {
					var t = this.parseComplexType();
					return haxe_macro_TypeParam.TPType(t);
				} catch( _ ) {
					if (_ instanceof js__$Boot_HaxeError) _ = _.val;
					if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
						{
							var _g11 = this.peek(0);
							switch(_g11.tok[1]) {
							case 1:
								var p = _g11.pos;
								var c = _g11.tok[2];
								this.last = this.token.elt;
								this.token = this.token.next;
								return haxe_macro_TypeParam.TPExpr({ expr : haxe_macro_ExprDef.EConst(c), pos : p});
							default:
								try {
									var e = this.expr();
									return haxe_macro_TypeParam.TPExpr(e);
								} catch( _1 ) {
									if (_1 instanceof js__$Boot_HaxeError) _1 = _1.val;
									if( js_Boot.__instanceof(_1,hxparse_NoMatch) ) {
										return (function($this) {
											var $r;
											throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
											return $r;
										}(this));
									} else throw(_1);
								}
							}
						}
					} else throw(_);
				}
			}
		}
	}
	,parseComplexTypeNext: function(t) {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 12:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t2 = this.parseComplexType();
				switch(t2[1]) {
				case 1:
					var r = t2[3];
					var args = t2[2];
					return haxe_macro_ComplexType.TFunction(haxeparser_HaxeParser.aadd(args,t),r);
				default:
					return haxe_macro_ComplexType.TFunction([t],t2);
				}
				break;
			default:
				return t;
			}
		}
	}
	,parseTypeAnonymous: function(opt) {
		var _g = this;
		try {
			var id = this.ident();
			{
				var _g1 = this.peek(0);
				switch(_g1.tok[1]) {
				case 11:
					this.last = this.token.elt;
					this.token = this.token.next;
					var t = this.parseComplexType();
					var next = function(p2,acc) {
						var t1;
						if(!opt) t1 = t; else switch(t[1]) {
						case 0:
							switch(t[2].pack.length) {
							case 0:
								switch(t[2].name) {
								case "Null":
									t1 = t;
									break;
								default:
									t1 = haxe_macro_ComplexType.TPath({ pack : [], name : "Null", sub : null, params : [haxe_macro_TypeParam.TPType(t)]});
								}
								break;
							default:
								t1 = haxe_macro_ComplexType.TPath({ pack : [], name : "Null", sub : null, params : [haxe_macro_TypeParam.TPType(t)]});
							}
							break;
						default:
							t1 = haxe_macro_ComplexType.TPath({ pack : [], name : "Null", sub : null, params : [haxe_macro_TypeParam.TPType(t)]});
						}
						return haxeparser_HaxeParser.aadd(acc,{ name : id.name, meta : opt?[{ name : ":optional", params : [], pos : id.pos}]:[], access : [], doc : null, kind : haxe_macro_FieldType.FVar(t1,null), pos : haxeparser_HaxeParser.punion(id.pos,p2)});
					};
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 17:
							var p21 = _g11.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return next(p21,[]);
						case 13:
							var p22 = _g11.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 17:
									this.last = this.token.elt;
									this.token = this.token.next;
									return next(p22,[]);
								default:
									try {
										var l = this.parseTypeAnonymous(false);
										return next(p22,l);
									} catch( _ ) {
										if (_ instanceof js__$Boot_HaxeError) _ = _.val;
										if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
											return (function($this) {
												var $r;
												throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
												return $r;
											}(this));
										} else throw(_);
									}
								}
							}
							break;
						default:
							return (function($this) {
								var $r;
								throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
								return $r;
							}(this));
						}
					}
					break;
				default:
					return (function($this) {
						var $r;
						throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
						return $r;
					}(this));
				}
			}
		} catch( _1 ) {
			if (_1 instanceof js__$Boot_HaxeError) _1 = _1.val;
			if( js_Boot.__instanceof(_1,hxparse_NoMatch) ) {
				var def = function() {
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(_g.stream.curPos(),_g.peek(0)));
				};
				{
					var _g3 = this.peek(0);
					switch(_g3.tok[1]) {
					case 20:
						if(!opt) {
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.parseTypeAnonymous(true);
						} else return def();
						break;
					default:
						return def();
					}
				}
			} else throw(_1);
		}
	}
	,parseEnum: function() {
		this.doc = null;
		var meta = this.parseMeta();
		var name = this.anyEnumIdent();
		var doc = this.getDoc();
		var params = this.parseConstraintParams();
		var args;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				var l = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.parseEnumParam));
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 19:
						this.last = this.token.elt;
						this.token = this.token.next;
						args = l;
						break;
					default:
						args = (function($this) {
							var $r;
							throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
							return $r;
						}(this));
					}
				}
				break;
			default:
				args = [];
			}
		}
		var t;
		{
			var _g2 = this.peek(0);
			switch(_g2.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t1 = this.parseComplexType();
				t = t1;
				break;
			default:
				t = null;
			}
		}
		var p2;
		try {
			var p = this.semicolon();
			p2 = p;
		} catch( _ ) {
			if (_ instanceof js__$Boot_HaxeError) _ = _.val;
			if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
				p2 = (function($this) {
					var $r;
					throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
					return $r;
				}(this));
			} else throw(_);
		}
		return { name : name.name, doc : doc, meta : meta, args : args, params : params, type : t, pos : haxeparser_HaxeParser.punion(name.pos,p2)};
	}
	,parseEnumParam: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 20:
				this.last = this.token.elt;
				this.token = this.token.next;
				var name = this.ident();
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 11:
						this.last = this.token.elt;
						this.token = this.token.next;
						var t = this.parseComplexType();
						return { name : name.name, opt : true, type : t};
					default:
						return (function($this) {
							var $r;
							throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
							return $r;
						}(this));
					}
				}
				break;
			default:
				var name1 = this.ident();
				{
					var _g11 = this.peek(0);
					switch(_g11.tok[1]) {
					case 11:
						this.last = this.token.elt;
						this.token = this.token.next;
						var t1 = this.parseComplexType();
						return { name : name1.name, opt : false, type : t1};
					default:
						return (function($this) {
							var $r;
							throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
							return $r;
						}(this));
					}
				}
			}
		}
	}
	,parseClassField: function() {
		this.doc = null;
		var meta = this.parseMeta();
		var al = this.parseCfRights(true,[]);
		var doc = this.getDoc();
		var data;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 2:
					var p1 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					var name = this.ident();
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 18:
							this.last = this.token.elt;
							this.token = this.token.next;
							var i1 = this.propertyIdent();
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 13:
									this.last = this.token.elt;
									this.token = this.token.next;
									var i2 = this.propertyIdent();
									{
										var _g3 = this.peek(0);
										switch(_g3.tok[1]) {
										case 19:
											this.last = this.token.elt;
											this.token = this.token.next;
											var t;
											{
												var _g4 = this.peek(0);
												switch(_g4.tok[1]) {
												case 11:
													this.last = this.token.elt;
													this.token = this.token.next;
													var t1 = this.parseComplexType();
													t = t1;
													break;
												default:
													t = null;
												}
											}
											var e;
											{
												var _g41 = this.peek(0);
												switch(_g41.tok[1]) {
												case 5:
													switch(_g41.tok[2][1]) {
													case 4:
														this.last = this.token.elt;
														this.token = this.token.next;
														var e1 = this.toplevelExpr();
														var p2 = this.semicolon();
														e = { expr : e1, pos : p2};
														break;
													default:
														e = (function($this) {
															var $r;
															throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
															return $r;
														}(this));
													}
													break;
												case 9:
													var p21 = _g41.pos;
													this.last = this.token.elt;
													this.token = this.token.next;
													e = { expr : null, pos : p21};
													break;
												default:
													e = (function($this) {
														var $r;
														throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
														return $r;
													}(this));
												}
											}
											data = { name : name.name, pos : haxeparser_HaxeParser.punion(p1,e.pos), kind : haxe_macro_FieldType.FProp(i1,i2,t,e.expr)};
											break;
										default:
											data = (function($this) {
												var $r;
												throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
												return $r;
											}(this));
										}
									}
									break;
								default:
									data = (function($this) {
										var $r;
										throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
										return $r;
									}(this));
								}
							}
							break;
						default:
							var t2 = this.parseTypeOpt();
							var e2;
							{
								var _g21 = this.peek(0);
								switch(_g21.tok[1]) {
								case 5:
									switch(_g21.tok[2][1]) {
									case 4:
										this.last = this.token.elt;
										this.token = this.token.next;
										var e3 = this.toplevelExpr();
										var p22 = this.semicolon();
										e2 = { expr : e3, pos : p22};
										break;
									default:
										e2 = (function($this) {
											var $r;
											throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
											return $r;
										}(this));
									}
									break;
								case 9:
									var p23 = _g21.pos;
									this.last = this.token.elt;
									this.token = this.token.next;
									e2 = { expr : null, pos : p23};
									break;
								default:
									e2 = (function($this) {
										var $r;
										throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
										return $r;
									}(this));
								}
							}
							data = { name : name.name, pos : haxeparser_HaxeParser.punion(p1,e2.pos), kind : haxe_macro_FieldType.FVar(t2,e2.expr)};
						}
					}
					break;
				case 0:
					var p11 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					var name1 = this.parseFunName();
					var pl = this.parseConstraintParams();
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 18:
							this.last = this.token.elt;
							this.token = this.token.next;
							var al1 = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.parseFunParam));
							{
								var _g22 = this.peek(0);
								switch(_g22.tok[1]) {
								case 19:
									this.last = this.token.elt;
									this.token = this.token.next;
									var t3 = this.parseTypeOpt();
									var e4;
									try {
										var e5 = this.toplevelExpr();
										this.semicolon();
										e4 = { expr : e5, pos : e5.pos};
									} catch( _ ) {
										if (_ instanceof js__$Boot_HaxeError) _ = _.val;
										if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
											{
												var _g31 = this.peek(0);
												switch(_g31.tok[1]) {
												case 9:
													var p = _g31.pos;
													this.last = this.token.elt;
													this.token = this.token.next;
													e4 = { expr : null, pos : p};
													break;
												default:
													e4 = (function($this) {
														var $r;
														throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
														return $r;
													}(this));
												}
											}
										} else throw(_);
									}
									var f = { params : pl, args : al1, ret : t3, expr : e4.expr};
									data = { name : name1, pos : haxeparser_HaxeParser.punion(p11,e4.pos), kind : haxe_macro_FieldType.FFun(f)};
									break;
								default:
									data = (function($this) {
										var $r;
										throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
										return $r;
									}(this));
								}
							}
							break;
						default:
							data = (function($this) {
								var $r;
								throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
								return $r;
							}(this));
						}
					}
					break;
				default:
					if(al.length == 0) throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0))); else data = (function($this) {
						var $r;
						throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
						return $r;
					}(this));
				}
				break;
			default:
				if(al.length == 0) throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0))); else data = (function($this) {
					var $r;
					throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
					return $r;
				}(this));
			}
		}
		return { name : data.name, doc : doc, meta : meta, access : al, pos : data.pos, kind : data.kind};
	}
	,parseCfRights: function(allowStatic,l) {
		var _g = this;
		var def5 = function() {
			var def4 = function() {
				var def3 = function() {
					var def2 = function() {
						var def1 = function() {
							var def = function() {
								{
									var _g1 = _g.peek(0);
									switch(_g1.tok[1]) {
									case 0:
										switch(_g1.tok[2][1]) {
										case 35:
											_g.last = _g.token.elt;
											_g.token = _g.token.next;
											var l1 = _g.parseCfRights(allowStatic,haxeparser_HaxeParser.aadd(l,haxe_macro_Access.AInline));
											return l1;
										default:
											return l;
										}
										break;
									default:
										return l;
									}
								}
							};
							{
								var _g11 = _g.peek(0);
								switch(_g11.tok[1]) {
								case 0:
									switch(_g11.tok[2][1]) {
									case 33:
										if(!Lambda.has(l,haxe_macro_Access.ADynamic)) {
											_g.last = _g.token.elt;
											_g.token = _g.token.next;
											var l2 = _g.parseCfRights(allowStatic,haxeparser_HaxeParser.aadd(l,haxe_macro_Access.ADynamic));
											return l2;
										} else return def();
										break;
									default:
										return def();
									}
									break;
								default:
									return def();
								}
							}
						};
						{
							var _g12 = _g.peek(0);
							switch(_g12.tok[1]) {
							case 0:
								switch(_g12.tok[2][1]) {
								case 31:
									if(!Lambda.has(l,haxe_macro_Access.AOverride)) {
										_g.last = _g.token.elt;
										_g.token = _g.token.next;
										var l3 = _g.parseCfRights(false,haxeparser_HaxeParser.aadd(l,haxe_macro_Access.AOverride));
										return l3;
									} else return def1();
									break;
								default:
									return def1();
								}
								break;
							default:
								return def1();
							}
						}
					};
					{
						var _g13 = _g.peek(0);
						switch(_g13.tok[1]) {
						case 0:
							switch(_g13.tok[2][1]) {
							case 19:
								if(!(Lambda.has(l,haxe_macro_Access.APublic) || Lambda.has(l,haxe_macro_Access.APrivate))) {
									_g.last = _g.token.elt;
									_g.token = _g.token.next;
									var l4 = _g.parseCfRights(allowStatic,haxeparser_HaxeParser.aadd(l,haxe_macro_Access.APrivate));
									return l4;
								} else return def2();
								break;
							default:
								return def2();
							}
							break;
						default:
							return def2();
						}
					}
				};
				{
					var _g14 = _g.peek(0);
					switch(_g14.tok[1]) {
					case 0:
						switch(_g14.tok[2][1]) {
						case 18:
							if(!(Lambda.has(l,haxe_macro_Access.APublic) || Lambda.has(l,haxe_macro_Access.APrivate))) {
								_g.last = _g.token.elt;
								_g.token = _g.token.next;
								var l5 = _g.parseCfRights(allowStatic,haxeparser_HaxeParser.aadd(l,haxe_macro_Access.APublic));
								return l5;
							} else return def3();
							break;
						default:
							return def3();
						}
						break;
					default:
						return def3();
					}
				}
			};
			{
				var _g15 = _g.peek(0);
				switch(_g15.tok[1]) {
				case 0:
					switch(_g15.tok[2][1]) {
					case 41:
						if(!Lambda.has(l,haxe_macro_Access.AMacro)) {
							_g.last = _g.token.elt;
							_g.token = _g.token.next;
							var l6 = _g.parseCfRights(allowStatic,haxeparser_HaxeParser.aadd(l,haxe_macro_Access.AMacro));
							return l6;
						} else return def4();
						break;
					default:
						return def4();
					}
					break;
				default:
					return def4();
				}
			}
		};
		{
			var _g2 = this.peek(0);
			switch(_g2.tok[1]) {
			case 0:
				switch(_g2.tok[2][1]) {
				case 17:
					if(allowStatic) {
						this.last = this.token.elt;
						this.token = this.token.next;
						var l7 = this.parseCfRights(false,haxeparser_HaxeParser.aadd(l,haxe_macro_Access.AStatic));
						return l7;
					} else return def5();
					break;
				default:
					return def5();
				}
				break;
			default:
				return def5();
			}
		}
	}
	,parseFunName: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var name = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return name;
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			case 0:
				switch(_g.tok[2][1]) {
				case 22:
					this.last = this.token.elt;
					this.token = this.token.next;
					return "new";
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,parseFunParam: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 20:
				this.last = this.token.elt;
				this.token = this.token.next;
				var id = this.ident();
				var t = this.parseTypeOpt();
				var c = this.parseFunParamValue();
				return { name : id.name, opt : true, type : t, value : c};
			default:
				var id1 = this.ident();
				var t1 = this.parseTypeOpt();
				var c1 = this.parseFunParamValue();
				return { name : id1.name, opt : false, type : t1, value : c1};
			}
		}
	}
	,parseFunParamValue: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 5:
				switch(_g.tok[2][1]) {
				case 4:
					this.last = this.token.elt;
					this.token = this.token.next;
					var e = this.toplevelExpr();
					return e;
				default:
					return null;
				}
				break;
			default:
				return null;
			}
		}
	}
	,parseConstraintParams: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 5:
				switch(_g.tok[2][1]) {
				case 9:
					this.last = this.token.elt;
					this.token = this.token.next;
					var l = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.parseConstraintParam));
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 5:
							switch(_g1.tok[2][1]) {
							case 7:
								this.last = this.token.elt;
								this.token = this.token.next;
								return l;
							default:
								return (function($this) {
									var $r;
									throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
									return $r;
								}(this));
							}
							break;
						default:
							return (function($this) {
								var $r;
								throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
								return $r;
							}(this));
						}
					}
					break;
				default:
					return [];
				}
				break;
			default:
				return [];
			}
		}
	}
	,parseConstraintParam: function() {
		var name = this.typeName();
		var params = [];
		var ctl;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 18:
						this.last = this.token.elt;
						this.token = this.token.next;
						var l = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.parseComplexType));
						{
							var _g2 = this.peek(0);
							switch(_g2.tok[1]) {
							case 19:
								this.last = this.token.elt;
								this.token = this.token.next;
								ctl = l;
								break;
							default:
								ctl = (function($this) {
									var $r;
									throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
									return $r;
								}(this));
							}
						}
						break;
					default:
						try {
							var t = this.parseComplexType();
							ctl = [t];
						} catch( _ ) {
							if (_ instanceof js__$Boot_HaxeError) _ = _.val;
							if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
								ctl = (function($this) {
									var $r;
									throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
									return $r;
								}(this));
							} else throw(_);
						}
					}
				}
				break;
			default:
				ctl = [];
			}
		}
		return { name : name, params : params, constraints : ctl};
	}
	,parseClassHerit: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 11:
					this.last = this.token.elt;
					this.token = this.token.next;
					var t = this.parseTypePath();
					return haxeparser_ClassFlag.HExtends(t);
				case 12:
					this.last = this.token.elt;
					this.token = this.token.next;
					var t1 = this.parseTypePath();
					return haxeparser_ClassFlag.HImplements(t1);
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,block1: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var name = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return this.block2(name,haxe_macro_Constant.CIdent(name),p);
				case 2:
					var p1 = _g.pos;
					var name1 = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return this.block2(haxeparser_HaxeParser.quoteIdent(name1),haxe_macro_Constant.CString(name1),p1);
				default:
					var b = this.block([]);
					return haxe_macro_ExprDef.EBlock(b);
				}
				break;
			default:
				var b1 = this.block([]);
				return haxe_macro_ExprDef.EBlock(b1);
			}
		}
	}
	,block2: function(name,ident,p) {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				var e = this.expr();
				var l = this.parseObjDecl();
				l.unshift({ field : name, expr : e});
				return haxe_macro_ExprDef.EObjectDecl(l);
			default:
				var e1 = this.exprNext({ expr : haxe_macro_ExprDef.EConst(ident), pos : p});
				var _ = this.semicolon();
				var b = this.block([e1]);
				return haxe_macro_ExprDef.EBlock(b);
			}
		}
	}
	,block: function(acc) {
		try {
			var e = this.parseBlockElt();
			return this.block(haxeparser_HaxeParser.aadd(acc,e));
		} catch( e1 ) {
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			if( js_Boot.__instanceof(e1,hxparse_NoMatch) ) {
				return acc;
			} else throw(e1);
		}
	}
	,parseBlockElt: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 2:
					var p1 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					var vl = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.parseVarDecl));
					var p2 = this.semicolon();
					return { expr : haxe_macro_ExprDef.EVars(vl), pos : haxeparser_HaxeParser.punion(p1,p2)};
				default:
					var e = this.expr();
					this.semicolon();
					return e;
				}
				break;
			default:
				var e1 = this.expr();
				this.semicolon();
				return e1;
			}
		}
	}
	,parseObjDecl: function() {
		var acc = [];
		try {
			while(true) {
				var _g = this.peek(0);
				switch(_g.tok[1]) {
				case 13:
					this.last = this.token.elt;
					this.token = this.token.next;
					try {
						var id = this.ident();
						{
							var _g1 = this.peek(0);
							switch(_g1.tok[1]) {
							case 11:
								this.last = this.token.elt;
								this.token = this.token.next;
								var e = this.expr();
								acc.push({ field : id.name, expr : e});
								break;
							default:
								throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
							}
						}
					} catch( _ ) {
						if (_ instanceof js__$Boot_HaxeError) _ = _.val;
						if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
							{
								var _g11 = this.peek(0);
								switch(_g11.tok[1]) {
								case 1:
									switch(_g11.tok[2][1]) {
									case 2:
										var name = _g11.tok[2][2];
										this.last = this.token.elt;
										this.token = this.token.next;
										{
											var _g2 = this.peek(0);
											switch(_g2.tok[1]) {
											case 11:
												this.last = this.token.elt;
												this.token = this.token.next;
												var e1 = this.expr();
												acc.push({ field : haxeparser_HaxeParser.quoteIdent(name), expr : e1});
												break;
											default:
												throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
											}
										}
										break;
									default:
										throw "__break__";
									}
									break;
								default:
									throw "__break__";
								}
							}
						} else throw(_);
					}
					break;
				default:
					throw "__break__";
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return acc;
	}
	,parseArrayDecl: function() {
		var acc = [];
		var br = false;
		while(true) {
			try {
				var e = this.expr();
				acc.push(e);
				{
					var _g = this.peek(0);
					switch(_g.tok[1]) {
					case 13:
						this.last = this.token.elt;
						this.token = this.token.next;
						null;
						break;
					default:
						br = true;
					}
				}
			} catch( _ ) {
				if (_ instanceof js__$Boot_HaxeError) _ = _.val;
				if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
					br = true;
				} else throw(_);
			}
			if(br) break;
		}
		return acc;
	}
	,parseVarDecl: function() {
		var id = this.dollarIdent();
		var t = this.parseTypeOpt();
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 5:
				switch(_g.tok[2][1]) {
				case 4:
					this.last = this.token.elt;
					this.token = this.token.next;
					var e = this.expr();
					return { name : id.name, type : t, expr : e};
				default:
					return { name : id.name, type : t, expr : null};
				}
				break;
			default:
				return { name : id.name, type : t, expr : null};
			}
		}
	}
	,inlineFunction: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 35:
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 0:
							switch(_g1.tok[2][1]) {
							case 0:
								var p1 = _g1.pos;
								this.last = this.token.elt;
								this.token = this.token.next;
								return { isInline : true, pos : p1};
							default:
								return (function($this) {
									var $r;
									throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
									return $r;
								}(this));
							}
							break;
						default:
							return (function($this) {
								var $r;
								throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
								return $r;
							}(this));
						}
					}
					break;
				case 0:
					var p11 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					return { isInline : false, pos : p11};
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,reify: function(inMacro) {
		var reificator = new haxeparser__$HaxeParser_Reificator(inMacro);
		return { toExpr : function(e) {
			return reificator.toExpr(e,e.pos);
		}, toType : $bind(reificator,reificator.toCType), toTypeDef : $bind(reificator,reificator.toTypeDef)};
	}
	,reifyExpr: function(e) {
		var toExpr = this.reify(this.inMacro).toExpr;
		var e1 = toExpr(e);
		return { expr : haxe_macro_ExprDef.ECheckType(e1,haxe_macro_ComplexType.TPath({ pack : ["haxe","macro"], name : "Expr", sub : null, params : []})), pos : e1.pos};
	}
	,parseMacroExpr: function(p) {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t = this.parseComplexType();
				var toType = this.reify(this.inMacro).toType;
				var t1 = toType(t,p);
				return { expr : haxe_macro_ExprDef.ECheckType(t1,haxe_macro_ComplexType.TPath({ pack : ["haxe","macro"], name : "Expr", sub : "ComplexType", params : []})), pos : p};
			case 0:
				switch(_g.tok[2][1]) {
				case 2:
					var p1 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					var vl = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.parseVarDecl));
					return this.reifyExpr({ expr : haxe_macro_ExprDef.EVars(vl), pos : p1});
				default:
					try {
						var d = this.parseClass([],[],false);
						var toType1 = this.reify(this.inMacro).toTypeDef;
						return { expr : haxe_macro_ExprDef.ECheckType(toType1(d),haxe_macro_ComplexType.TPath({ pack : ["haxe","macro"], name : "Expr", sub : "TypeDefinition", params : []})), pos : p};
					} catch( _ ) {
						if (_ instanceof js__$Boot_HaxeError) _ = _.val;
						if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
							var e = this.secureExpr();
							return this.reifyExpr(e);
						} else throw(_);
					}
				}
				break;
			default:
				try {
					var d1 = this.parseClass([],[],false);
					var toType2 = this.reify(this.inMacro).toTypeDef;
					return { expr : haxe_macro_ExprDef.ECheckType(toType2(d1),haxe_macro_ComplexType.TPath({ pack : ["haxe","macro"], name : "Expr", sub : "TypeDefinition", params : []})), pos : p};
				} catch( _1 ) {
					if (_1 instanceof js__$Boot_HaxeError) _1 = _1.val;
					if( js_Boot.__instanceof(_1,hxparse_NoMatch) ) {
						var e1 = this.secureExpr();
						return this.reifyExpr(e1);
					} else throw(_1);
				}
			}
		}
	}
	,expr: function() {
		try {
			var meta = this.parseMetaEntry();
			return haxeparser_HaxeParser.makeMeta(meta.name,meta.params,this.secureExpr(),meta.pos);
		} catch( _ ) {
			if (_ instanceof js__$Boot_HaxeError) _ = _.val;
			if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
				{
					var _g = this.peek(0);
					switch(_g.tok[1]) {
					case 16:
						var p1 = _g.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						var b = this.block1();
						{
							var _g1 = this.peek(0);
							switch(_g1.tok[1]) {
							case 17:
								var p2 = _g1.pos;
								this.last = this.token.elt;
								this.token = this.token.next;
								var e = { expr : b, pos : haxeparser_HaxeParser.punion(p1,p2)};
								switch(b[1]) {
								case 5:
									return this.exprNext(e);
								default:
									return e;
								}
								break;
							default:
								return (function($this) {
									var $r;
									throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
									return $r;
								}(this));
							}
						}
						break;
					case 0:
						switch(_g.tok[2][1]) {
						case 41:
							var p = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.parseMacroExpr(p);
						case 2:
							var p11 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							var v = this.parseVarDecl();
							return { expr : haxe_macro_ExprDef.EVars([v]), pos : p11};
						case 23:
							var p3 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.exprNext({ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent("this")), pos : p3});
						case 38:
							var p4 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.exprNext({ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent("true")), pos : p4});
						case 39:
							var p5 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.exprNext({ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent("false")), pos : p5});
						case 37:
							var p6 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.exprNext({ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent("null")), pos : p6});
						case 30:
							var p12 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							{
								var _g11 = this.peek(0);
								switch(_g11.tok[1]) {
								case 18:
									this.last = this.token.elt;
									this.token = this.token.next;
									var e1 = this.expr();
									{
										var _g2 = this.peek(0);
										switch(_g2.tok[1]) {
										case 13:
											this.last = this.token.elt;
											this.token = this.token.next;
											var t = this.parseComplexType();
											{
												var _g3 = this.peek(0);
												switch(_g3.tok[1]) {
												case 19:
													var p21 = _g3.pos;
													this.last = this.token.elt;
													this.token = this.token.next;
													return this.exprNext({ expr : haxe_macro_ExprDef.ECast(e1,t), pos : haxeparser_HaxeParser.punion(p12,p21)});
												default:
													return (function($this) {
														var $r;
														throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
														return $r;
													}(this));
												}
											}
											break;
										case 19:
											var p22 = _g2.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											return this.exprNext({ expr : haxe_macro_ExprDef.ECast(e1,null), pos : haxeparser_HaxeParser.punion(p12,p22)});
										default:
											return (function($this) {
												var $r;
												throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
												return $r;
											}(this));
										}
									}
									break;
								default:
									var e2 = this.secureExpr();
									return this.exprNext({ expr : haxe_macro_ExprDef.ECast(e2,null), pos : haxeparser_HaxeParser.punion(p12,e2.pos)});
								}
							}
							break;
						case 24:
							var p7 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							var e3 = this.expr();
							return { expr : haxe_macro_ExprDef.EThrow(e3), pos : p7};
						case 22:
							var p13 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							var t1 = this.parseTypePath();
							{
								var _g12 = this.peek(0);
								switch(_g12.tok[1]) {
								case 18:
									this.last = this.token.elt;
									this.token = this.token.next;
									try {
										var al = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.expr));
										{
											var _g21 = this.peek(0);
											switch(_g21.tok[1]) {
											case 19:
												var p23 = _g21.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												return this.exprNext({ expr : haxe_macro_ExprDef.ENew(t1,al), pos : haxeparser_HaxeParser.punion(p13,p23)});
											default:
												return (function($this) {
													var $r;
													throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
													return $r;
												}(this));
											}
										}
									} catch( _1 ) {
										if (_1 instanceof js__$Boot_HaxeError) _1 = _1.val;
										if( js_Boot.__instanceof(_1,hxparse_NoMatch) ) {
											return (function($this) {
												var $r;
												throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
												return $r;
											}(this));
										} else throw(_1);
									}
									break;
								default:
									return (function($this) {
										var $r;
										throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
										return $r;
									}(this));
								}
							}
							break;
						default:
							try {
								var inl = this.inlineFunction();
								var name = this.parseOptional($bind(this,this.dollarIdent));
								var pl = this.parseConstraintParams();
								{
									var _g13 = this.peek(0);
									switch(_g13.tok[1]) {
									case 18:
										this.last = this.token.elt;
										this.token = this.token.next;
										var al1 = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.parseFunParam));
										{
											var _g22 = this.peek(0);
											switch(_g22.tok[1]) {
											case 19:
												this.last = this.token.elt;
												this.token = this.token.next;
												var t2 = this.parseTypeOpt();
												var make = function(e4) {
													var f = { params : pl, ret : t2, args : al1, expr : e4};
													return { expr : haxe_macro_ExprDef.EFunction(name == null?null:inl.isInline?"inline_" + name.name:name.name,f), pos : haxeparser_HaxeParser.punion(inl.pos,e4.pos)};
												};
												return this.exprNext(make(this.secureExpr()));
											default:
												return (function($this) {
													var $r;
													throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
													return $r;
												}(this));
											}
										}
										break;
									default:
										return (function($this) {
											var $r;
											throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
											return $r;
										}(this));
									}
								}
							} catch( _2 ) {
								if (_2 instanceof js__$Boot_HaxeError) _2 = _2.val;
								if( js_Boot.__instanceof(_2,hxparse_NoMatch) ) {
									{
										var _g14 = this.peek(0);
										switch(_g14.tok[1]) {
										case 4:
											var p14 = _g14.pos;
											var op = _g14.tok[2];
											this.last = this.token.elt;
											this.token = this.token.next;
											var e5 = this.expr();
											return haxeparser_HaxeParser.makeUnop(op,e5,p14);
										case 5:
											switch(_g14.tok[2][1]) {
											case 3:
												var p15 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var e6 = this.expr();
												var neg = function(s) {
													if(HxOverrides.cca(s,0) == 45) return HxOverrides.substr(s,1,null); else return "-" + s;
												};
												{
													var _g23 = haxeparser_HaxeParser.makeUnop(haxe_macro_Unop.OpNeg,e6,p15);
													var e7 = _g23;
													switch(_g23.expr[1]) {
													case 9:
														switch(_g23.expr[2][1]) {
														case 3:
															switch(_g23.expr[3]) {
															case false:
																switch(_g23.expr[4].expr[1]) {
																case 0:
																	switch(_g23.expr[4].expr[2][1]) {
																	case 0:
																		var p8 = _g23.pos;
																		var i = _g23.expr[4].expr[2][2];
																		return { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CInt(neg(i))), pos : p8};
																	case 1:
																		var p9 = _g23.pos;
																		var j = _g23.expr[4].expr[2][2];
																		return { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CFloat(neg(j))), pos : p9};
																	default:
																		return e7;
																	}
																	break;
																default:
																	return e7;
																}
																break;
															default:
																return e7;
															}
															break;
														default:
															return e7;
														}
														break;
													default:
														return e7;
													}
												}
												break;
											default:
												throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
											}
											break;
										case 0:
											switch(_g14.tok[2][1]) {
											case 7:
												var p10 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												{
													var _g24 = this.peek(0);
													switch(_g24.tok[1]) {
													case 18:
														this.last = this.token.elt;
														this.token = this.token.next;
														var it = this.expr();
														{
															var _g31 = this.peek(0);
															switch(_g31.tok[1]) {
															case 19:
																this.last = this.token.elt;
																this.token = this.token.next;
																var e8 = this.secureExpr();
																return { expr : haxe_macro_ExprDef.EFor(it,e8), pos : haxeparser_HaxeParser.punion(p10,e8.pos)};
															default:
																return (function($this) {
																	var $r;
																	throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																	return $r;
																}(this));
															}
														}
														break;
													default:
														return (function($this) {
															var $r;
															throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
															return $r;
														}(this));
													}
												}
												break;
											case 3:
												var p16 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												{
													var _g25 = this.peek(0);
													switch(_g25.tok[1]) {
													case 18:
														this.last = this.token.elt;
														this.token = this.token.next;
														var cond = this.expr();
														{
															var _g32 = this.peek(0);
															switch(_g32.tok[1]) {
															case 19:
																this.last = this.token.elt;
																this.token = this.token.next;
																var e11 = this.expr();
																var e21;
																{
																	var _g4 = this.peek(0);
																	switch(_g4.tok[1]) {
																	case 0:
																		switch(_g4.tok[2][1]) {
																		case 4:
																			this.last = this.token.elt;
																			this.token = this.token.next;
																			var e22 = this.expr();
																			e21 = e22;
																			break;
																		default:
																			{
																				var _g5 = this.peek(0);
																				var _g6 = this.peek(1);
																				switch(_g5.tok[1]) {
																				case 9:
																					switch(_g6.tok[1]) {
																					case 0:
																						switch(_g6.tok[2][1]) {
																						case 4:
																							this.last = this.token.elt;
																							this.token = this.token.next;
																							this.last = this.token.elt;
																							this.token = this.token.next;
																							e21 = this.secureExpr();
																							break;
																						default:
																							e21 = null;
																						}
																						break;
																					default:
																						e21 = null;
																					}
																					break;
																				default:
																					e21 = null;
																				}
																			}
																		}
																		break;
																	default:
																		{
																			var _g51 = this.peek(0);
																			var _g61 = this.peek(1);
																			switch(_g51.tok[1]) {
																			case 9:
																				switch(_g61.tok[1]) {
																				case 0:
																					switch(_g61.tok[2][1]) {
																					case 4:
																						this.last = this.token.elt;
																						this.token = this.token.next;
																						this.last = this.token.elt;
																						this.token = this.token.next;
																						e21 = this.secureExpr();
																						break;
																					default:
																						e21 = null;
																					}
																					break;
																				default:
																					e21 = null;
																				}
																				break;
																			default:
																				e21 = null;
																			}
																		}
																	}
																}
																return { expr : haxe_macro_ExprDef.EIf(cond,e11,e21), pos : haxeparser_HaxeParser.punion(p16,e21 == null?e11.pos:e21.pos)};
															default:
																return (function($this) {
																	var $r;
																	throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																	return $r;
																}(this));
															}
														}
														break;
													default:
														return (function($this) {
															var $r;
															throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
															return $r;
														}(this));
													}
												}
												break;
											case 10:
												var p17 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var e9 = this.parseOptional($bind(this,this.expr));
												return { expr : haxe_macro_ExprDef.EReturn(e9), pos : e9 == null?p17:haxeparser_HaxeParser.punion(p17,e9.pos)};
											case 8:
												var p18 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												return { expr : haxe_macro_ExprDef.EBreak, pos : p18};
											case 9:
												var p19 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												return { expr : haxe_macro_ExprDef.EContinue, pos : p19};
											case 5:
												var p110 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												{
													var _g26 = this.peek(0);
													switch(_g26.tok[1]) {
													case 18:
														this.last = this.token.elt;
														this.token = this.token.next;
														var cond1 = this.expr();
														{
															var _g33 = this.peek(0);
															switch(_g33.tok[1]) {
															case 19:
																this.last = this.token.elt;
																this.token = this.token.next;
																var e10 = this.secureExpr();
																return { expr : haxe_macro_ExprDef.EWhile(cond1,e10,true), pos : haxeparser_HaxeParser.punion(p110,e10.pos)};
															default:
																return (function($this) {
																	var $r;
																	throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																	return $r;
																}(this));
															}
														}
														break;
													default:
														return (function($this) {
															var $r;
															throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
															return $r;
														}(this));
													}
												}
												break;
											case 6:
												var p111 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var e12 = this.expr();
												{
													var _g27 = this.peek(0);
													switch(_g27.tok[1]) {
													case 0:
														switch(_g27.tok[2][1]) {
														case 5:
															this.last = this.token.elt;
															this.token = this.token.next;
															{
																var _g34 = this.peek(0);
																switch(_g34.tok[1]) {
																case 18:
																	this.last = this.token.elt;
																	this.token = this.token.next;
																	var cond2 = this.expr();
																	{
																		var _g41 = this.peek(0);
																		switch(_g41.tok[1]) {
																		case 19:
																			this.last = this.token.elt;
																			this.token = this.token.next;
																			return { expr : haxe_macro_ExprDef.EWhile(cond2,e12,false), pos : haxeparser_HaxeParser.punion(p111,e12.pos)};
																		default:
																			return (function($this) {
																				var $r;
																				throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																				return $r;
																			}(this));
																		}
																	}
																	break;
																default:
																	return (function($this) {
																		var $r;
																		throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																		return $r;
																	}(this));
																}
															}
															break;
														default:
															return (function($this) {
																var $r;
																throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																return $r;
															}(this));
														}
														break;
													default:
														return (function($this) {
															var $r;
															throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
															return $r;
														}(this));
													}
												}
												break;
											case 14:
												var p112 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var e13 = this.expr();
												{
													var _g28 = this.peek(0);
													switch(_g28.tok[1]) {
													case 16:
														this.last = this.token.elt;
														this.token = this.token.next;
														var cases = this.parseSwitchCases();
														{
															var _g35 = this.peek(0);
															switch(_g35.tok[1]) {
															case 17:
																var p24 = _g35.pos;
																this.last = this.token.elt;
																this.token = this.token.next;
																return { expr : haxe_macro_ExprDef.ESwitch(e13,cases.cases,cases.def), pos : haxeparser_HaxeParser.punion(p112,p24)};
															default:
																return (function($this) {
																	var $r;
																	throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																	return $r;
																}(this));
															}
														}
														break;
													default:
														return (function($this) {
															var $r;
															throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
															return $r;
														}(this));
													}
												}
												break;
											case 20:
												var p113 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var e14 = this.expr();
												var cl = this.parseRepeat($bind(this,this.parseCatch));
												return { expr : haxe_macro_ExprDef.ETry(e14,cl), pos : p113};
											case 29:
												var p114 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var e15 = this.expr();
												return { expr : haxe_macro_ExprDef.EUntyped(e15), pos : haxeparser_HaxeParser.punion(p114,e15.pos)};
											default:
												throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
											}
											break;
										case 8:
											var p115 = _g14.pos;
											var i1 = _g14.tok[2];
											this.last = this.token.elt;
											this.token = this.token.next;
											var e23 = this.expr();
											return haxeparser_HaxeParser.makeBinop(haxe_macro_Binop.OpInterval,{ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CInt(i1)), pos : p115},e23);
										case 3:
											var p20 = _g14.pos;
											var v1 = _g14.tok[2];
											this.last = this.token.elt;
											this.token = this.token.next;
											return this.exprNext({ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent("$" + v1)), pos : p20});
										default:
											throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
										}
									}
								} else throw(_2);
							}
						}
						break;
					case 1:
						var p25 = _g.pos;
						var c = _g.tok[2];
						this.last = this.token.elt;
						this.token = this.token.next;
						return this.exprNext({ expr : haxe_macro_ExprDef.EConst(c), pos : p25});
					case 18:
						var p116 = _g.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						var e16 = this.expr();
						{
							var _g15 = this.peek(0);
							switch(_g15.tok[1]) {
							case 19:
								var p26 = _g15.pos;
								this.last = this.token.elt;
								this.token = this.token.next;
								return this.exprNext({ expr : haxe_macro_ExprDef.EParenthesis(e16), pos : haxeparser_HaxeParser.punion(p116,p26)});
							case 11:
								this.last = this.token.elt;
								this.token = this.token.next;
								var t3 = this.parseComplexType();
								{
									var _g29 = this.peek(0);
									switch(_g29.tok[1]) {
									case 19:
										var p27 = _g29.pos;
										this.last = this.token.elt;
										this.token = this.token.next;
										return this.exprNext({ expr : haxe_macro_ExprDef.ECheckType(e16,t3), pos : haxeparser_HaxeParser.punion(p116,p27)});
									default:
										return (function($this) {
											var $r;
											throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
											return $r;
										}(this));
									}
								}
								break;
							default:
								throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
							}
						}
						break;
					case 14:
						var p117 = _g.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						var l = this.parseArrayDecl();
						{
							var _g16 = this.peek(0);
							switch(_g16.tok[1]) {
							case 15:
								var p28 = _g16.pos;
								this.last = this.token.elt;
								this.token = this.token.next;
								return this.exprNext({ expr : haxe_macro_ExprDef.EArrayDecl(l), pos : haxeparser_HaxeParser.punion(p117,p28)});
							default:
								return (function($this) {
									var $r;
									throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
									return $r;
								}(this));
							}
						}
						break;
					default:
						try {
							var inl1 = this.inlineFunction();
							var name1 = this.parseOptional($bind(this,this.dollarIdent));
							var pl1 = this.parseConstraintParams();
							{
								var _g17 = this.peek(0);
								switch(_g17.tok[1]) {
								case 18:
									this.last = this.token.elt;
									this.token = this.token.next;
									var al2 = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.parseFunParam));
									{
										var _g210 = this.peek(0);
										switch(_g210.tok[1]) {
										case 19:
											this.last = this.token.elt;
											this.token = this.token.next;
											var t4 = this.parseTypeOpt();
											var make1 = function(e4) {
												var f1 = { params : pl1, ret : t4, args : al2, expr : e4};
												return { expr : haxe_macro_ExprDef.EFunction(name1 == null?null:inl1.isInline?"inline_" + name1.name:name1.name,f1), pos : haxeparser_HaxeParser.punion(inl1.pos,e4.pos)};
											};
											return this.exprNext(make1(this.secureExpr()));
										default:
											return (function($this) {
												var $r;
												throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
												return $r;
											}(this));
										}
									}
									break;
								default:
									return (function($this) {
										var $r;
										throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
										return $r;
									}(this));
								}
							}
						} catch( _3 ) {
							if (_3 instanceof js__$Boot_HaxeError) _3 = _3.val;
							if( js_Boot.__instanceof(_3,hxparse_NoMatch) ) {
								{
									var _g18 = this.peek(0);
									switch(_g18.tok[1]) {
									case 4:
										var p118 = _g18.pos;
										var op1 = _g18.tok[2];
										this.last = this.token.elt;
										this.token = this.token.next;
										var e17 = this.expr();
										return haxeparser_HaxeParser.makeUnop(op1,e17,p118);
									case 5:
										switch(_g18.tok[2][1]) {
										case 3:
											var p119 = _g18.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var e18 = this.expr();
											var neg1 = function(s) {
												if(HxOverrides.cca(s,0) == 45) return HxOverrides.substr(s,1,null); else return "-" + s;
											};
											{
												var _g211 = haxeparser_HaxeParser.makeUnop(haxe_macro_Unop.OpNeg,e18,p119);
												var e19 = _g211;
												switch(_g211.expr[1]) {
												case 9:
													switch(_g211.expr[2][1]) {
													case 3:
														switch(_g211.expr[3]) {
														case false:
															switch(_g211.expr[4].expr[1]) {
															case 0:
																switch(_g211.expr[4].expr[2][1]) {
																case 0:
																	var p29 = _g211.pos;
																	var i2 = _g211.expr[4].expr[2][2];
																	return { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CInt(neg1(i2))), pos : p29};
																case 1:
																	var p30 = _g211.pos;
																	var j1 = _g211.expr[4].expr[2][2];
																	return { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CFloat(neg1(j1))), pos : p30};
																default:
																	return e19;
																}
																break;
															default:
																return e19;
															}
															break;
														default:
															return e19;
														}
														break;
													default:
														return e19;
													}
													break;
												default:
													return e19;
												}
											}
											break;
										default:
											throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
										}
										break;
									case 0:
										switch(_g18.tok[2][1]) {
										case 7:
											var p31 = _g18.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											{
												var _g212 = this.peek(0);
												switch(_g212.tok[1]) {
												case 18:
													this.last = this.token.elt;
													this.token = this.token.next;
													var it1 = this.expr();
													{
														var _g36 = this.peek(0);
														switch(_g36.tok[1]) {
														case 19:
															this.last = this.token.elt;
															this.token = this.token.next;
															var e20 = this.secureExpr();
															return { expr : haxe_macro_ExprDef.EFor(it1,e20), pos : haxeparser_HaxeParser.punion(p31,e20.pos)};
														default:
															return (function($this) {
																var $r;
																throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																return $r;
															}(this));
														}
													}
													break;
												default:
													return (function($this) {
														var $r;
														throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
														return $r;
													}(this));
												}
											}
											break;
										case 3:
											var p32 = _g18.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											{
												var _g213 = this.peek(0);
												switch(_g213.tok[1]) {
												case 18:
													this.last = this.token.elt;
													this.token = this.token.next;
													var cond3 = this.expr();
													{
														var _g37 = this.peek(0);
														switch(_g37.tok[1]) {
														case 19:
															this.last = this.token.elt;
															this.token = this.token.next;
															var e110 = this.expr();
															var e24;
															{
																var _g42 = this.peek(0);
																switch(_g42.tok[1]) {
																case 0:
																	switch(_g42.tok[2][1]) {
																	case 4:
																		this.last = this.token.elt;
																		this.token = this.token.next;
																		var e25 = this.expr();
																		e24 = e25;
																		break;
																	default:
																		{
																			var _g52 = this.peek(0);
																			var _g62 = this.peek(1);
																			switch(_g52.tok[1]) {
																			case 9:
																				switch(_g62.tok[1]) {
																				case 0:
																					switch(_g62.tok[2][1]) {
																					case 4:
																						this.last = this.token.elt;
																						this.token = this.token.next;
																						this.last = this.token.elt;
																						this.token = this.token.next;
																						e24 = this.secureExpr();
																						break;
																					default:
																						e24 = null;
																					}
																					break;
																				default:
																					e24 = null;
																				}
																				break;
																			default:
																				e24 = null;
																			}
																		}
																	}
																	break;
																default:
																	{
																		var _g53 = this.peek(0);
																		var _g63 = this.peek(1);
																		switch(_g53.tok[1]) {
																		case 9:
																			switch(_g63.tok[1]) {
																			case 0:
																				switch(_g63.tok[2][1]) {
																				case 4:
																					this.last = this.token.elt;
																					this.token = this.token.next;
																					this.last = this.token.elt;
																					this.token = this.token.next;
																					e24 = this.secureExpr();
																					break;
																				default:
																					e24 = null;
																				}
																				break;
																			default:
																				e24 = null;
																			}
																			break;
																		default:
																			e24 = null;
																		}
																	}
																}
															}
															return { expr : haxe_macro_ExprDef.EIf(cond3,e110,e24), pos : haxeparser_HaxeParser.punion(p32,e24 == null?e110.pos:e24.pos)};
														default:
															return (function($this) {
																var $r;
																throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																return $r;
															}(this));
														}
													}
													break;
												default:
													return (function($this) {
														var $r;
														throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
														return $r;
													}(this));
												}
											}
											break;
										case 10:
											var p33 = _g18.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var e26 = this.parseOptional($bind(this,this.expr));
											return { expr : haxe_macro_ExprDef.EReturn(e26), pos : e26 == null?p33:haxeparser_HaxeParser.punion(p33,e26.pos)};
										case 8:
											var p34 = _g18.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											return { expr : haxe_macro_ExprDef.EBreak, pos : p34};
										case 9:
											var p35 = _g18.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											return { expr : haxe_macro_ExprDef.EContinue, pos : p35};
										case 5:
											var p120 = _g18.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											{
												var _g214 = this.peek(0);
												switch(_g214.tok[1]) {
												case 18:
													this.last = this.token.elt;
													this.token = this.token.next;
													var cond4 = this.expr();
													{
														var _g38 = this.peek(0);
														switch(_g38.tok[1]) {
														case 19:
															this.last = this.token.elt;
															this.token = this.token.next;
															var e27 = this.secureExpr();
															return { expr : haxe_macro_ExprDef.EWhile(cond4,e27,true), pos : haxeparser_HaxeParser.punion(p120,e27.pos)};
														default:
															return (function($this) {
																var $r;
																throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																return $r;
															}(this));
														}
													}
													break;
												default:
													return (function($this) {
														var $r;
														throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
														return $r;
													}(this));
												}
											}
											break;
										case 6:
											var p121 = _g18.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var e28 = this.expr();
											{
												var _g215 = this.peek(0);
												switch(_g215.tok[1]) {
												case 0:
													switch(_g215.tok[2][1]) {
													case 5:
														this.last = this.token.elt;
														this.token = this.token.next;
														{
															var _g39 = this.peek(0);
															switch(_g39.tok[1]) {
															case 18:
																this.last = this.token.elt;
																this.token = this.token.next;
																var cond5 = this.expr();
																{
																	var _g43 = this.peek(0);
																	switch(_g43.tok[1]) {
																	case 19:
																		this.last = this.token.elt;
																		this.token = this.token.next;
																		return { expr : haxe_macro_ExprDef.EWhile(cond5,e28,false), pos : haxeparser_HaxeParser.punion(p121,e28.pos)};
																	default:
																		return (function($this) {
																			var $r;
																			throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																			return $r;
																		}(this));
																	}
																}
																break;
															default:
																return (function($this) {
																	var $r;
																	throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																	return $r;
																}(this));
															}
														}
														break;
													default:
														return (function($this) {
															var $r;
															throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
															return $r;
														}(this));
													}
													break;
												default:
													return (function($this) {
														var $r;
														throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
														return $r;
													}(this));
												}
											}
											break;
										case 14:
											var p122 = _g18.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var e29 = this.expr();
											{
												var _g216 = this.peek(0);
												switch(_g216.tok[1]) {
												case 16:
													this.last = this.token.elt;
													this.token = this.token.next;
													var cases1 = this.parseSwitchCases();
													{
														var _g310 = this.peek(0);
														switch(_g310.tok[1]) {
														case 17:
															var p210 = _g310.pos;
															this.last = this.token.elt;
															this.token = this.token.next;
															return { expr : haxe_macro_ExprDef.ESwitch(e29,cases1.cases,cases1.def), pos : haxeparser_HaxeParser.punion(p122,p210)};
														default:
															return (function($this) {
																var $r;
																throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
																return $r;
															}(this));
														}
													}
													break;
												default:
													return (function($this) {
														var $r;
														throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
														return $r;
													}(this));
												}
											}
											break;
										case 20:
											var p123 = _g18.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var e30 = this.expr();
											var cl1 = this.parseRepeat($bind(this,this.parseCatch));
											return { expr : haxe_macro_ExprDef.ETry(e30,cl1), pos : p123};
										case 29:
											var p124 = _g18.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var e31 = this.expr();
											return { expr : haxe_macro_ExprDef.EUntyped(e31), pos : haxeparser_HaxeParser.punion(p124,e31.pos)};
										default:
											throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
										}
										break;
									case 8:
										var p125 = _g18.pos;
										var i3 = _g18.tok[2];
										this.last = this.token.elt;
										this.token = this.token.next;
										var e210 = this.expr();
										return haxeparser_HaxeParser.makeBinop(haxe_macro_Binop.OpInterval,{ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CInt(i3)), pos : p125},e210);
									case 3:
										var p36 = _g18.pos;
										var v2 = _g18.tok[2];
										this.last = this.token.elt;
										this.token = this.token.next;
										return this.exprNext({ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent("$" + v2)), pos : p36});
									default:
										throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
									}
								}
							} else throw(_3);
						}
					}
				}
			} else throw(_);
		}
	}
	,toplevelExpr: function() {
		return this.expr();
	}
	,exprNext: function(e1) {
		var _g2 = this;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 10:
				var p = _g.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 3:
						var p2 = _g1.pos;
						var v = _g1.tok[2];
						this.last = this.token.elt;
						this.token = this.token.next;
						return this.exprNext({ expr : haxe_macro_ExprDef.EField(e1,"$" + v), pos : haxeparser_HaxeParser.punion(e1.pos,p2)});
					default:
						var def1 = function() {
							var def = function() {
								switch(e1.expr[1]) {
								case 0:
									switch(e1.expr[2][1]) {
									case 0:
										var p21 = e1.pos;
										var v1 = e1.expr[2][2];
										if(p21.max == p.min) return _g2.exprNext({ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CFloat(v1 + ".")), pos : haxeparser_HaxeParser.punion(p,p21)}); else return (function($this) {
											var $r;
											throw new js__$Boot_HaxeError(new hxparse_Unexpected(_g2.peek(0),_g2.stream.curPos()));
											return $r;
										}(this));
										break;
									default:
										return (function($this) {
											var $r;
											throw new js__$Boot_HaxeError(new hxparse_Unexpected(_g2.peek(0),_g2.stream.curPos()));
											return $r;
										}(this));
									}
									break;
								default:
									return (function($this) {
										var $r;
										throw new js__$Boot_HaxeError(new hxparse_Unexpected(_g2.peek(0),_g2.stream.curPos()));
										return $r;
									}(this));
								}
							};
							{
								var _g3 = _g2.peek(0);
								switch(_g3.tok[1]) {
								case 0:
									switch(_g3.tok[2][1]) {
									case 41:
										var p22 = _g3.pos;
										if(p.max == p22.min) {
											_g2.last = _g2.token.elt;
											_g2.token = _g2.token.next;
											return _g2.exprNext({ expr : haxe_macro_ExprDef.EField(e1,"macro"), pos : haxeparser_HaxeParser.punion(e1.pos,p22)});
										} else return def();
										break;
									default:
										return def();
									}
									break;
								default:
									return def();
								}
							}
						};
						{
							var _g21 = this.peek(0);
							switch(_g21.tok[1]) {
							case 1:
								switch(_g21.tok[2][1]) {
								case 3:
									var p23 = _g21.pos;
									var f = _g21.tok[2][2];
									if(p.max == p23.min) {
										this.last = this.token.elt;
										this.token = this.token.next;
										return this.exprNext({ expr : haxe_macro_ExprDef.EField(e1,f), pos : haxeparser_HaxeParser.punion(e1.pos,p23)});
									} else return def1();
									break;
								default:
									return def1();
								}
								break;
							default:
								return def1();
							}
						}
					}
				}
				break;
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				try {
					var params = this.parseCallParams();
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 19:
							var p24 = _g11.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.exprNext({ expr : haxe_macro_ExprDef.ECall(e1,params), pos : haxeparser_HaxeParser.punion(e1.pos,p24)});
						default:
							return (function($this) {
								var $r;
								throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
								return $r;
							}(this));
						}
					}
				} catch( _ ) {
					if (_ instanceof js__$Boot_HaxeError) _ = _.val;
					if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
						return (function($this) {
							var $r;
							throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
							return $r;
						}(this));
					} else throw(_);
				}
				break;
			case 14:
				this.last = this.token.elt;
				this.token = this.token.next;
				var e2 = this.expr();
				{
					var _g12 = this.peek(0);
					switch(_g12.tok[1]) {
					case 15:
						var p25 = _g12.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						return this.exprNext({ expr : haxe_macro_ExprDef.EArray(e1,e2), pos : haxeparser_HaxeParser.punion(e1.pos,p25)});
					default:
						return (function($this) {
							var $r;
							throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
							return $r;
						}(this));
					}
				}
				break;
			case 5:
				var op = _g.tok[2];
				switch(_g.tok[2][1]) {
				case 7:
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g13 = this.peek(0);
						switch(_g13.tok[1]) {
						case 5:
							switch(_g13.tok[2][1]) {
							case 7:
								this.last = this.token.elt;
								this.token = this.token.next;
								{
									var _g22 = this.peek(0);
									switch(_g22.tok[1]) {
									case 5:
										switch(_g22.tok[2][1]) {
										case 7:
											this.last = this.token.elt;
											this.token = this.token.next;
											{
												var _g31 = this.peek(0);
												switch(_g31.tok[1]) {
												case 5:
													switch(_g31.tok[2][1]) {
													case 4:
														this.last = this.token.elt;
														this.token = this.token.next;
														var e21 = this.expr();
														return haxeparser_HaxeParser.makeBinop(haxe_macro_Binop.OpAssignOp(haxe_macro_Binop.OpUShr),e1,e21);
													default:
														var e22 = this.secureExpr();
														return haxeparser_HaxeParser.makeBinop(haxe_macro_Binop.OpUShr,e1,e22);
													}
													break;
												default:
													var e23 = this.secureExpr();
													return haxeparser_HaxeParser.makeBinop(haxe_macro_Binop.OpUShr,e1,e23);
												}
											}
											break;
										case 4:
											this.last = this.token.elt;
											this.token = this.token.next;
											var e24 = this.expr();
											return haxeparser_HaxeParser.makeBinop(haxe_macro_Binop.OpAssignOp(haxe_macro_Binop.OpShr),e1,e24);
										default:
											var e25 = this.secureExpr();
											return haxeparser_HaxeParser.makeBinop(haxe_macro_Binop.OpShr,e1,e25);
										}
										break;
									default:
										var e26 = this.secureExpr();
										return haxeparser_HaxeParser.makeBinop(haxe_macro_Binop.OpShr,e1,e26);
									}
								}
								break;
							case 4:
								this.last = this.token.elt;
								this.token = this.token.next;
								return haxeparser_HaxeParser.makeBinop(haxe_macro_Binop.OpGte,e1,this.secureExpr());
							default:
								var e27 = this.secureExpr();
								return haxeparser_HaxeParser.makeBinop(haxe_macro_Binop.OpGt,e1,e27);
							}
							break;
						default:
							var e28 = this.secureExpr();
							return haxeparser_HaxeParser.makeBinop(haxe_macro_Binop.OpGt,e1,e28);
						}
					}
					break;
				default:
					this.last = this.token.elt;
					this.token = this.token.next;
					var e29 = this.expr();
					return haxeparser_HaxeParser.makeBinop(op,e1,e29);
				}
				break;
			case 20:
				this.last = this.token.elt;
				this.token = this.token.next;
				var e210 = this.expr();
				{
					var _g14 = this.peek(0);
					switch(_g14.tok[1]) {
					case 11:
						this.last = this.token.elt;
						this.token = this.token.next;
						var e3 = this.expr();
						return { expr : haxe_macro_ExprDef.ETernary(e1,e210,e3), pos : haxeparser_HaxeParser.punion(e1.pos,e3.pos)};
					default:
						return (function($this) {
							var $r;
							throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
							return $r;
						}(this));
					}
				}
				break;
			case 0:
				switch(_g.tok[2][1]) {
				case 27:
					this.last = this.token.elt;
					this.token = this.token.next;
					var e211 = this.expr();
					return { expr : haxe_macro_ExprDef.EIn(e1,e211), pos : haxeparser_HaxeParser.punion(e1.pos,e211.pos)};
				default:
					var def3 = function() {
						var def2 = function() {
							return e1;
						};
						{
							var _g15 = _g2.peek(0);
							switch(_g15.tok[1]) {
							case 16:
								var p1 = _g15.pos;
								if(haxeparser_HaxeParser.isDollarIdent(e1)) {
									_g2.last = _g2.token.elt;
									_g2.token = _g2.token.next;
									var eparam = _g2.expr();
									{
										var _g32 = _g2.peek(0);
										switch(_g32.tok[1]) {
										case 17:
											var p26 = _g32.pos;
											_g2.last = _g2.token.elt;
											_g2.token = _g2.token.next;
											{
												var _g4 = e1.expr;
												switch(_g4[1]) {
												case 0:
													switch(_g4[2][1]) {
													case 3:
														var n = _g4[2][2];
														return _g2.exprNext({ expr : haxe_macro_ExprDef.EMeta({ name : n, params : [], pos : e1.pos},eparam), pos : haxeparser_HaxeParser.punion(p1,p26)});
													default:
														throw new js__$Boot_HaxeError(false);
													}
													break;
												default:
													throw new js__$Boot_HaxeError(false);
												}
											}
											break;
										default:
											return (function($this) {
												var $r;
												throw new js__$Boot_HaxeError(new hxparse_Unexpected(_g2.peek(0),_g2.stream.curPos()));
												return $r;
											}(this));
										}
									}
								} else return def2();
								break;
							default:
								return def2();
							}
						}
					};
					{
						var _g16 = this.peek(0);
						switch(_g16.tok[1]) {
						case 4:
							var p3 = _g16.pos;
							var op1 = _g16.tok[2];
							if(haxeparser_HaxeParser.isPostfix(e1,op1)) {
								this.last = this.token.elt;
								this.token = this.token.next;
								return this.exprNext({ expr : haxe_macro_ExprDef.EUnop(op1,true,e1), pos : haxeparser_HaxeParser.punion(e1.pos,p3)});
							} else return def3();
							break;
						default:
							return def3();
						}
					}
				}
				break;
			default:
				var def5 = function() {
					var def4 = function() {
						return e1;
					};
					{
						var _g17 = _g2.peek(0);
						switch(_g17.tok[1]) {
						case 16:
							var p11 = _g17.pos;
							if(haxeparser_HaxeParser.isDollarIdent(e1)) {
								_g2.last = _g2.token.elt;
								_g2.token = _g2.token.next;
								var eparam1 = _g2.expr();
								{
									var _g33 = _g2.peek(0);
									switch(_g33.tok[1]) {
									case 17:
										var p27 = _g33.pos;
										_g2.last = _g2.token.elt;
										_g2.token = _g2.token.next;
										{
											var _g41 = e1.expr;
											switch(_g41[1]) {
											case 0:
												switch(_g41[2][1]) {
												case 3:
													var n1 = _g41[2][2];
													return _g2.exprNext({ expr : haxe_macro_ExprDef.EMeta({ name : n1, params : [], pos : e1.pos},eparam1), pos : haxeparser_HaxeParser.punion(p11,p27)});
												default:
													throw new js__$Boot_HaxeError(false);
												}
												break;
											default:
												throw new js__$Boot_HaxeError(false);
											}
										}
										break;
									default:
										return (function($this) {
											var $r;
											throw new js__$Boot_HaxeError(new hxparse_Unexpected(_g2.peek(0),_g2.stream.curPos()));
											return $r;
										}(this));
									}
								}
							} else return def4();
							break;
						default:
							return def4();
						}
					}
				};
				{
					var _g18 = this.peek(0);
					switch(_g18.tok[1]) {
					case 4:
						var p4 = _g18.pos;
						var op2 = _g18.tok[2];
						if(haxeparser_HaxeParser.isPostfix(e1,op2)) {
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.exprNext({ expr : haxe_macro_ExprDef.EUnop(op2,true,e1), pos : haxeparser_HaxeParser.punion(e1.pos,p4)});
						} else return def5();
						break;
					default:
						return def5();
					}
				}
			}
		}
	}
	,parseGuard: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 3:
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 18:
							this.last = this.token.elt;
							this.token = this.token.next;
							var e = this.expr();
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 19:
									this.last = this.token.elt;
									this.token = this.token.next;
									return e;
								default:
									return (function($this) {
										var $r;
										throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
										return $r;
									}(this));
								}
							}
							break;
						default:
							return (function($this) {
								var $r;
								throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
								return $r;
							}(this));
						}
					}
					break;
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,parseSwitchCases: function() {
		var cases = [];
		var def = null;
		var caseBlock = function(b,p) {
			if(b.length == 0) return null; else switch(b.length) {
			case 1:
				var e = b[0];
				switch(b[0].expr[1]) {
				case 12:
					var el = b[0].expr[2];
					return e;
				default:
					return { expr : haxe_macro_ExprDef.EBlock(b), pos : p};
				}
				break;
			default:
				return { expr : haxe_macro_ExprDef.EBlock(b), pos : p};
			}
		};
		try {
			while(true) {
				var _g = this.peek(0);
				switch(_g.tok[1]) {
				case 0:
					switch(_g.tok[2][1]) {
					case 16:
						var p1 = _g.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						{
							var _g1 = this.peek(0);
							switch(_g1.tok[1]) {
							case 11:
								this.last = this.token.elt;
								this.token = this.token.next;
								var b1 = this.block([]);
								var e1 = caseBlock(b1,p1);
								if(e1 == null) e1 = { expr : null, pos : p1};
								if(def != null) throw new js__$Boot_HaxeError(new haxeparser_ParserError(haxeparser_ParserErrorMsg.DuplicateDefault,p1));
								def = e1;
								break;
							default:
								throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
							}
						}
						break;
					case 15:
						var p11 = _g.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						var el1 = this.psep(haxeparser_TokenDef.Comma,$bind(this,this.expr));
						var eg = this.parseOptional($bind(this,this.parseGuard));
						{
							var _g11 = this.peek(0);
							switch(_g11.tok[1]) {
							case 11:
								this.last = this.token.elt;
								this.token = this.token.next;
								var b2 = this.block([]);
								var e2 = caseBlock(b2,p11);
								cases.push({ values : el1, guard : eg, expr : e2});
								break;
							default:
								throw new js__$Boot_HaxeError(new hxparse_Unexpected(this.peek(0),this.stream.curPos()));
							}
						}
						break;
					default:
						throw "__break__";
					}
					break;
				default:
					throw "__break__";
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return { cases : cases, def : def};
	}
	,parseCatch: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 21:
					var p = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 18:
							this.last = this.token.elt;
							this.token = this.token.next;
							var id = this.ident();
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 11:
									this.last = this.token.elt;
									this.token = this.token.next;
									var t = this.parseComplexType();
									{
										var _g3 = this.peek(0);
										switch(_g3.tok[1]) {
										case 19:
											this.last = this.token.elt;
											this.token = this.token.next;
											return { name : id.name, type : t, expr : this.secureExpr()};
										default:
											return (function($this) {
												var $r;
												throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
												return $r;
											}(this));
										}
									}
									break;
								default:
									throw new js__$Boot_HaxeError(new haxeparser_ParserError(haxeparser_ParserErrorMsg.MissingType,p));
								}
							}
							break;
						default:
							return (function($this) {
								var $r;
								throw new js__$Boot_HaxeError(new hxparse_Unexpected($this.peek(0),$this.stream.curPos()));
								return $r;
							}(this));
						}
					}
					break;
				default:
					throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
				}
				break;
			default:
				throw new js__$Boot_HaxeError(new hxparse_NoMatch(this.stream.curPos(),this.peek(0)));
			}
		}
	}
	,parseCallParams: function() {
		var ret = [];
		try {
			var e = this.expr();
			ret.push(e);
		} catch( _ ) {
			if (_ instanceof js__$Boot_HaxeError) _ = _.val;
			if( js_Boot.__instanceof(_,hxparse_NoMatch) ) {
				return [];
			} else throw(_);
		}
		try {
			while(true) {
				var _g = this.peek(0);
				switch(_g.tok[1]) {
				case 13:
					this.last = this.token.elt;
					this.token = this.token.next;
					var e1 = this.expr();
					ret.push(e1);
					break;
				default:
					throw "__break__";
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return ret;
	}
	,secureExpr: function() {
		return this.expr();
	}
	,__class__: haxeparser_HaxeParser
});
var haxeparser__$HaxeParser_Reificator = function(inMacro) {
	this.curPos = null;
	this.inMacro = inMacro;
};
$hxClasses["haxeparser._HaxeParser.Reificator"] = haxeparser__$HaxeParser_Reificator;
haxeparser__$HaxeParser_Reificator.__name__ = ["haxeparser","_HaxeParser","Reificator"];
haxeparser__$HaxeParser_Reificator.prototype = {
	curPos: null
	,inMacro: null
	,mkEnum: function(ename,name,vl,p) {
		var constr = { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent(name)), pos : p};
		switch(vl.length) {
		case 0:
			return constr;
		default:
			return { expr : haxe_macro_ExprDef.ECall(constr,vl), pos : p};
		}
	}
	,toConst: function(c,p) {
		var _g = this;
		var cst = function(n,v) {
			return _g.mkEnum("Constant",n,[{ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CString(v)), pos : p}],p);
		};
		switch(c[1]) {
		case 0:
			var i = c[2];
			return cst("CInt",i);
		case 2:
			var s = c[2];
			return cst("CString",s);
		case 1:
			var s1 = c[2];
			return cst("CFloat",s1);
		case 3:
			var s2 = c[2];
			return cst("CIdent",s2);
		case 4:
			var o = c[3];
			var r = c[2];
			return this.mkEnum("Constant","CRegexp",[{ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CString(r)), pos : p},{ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CString(o)), pos : p}],p);
		}
	}
	,toBinop: function(o,p) {
		var _g = this;
		var op = function(n) {
			return _g.mkEnum("Binop",n,[],p);
		};
		switch(o[1]) {
		case 0:
			return op("OpAdd");
		case 1:
			return op("OpMult");
		case 2:
			return op("OpDiv");
		case 3:
			return op("OpSub");
		case 4:
			return op("OpAssign");
		case 5:
			return op("OpEq");
		case 6:
			return op("OpNotEq");
		case 7:
			return op("OpGt");
		case 8:
			return op("OpGte");
		case 9:
			return op("OpLt");
		case 10:
			return op("OpLte");
		case 11:
			return op("OpAnd");
		case 12:
			return op("OpOr");
		case 13:
			return op("OpXor");
		case 14:
			return op("OpBoolAnd");
		case 15:
			return op("OpBoolOr");
		case 16:
			return op("OpShl");
		case 17:
			return op("OpShr");
		case 18:
			return op("OpUShr");
		case 19:
			return op("OpMod");
		case 20:
			var o1 = o[2];
			return this.mkEnum("Binop","OpAssignOp",[this.toBinop(o1,p)],p);
		case 21:
			return op("OpInterval");
		case 22:
			return op("OpArrow");
		}
	}
	,toString: function(s,p) {
		var len = s.length;
		if(len > 1 && s.charAt(0) == "$") return { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent(HxOverrides.substr(s,1,null))), pos : p}; else return { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CString(s)), pos : p};
	}
	,toArray: function(f,a,p) {
		var vals = [];
		var _g = 0;
		while(_g < a.length) {
			var v = a[_g];
			++_g;
			vals.push(f(v,p));
		}
		var e = { pos : p, expr : haxe_macro_ExprDef.EArrayDecl(vals)};
		return e;
	}
	,toNull: function(p) {
		return { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent("null")), pos : p};
	}
	,toOpt: function(f,v,p) {
		if(v == null) return this.toNull(p); else return f(v,p);
	}
	,toBool: function(o,p) {
		var s;
		if(o) s = "true"; else s = "false";
		return { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent(s)), pos : p};
	}
	,toObj: function(fields,p) {
		return { expr : haxe_macro_ExprDef.EObjectDecl(fields), pos : p};
	}
	,toTParam: function(t,p) {
		var n;
		var v;
		switch(t[1]) {
		case 0:
			var t1 = t[2];
			n = "TPType";
			v = this.toCType(t1,p);
			break;
		case 1:
			var e = t[2];
			n = "TPExpr";
			v = this.toExpr(e,p);
			break;
		}
		return this.mkEnum("TypeParam",n,[v],p);
	}
	,toTPath: function(t,p) {
		var fields = [{ field : "pack", expr : this.toArray($bind(this,this.toString),t.pack,p)},{ field : "name", expr : this.toString(t.name,p)},{ field : "params", expr : this.toArray($bind(this,this.toTParam),t.params,p)}];
		if(t.sub != null) fields.push({ field : "sub", expr : this.toString(t.sub,p)});
		return this.toObj(fields,p);
	}
	,toCType: function(t,p) {
		var _g = this;
		var ct = function(n,vl) {
			return _g.mkEnum("ComplexType",n,vl,p);
		};
		switch(t[1]) {
		case 0:
			var t1 = t[2];
			if(t[2].sub == null) {
				if(t[2].params != null) switch(t[2].params.length) {
				case 0:
					switch(t[2].pack.length) {
					case 0:
						var n1 = t[2].name;
						if(n1.charAt(0) == "$") return this.toString(n1,p); else return ct("TPath",[this.toTPath(t1,p)]);
						break;
					default:
						return ct("TPath",[this.toTPath(t1,p)]);
					}
					break;
				default:
					return ct("TPath",[this.toTPath(t1,p)]);
				} else return ct("TPath",[this.toTPath(t1,p)]);
			} else switch(t[2].sub) {
			default:
				return ct("TPath",[this.toTPath(t1,p)]);
			}
			break;
		case 1:
			var ret = t[3];
			var args = t[2];
			return ct("TFunction",[this.toArray($bind(this,this.toCType),args,p),this.toCType(ret,p)]);
		case 2:
			var fields = t[2];
			return ct("TAnonymous",[this.toArray($bind(this,this.toCField),fields,p)]);
		case 3:
			var t2 = t[2];
			return ct("TParent",[this.toCType(t2,p)]);
		case 4:
			var fields1 = t[3];
			var tl = t[2];
			return ct("TExtend",[this.toArray($bind(this,this.toTPath),tl,p),this.toArray($bind(this,this.toCField),fields1,p)]);
		case 5:
			var t3 = t[2];
			return ct("TOptional",[this.toCType(t3,p)]);
		}
	}
	,toFun: function(f,p) {
		var _g = this;
		var farg = function(vv,p1) {
			var n = vv.name;
			var o = vv.opt;
			var t = vv.type;
			var e = vv.value;
			var fields = [{ field : "name", expr : _g.toString(n,p1)},{ field : "opt", expr : _g.toBool(o,p1)},{ field : "type", expr : _g.toOpt($bind(_g,_g.toCType),t,p1)}];
			if(e != null) fields.push({ field : "value", expr : _g.toExpr(e,p1)});
			return _g.toObj(fields,p1);
		};
		var fparam;
		var fparam1 = null;
		fparam1 = function(t1,p2) {
			var fields2 = [{ field : "name", expr : _g.toString(t1.name,p2)},{ field : "constraints", expr : _g.toArray($bind(_g,_g.toCType),t1.constraints,p2)},{ field : "params", expr : _g.toArray(fparam1,t1.params,p2)}];
			return _g.toObj(fields2,p2);
		};
		fparam = fparam1;
		var fields1 = [{ field : "args", expr : this.toArray(farg,f.args,p)},{ field : "ret", expr : this.toOpt($bind(this,this.toCType),f.ret,p)},{ field : "expr", expr : this.toOpt($bind(this,this.toExpr),f.expr,p)},{ field : "params", expr : this.toArray(fparam,f.params,p)}];
		return this.toObj(fields1,p);
	}
	,toAccess: function(a,p) {
		var n;
		var n1;
		switch(a[1]) {
		case 0:
			n1 = "APublic";
			break;
		case 1:
			n1 = "APrivate";
			break;
		case 2:
			n1 = "AStatic";
			break;
		case 3:
			n1 = "AOverride";
			break;
		case 4:
			n1 = "ADynamic";
			break;
		case 5:
			n1 = "AInline";
			break;
		case 6:
			n1 = "AMacro";
			break;
		}
		return this.mkEnum("Access",n1,[],p);
	}
	,toCField: function(f,p) {
		var _g = this;
		var p2 = f.pos;
		var toFType = function(k) {
			var n;
			var vl;
			switch(k[1]) {
			case 0:
				var e = k[3];
				var ct = k[2];
				n = "FVar";
				vl = [_g.toOpt($bind(_g,_g.toCType),ct,p),_g.toOpt($bind(_g,_g.toExpr),e,p)];
				break;
			case 1:
				var f1 = k[2];
				n = "FFun";
				vl = [_g.toFun(f1,p)];
				break;
			case 2:
				var e1 = k[5];
				var t = k[4];
				var set = k[3];
				var get = k[2];
				n = "FProp";
				vl = [_g.toString(get,p),_g.toString(set,p),_g.toOpt($bind(_g,_g.toCType),t,p),_g.toOpt($bind(_g,_g.toExpr),e1,p)];
				break;
			}
			return _g.mkEnum("FieldType",n,vl,p);
		};
		var fields = [];
		fields.push({ field : "name", expr : this.toString(f.name,p)});
		if(f.doc != null) fields.push({ field : "doc", expr : this.toString(f.doc,p)});
		if(f.access != null) fields.push({ field : "access", expr : this.toArray($bind(this,this.toAccess),f.access,p)});
		fields.push({ field : "kind", expr : toFType(f.kind)});
		fields.push({ field : "pos", expr : this.toPos(f.pos)});
		if(f.meta != null) fields.push({ field : "meta", expr : this.toMeta(f.meta,p)});
		return this.toObj(fields,p);
	}
	,toMeta: function(m,p) {
		var _g = this;
		return this.toArray(function(me,_) {
			var fields = [{ field : "name", expr : _g.toString(me.name,me.pos)},{ field : "params", expr : _g.toExprArray(me.params,me.pos)},{ field : "pos", expr : _g.toPos(me.pos)}];
			return _g.toObj(fields,me.pos);
		},m,p);
	}
	,toPos: function(p) {
		if(this.curPos != null) return this.curPos;
		var file = { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CString(p.file)), pos : p};
		var pmin = { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CInt(p.min == null?"null":"" + p.min)), pos : p};
		var pmax = { expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CInt(p.max == null?"null":"" + p.max)), pos : p};
		if(this.inMacro) return { expr : haxe_macro_ExprDef.EUntyped({ expr : haxe_macro_ExprDef.ECall({ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent("$mk_pos")), pos : p},[file,pmin,pmax]), pos : p}), pos : p}; else return this.toObj([{ field : "file", expr : file},{ field : "min", expr : pmin},{ field : "max", expr : pmax}],p);
	}
	,toExprArray: function(a,p) {
		if(a.length > 0) {
			var _g = a[0].expr;
			switch(_g[1]) {
			case 29:
				var e1 = _g[3];
				var md = _g[2];
				if(md.name == "$a" && md.params.length == 0) {
					var _g1 = e1.expr;
					switch(_g1[1]) {
					case 6:
						var el = _g1[2];
						return this.toExprArray(el,p);
					default:
						return e1;
					}
				}
				break;
			default:
			}
		}
		return this.toArray($bind(this,this.toExpr),a,p);
	}
	,toExpr: function(e,_) {
		var _g = this;
		var p = e.pos;
		var expr = function(n,vl) {
			var e1 = _g.mkEnum("ExprDef",n,vl,p);
			return _g.toObj([{ field : "expr", expr : e1},{ field : "pos", expr : _g.toPos(p)}],p);
		};
		var loop = function(e2) {
			return _g.toExpr(e2,e2.pos);
		};
		{
			var _g1 = e.expr;
			switch(_g1[1]) {
			case 0:
				var c = _g1[2];
				switch(_g1[2][1]) {
				case 3:
					var n1 = _g1[2][2];
					if(n1.charAt(0) == "$" && n1.length > 1) return this.toString(n1,p); else return expr("EConst",[this.toConst(c,p)]);
					break;
				default:
					return expr("EConst",[this.toConst(c,p)]);
				}
				break;
			case 1:
				var e21 = _g1[3];
				var e11 = _g1[2];
				return expr("EArray",[loop(e11),loop(e21)]);
			case 2:
				var e22 = _g1[4];
				var e12 = _g1[3];
				var op = _g1[2];
				return expr("EBinop",[this.toBinop(op,p),loop(e12),loop(e22)]);
			case 3:
				var s = _g1[3];
				var e3 = _g1[2];
				return expr("EField",[loop(e3),this.toString(s,p)]);
			case 4:
				var e4 = _g1[2];
				return expr("EParenthesis",[loop(e4)]);
			case 5:
				var fl = _g1[2];
				return expr("EObjectDecl",[this.toArray(function(f,p2) {
					return _g.toObj([{ field : "field", expr : _g.toString(f.field,p)},{ field : "expr", expr : loop(f.expr)}],p2);
				},fl,p)]);
			case 6:
				var el = _g1[2];
				return expr("EArrayDecl",[this.toExprArray(el,p)]);
			case 7:
				var el1 = _g1[3];
				var e5 = _g1[2];
				return expr("ECall",[loop(e5),this.toExprArray(el1,p)]);
			case 8:
				var el2 = _g1[3];
				var t = _g1[2];
				return expr("ENew",[this.toTPath(t,p),this.toExprArray(el2,p)]);
			case 9:
				var e6 = _g1[4];
				var isPostfix = _g1[3];
				var op1 = _g1[2];
				var ops;
				switch(op1[1]) {
				case 0:
					ops = "OpIncrement";
					break;
				case 1:
					ops = "OpDecrement";
					break;
				case 2:
					ops = "OpNot";
					break;
				case 3:
					ops = "OpNeg";
					break;
				case 4:
					ops = "OpNegBits";
					break;
				}
				var op2 = this.mkEnum("Unop",ops,[],p);
				return expr("EUnop",[op2,this.toBool(isPostfix,p),loop(e6)]);
			case 10:
				var vl1 = _g1[2];
				return expr("EVars",[this.toArray(function(vv,p1) {
					var name = vv.name;
					var type = vv.type;
					var expr1 = vv.expr;
					var fields = [{ field : "name", expr : _g.toString(name,p1)},{ field : "type", expr : _g.toOpt($bind(_g,_g.toCType),type,p1)},{ field : "expr", expr : _g.toOpt($bind(_g,_g.toExpr),expr1,p1)}];
					return _g.toObj(fields,p1);
				},vl1,p)]);
			case 11:
				var f1 = _g1[3];
				var name1 = _g1[2];
				return expr("EFunction",[this.toOpt($bind(this,this.toString),name1,p),this.toFun(f1,p)]);
			case 12:
				var el3 = _g1[2];
				return expr("EBlock",[this.toExprArray(el3,p)]);
			case 13:
				var e23 = _g1[3];
				var e13 = _g1[2];
				return expr("EFor",[loop(e13),loop(e23)]);
			case 14:
				var e24 = _g1[3];
				var e14 = _g1[2];
				return expr("EIn",[loop(e14),loop(e24)]);
			case 15:
				var eelse = _g1[4];
				var e25 = _g1[3];
				var e15 = _g1[2];
				return expr("EIf",[loop(e15),loop(e25),this.toOpt($bind(this,this.toExpr),eelse,p)]);
			case 16:
				var normalWhile = _g1[4];
				var e26 = _g1[3];
				var e16 = _g1[2];
				return expr("EWhile",[loop(e16),loop(e26),this.toBool(normalWhile,p)]);
			case 17:
				var def = _g1[4];
				var cases = _g1[3];
				var e17 = _g1[2];
				var scase = function(swc,p3) {
					var el4 = swc.values;
					var eg = swc.guard;
					var e7 = swc.expr;
					return _g.toObj([{ field : "values", expr : _g.toExprArray(el4,p3)},{ field : "guard", expr : _g.toOpt($bind(_g,_g.toExpr),eg,p3)},{ field : "expr", expr : _g.toOpt($bind(_g,_g.toExpr),e7,p3)}],p3);
				};
				return expr("ESwitch",[loop(e17),this.toArray(scase,cases,p),this.toOpt(function(def2,p4) {
					return _g.toOpt(function(def3,p5) {
						return _g.toExpr(def3,p5);
					},def2,p4);
				},def,p)]);
			case 18:
				var catches = _g1[3];
				var e18 = _g1[2];
				var scatch = function(c1,p6) {
					var n2 = c1.name;
					var t1 = c1.type;
					var e8 = c1.expr;
					return _g.toObj([{ field : "name", expr : _g.toString(n2,p6)},{ field : "type", expr : _g.toCType(t1,p6)},{ field : "expr", expr : loop(e8)}],p6);
				};
				return expr("ETry",[loop(e18),this.toArray(scatch,catches,p)]);
			case 19:
				var eo = _g1[2];
				return expr("EReturn",[this.toOpt($bind(this,this.toExpr),eo,p)]);
			case 20:
				return expr("EBreak",[]);
			case 21:
				return expr("EContinue",[]);
			case 22:
				var e9 = _g1[2];
				return expr("EUntyped",[loop(e9)]);
			case 23:
				var e10 = _g1[2];
				return expr("EThrow",[loop(e10)]);
			case 24:
				var ct = _g1[3];
				var e19 = _g1[2];
				return expr("ECast",[loop(e19),this.toOpt($bind(this,this.toCType),ct,p)]);
			case 25:
				var flag = _g1[3];
				var e20 = _g1[2];
				return expr("EDisplay",[loop(e20),this.toBool(flag,p)]);
			case 26:
				var t2 = _g1[2];
				return expr("EDisplayNew",[this.toTPath(t2,p)]);
			case 27:
				var e31 = _g1[4];
				var e27 = _g1[3];
				var e110 = _g1[2];
				return expr("ETernary",[loop(e110),loop(e27),loop(e31)]);
			case 28:
				var ct1 = _g1[3];
				var e111 = _g1[2];
				return expr("ECheckType",[loop(e111),this.toCType(ct1,p)]);
			case 29:
				var e112 = _g1[3];
				var md = _g1[2];
				var _g11 = md.name;
				switch(_g11) {
				case "$":case "$e":
					return e112;
				case "$a":
					{
						var _g2 = e112.expr;
						switch(_g2[1]) {
						case 6:
							var el5 = _g2[2];
							return expr("EArrayDecl",[this.toExprArray(el5,p)]);
						default:
							return expr("EArrayDecl",[e112]);
						}
					}
					break;
				case "$b":
					return expr("EBlock",[e112]);
				case "$v":
					return { expr : haxe_macro_ExprDef.ECall({ expr : haxe_macro_ExprDef.EField({ expr : haxe_macro_ExprDef.EField({ expr : haxe_macro_ExprDef.EField({ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent("haxe")), pos : p},"macro"), pos : p},"Context"), pos : p},"makeExpr"), pos : p},[e,this.toPos(e.pos)]), pos : p};
				case "$i":
					return expr("EConst",[this.mkEnum("Constant","CIdent",[e112],e112.pos)]);
				case "$p":
					return { expr : haxe_macro_ExprDef.ECall({ expr : haxe_macro_ExprDef.EField({ expr : haxe_macro_ExprDef.EField({ expr : haxe_macro_ExprDef.EField({ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent("haxe")), pos : p},"macro"), pos : p},"ExprTools"), pos : p},"toFieldExpr"), pos : p},[e]), pos : p};
				case ":pos":
					if(md.params.length == 1) {
						var old = this.curPos;
						this.curPos = md.params[0];
						var e28 = loop(e112);
						this.curPos = old;
						return e28;
					} else return expr("EMeta",[this.toObj([{ field : "name", expr : this.toString(md.name,p)},{ field : "params", expr : this.toExprArray(md.params,p)},{ field : "pos", expr : this.toPos(p)}],p),loop(e112)]);
					break;
				default:
					return expr("EMeta",[this.toObj([{ field : "name", expr : this.toString(md.name,p)},{ field : "params", expr : this.toExprArray(md.params,p)},{ field : "pos", expr : this.toPos(p)}],p),loop(e112)]);
				}
				break;
			}
		}
	}
	,toTParamDecl: function(t,p) {
		var params = [];
		var _g = 0;
		var _g1 = t.params;
		while(_g < _g1.length) {
			var tp = _g1[_g];
			++_g;
			params.push(this.toTParamDecl(tp,p));
		}
		var constraints = [];
		var _g2 = 0;
		var _g11 = t.constraints;
		while(_g2 < _g11.length) {
			var c = _g11[_g2];
			++_g2;
			constraints.push(this.toCType(c,p));
		}
		return this.toObj([{ field : "name", expr : this.toString(t.name,p)},{ field : "params", expr : { expr : haxe_macro_ExprDef.EArrayDecl(params), pos : p}},{ field : "constraints", expr : { expr : haxe_macro_ExprDef.EArrayDecl(constraints), pos : p}}],p);
	}
	,toTypeDef: function(td) {
		var p = td.pos;
		{
			var _g = td.decl;
			switch(_g[1]) {
			case 0:
				var d = _g[2];
				var ext = null;
				var impl = [];
				var interf = false;
				var _g1 = 0;
				var _g2 = d.flags;
				while(_g1 < _g2.length) {
					var f = _g2[_g1];
					++_g1;
					switch(f[1]) {
					case 1:case 2:
						break;
					case 0:
						interf = true;
						break;
					case 3:
						var t = f[2];
						ext = this.toTPath(t,td.pos);
						break;
					case 4:
						var i = f[2];
						impl.push(this.toTPath(i,td.pos));
						break;
					}
				}
				var params = [];
				var _g11 = 0;
				var _g21 = d.params;
				while(_g11 < _g21.length) {
					var par = _g21[_g11];
					++_g11;
					params.push(this.toTParamDecl(par,p));
				}
				var isExtern = false;
				var _g12 = 0;
				var _g22 = d.flags;
				try {
					while(_g12 < _g22.length) {
						var f1 = _g22[_g12];
						++_g12;
						switch(f1[1]) {
						case 1:
							isExtern = true;
							throw "__break__";
							break;
						default:
						}
					}
				} catch( e ) { if( e != "__break__" ) throw e; }
				var kindParams = [];
				if(ext == null) kindParams.push({ expr : haxe_macro_ExprDef.EConst(haxe_macro_Constant.CIdent("null")), pos : p}); else kindParams.push(ext);
				kindParams.push({ expr : haxe_macro_ExprDef.EArrayDecl(impl), pos : p});
				kindParams.push(this.toBool(interf,p));
				var fields = [];
				var _g13 = 0;
				var _g23 = d.data;
				while(_g13 < _g23.length) {
					var d1 = _g23[_g13];
					++_g13;
					fields.push(this.toCField(d1,p));
				}
				return this.toObj([{ field : "pack", expr : { expr : haxe_macro_ExprDef.EArrayDecl([]), pos : p}},{ field : "name", expr : this.toString(d.name,p)},{ field : "pos", expr : this.toPos(p)},{ field : "meta", expr : this.toMeta(d.meta,p)},{ field : "params", expr : { expr : haxe_macro_ExprDef.EArrayDecl(params), pos : p}},{ field : "isExtern", expr : this.toBool(isExtern,p)},{ field : "kind", expr : this.mkEnum("TypeDefKind","TDClass",kindParams,p)},{ field : "fields", expr : { expr : haxe_macro_ExprDef.EArrayDecl(fields), pos : p}}],td.pos);
			default:
				throw new js__$Boot_HaxeError("Invalid type for reification");
			}
		}
	}
	,__class__: haxeparser__$HaxeParser_Reificator
};
var haxeprinter_Printer = function() {
	this.config = haxe_Json.parse(haxe_Resource.getString("config"));
};
$hxClasses["haxeprinter.Printer"] = haxeprinter_Printer;
haxeprinter_Printer.__name__ = ["haxeprinter","Printer"];
haxeprinter_Printer.prototype = {
	config: null
	,buf: null
	,line: null
	,lineLen: null
	,indentLevel: null
	,indent: null
	,col: null
	,setIndent: function(level) {
		this.indentLevel = level;
		if(this.config.indent_with_tabs) this.indent = StringTools.lpad("","\t",this.indentLevel); else this.indent = StringTools.lpad(""," ",this.indentLevel * this.config.tab_width | 0);
	}
	,newline: function() {
		this.buf.b += Std.string(this.line.b + "\n");
		this.line = new StringBuf();
		this.col = 0;
		this.lineLen = 0;
	}
	,print: function(s,style) {
		if(style == null) style = haxeprinter_Style.SNormal;
		this.lineLen += s.length;
		if(s == null) this.line.b += "null"; else this.line.b += "" + s;
	}
	,breakPoint: function(force) {
		if(force == null) force = false;
		if(this.col > 0 && (force || this.col + this.lineLen > this.config.maximum_line_length)) {
			this.buf.b += "\n";
			this.setIndent(this.indentLevel + 1);
			this.buf.b += Std.string(this.indent);
			this.col = this.indent.length;
			this.setIndent(this.indentLevel - 1);
		}
		this.col += this.lineLen;
		this.buf.b += Std.string(this.line.b);
		this.line = new StringBuf();
		this.lineLen = 0;
	}
	,printAST: function(ast) {
		this.indentLevel = 0;
		this.indent = "";
		this.col = 0;
		this.buf = new StringBuf();
		this.line = new StringBuf();
		this.lineLen = 0;
		this.printPackage(ast.pack);
		var _g = 0;
		var _g1 = ast.decls;
		while(_g < _g1.length) {
			var type = _g1[_g];
			++_g;
			this.printType(type.decl);
		}
		return this.buf.b;
	}
	,printPackage: function(pack) {
		if(pack.length == 0 && !this.config.print_root_package) return;
		this.print("package",haxeprinter_Style.SDirective);
		var _g1 = 0;
		var _g = pack.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(i == 0) this.print(" ");
			this.print(pack[i],haxeprinter_Style.SType);
			if(i < pack.length - 1) this.print(".");
		}
		this.print(";");
		this.newline();
		if(this.config.empty_line_after_package) this.newline();
	}
	,printType: function(type) {
		switch(type[1]) {
		case 3:
			var mode = type[3];
			var sl = type[2];
			this.printImport(sl,mode);
			break;
		case 5:
			var path = type[2];
			this.printUsing(path);
			break;
		case 2:
			var data = type[2];
			this.printAbstract(data);
			break;
		case 0:
			var data1 = type[2];
			this.printClass(data1);
			break;
		case 1:
			var data2 = type[2];
			this.printEnum(data2);
			break;
		case 4:
			var data3 = type[2];
			this.printTypedef(data3);
			break;
		}
	}
	,printImport: function(path,mode) {
		this.print("import",haxeprinter_Style.SDirective);
		var _g1 = 0;
		var _g = path.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(i == 0) this.print(" ");
			this.print(path[i].pack,haxeprinter_Style.SType);
			if(i < path.length - 1) this.print(".");
		}
		{
			var o = mode;
			switch(mode[1]) {
			case 2:
				this.print(".");
				this.print("*",haxeprinter_Style.SOperator);
				break;
			case 1:
				var s = mode[2];
				this.print(" ");
				this.print("in",haxeprinter_Style.SKeyword);
				this.print(" ");
				this.print(s);
				break;
			default:
			}
		}
		this.print(";");
		this.newline();
		if(this.config.empty_line_after_import) this.newline();
	}
	,printUsing: function(path) {
		this.print("using",haxeprinter_Style.SDirective);
		this.print(" ");
		this.printTypePath(path);
		this.print(";");
		this.newline();
		if(this.config.empty_line_after_import) this.newline();
	}
	,printAbstract: function(data) {
		haxe_Log.trace(data,{ fileName : "Printer.hx", lineNumber : 157, className : "haxeprinter.Printer", methodName : "printAbstract"});
	}
	,printClass: function(type) {
		if(this.buf.b.length > 0 && this.config.empty_line_before_type) this.newline();
		var isInterface = false;
		var modifiers = [];
		var ext = null;
		var impls = [];
		var _g = 0;
		var _g1 = type.flags;
		while(_g < _g1.length) {
			var flag = _g1[_g];
			++_g;
			switch(flag[1]) {
			case 0:
				isInterface = true;
				break;
			case 1:
				modifiers.push("extern");
				break;
			case 2:
				modifiers.push("private");
				break;
			case 3:
				var t = flag[2];
				ext = t;
				break;
			case 4:
				var t1 = flag[2];
				impls.push(t1);
				break;
			}
		}
		this.printModifiers(modifiers);
		this.print(isInterface?"interface":"class",haxeprinter_Style.SDirective);
		this.print(" ");
		this.print(type.name,haxeprinter_Style.SType);
		this.printTypeParamDecls(type.params);
		if(ext != null) {
			this.print(" ");
			this.breakPoint();
			this.print("extends",haxeprinter_Style.SKeyword);
			this.print(" ");
			this.printTypePath(ext);
			this.breakPoint(this.config.extends_on_newline);
		}
		if(impls.length > 0) {
			var _g2 = 0;
			while(_g2 < impls.length) {
				var impl = impls[_g2];
				++_g2;
				this.print(" ");
				this.breakPoint();
				this.print("implements",haxeprinter_Style.SKeyword);
				this.print(" ");
				this.printTypePath(impl);
				this.breakPoint(this.config.implements_on_newline);
			}
		}
		if(type.data.length == 0 && this.config.inline_empty_braces) {
			this.print(" {}");
			this.newline();
			return;
		}
		if(this.config.cuddle_type_braces) {
			this.print(" {");
			this.newline();
			this.breakPoint();
		} else {
			this.breakPoint();
			this.newline();
			this.print("{");
			this.newline();
		}
		this.setIndent(this.indentLevel + 1);
		var _g11 = 0;
		var _g3 = type.data.length;
		while(_g11 < _g3) {
			var i = _g11++;
			this.printClassField(type.data[i]);
			if(i < type.data.length - 1 && this.config.empty_line_between_fields) this.newline();
		}
		this.setIndent(this.indentLevel - 1);
		this.print("}");
		this.newline();
	}
	,printClassField: function(field) {
		this.print(this.indent);
		var modifiers = field.access.map(function(a) {
			return HxOverrides.substr(Std.string(a),1,null).toLowerCase();
		});
		if(this.config.remove_private_field_modifier) HxOverrides.remove(modifiers,"private");
		this.printModifiers(modifiers);
		{
			var _g = field.kind;
			switch(_g[1]) {
			case 1:
				var f = _g[2];
				this.printFunction(field,f);
				break;
			case 0:
				var e = _g[3];
				var t = _g[2];
				this.printProp(field,null,null,t,e);
				break;
			case 2:
				var e1 = _g[5];
				var t1 = _g[4];
				var set = _g[3];
				var get = _g[2];
				this.printProp(field,get,set,t1,e1);
				break;
			}
		}
	}
	,printEnum: function(type) {
		if(this.config.empty_line_before_type) this.newline();
		var modifiers = type.flags.map(function(flag) {
			return HxOverrides.substr(Std.string(flag),1,null).toLowerCase();
		});
		this.printModifiers(modifiers);
		this.print("enum",haxeprinter_Style.SDirective);
		this.print(" ");
		this.print(type.name,haxeprinter_Style.SType);
		this.printTypeParamDecls(type.params);
		if(type.data.length == 0 && this.config.inline_empty_braces) {
			this.print(" {}");
			this.newline();
			return;
		}
		if(this.config.cuddle_type_braces) {
			this.print(" {");
			this.newline();
		} else {
			this.newline();
			this.print("{");
			this.newline();
		}
		this.setIndent(this.indentLevel + 1);
		var _g1 = 0;
		var _g = type.data.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.printEnumConstructor(type.data[i]);
			if(i < type.data.length - 1 && this.config.empty_line_between_enum_constructors) this.newline();
		}
		this.setIndent(this.indentLevel - 1);
		this.print("}");
		this.newline();
	}
	,printEnumConstructor: function(ctor) {
		this.print(this.indent);
		this.print(ctor.name,haxeprinter_Style.SType);
		this.printTypeParamDecls(ctor.params);
		this.printEnumConstructorArgs(ctor.args);
		this.print(";");
		this.newline();
	}
	,printEnumConstructorArgs: function(args) {
		if(args.length == 0) return;
		this.print("(");
		var _g1 = 0;
		var _g = args.length;
		while(_g1 < _g) {
			var i = _g1++;
			var arg = args[i];
			if(arg.opt) this.print("?");
			this.print(arg.name,haxeprinter_Style.SIdent);
			this.print(":");
			this.printComplexType(arg.type);
			if(i < args.length - 1) {
				if(this.config.space_between_enum_constructor_args) this.print(", "); else this.print(",");
			}
		}
		this.print(")");
	}
	,printTypedef: function(type) {
		if(this.config.empty_line_before_type) this.newline();
		var modifiers = type.flags.map(function(flag) {
			return HxOverrides.substr(Std.string(flag),1,null).toLowerCase();
		});
		this.printModifiers(modifiers);
		this.print("typedef",haxeprinter_Style.SDirective);
		this.print(" ");
		this.print(type.name,haxeprinter_Style.SType);
		this.printTypeParamDecls(type.params);
		this.print(" = ");
		{
			var _g = type.data;
			switch(_g[1]) {
			case 2:
				var fields = _g[2];
				this.printAnonFields(fields);
				break;
			case 0:
				var path = _g[2];
				this.printTypePath(path);
				break;
			default:
				throw new js__$Boot_HaxeError("todo: " + Std.string(type.data));
			}
		}
		this.newline();
	}
	,printAnonFields: function(fields) {
		if(fields.length == 0 && this.config.inline_empty_braces) {
			this.print(" {}");
			return;
		}
		if(this.config.cuddle_type_braces) {
			this.print(" {");
			this.newline();
		} else {
			this.newline();
			this.print("{");
			this.newline();
		}
		this.setIndent(this.indentLevel + 1);
		var _g1 = 0;
		var _g = fields.length;
		while(_g1 < _g) {
			var i = _g1++;
			var field = fields[i];
			this.print(this.indent);
			this.print(field.name,haxeprinter_Style.SIdent);
			this.print(":");
			{
				var _g2 = field.kind;
				switch(_g2[1]) {
				case 0:
					var t = _g2[2];
					this.printComplexType(t);
					break;
				default:
					throw new js__$Boot_HaxeError("todo: " + Std.string(field.kind));
				}
			}
			if(i < fields.length - 1) {
				this.print(",");
				if(this.config.empty_line_between_typedef_fields) this.newline();
			}
			this.newline();
		}
		this.setIndent(this.indentLevel - 1);
		this.print("}");
	}
	,printFunction: function(field,f) {
		this.print("function",haxeprinter_Style.SKeyword);
		this.print(" ");
		this.print(field.name,haxeprinter_Style.SIdent);
		this.printTypeParamDecls(f.params);
		this.printFunctionArgs(f.args);
		if(f.ret != null) {
			this.print(":");
			this.printComplexType(f.ret);
		}
		if(this.config.cuddle_method_braces) this.print(" "); else {
			this.newline();
			this.print(this.indent);
		}
		this.printExpr(f.expr);
		this.newline();
	}
	,printProp: function(field,get,set,type,expr) {
		this.print("var",haxeprinter_Style.SKeyword);
		this.print(" ");
		this.print(field.name,haxeprinter_Style.SIdent);
		if(get != null && set != null) {
			this.print("(");
			this.print(get,haxeprinter_Style.SModifier);
			if(this.config.space_betwen_property_get_set) this.print(", "); else this.print(",");
			this.print(set,haxeprinter_Style.SModifier);
			this.print(")");
		}
		if(type != null) {
			this.print(":");
			this.printComplexType(type);
		}
		if(expr != null) {
			if(this.config.space_around_property_assign) this.print(" = "); else this.print("=");
			this.printExpr(expr);
		}
		this.print(";");
		this.newline();
	}
	,printExpr: function(expr) {
		this.print(haxe_macro_ExprTools.toString(expr).split("\n").join("\n" + this.indent));
	}
	,printFunctionArgs: function(args) {
		this.print("(");
		this.breakPoint(this.config.function_arg_on_newline);
		var _g1 = 0;
		var _g = args.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.breakPoint(this.config.function_arg_on_newline);
			var arg = args[i];
			if(arg.opt) this.print("?");
			this.print(arg.name,haxeprinter_Style.SIdent);
			if(arg.type != null) {
				this.print(":");
				this.printComplexType(arg.type);
			}
			if(arg.value != null) {
				if(this.config.space_around_function_arg_assign) this.print(" = "); else this.print("=");
				this.printExpr(arg.value);
			}
			if(i < args.length - 1) {
				this.print(",");
				if(this.config.space_between_function_args) this.print(" ");
				this.breakPoint();
			}
		}
		this.print(")");
		this.breakPoint();
	}
	,printModifiers: function(modifiers) {
		if(modifiers.length == 0) return;
		var order = this.config.modifier_order;
		modifiers.sort(function(a,b) {
			return HxOverrides.indexOf(order,a,0) - HxOverrides.indexOf(order,b,0);
		});
		var _g = 0;
		while(_g < modifiers.length) {
			var modifier = modifiers[_g];
			++_g;
			this.print(modifier,haxeprinter_Style.SModifier);
			this.print(" ");
		}
	}
	,printTypePath: function(path) {
		var pack = path.pack.concat([path.name]);
		var _g1 = 0;
		var _g = pack.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.print(pack[i],haxeprinter_Style.SType);
			if(i < pack.length - 1) this.print(".");
		}
		var params = path.params;
		if(params.length == 0) return;
		this.print("<");
		var _g11 = 0;
		var _g2 = params.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this.printTypeParam(params[i1]);
			if(i1 < params.length - 1) {
				if(this.config.space_between_type_params) this.print(", "); else this.print(",");
			}
		}
		this.print(">");
	}
	,printTypeParamDecls: function(params) {
		if(params.length == 0) return;
		this.print("<");
		var _g1 = 0;
		var _g = params.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.printTypeParamDecl(params[i]);
			if(i < params.length - 1) {
				if(this.config.space_between_type_params) this.print(", "); else this.print(",");
			}
		}
		this.print(">");
	}
	,printTypeParamDecl: function(param) {
		this.print(param.name,haxeprinter_Style.SType);
		var constraints = param.constraints;
		if(constraints.length == 0) return;
		this.print(":");
		if(constraints.length > 1) this.print("(");
		var _g1 = 0;
		var _g = constraints.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.printComplexType(constraints[i]);
			if(i < constraints.length - 1) {
				if(this.config.space_between_type_param_constraints) this.print(", "); else this.print(",");
			}
		}
		if(constraints.length > 1) this.print(")");
	}
	,printTypeParam: function(param) {
		switch(param[1]) {
		case 0:
			var type = param[2];
			this.printComplexType(type);
			break;
		default:
			throw new js__$Boot_HaxeError("todo: " + Std.string(param));
		}
	}
	,printComplexType: function(type) {
		switch(type[1]) {
		case 0:
			var path = type[2];
			this.printTypePath(path);
			break;
		case 2:
			var fields = type[2];
			this.printAnonType(fields);
			break;
		default:
			throw new js__$Boot_HaxeError("todo: " + Std.string(type));
		}
	}
	,printAnonType: function(fields) {
		this.print("{");
		var _g1 = 0;
		var _g = fields.length;
		while(_g1 < _g) {
			var i = _g1++;
			var field = fields[i];
			this.print(field.name,haxeprinter_Style.SIdent);
			this.print(":");
			{
				var _g2 = field.kind;
				switch(_g2[1]) {
				case 0:
					var t = _g2[2];
					this.printComplexType(t);
					break;
				default:
					throw new js__$Boot_HaxeError("todo: " + Std.string(field.kind));
				}
			}
			if(i < fields.length - 1) {
				if(this.config.space_between_anon_type_fields) this.print(", "); else this.print(",");
			}
		}
		this.print("}");
	}
	,__class__: haxeprinter_Printer
};
var haxeprinter_Style = $hxClasses["haxeprinter.Style"] = { __ename__ : ["haxeprinter","Style"], __constructs__ : ["SNormal","SDirective","SOperator","SKeyword","SIdent","SString","SNumber","SType","SModifier"] };
haxeprinter_Style.SNormal = ["SNormal",0];
haxeprinter_Style.SNormal.__enum__ = haxeprinter_Style;
haxeprinter_Style.SDirective = ["SDirective",1];
haxeprinter_Style.SDirective.__enum__ = haxeprinter_Style;
haxeprinter_Style.SOperator = ["SOperator",2];
haxeprinter_Style.SOperator.__enum__ = haxeprinter_Style;
haxeprinter_Style.SKeyword = ["SKeyword",3];
haxeprinter_Style.SKeyword.__enum__ = haxeprinter_Style;
haxeprinter_Style.SIdent = ["SIdent",4];
haxeprinter_Style.SIdent.__enum__ = haxeprinter_Style;
haxeprinter_Style.SString = ["SString",5];
haxeprinter_Style.SString.__enum__ = haxeprinter_Style;
haxeprinter_Style.SNumber = ["SNumber",6];
haxeprinter_Style.SNumber.__enum__ = haxeprinter_Style;
haxeprinter_Style.SType = ["SType",7];
haxeprinter_Style.SType.__enum__ = haxeprinter_Style;
haxeprinter_Style.SModifier = ["SModifier",8];
haxeprinter_Style.SModifier.__enum__ = haxeprinter_Style;
var haxeproject_HaxeProject = function() {
	var _g = this;
	newprojectdialog_NewProjectDialog.getCategory("Haxe",1).addItem("Flash Project",$bind(this,this.createFlashProject));
	newprojectdialog_NewProjectDialog.getCategory("Haxe").addItem("JavaScript Project",$bind(this,this.createJavaScriptProject));
	newprojectdialog_NewProjectDialog.getCategory("Haxe").addItem("Neko Project",$bind(this,this.createNekoProject));
	newprojectdialog_NewProjectDialog.getCategory("Haxe").addItem("PHP Project",$bind(this,this.createPhpProject));
	newprojectdialog_NewProjectDialog.getCategory("Haxe").addItem("C++ Project",$bind(this,this.createCppProject));
	newprojectdialog_NewProjectDialog.getCategory("Haxe").addItem("Java Project",$bind(this,this.createJavaProject));
	newprojectdialog_NewProjectDialog.getCategory("Haxe").addItem("C# Project",$bind(this,this.createCSharpProject));
	newprojectdialog_NewProjectDialog.getCategory("Haxe").addItem("Python Project",$bind(this,this.createPythonProject));
	var options = { };
	options.encoding = "utf8";
	var path = js_Node.require("path").join("core","templates","Main.tpl");
	js_Node.require("fs").readFile(path,options,function(error,data) {
		if(error == null) _g.code = data; else {
			haxe_Log.trace(error,{ fileName : "HaxeProject.hx", lineNumber : 64, className : "haxeproject.HaxeProject", methodName : "new"});
			alertify.error("Can't load template " + path);
		}
	});
	path = js_Node.require("path").join("core","templates","index.tpl");
	js_Node.require("fs").readFile(path,options,function(error1,data1) {
		if(error1 == null) _g.indexPageCode = data1; else {
			haxe_Log.trace(error1,{ fileName : "HaxeProject.hx", lineNumber : 80, className : "haxeproject.HaxeProject", methodName : "new"});
			alertify.error("Can't load template " + path);
		}
	});
};
$hxClasses["haxeproject.HaxeProject"] = haxeproject_HaxeProject;
haxeproject_HaxeProject.__name__ = ["haxeproject","HaxeProject"];
haxeproject_HaxeProject.get = function() {
	if(haxeproject_HaxeProject.instance == null) haxeproject_HaxeProject.instance = new haxeproject_HaxeProject();
	return haxeproject_HaxeProject.instance;
};
haxeproject_HaxeProject.prototype = {
	code: null
	,indexPageCode: null
	,createPythonProject: function(data) {
		this.createHaxeProject(data,7);
	}
	,createCSharpProject: function(data) {
		this.createHaxeProject(data,6);
	}
	,createJavaProject: function(data) {
		this.createHaxeProject(data,5);
	}
	,createCppProject: function(data) {
		this.createHaxeProject(data,4);
	}
	,createPhpProject: function(data) {
		this.createHaxeProject(data,3);
	}
	,createNekoProject: function(data) {
		this.createHaxeProject(data,2);
	}
	,createFlashProject: function(data) {
		this.createHaxeProject(data,0);
	}
	,createJavaScriptProject: function(data) {
		this.createHaxeProject(data,1);
	}
	,createHaxeProject: function(data,target) {
		var _g = this;
		var pathToSrc = js_Node.require("path").join(data.projectLocation,data.projectName,"src");
		js_node_Mkdirp.mkdirp(pathToSrc,function(err,made) {
			var pathToProject = data.projectLocation;
			if(data.createDirectory) pathToProject = js_Node.require("path").join(pathToProject,data.projectName);
			var project = new projectaccess_Project();
			project.name = data.projectName;
			project.projectPackage = data.projectPackage;
			project.company = data.projectCompany;
			project.license = data.projectLicense;
			project.url = data.projectURL;
			project.type = 0;
			project.target = target;
			projectaccess_ProjectAccess.path = pathToProject;
			projectaccess_ProjectAccess.currentProject = project;
			var pathToSrc1 = js_Node.require("path").join(pathToProject,"src");
			var fullPackagePath = "";
			if(data.projectPackage != "") {
				fullPackagePath = StringTools.replace(data.projectPackage,".",js_Node.require("path").sep);
				js_node_Mkdirp.mkdirpSync(js_Node.require("path").join(pathToSrc1,fullPackagePath));
			}
			var pathToMain;
			pathToMain = js_Node.require("path").join(pathToSrc1,fullPackagePath,"Main.hx");
			var tabManagerInstance = tabmanager_TabManager.get();
			var fileTemplate = { };
			fileTemplate = tabManagerInstance.generateTemplate(fileTemplate,data.projectPackage);
			var templateCode = new haxe_Template(_g.code).execute(fileTemplate);
			js_Node.require("fs").writeFile(pathToMain,templateCode,null,function(error) {
				if(error != null) alertify.error("Write file error" + error);
				js_Node.require("fs").exists(pathToMain,function(exists) {
					if(exists) {
						var tabManagerInstance1 = tabmanager_TabManager.get();
						tabManagerInstance1.openFileInNewTab(pathToMain);
					} else haxe_Log.trace(pathToMain + " file was not generated",{ fileName : "HaxeProject.hx", lineNumber : 189, className : "haxeproject.HaxeProject", methodName : "createHaxeProject"});
				});
			});
			var filenames = ["flash","javascript","neko","php","cpp","java","csharp","python"];
			var pathToProjectTemplates = js_Node.require("path").join("core","templates","project");
			var _g2 = 0;
			var _g1 = filenames.length;
			while(_g2 < _g1) {
				var i = _g2++;
				var targetData = { };
				targetData.pathToHxml = filenames[i] + ".hxml";
				var options = { };
				options.encoding = "utf8";
				var templateCode1 = js_Node.require("fs").readFileSync(js_Node.require("path").join(pathToProjectTemplates,filenames[i] + ".tpl"),options);
				var pathToFile;
				switch(i) {
				case 0:
					pathToFile = "bin/" + project.name + ".swf";
					targetData.runActionType = 1;
					targetData.runActionText = pathToFile;
					break;
				case 1:
					pathToFile = "bin/" + project.name + ".js";
					targetData.runActionType = 1;
					targetData.runActionText = js_Node.require("path").join("bin","index.html");
					break;
				case 2:
					pathToFile = "bin/" + project.name + ".n";
					targetData.runActionType = 2;
					targetData.runActionText = "neko " + pathToFile;
					break;
				case 3:
					pathToFile = "bin/" + project.name + ".php";
					break;
				case 4:
					pathToFile = "bin";
					targetData.runActionType = 2;
					targetData.runActionText = "bin/" + "Main" + "-debug";
					if(core_Utils.os == 0) targetData.runActionText += ".exe";
					break;
				case 5:
					pathToFile = "bin/" + project.name + ".jar";
					break;
				case 6:
					pathToFile = "bin/" + project.name + ".exe";
					break;
				case 7:
					pathToFile = "bin/" + project.name + ".py";
					targetData.runActionType = 2;
					targetData.runActionText = "python " + pathToFile;
					break;
				default:
					throw new js__$Boot_HaxeError("Path to file is null");
				}
				var templateCode2 = new haxe_Template(templateCode1).execute({ file : pathToFile, pack : data.projectPackage});
				js_Node.require("fs").writeFileSync(js_Node.require("path").join(pathToProject,targetData.pathToHxml),templateCode2,"utf8");
				project.targetData.push(targetData);
			}
			js_Node.require("fs").mkdir(js_Node.require("path").join(pathToProject,"bin"),null,function(error1) {
				if(error1 == null) {
					var updatedPageCode = new haxe_Template(_g.indexPageCode).execute({ title : project.name, script : project.name + ".js"});
					var pathToWebPage = js_Node.require("path").join(pathToProject,"bin","index.html");
					js_Node.require("fs").writeFile(pathToWebPage,updatedPageCode,"utf8",function(error2) {
						if(error2 != null) {
							haxe_Log.trace(error2,{ fileName : "HaxeProject.hx", lineNumber : 275, className : "haxeproject.HaxeProject", methodName : "createHaxeProject"});
							alertify.error("Generate web page error: " + error2);
						}
					});
				} else alertify.error("Folder creation error: " + error1);
			});
			var path = js_Node.require("path").join(pathToProject,"project.hide");
			projectaccess_ProjectAccess.save((function(f,a1) {
				return function() {
					return f(a1);
				};
			})(openproject_OpenProject.openProject,path));
		});
	}
	,__class__: haxeproject_HaxeProject
};
var hxparse_LexerTokenSource = function(lexer,ruleset) {
	this.lexer = lexer;
	this.ruleset = ruleset;
};
$hxClasses["hxparse.LexerTokenSource"] = hxparse_LexerTokenSource;
hxparse_LexerTokenSource.__name__ = ["hxparse","LexerTokenSource"];
hxparse_LexerTokenSource.prototype = {
	lexer: null
	,ruleset: null
	,token: function() {
		return this.lexer.token(this.ruleset);
	}
	,curPos: function() {
		return this.lexer.curPos();
	}
	,__class__: hxparse_LexerTokenSource
};
var hxparse_NoMatch = function(pos,token) {
	this.pos = pos;
	this.token = token;
};
$hxClasses["hxparse.NoMatch"] = hxparse_NoMatch;
hxparse_NoMatch.__name__ = ["hxparse","NoMatch"];
hxparse_NoMatch.prototype = {
	pos: null
	,token: null
	,toString: function() {
		return "" + Std.string(this.pos) + ": No match: " + Std.string(this.token);
	}
	,__class__: hxparse_NoMatch
};
var hxparse_State = function() {
	this["final"] = -1;
	var this1;
	this1 = new Array(256);
	this.trans = this1;
};
$hxClasses["hxparse.State"] = hxparse_State;
hxparse_State.__name__ = ["hxparse","State"];
hxparse_State.prototype = {
	trans: null
	,'final': null
	,__class__: hxparse_State
};
var hxparse_Unexpected = function(token,pos) {
	this.token = token;
	this.pos = pos;
};
$hxClasses["hxparse.Unexpected"] = hxparse_Unexpected;
hxparse_Unexpected.__name__ = ["hxparse","Unexpected"];
hxparse_Unexpected.prototype = {
	token: null
	,pos: null
	,toString: function() {
		return "Unexpected " + Std.string(this.token) + " at " + Std.string(this.pos);
	}
	,__class__: hxparse_Unexpected
};
var hxparse_UnexpectedChar = function($char,pos) {
	this["char"] = $char;
	this.pos = pos;
};
$hxClasses["hxparse.UnexpectedChar"] = hxparse_UnexpectedChar;
hxparse_UnexpectedChar.__name__ = ["hxparse","UnexpectedChar"];
hxparse_UnexpectedChar.prototype = {
	'char': null
	,pos: null
	,toString: function() {
		return "" + Std.string(this.pos) + ": Unexpected " + this["char"];
	}
	,__class__: hxparse_UnexpectedChar
};
var js_Browser = function() { };
$hxClasses["js.Browser"] = js_Browser;
js_Browser.__name__ = ["js","Browser"];
js_Browser.getLocalStorage = function() {
	try {
		var s = window.localStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
var js_Lib = function() { };
$hxClasses["js.Lib"] = js_Lib;
js_Lib.__name__ = ["js","Lib"];
js_Lib["eval"] = function(code) {
	return eval(code);
};
var js_Node = function() { };
$hxClasses["js.Node"] = js_Node;
js_Node.__name__ = ["js","Node"];
var js_node_Mkdirp = function() { };
$hxClasses["js.node.Mkdirp"] = js_node_Mkdirp;
js_node_Mkdirp.__name__ = ["js","node","Mkdirp"];
js_node_Mkdirp.mkdirp = function(dir,mode,cb) {
	if(cb == null) js_node_Mkdirp._mkdirp(dir,mode); else js_node_Mkdirp._mkdirp(dir,mode,cb);
};
js_node_Mkdirp.mkdirpSync = function(dir,mode) {
	return js_node_Mkdirp._mkdirp.sync(dir,mode);
};
var js_node_Mv = function() { };
$hxClasses["js.node.Mv"] = js_node_Mv;
js_node_Mv.__name__ = ["js","node","Mv"];
js_node_Mv.move = function(src,dest,cb) {
	js_node_Mv.mv(src,dest,cb);
};
var js_node_Remove = function() { };
$hxClasses["js.node.Remove"] = js_node_Remove;
js_node_Remove.__name__ = ["js","node","Remove"];
js_node_Remove.removeAsync = function(path,options,cb) {
	js_node_Remove.remove(path,options,cb);
};
var Walkdir = function() { };
$hxClasses["Walkdir"] = Walkdir;
Walkdir.__name__ = ["Walkdir"];
Walkdir.walk = function(path,options,onItem) {
	var emitter;
	if(onItem != null) emitter = Walkdir.walkdir(path,options,onItem); else emitter = Walkdir.walkdir(path,options);
	return emitter;
};
Walkdir.walkSync = function(path,options,onItem) {
	var result;
	if(options != null) result = Walkdir.walkdir.sync(path,options,onItem); else result = Walkdir.walkdir.sync(path,onItem);
	return result;
};
var kha_KhaProject = function() {
};
$hxClasses["kha.KhaProject"] = kha_KhaProject;
kha_KhaProject.__name__ = ["kha","KhaProject"];
kha_KhaProject.get = function() {
	if(kha_KhaProject.instance == null) kha_KhaProject.instance = new kha_KhaProject();
	return kha_KhaProject.instance;
};
kha_KhaProject.prototype = {
	load: function() {
	}
	,__class__: kha_KhaProject
};
var menu_BootstrapMenu = function() { };
$hxClasses["menu.BootstrapMenu"] = menu_BootstrapMenu;
menu_BootstrapMenu.__name__ = ["menu","BootstrapMenu"];
menu_BootstrapMenu.createMenuBar = function() {
	window.document.body.style.overflow = "hidden";
	var navbar;
	var _this = window.document;
	navbar = _this.createElement("div");
	navbar.className = "navbar navbar-default navbar-inverse navbar-fixed-top";
	var navbarHeader;
	var _this1 = window.document;
	navbarHeader = _this1.createElement("div");
	navbarHeader.className = "navbar-header";
	navbar.appendChild(navbarHeader);
	var a;
	var _this2 = window.document;
	a = _this2.createElement("a");
	a.className = "navbar-brand";
	a.href = "#";
	a.innerText = watchers_LocaleWatcher.getStringSync("HIDE");
	a.setAttribute("localeString","HIDE");
	navbarHeader.appendChild(a);
	var div;
	var _this3 = window.document;
	div = _this3.createElement("div");
	div.className = "navbar-collapse collapse";
	var ul;
	var _this4 = window.document;
	ul = _this4.createElement("ul");
	ul.id = "position-navbar";
	ul.className = "nav navbar-nav";
	div.appendChild(ul);
	navbar.appendChild(div);
	window.document.body.appendChild(navbar);
};
menu_BootstrapMenu.getMenu = function(name,position) {
	var menu1;
	if(!menu_BootstrapMenu.menus.exists(name)) {
		menu1 = new menu_Menu(name);
		menu1.setPosition(position);
		menu_BootstrapMenu.addMenuToDocument(menu1);
		menu_BootstrapMenu.menus.set(name,menu1);
		$(window.document).on("mouseenter","#position-navbar .dropdown",function(e) {
			var self = this;
			var open = $(self).siblings(".open");
			if(open.length > 0) {
				open.removeClass("open");
				$(self).addClass("open");
			}
		});
	} else {
		menu1 = menu_BootstrapMenu.menus.get(name);
		if(position != null && menu1.position != position) {
			menu1.removeFromDocument();
			menu_BootstrapMenu.menus.remove(name);
			menu1.setPosition(position);
			menu_BootstrapMenu.addMenuToDocument(menu1);
			menu_BootstrapMenu.menus.set(name,menu1);
		}
	}
	return menu1;
};
menu_BootstrapMenu.addMenuToDocument = function(menu1) {
	var div;
	div = js_Boot.__cast(window.document.getElementById("position-navbar") , HTMLElement);
	if(menu1.position != null && menu_BootstrapMenu.menuArray.length > 0 && div.childNodes.length > 0) {
		var currentMenu;
		var added = false;
		var _g1 = 0;
		var _g = menu_BootstrapMenu.menuArray.length;
		while(_g1 < _g) {
			var i = _g1++;
			currentMenu = menu_BootstrapMenu.menuArray[i];
			if(currentMenu != menu1 && currentMenu.position == null || menu1.position < currentMenu.position) {
				div.insertBefore(menu1.getElement(),currentMenu.getElement());
				menu_BootstrapMenu.menuArray.splice(i,0,menu1);
				added = true;
				break;
			}
		}
		if(!added) {
			menu1.addToDocument();
			menu_BootstrapMenu.menuArray.push(menu1);
		}
	} else {
		menu1.addToDocument();
		menu_BootstrapMenu.menuArray.push(menu1);
	}
};
menu_BootstrapMenu.removeMenu = function(name,position) {
	var menu1;
	if(menu_BootstrapMenu.menus.exists(name)) {
		menu1 = menu_BootstrapMenu.menus.get(name);
		menu1.removeFromDocument();
		menu_BootstrapMenu.menus.remove(name);
	}
};
var menu_MenuItem = function() { };
$hxClasses["menu.MenuItem"] = menu_MenuItem;
menu_MenuItem.__name__ = ["menu","MenuItem"];
var menu_MenuButtonItem = function(_menu,_text,_onClickFunction,_hotkey,_submenu) {
	if(_submenu == null) _submenu = false;
	if(_hotkey == null) _hotkey = "";
	var _g = this;
	var hotkeyText = _hotkey;
	this.action = _onClickFunction;
	this.menuItem = _menu + "->" + _text;
	var span;
	var _this = window.document;
	span = _this.createElement("span");
	span.className = "hotkey";
	if(!_submenu) core_Hotkeys.add(this.menuItem,hotkeyText,span,_onClickFunction);
	var _this1 = window.document;
	this.li = _this1.createElement("li");
	this.li.classList.add("menu-item");
	var _this2 = window.document;
	this.anchorElement = _this2.createElement("a");
	this.anchorElement.style.left = "0";
	if(!_submenu) {
		this.anchorElement.textContent = watchers_LocaleWatcher.getStringSync(_text);
		this.anchorElement.setAttribute("localeString",_text);
	} else this.anchorElement.textContent = _text;
	if(_onClickFunction != null) this.anchorElement.onclick = function(e) {
		haxe_Log.trace("cli",{ fileName : "Menu.hx", lineNumber : 76, className : "menu.MenuButtonItem", methodName : "new"});
		if(_g.li.className != "disabled") _onClickFunction();
	};
	this.anchorElement.innerText = _text;
	this.anchorElement.appendChild(span);
	this.li.appendChild(this.anchorElement);
};
$hxClasses["menu.MenuButtonItem"] = menu_MenuButtonItem;
menu_MenuButtonItem.__name__ = ["menu","MenuButtonItem"];
menu_MenuButtonItem.__interfaces__ = [menu_MenuItem];
menu_MenuButtonItem.prototype = {
	anchorElement: null
	,li: null
	,position: null
	,menuItem: null
	,action: null
	,getElement: function() {
		return this.li;
	}
	,__class__: menu_MenuButtonItem
};
var menu_Separator = function() {
	var _this = window.document;
	this.li = _this.createElement("li");
	this.li.className = "divider";
};
$hxClasses["menu.Separator"] = menu_Separator;
menu_Separator.__name__ = ["menu","Separator"];
menu_Separator.__interfaces__ = [menu_MenuItem];
menu_Separator.prototype = {
	li: null
	,getElement: function() {
		return this.li;
	}
	,__class__: menu_Separator
};
var menu_Submenu = function(_parentMenu,_name) {
	var _g = this;
	this.name = _name;
	this.parentMenu = _parentMenu;
	this.items = [];
	var li2;
	var _this = window.document;
	li2 = _this.createElement("li");
	li2.classList.add("menu-item");
	li2.classList.add("dropdown");
	li2.classList.add("dropdown-submenu");
	this.li = li2;
	var _this1 = window.document;
	this.ul = _this1.createElement("ul");
	var a2;
	var _this2 = window.document;
	a2 = _this2.createElement("a");
	a2.href = "#";
	a2.classList.add("dropdown-toggle");
	a2.setAttribute("data-toggle","dropdown");
	a2.setAttribute("localeString",this.name);
	a2.textContent = this.name;
	a2.onclick = function(event) {
		$("li.menu-item.dropdown.dropdown-submenu.open").removeClass("open");
		event.preventDefault();
		event.stopPropagation();
		if(_g.ul.childElementCount > 0) {
			li2.classList.add("open");
			var menu1 = _g.ul;
			var newpos;
			if(menu1.offsetLeft + menu1.clientWidth + 30 > window.innerWidth) newpos = -menu1.clientWidth; else newpos = li2.clientWidth;
			menu1.style.left = (newpos == null?"null":"" + newpos) + "px";
		}
	};
	li2.appendChild(a2);
	this.ul.classList.add("dropdown-menu");
	li2.appendChild(this.ul);
};
$hxClasses["menu.Submenu"] = menu_Submenu;
menu_Submenu.__name__ = ["menu","Submenu"];
menu_Submenu.prototype = {
	ul: null
	,li: null
	,name: null
	,parentMenu: null
	,items: null
	,addMenuItem: function(_text,_position,_onClickFunction,_hotkey) {
		var menuButtonItem = new menu_MenuButtonItem(this.parentMenu + "->" + this.name,_text,_onClickFunction,_hotkey,true);
		this.ul.appendChild(menuButtonItem.getElement());
		this.items.push(menuButtonItem);
	}
	,addMenuCheckItem: function(_text,_position,_onClickFunction,_hotkey) {
		var menuButtonItem = new menu_MenuCheckItem(this.parentMenu + "->" + this.name,_text,_onClickFunction,_hotkey,true);
		this.ul.appendChild(menuButtonItem.getElement());
		this.items.push(menuButtonItem);
	}
	,clear: function() {
		this.items = [];
		while(this.ul.firstChild != null) this.ul.removeChild(this.ul.firstChild);
	}
	,getElement: function() {
		return this.li;
	}
	,getItems: function() {
		return this.items;
	}
	,__class__: menu_Submenu
};
var menu_Menu = function(_text,_headerText) {
	this.name = _text;
	var _this = window.document;
	this.li = _this.createElement("li");
	this.li.className = "dropdown";
	var a;
	var _this1 = window.document;
	a = _this1.createElement("a");
	a.href = "#";
	a.className = "dropdown-toggle";
	a.setAttribute("data-toggle","dropdown");
	a.innerText = watchers_LocaleWatcher.getStringSync(_text);
	a.setAttribute("localeString",_text);
	this.li.appendChild(a);
	var _this2 = window.document;
	this.ul = _this2.createElement("ul");
	this.ul.className = "dropdown-menu";
	this.ul.classList.add("dropdown-menu-form");
	if(_headerText != null) {
		var li_header;
		var _this3 = window.document;
		li_header = _this3.createElement("li");
		li_header.className = "dropdown-header";
		li_header.innerText = _headerText;
		this.ul.appendChild(li_header);
	}
	this.li.appendChild(this.ul);
	this.items = [];
	this.submenus = new haxe_ds_StringMap();
};
$hxClasses["menu.Menu"] = menu_Menu;
menu_Menu.__name__ = ["menu","Menu"];
menu_Menu.prototype = {
	li: null
	,ul: null
	,items: null
	,name: null
	,submenus: null
	,position: null
	,addMenuItem: function(_text,_position,_onClickFunction,_hotkey) {
		var menuButtonItem = new menu_MenuButtonItem(this.name,_text,_onClickFunction,_hotkey);
		menuButtonItem.position = _position;
		if(menuButtonItem.position != null && this.items.length > 0 && this.ul.childNodes.length > 0) {
			var currentMenuButtonItem;
			var added = false;
			var _g1 = 0;
			var _g = this.items.length;
			while(_g1 < _g) {
				var i = _g1++;
				currentMenuButtonItem = this.items[i];
				if(currentMenuButtonItem != menuButtonItem && currentMenuButtonItem.position == null || menuButtonItem.position < currentMenuButtonItem.position) {
					this.ul.insertBefore(menuButtonItem.getElement(),currentMenuButtonItem.getElement());
					this.items.splice(i,0,menuButtonItem);
					added = true;
					break;
				}
			}
			if(!added) {
				this.ul.appendChild(menuButtonItem.getElement());
				this.items.push(menuButtonItem);
			}
		} else {
			this.ul.appendChild(menuButtonItem.getElement());
			this.items.push(menuButtonItem);
		}
	}
	,addSeparator: function() {
		this.ul.appendChild(new menu_Separator().getElement());
	}
	,addSubmenu: function(_text) {
		var submenu = new menu_Submenu(this.name,_text);
		this.ul.appendChild(submenu.getElement());
		this.submenus.set(_text,submenu);
		return submenu;
	}
	,addToDocument: function() {
		var div;
		div = js_Boot.__cast(window.document.getElementById("position-navbar") , HTMLElement);
		div.appendChild(this.li);
	}
	,removeFromDocument: function() {
		this.li.remove();
	}
	,setPosition: function(_position) {
		this.position = _position;
	}
	,getSubmenu: function(name) {
		if(!this.submenus.exists(name)) this.submenus.set(name,this.addSubmenu(name));
		return this.submenus.get(name);
	}
	,getItems: function() {
		return this.items;
	}
	,getElement: function() {
		return this.li;
	}
	,__class__: menu_Menu
};
var menu_MenuCheckItem = function(_menu,_text,_onClickFunction,_hotkey,_submenu) {
	if(_submenu == null) _submenu = false;
	if(_hotkey == null) _hotkey = "";
	this.checked = false;
	var _g = this;
	menu_MenuButtonItem.call(this,_menu,_text,_onClickFunction,_hotkey,_submenu);
	var span;
	var _this = window.document;
	span = _this.createElement("span");
	span.className = "hotkey";
	var checkbox;
	var _this1 = window.document;
	checkbox = _this1.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = this.checked;
	span.appendChild(checkbox);
	this.anchorElement.appendChild(span);
	if(_onClickFunction != null) this.anchorElement.onclick = function(e) {
		if(_g.li.className == "disabled") return;
		_g.checked = !_g.checked;
		checkbox.checked = _g.checked;
		_onClickFunction(_g);
	};
};
$hxClasses["menu.MenuCheckItem"] = menu_MenuCheckItem;
menu_MenuCheckItem.__name__ = ["menu","MenuCheckItem"];
menu_MenuCheckItem.__super__ = menu_MenuButtonItem;
menu_MenuCheckItem.prototype = $extend(menu_MenuButtonItem.prototype,{
	checked: null
	,__class__: menu_MenuCheckItem
});
var newprojectdialog_Category = function(_name,_element) {
	this.element = _element;
	this.subcategories = new haxe_ds_StringMap();
	this.items = [];
	this.name = _name;
};
$hxClasses["newprojectdialog.Category"] = newprojectdialog_Category;
newprojectdialog_Category.__name__ = ["newprojectdialog","Category"];
newprojectdialog_Category.prototype = {
	element: null
	,items: null
	,subcategories: null
	,position: null
	,name: null
	,parent: null
	,getCategory: function(name) {
		if(!this.subcategories.exists(name)) newprojectdialog_NewProjectDialog.createSubcategory(name,this);
		return this.subcategories.get(name);
	}
	,addItem: function(name,createProjectFunction,showCreateDirectoryOption,nameLocked) {
		if(nameLocked == null) nameLocked = false;
		if(showCreateDirectoryOption == null) showCreateDirectoryOption = true;
		this.items.push(new newprojectdialog_Item(name,createProjectFunction,showCreateDirectoryOption,nameLocked));
		newprojectdialog_NewProjectDialog.loadProjectCategory();
	}
	,getItems: function() {
		var itemNames = [];
		var _g = 0;
		var _g1 = this.items;
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			itemNames.push(item.name);
		}
		return itemNames;
	}
	,select: function(item) {
		newprojectdialog_NewProjectDialog.updateListItems(this,item);
	}
	,getItem: function(name) {
		var currentItem = null;
		var _g = 0;
		var _g1 = this.items;
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			if(name == item.name) currentItem = item;
		}
		return currentItem;
	}
	,setPosition: function(_position) {
		this.position = _position;
	}
	,getElement: function() {
		return this.element;
	}
	,__class__: newprojectdialog_Category
};
var newprojectdialog_Item = function(_name,_createProjectFunction,_showCreateDirectoryOption,_nameLocked) {
	if(_nameLocked == null) _nameLocked = false;
	if(_showCreateDirectoryOption == null) _showCreateDirectoryOption = true;
	this.name = _name;
	this.showCreateDirectoryOption = _showCreateDirectoryOption;
	this.nameLocked = _nameLocked;
	this.createProjectFunction = _createProjectFunction;
};
$hxClasses["newprojectdialog.Item"] = newprojectdialog_Item;
newprojectdialog_Item.__name__ = ["newprojectdialog","Item"];
newprojectdialog_Item.prototype = {
	name: null
	,showCreateDirectoryOption: null
	,nameLocked: null
	,createProjectFunction: null
	,__class__: newprojectdialog_Item
};
var newprojectdialog_NewProjectDialog = function() { };
$hxClasses["newprojectdialog.NewProjectDialog"] = newprojectdialog_NewProjectDialog;
newprojectdialog_NewProjectDialog.__name__ = ["newprojectdialog","NewProjectDialog"];
newprojectdialog_NewProjectDialog.load = function() {
	newprojectdialog_NewProjectDialog.modalDialog = new dialogs_ModalDialog("New Project");
	var button;
	var _this = window.document;
	button = _this.createElement("button");
	button.type = "button";
	button.className = "close";
	button.setAttribute("data-dismiss","modal");
	button.setAttribute("aria-hidden","true");
	button.innerHTML = "&times;";
	newprojectdialog_NewProjectDialog.modalDialog.getHeader().appendChild(button);
	newprojectdialog_NewProjectDialog.textfieldsWithCheckboxes = new haxe_ds_StringMap();
	newprojectdialog_NewProjectDialog.checkboxes = new haxe_ds_StringMap();
	newprojectdialog_NewProjectDialog.createPage1();
	newprojectdialog_NewProjectDialog.modalDialog.getBody().appendChild(newprojectdialog_NewProjectDialog.page1);
	newprojectdialog_NewProjectDialog.createPage2();
	newprojectdialog_NewProjectDialog.page2.style.display = "none";
	newprojectdialog_NewProjectDialog.modalDialog.getBody().appendChild(newprojectdialog_NewProjectDialog.page2);
	var buttonManager = bootstrap_ButtonManager.get();
	newprojectdialog_NewProjectDialog.backButton = buttonManager.createButton("Back",true);
	newprojectdialog_NewProjectDialog.modalDialog.getFooter().appendChild(newprojectdialog_NewProjectDialog.backButton);
	newprojectdialog_NewProjectDialog.nextButton = buttonManager.createButton("Next");
	newprojectdialog_NewProjectDialog.backButton.onclick = function(e) {
		if(newprojectdialog_NewProjectDialog.backButton.className.indexOf("disabled") == -1) newprojectdialog_NewProjectDialog.showPage1();
	};
	newprojectdialog_NewProjectDialog.nextButton.onclick = function(e1) {
		if(newprojectdialog_NewProjectDialog.nextButton.className.indexOf("disabled") == -1) newprojectdialog_NewProjectDialog.showPage2();
	};
	newprojectdialog_NewProjectDialog.modalDialog.getFooter().appendChild(newprojectdialog_NewProjectDialog.nextButton);
	var finishButton = buttonManager.createButton("Finish",false,false,true);
	finishButton.onclick = function(e2) {
		if(newprojectdialog_NewProjectDialog.projectLocation.value == "") {
			newprojectdialog_NewProjectDialog.showPage2();
			newprojectdialog_NewProjectDialog.projectLocation.focus();
			alertify.log("Please specify location for your projects");
		} else if(newprojectdialog_NewProjectDialog.page1.style.display != "none" || newprojectdialog_NewProjectDialog.projectName.value == "") newprojectdialog_NewProjectDialog.generateProjectName(newprojectdialog_NewProjectDialog.createProject); else newprojectdialog_NewProjectDialog.createProject();
	};
	newprojectdialog_NewProjectDialog.modalDialog.getFooter().appendChild(finishButton);
	var cancelButton = buttonManager.createButton("Cancel",false,true);
	newprojectdialog_NewProjectDialog.modalDialog.getFooter().appendChild(cancelButton);
	var location = js_Browser.getLocalStorage().getItem("Location");
	if(location != null) newprojectdialog_NewProjectDialog.projectLocation.value = location;
	newprojectdialog_NewProjectDialog.loadData("Package");
	newprojectdialog_NewProjectDialog.loadData("Company");
	newprojectdialog_NewProjectDialog.loadData("License");
	newprojectdialog_NewProjectDialog.loadData("URL");
	flambeproject_FlambePage.loadData();
	newprojectdialog_NewProjectDialog.loadCheckboxState("Package");
	newprojectdialog_NewProjectDialog.loadCheckboxState("Company");
	newprojectdialog_NewProjectDialog.loadCheckboxState("License");
	newprojectdialog_NewProjectDialog.loadCheckboxState("URL");
	newprojectdialog_NewProjectDialog.loadCheckboxState("CreateDirectory");
	newprojectdialog_NewProjectDialog.lastProjectCategoryPath = js_Browser.getLocalStorage().getItem("lastProject");
};
newprojectdialog_NewProjectDialog.showPage1 = function() {
	$(newprojectdialog_NewProjectDialog.page1).show(300);
	$(newprojectdialog_NewProjectDialog.page2).hide(300);
	newprojectdialog_NewProjectDialog.backButton.className = "btn btn-default disabled";
	newprojectdialog_NewProjectDialog.nextButton.className = "btn btn-default";
};
newprojectdialog_NewProjectDialog.showPage2 = function() {
	newprojectdialog_NewProjectDialog.generateProjectName();
	$(newprojectdialog_NewProjectDialog.page1).hide(300);
	$(newprojectdialog_NewProjectDialog.page2).show(300);
	newprojectdialog_NewProjectDialog.backButton.className = "btn btn-default";
	newprojectdialog_NewProjectDialog.nextButton.className = "btn btn-default disabled";
};
newprojectdialog_NewProjectDialog.getCheckboxData = function(key) {
	var data = "";
	if(newprojectdialog_NewProjectDialog.checkboxes.get(key).checked) data = newprojectdialog_NewProjectDialog.textfieldsWithCheckboxes.get(key).value;
	return data;
};
newprojectdialog_NewProjectDialog.createProject = function() {
	var location = newprojectdialog_NewProjectDialog.projectLocation.value;
	if(location != "" && newprojectdialog_NewProjectDialog.projectName.value != "") js_Node.require("fs").exists(location,function(exists) {
		if(!exists) js_node_Mkdirp.mkdirpSync(location);
		var item = newprojectdialog_NewProjectDialog.selectedCategory.getItem(newprojectdialog_NewProjectDialog.list.value);
		newprojectdialog_NewProjectDialog.saveProjectCategory();
		if(item.createProjectFunction != null) {
			var projectPackage = newprojectdialog_NewProjectDialog.getCheckboxData("Package");
			var projectCompany = newprojectdialog_NewProjectDialog.getCheckboxData("Company");
			var projectLicense = newprojectdialog_NewProjectDialog.getCheckboxData("License");
			var projectURL = newprojectdialog_NewProjectDialog.getCheckboxData("URL");
			var data = { projectName : newprojectdialog_NewProjectDialog.projectName.value, projectLocation : location, projectPackage : projectPackage, projectCompany : projectCompany, projectLicense : projectLicense, projectURL : projectURL, createDirectory : !newprojectdialog_NewProjectDialog.selectedCategory.getItem(newprojectdialog_NewProjectDialog.list.value).showCreateDirectoryOption || newprojectdialog_NewProjectDialog.createDirectoryForProject.checked};
			item.createProjectFunction(data);
			js_Browser.getLocalStorage().setItem("Location",location);
		}
		flambeproject_FlambePage.saveAllData();
		newprojectdialog_NewProjectDialog.saveData("Package");
		newprojectdialog_NewProjectDialog.saveData("Company");
		newprojectdialog_NewProjectDialog.saveData("License");
		newprojectdialog_NewProjectDialog.saveData("URL");
		newprojectdialog_NewProjectDialog.saveCheckboxState("Package");
		newprojectdialog_NewProjectDialog.saveCheckboxState("Company");
		newprojectdialog_NewProjectDialog.saveCheckboxState("License");
		newprojectdialog_NewProjectDialog.saveCheckboxState("URL");
		newprojectdialog_NewProjectDialog.saveCheckboxState("CreateDirectory");
		newprojectdialog_NewProjectDialog.hide();
	});
};
newprojectdialog_NewProjectDialog.saveProjectCategory = function() {
	var fullCategoryPath = "";
	var root = false;
	var parentCategory = newprojectdialog_NewProjectDialog.selectedCategory;
	while(!root) {
		fullCategoryPath = parentCategory.name + "/" + fullCategoryPath;
		if(parentCategory.parent != null) parentCategory = parentCategory.parent; else root = true;
	}
	fullCategoryPath += newprojectdialog_NewProjectDialog.list.value;
	js_Browser.getLocalStorage().setItem("lastProject",fullCategoryPath);
};
newprojectdialog_NewProjectDialog.generateProjectName = function(onGenerated) {
	if(newprojectdialog_NewProjectDialog.selectedCategory.getItem(newprojectdialog_NewProjectDialog.list.value).nameLocked == false) {
		var value = StringTools.replace(newprojectdialog_NewProjectDialog.list.value,"+","p");
		value = StringTools.replace(value,"#","sharp");
		value = StringTools.replace(value," ","");
		newprojectdialog_NewProjectDialog.generateFolderName(newprojectdialog_NewProjectDialog.projectLocation.value,value,1,onGenerated);
	} else {
		newprojectdialog_NewProjectDialog.projectName.value = newprojectdialog_NewProjectDialog.list.value;
		newprojectdialog_NewProjectDialog.updateHelpBlock();
		if(onGenerated != null) onGenerated();
	}
	if(newprojectdialog_NewProjectDialog.selectedCategory.getItem(newprojectdialog_NewProjectDialog.list.value).showCreateDirectoryOption) newprojectdialog_NewProjectDialog.createDirectoryForProject.parentElement.parentElement.style.display = "block"; else newprojectdialog_NewProjectDialog.createDirectoryForProject.parentElement.parentElement.style.display = "none";
	newprojectdialog_NewProjectDialog.projectName.disabled = newprojectdialog_NewProjectDialog.selectedCategory.getItem(newprojectdialog_NewProjectDialog.list.value).nameLocked;
};
newprojectdialog_NewProjectDialog.show = function() {
	if(newprojectdialog_NewProjectDialog.page1.style.display == "none") newprojectdialog_NewProjectDialog.backButton.click();
	if(newprojectdialog_NewProjectDialog.selectedCategory == null && newprojectdialog_NewProjectDialog.categoriesArray.length > 0) newprojectdialog_NewProjectDialog.categoriesArray[0].select(); else newprojectdialog_NewProjectDialog.selectedCategory.select(newprojectdialog_NewProjectDialog.list.value);
	newprojectdialog_NewProjectDialog.modalDialog.show();
};
newprojectdialog_NewProjectDialog.hide = function() {
	newprojectdialog_NewProjectDialog.modalDialog.hide();
};
newprojectdialog_NewProjectDialog.getCategory = function(name,position) {
	var category;
	if(!newprojectdialog_NewProjectDialog.categories.exists(name)) {
		category = newprojectdialog_NewProjectDialog.createCategory(name);
		newprojectdialog_NewProjectDialog.categories.set(name,category);
		category.setPosition(position);
		newprojectdialog_NewProjectDialog.addCategoryToDocument(category);
	} else {
		category = newprojectdialog_NewProjectDialog.categories.get(name);
		if(position != null && category.position != position) {
		}
	}
	if(position != null && category.position != position) {
		category.getElement().remove();
		newprojectdialog_NewProjectDialog.categories.remove(name);
		category.setPosition(position);
		newprojectdialog_NewProjectDialog.addCategoryToDocument(category);
		newprojectdialog_NewProjectDialog.categories.set(name,category);
	}
	return category;
};
newprojectdialog_NewProjectDialog.loadProjectCategory = function() {
	if(newprojectdialog_NewProjectDialog.lastProjectCategoryPath != null) {
		var categoryNames = newprojectdialog_NewProjectDialog.lastProjectCategoryPath.split("/");
		if(newprojectdialog_NewProjectDialog.categories.exists(categoryNames[0])) {
			var category = newprojectdialog_NewProjectDialog.categories.get(categoryNames[0]);
			if(categoryNames.length > 2) {
				var _g1 = 1;
				var _g = categoryNames.length - 1;
				while(_g1 < _g) {
					var i = _g1++;
					if(category.subcategories.exists(categoryNames[i])) {
						category = category.subcategories.get(categoryNames[i]);
						if(Lambda.has(category.getItems(),categoryNames[categoryNames.length - 1])) {
							category.select(categoryNames[categoryNames.length - 1]);
							newprojectdialog_NewProjectDialog.lastProjectCategoryPath = null;
							$(category.element).children("ul.tree").show(300);
						}
					} else break;
				}
			} else if(Lambda.has(category.getItems(),categoryNames[categoryNames.length - 1])) {
				category.select(categoryNames[categoryNames.length - 1]);
				newprojectdialog_NewProjectDialog.lastProjectCategoryPath = null;
				$(category.element).children("ul.tree").show(300);
			}
		}
	}
};
newprojectdialog_NewProjectDialog.addCategoryToDocument = function(category) {
	if(category.position != null && newprojectdialog_NewProjectDialog.categoriesArray.length > 0 && newprojectdialog_NewProjectDialog.tree.childNodes.length > 0) {
		var currentCategory;
		var added = false;
		var _g1 = 0;
		var _g = newprojectdialog_NewProjectDialog.categoriesArray.length;
		while(_g1 < _g) {
			var i = _g1++;
			currentCategory = newprojectdialog_NewProjectDialog.categoriesArray[i];
			if(currentCategory != category && currentCategory.position == null || category.position < currentCategory.position) {
				newprojectdialog_NewProjectDialog.tree.insertBefore(category.getElement(),currentCategory.getElement());
				newprojectdialog_NewProjectDialog.categoriesArray.splice(i,0,category);
				added = true;
				break;
			}
		}
		if(!added) {
			newprojectdialog_NewProjectDialog.tree.appendChild(category.getElement());
			newprojectdialog_NewProjectDialog.categoriesArray.push(category);
		}
	} else {
		newprojectdialog_NewProjectDialog.tree.appendChild(category.getElement());
		newprojectdialog_NewProjectDialog.categoriesArray.push(category);
	}
};
newprojectdialog_NewProjectDialog.generateFolderName = function(path,folder,n,onGenerated) {
	if(path != "" && folder != "") js_Node.require("fs").exists(js_Node.require("path").join(path,folder + (n == null?"null":"" + n)),function(exists) {
		if(exists) newprojectdialog_NewProjectDialog.generateFolderName(path,folder,n + 1,onGenerated); else {
			newprojectdialog_NewProjectDialog.projectName.value = folder + (n == null?"null":"" + n);
			newprojectdialog_NewProjectDialog.updateHelpBlock();
			if(onGenerated != null) onGenerated();
		}
	}); else {
		newprojectdialog_NewProjectDialog.projectName.value = folder + (n == null?"null":"" + n);
		newprojectdialog_NewProjectDialog.updateHelpBlock();
	}
};
newprojectdialog_NewProjectDialog.loadData = function(_text) {
	var text = js_Browser.getLocalStorage().getItem(_text);
	if(text != null) newprojectdialog_NewProjectDialog.textfieldsWithCheckboxes.get(_text).value = text;
};
newprojectdialog_NewProjectDialog.saveData = function(_text) {
	if(newprojectdialog_NewProjectDialog.checkboxes.get(_text).checked) {
		var value = newprojectdialog_NewProjectDialog.textfieldsWithCheckboxes.get(_text).value;
		if(value != "") js_Browser.getLocalStorage().setItem(_text,value);
	}
};
newprojectdialog_NewProjectDialog.loadCheckboxState = function(_text) {
	var text = js_Browser.getLocalStorage().getItem(_text + "Checkbox");
	if(text != null) newprojectdialog_NewProjectDialog.checkboxes.get(_text).checked = js_Node.parse(text);
};
newprojectdialog_NewProjectDialog.saveCheckboxState = function(_text) {
	js_Browser.getLocalStorage().setItem(_text + "Checkbox",js_Node.stringify(newprojectdialog_NewProjectDialog.checkboxes.get(_text).checked));
};
newprojectdialog_NewProjectDialog.createPage1 = function() {
	var _this = window.document;
	newprojectdialog_NewProjectDialog.page1 = _this.createElement("div");
	var well;
	var _this1 = window.document;
	well = _this1.createElement("div");
	well.id = "new-project-dialog-well";
	well.className = "well";
	well.style["float"] = "left";
	well.style.width = "50%";
	well.style.height = "250px";
	well.style.marginBottom = "0";
	newprojectdialog_NewProjectDialog.page1.appendChild(well);
	var _this2 = window.document;
	newprojectdialog_NewProjectDialog.tree = _this2.createElement("ul");
	newprojectdialog_NewProjectDialog.tree.className = "nav nav-list";
	well.appendChild(newprojectdialog_NewProjectDialog.tree);
	newprojectdialog_NewProjectDialog.list = newprojectdialog_NewProjectDialog.createList();
	newprojectdialog_NewProjectDialog.list.style["float"] = "left";
	newprojectdialog_NewProjectDialog.list.style.width = "50%";
	newprojectdialog_NewProjectDialog.list.style.height = "250px";
	newprojectdialog_NewProjectDialog.page1.appendChild(newprojectdialog_NewProjectDialog.list);
	newprojectdialog_NewProjectDialog.page1.appendChild((function($this) {
		var $r;
		var _this3 = window.document;
		$r = _this3.createElement("br");
		return $r;
	}(this)));
	var _this4 = window.document;
	newprojectdialog_NewProjectDialog.description = _this4.createElement("p");
	newprojectdialog_NewProjectDialog.description.style.width = "100%";
	newprojectdialog_NewProjectDialog.description.style.height = "50px";
	newprojectdialog_NewProjectDialog.description.style.overflow = "auto";
	newprojectdialog_NewProjectDialog.description.textContent = watchers_LocaleWatcher.getStringSync("Description");
	newprojectdialog_NewProjectDialog.description.setAttribute("localeString","Description");
	newprojectdialog_NewProjectDialog.page1.appendChild(newprojectdialog_NewProjectDialog.description);
	return newprojectdialog_NewProjectDialog.page1;
};
newprojectdialog_NewProjectDialog.createPage2 = function() {
	var _this = window.document;
	newprojectdialog_NewProjectDialog.page2 = _this.createElement("div");
	newprojectdialog_NewProjectDialog.page2.style.padding = "15px";
	var row;
	var _this1 = window.document;
	row = _this1.createElement("div");
	row.className = "row";
	var _this2 = window.document;
	newprojectdialog_NewProjectDialog.projectName = _this2.createElement("input");
	newprojectdialog_NewProjectDialog.projectName.type = "text";
	newprojectdialog_NewProjectDialog.projectName.className = "form-control";
	newprojectdialog_NewProjectDialog.projectName.placeholder = watchers_LocaleWatcher.getStringSync("Name");
	newprojectdialog_NewProjectDialog.projectName.style.width = "100%";
	row.appendChild(newprojectdialog_NewProjectDialog.projectName);
	newprojectdialog_NewProjectDialog.page2.appendChild(row);
	var _this3 = window.document;
	row = _this3.createElement("div");
	row.className = "row";
	var inputGroup;
	var _this4 = window.document;
	inputGroup = _this4.createElement("div");
	inputGroup.className = "input-group";
	inputGroup.style.display = "inline";
	row.appendChild(inputGroup);
	var _this5 = window.document;
	newprojectdialog_NewProjectDialog.projectLocation = _this5.createElement("input");
	newprojectdialog_NewProjectDialog.projectLocation.type = "text";
	newprojectdialog_NewProjectDialog.projectLocation.className = "form-control";
	newprojectdialog_NewProjectDialog.projectLocation.placeholder = watchers_LocaleWatcher.getStringSync("Location");
	newprojectdialog_NewProjectDialog.projectLocation.style.width = "80%";
	inputGroup.appendChild(newprojectdialog_NewProjectDialog.projectLocation);
	var browseButton;
	var _this6 = window.document;
	browseButton = _this6.createElement("button");
	browseButton.type = "button";
	browseButton.className = "btn btn-default";
	browseButton.textContent = watchers_LocaleWatcher.getStringSync("Browse...");
	browseButton.style.width = "20%";
	browseButton.onclick = function(e) {
		core_FileDialog.openFolder(function(path) {
			newprojectdialog_NewProjectDialog.projectLocation.value = path;
			newprojectdialog_NewProjectDialog.updateHelpBlock();
			js_Browser.getLocalStorage().setItem("Location",path);
		});
	};
	inputGroup.appendChild(browseButton);
	newprojectdialog_NewProjectDialog.page2.appendChild(row);
	newprojectdialog_NewProjectDialog.createTextWithCheckbox(newprojectdialog_NewProjectDialog.page2,"Package");
	newprojectdialog_NewProjectDialog.createTextWithCheckbox(newprojectdialog_NewProjectDialog.page2,"Company");
	newprojectdialog_NewProjectDialog.createTextWithCheckbox(newprojectdialog_NewProjectDialog.page2,"License");
	newprojectdialog_NewProjectDialog.createTextWithCheckbox(newprojectdialog_NewProjectDialog.page2,"URL");
	flambeproject_FlambePage.createPage2(newprojectdialog_NewProjectDialog.page2);
	var _this7 = window.document;
	row = _this7.createElement("div");
	row.className = "row";
	var checkboxDiv;
	var _this8 = window.document;
	checkboxDiv = _this8.createElement("div");
	checkboxDiv.className = "checkbox";
	row.appendChild(checkboxDiv);
	var label;
	var _this9 = window.document;
	label = _this9.createElement("label");
	checkboxDiv.appendChild(label);
	var _this10 = window.document;
	newprojectdialog_NewProjectDialog.createDirectoryForProject = _this10.createElement("input");
	newprojectdialog_NewProjectDialog.createDirectoryForProject.type = "checkbox";
	newprojectdialog_NewProjectDialog.createDirectoryForProject.checked = true;
	label.appendChild(newprojectdialog_NewProjectDialog.createDirectoryForProject);
	newprojectdialog_NewProjectDialog.checkboxes.set("CreateDirectory",newprojectdialog_NewProjectDialog.createDirectoryForProject);
	newprojectdialog_NewProjectDialog.createDirectoryForProject.onchange = function(e1) {
		newprojectdialog_NewProjectDialog.updateHelpBlock();
	};
	label.appendChild(window.document.createTextNode("Create directory for project"));
	newprojectdialog_NewProjectDialog.page2.appendChild(row);
	var _this11 = window.document;
	row = _this11.createElement("div");
	var _this12 = window.document;
	newprojectdialog_NewProjectDialog.helpBlock = _this12.createElement("p");
	newprojectdialog_NewProjectDialog.helpBlock.className = "help-block";
	row.appendChild(newprojectdialog_NewProjectDialog.helpBlock);
	newprojectdialog_NewProjectDialog.projectLocation.onchange = function(e2) {
		newprojectdialog_NewProjectDialog.updateHelpBlock();
		newprojectdialog_NewProjectDialog.generateFolderName(newprojectdialog_NewProjectDialog.projectLocation.value,newprojectdialog_NewProjectDialog.projectName.value,1);
	};
	newprojectdialog_NewProjectDialog.projectName.onchange = function(e3) {
		newprojectdialog_NewProjectDialog.projectName.value = HxOverrides.substr(newprojectdialog_NewProjectDialog.projectName.value,0,1).toUpperCase() + HxOverrides.substr(newprojectdialog_NewProjectDialog.projectName.value,1,null);
		newprojectdialog_NewProjectDialog.updateHelpBlock();
	};
	newprojectdialog_NewProjectDialog.page2.appendChild(row);
	return newprojectdialog_NewProjectDialog.page2;
};
newprojectdialog_NewProjectDialog.updateHelpBlock = function() {
	if(newprojectdialog_NewProjectDialog.projectLocation.value != "") {
		var str = "";
		if((!newprojectdialog_NewProjectDialog.selectedCategory.getItem(newprojectdialog_NewProjectDialog.list.value).showCreateDirectoryOption || newprojectdialog_NewProjectDialog.createDirectoryForProject.checked == true) && newprojectdialog_NewProjectDialog.projectName.value != "") str = newprojectdialog_NewProjectDialog.projectName.value;
		newprojectdialog_NewProjectDialog.helpBlock.innerText = watchers_LocaleWatcher.getStringSync("Project will be created in: ") + js_Node.require("path").join(newprojectdialog_NewProjectDialog.projectLocation.value,str);
	} else newprojectdialog_NewProjectDialog.helpBlock.innerText = "";
};
newprojectdialog_NewProjectDialog.createTextWithCheckbox = function(_page2,_text) {
	var row;
	var _this = window.document;
	row = _this.createElement("div");
	row.className = "row";
	var inputGroup;
	var _this1 = window.document;
	inputGroup = _this1.createElement("div");
	inputGroup.className = "input-group";
	row.appendChild(inputGroup);
	var inputGroupAddon;
	var _this2 = window.document;
	inputGroupAddon = _this2.createElement("span");
	inputGroupAddon.className = "input-group-addon";
	inputGroup.appendChild(inputGroupAddon);
	var checkbox;
	var _this3 = window.document;
	checkbox = _this3.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = true;
	inputGroupAddon.appendChild(checkbox);
	newprojectdialog_NewProjectDialog.checkboxes.set(_text,checkbox);
	var text;
	var _this4 = window.document;
	text = _this4.createElement("input");
	text.type = "text";
	text.className = "form-control";
	text.placeholder = watchers_LocaleWatcher.getStringSync(_text);
	newprojectdialog_NewProjectDialog.textfieldsWithCheckboxes.set(_text,text);
	checkbox.onchange = function(e) {
		if(checkbox.checked) text.disabled = false; else text.disabled = true;
	};
	inputGroup.appendChild(text);
	_page2.appendChild(row);
};
newprojectdialog_NewProjectDialog.createCategory = function(text) {
	var li;
	var _this = window.document;
	li = _this.createElement("li");
	var category = new newprojectdialog_Category(text,li);
	var a;
	var _this1 = window.document;
	a = _this1.createElement("a");
	a.href = "#";
	a.addEventListener("click",function(e) {
		newprojectdialog_NewProjectDialog.updateListItems(category);
	});
	var span;
	var _this2 = window.document;
	span = _this2.createElement("span");
	span.className = "glyphicon glyphicon-folder-open";
	a.appendChild(span);
	var _this3 = window.document;
	span = _this3.createElement("span");
	span.textContent = watchers_LocaleWatcher.getStringSync(text);
	span.setAttribute("localeString",text);
	span.style.marginLeft = "5px";
	a.appendChild(span);
	li.appendChild(a);
	return category;
};
newprojectdialog_NewProjectDialog.createSubcategory = function(text,category) {
	var a;
	a = js_Boot.__cast(category.element.getElementsByTagName("a")[0] , HTMLAnchorElement);
	a.className = "tree-toggler nav-header";
	a.onclick = function(e) {
		$(category.element).children("ul.tree").toggle(300);
	};
	var ul;
	var _this = window.document;
	ul = _this.createElement("ul");
	ul.className = "nav nav-list tree";
	category.element.appendChild(ul);
	category.element.onclick = function(e1) {
		var $it0 = category.subcategories.keys();
		while( $it0.hasNext() ) {
			var subcategory1 = $it0.next();
			ul.appendChild(category.subcategories.get(subcategory1).element);
		}
		e1.stopPropagation();
		e1.preventDefault();
		category.element.onclick = null;
		$(ul).show(300);
	};
	var subcategory = newprojectdialog_NewProjectDialog.createCategory(text);
	subcategory.parent = category;
	category.subcategories.set(text,subcategory);
};
newprojectdialog_NewProjectDialog.updateListItems = function(category,item) {
	newprojectdialog_NewProjectDialog.selectedCategory = category;
	if(newprojectdialog_NewProjectDialog.selectedCategory.name == "Flambe") flambeproject_FlambePage.show(); else flambeproject_FlambePage.hide();
	$(newprojectdialog_NewProjectDialog.list).children().remove();
	newprojectdialog_NewProjectDialog.setListItems(newprojectdialog_NewProjectDialog.list,category.getItems(),item);
	newprojectdialog_NewProjectDialog.checkSelectedOptions();
};
newprojectdialog_NewProjectDialog.createList = function() {
	var select;
	var _this = window.document;
	select = _this.createElement("select");
	select.size = 10;
	select.onchange = function(e) {
		newprojectdialog_NewProjectDialog.checkSelectedOptions();
	};
	select.ondblclick = function(e1) {
		newprojectdialog_NewProjectDialog.showPage2();
	};
	return select;
};
newprojectdialog_NewProjectDialog.checkSelectedOptions = function() {
	if(newprojectdialog_NewProjectDialog.list.selectedOptions.length > 0) {
		var option;
		option = js_Boot.__cast(newprojectdialog_NewProjectDialog.list.selectedOptions[0] , HTMLOptionElement);
	}
};
newprojectdialog_NewProjectDialog.setListItems = function(list,items,selectedItem) {
	var _g = 0;
	while(_g < items.length) {
		var item = items[_g];
		++_g;
		list.appendChild(newprojectdialog_NewProjectDialog.createListItem(item));
	}
	list.selectedIndex = 0;
	newprojectdialog_NewProjectDialog.checkSelectedOptions();
};
newprojectdialog_NewProjectDialog.createListItem = function(text) {
	var option;
	var _this = window.document;
	option = _this.createElement("option");
	option.textContent = watchers_LocaleWatcher.getStringSync(text);
	option.setAttribute("localeString",text);
	option.value = text;
	return option;
};
var nodejs_webkit_App = require("nw.gui").App;
var nodejs_webkit_Clipboard = require("nw.gui").Clipboard;
var nodejs_webkit_Shell = require("nw.gui").Shell;
var openflproject_CreateOpenFLProject = function() { };
$hxClasses["openflproject.CreateOpenFLProject"] = openflproject_CreateOpenFLProject;
openflproject_CreateOpenFLProject.__name__ = ["openflproject","CreateOpenFLProject"];
openflproject_CreateOpenFLProject.createOpenFLProject = function(params,path,onComplete) {
	var processParams = ["run","lime","create"].concat(params);
	var processHelper = core_ProcessHelper.get();
	var pathToHaxelib = core_HaxeHelper.getPathToHaxelib();
	processHelper.runProcess(pathToHaxelib,processParams,path,function(stdout,stderr) {
		if(stdout != "") alertify.log("stdout:\n" + stdout);
		if(stderr != "") alertify.log("stderr:\n" + stderr);
		onComplete();
	},function(code,stdout1,stderr1) {
		alertify.error([pathToHaxelib].concat(processParams).join(" ") + " " + (code == null?"null":"" + code));
		if(stdout1 != "") alertify.error("stdout:\n" + stdout1);
		if(stderr1 != "") alertify.error("stderr:\n" + stderr1);
	});
};
var openflproject_OpenFLProject = function() {
	var _g1 = this;
	newprojectdialog_NewProjectDialog.getCategory("OpenFL",2).addItem("OpenFL Project",$bind(this,this.createOpenFLProject),false);
	newprojectdialog_NewProjectDialog.getCategory("OpenFL").addItem("OpenFL Extension",$bind(this,this.createOpenFLExtension),false);
	var samples = ["ActuateExample","AddingAnimation","AddingText","DisplayingABitmap","HandlingKeyboardEvents","HandlingMouseEvent","HerokuShaders","PiratePig","PlayingSound","SimpleBox2D","SimpleOpenGLView"];
	var _g = 0;
	while(_g < samples.length) {
		var sample = samples[_g];
		++_g;
		newprojectdialog_NewProjectDialog.getCategory("OpenFL").getCategory("Samples").addItem(sample,function(data) {
			_g1.createOpenFLProject(data,true);
		},false,true);
	}
};
$hxClasses["openflproject.OpenFLProject"] = openflproject_OpenFLProject;
openflproject_OpenFLProject.__name__ = ["openflproject","OpenFLProject"];
openflproject_OpenFLProject.get = function() {
	if(openflproject_OpenFLProject.instance == null) openflproject_OpenFLProject.instance = new openflproject_OpenFLProject();
	return openflproject_OpenFLProject.instance;
};
openflproject_OpenFLProject.prototype = {
	createOpenFLProject: function(data,sample) {
		if(sample == null) sample = false;
		var _g = this;
		var params;
		if(!sample) {
			var str = "";
			if(data.projectPackage != "") str = data.projectPackage + ".";
			params = ["openfl:project","\"" + str + data.projectName + "\""];
		} else params = ["openfl:" + data.projectName];
		openflproject_CreateOpenFLProject.createOpenFLProject(params,data.projectLocation,function() {
			var pathToProject = js_Node.require("path").join(data.projectLocation,data.projectName);
			_g.createProject(data);
			var tabManagerInstance = tabmanager_TabManager.get();
			tabManagerInstance.openFileInNewTab(js_Node.require("path").join(pathToProject,"Source","Main.hx"));
		});
	}
	,createOpenFLExtension: function(data) {
		var _g = this;
		openflproject_CreateOpenFLProject.createOpenFLProject(["extension",data.projectName],data.projectLocation,function() {
			_g.createProject(data);
		});
	}
	,createProject: function(data) {
		var pathToProject = js_Node.require("path").join(data.projectLocation,data.projectName);
		var project = new projectaccess_Project();
		project.name = data.projectName;
		project.projectPackage = data.projectPackage;
		project.company = data.projectCompany;
		project.license = data.projectLicense;
		project.url = data.projectURL;
		project.type = 1;
		project.openFLTarget = "flash";
		projectaccess_ProjectAccess.path = pathToProject;
		project.buildActionCommand = ["haxelib","run","lime","build","\"%path%\"",project.openFLTarget,"--connect","5000"].join(" ");
		project.runActionType = 2;
		project.runActionText = ["haxelib","run","lime","run","\"%path%\"",project.openFLTarget].join(" ");
		projectaccess_ProjectAccess.currentProject = project;
	}
	,__class__: openflproject_OpenFLProject
};
var openflproject_OpenFLTools = function() { };
$hxClasses["openflproject.OpenFLTools"] = openflproject_OpenFLTools;
openflproject_OpenFLTools.__name__ = ["openflproject","OpenFLTools"];
openflproject_OpenFLTools.getParams = function(path,target,onLoaded) {
	var processHelper = core_ProcessHelper.get();
	processHelper.runProcess(core_HaxeHelper.getPathToHaxelib(),["run","lime","display",target,"-nocolor"],path,function(stdout,stderr) {
		if(onLoaded != null) onLoaded(stdout);
		openflproject_OpenFLTools.printStderr(stderr);
	},function(code,stdout1,stderr1) {
		alertify.error("OpenFL tools error. OpenFL may be not installed. Please update OpenFL.(haxelib upgrade)");
		alertify.error("OpenFL tools process exit code " + code);
		openflproject_OpenFLTools.printStderr(stdout1);
		openflproject_OpenFLTools.printStderr(stderr1);
	});
};
openflproject_OpenFLTools.printStderr = function(stderr) {
	if(stderr != "") alertify.error("OpenFL tools stderr: " + stderr,15000);
};
var openproject_OpenFL = function() { };
$hxClasses["openproject.OpenFL"] = openproject_OpenFL;
openproject_OpenFL.__name__ = ["openproject","OpenFL"];
openproject_OpenFL.open = function(path) {
	var pathToProject = js_Node.require("path").dirname(path);
	var project = new projectaccess_Project();
	var pos = pathToProject.lastIndexOf(js_Node.require("path").sep);
	project.name = HxOverrides.substr(pathToProject,pos,null);
	project.type = 1;
	project.openFLTarget = "flash";
	project.openFLBuildMode = "Debug";
	projectaccess_ProjectAccess.path = pathToProject;
	project.buildActionCommand = ["haxelib","run","lime","build","\"%path%\"",project.openFLTarget,"--connect","5000"].join(" ");
	project.runActionType = 2;
	project.runActionText = ["haxelib","run","lime","run","\"%path%\"",project.openFLTarget].join(" ");
	var pathToProjectHide = js_Node.require("path").join(pathToProject,"project.hide");
	projectaccess_ProjectAccess.currentProject = project;
	var projectOptions = projectaccess_ProjectOptions.get();
	var splitter = core_Splitter.get();
	var fileTree = filetree_FileTree.get();
	var recentProjectsList = core_RecentProjectsList.get();
	projectOptions.updateProjectOptions();
	projectaccess_ProjectAccess.save((function(f,a1,a2) {
		return function() {
			f(a1,a2);
		};
	})($bind(fileTree,fileTree.load),project.name,pathToProject));
	splitter.show();
	js_Browser.getLocalStorage().setItem("pathToLastProject",pathToProjectHide);
	recentProjectsList.add(pathToProjectHide);
};
openproject_OpenFL.parseOpenFLDisplayParameters = function(pathToProject,target,onComplete) {
	openflproject_OpenFLTools.getParams(pathToProject,target,function(stdout) {
		var args = [];
		var currentLine;
		var _g = 0;
		var _g1 = stdout.split("\n");
		while(_g < _g1.length) {
			var line = _g1[_g];
			++_g;
			currentLine = StringTools.trim(line);
			if(!StringTools.startsWith(currentLine,"#")) args.push(currentLine);
		}
		onComplete(args);
	});
};
var openproject_OpenProject = function() { };
$hxClasses["openproject.OpenProject"] = openproject_OpenProject;
openproject_OpenProject.__name__ = ["openproject","OpenProject"];
openproject_OpenProject.openProject = function(pathToProject,project) {
	if(project == null) project = false;
	var success = true;
	if(pathToProject == null) {
		if(project) core_FileDialog.openFile(openproject_OpenProject.parseProject,".hide,.lime,.xml,.hxml"); else core_FileDialog.openFile(openproject_OpenProject.parseProject);
	} else {
		var isDir = js_Node.require("fs").lstatSync(pathToProject).isDirectory();
		if(isDir) {
			var directoryContents = js_Node.require("fs").readdirSync(pathToProject);
			var hasProjectFile = HxOverrides.indexOf(directoryContents,"project.hide",0) != -1;
			success = hasProjectFile;
			if(hasProjectFile) {
				var pathToProjectFile = js_Node.require("path").join(pathToProject,"project.hide");
				openproject_OpenProject.openProject(pathToProject);
			}
		} else openproject_OpenProject.checkIfFileExists(pathToProject);
	}
	return success;
};
openproject_OpenProject.checkIfFileExists = function(path) {
	js_Node.require("fs").exists(path,function(exists) {
		if(exists) openproject_OpenProject.parseProject(path); else haxe_Log.trace("previously opened project: " + path + " was not found",{ fileName : "OpenProject.hx", lineNumber : 84, className : "openproject.OpenProject", methodName : "checkIfFileExists"});
	});
};
openproject_OpenProject.parseProject = function(path) {
	flambeproject_FlambeHeaderMenu.get().destroy();
	tools_gradle_GradleTool.get().destroy();
	haxe_Log.trace("open: " + path,{ fileName : "OpenProject.hx", lineNumber : 94, className : "openproject.OpenProject", methodName : "parseProject"});
	var filename = js_Node.require("path").basename(path);
	var outlinePanel = core_OutlinePanel.get();
	var tabManagerInstance = tabmanager_TabManager.get();
	var fileTree = filetree_FileTree.get();
	var projectOptions = projectaccess_ProjectOptions.get();
	var recentProjectsList = core_RecentProjectsList.get();
	var splitter = core_Splitter.get();
	switch(filename) {
	case "project.hide":
		openproject_OpenProject.closeProject(true);
		outlinePanel.clearFields();
		outlinePanel.update();
		var options = { };
		options.encoding = "utf8";
		js_Node.require("fs").readFile(path,options,function(error,data) {
			var pathToProject = js_Node.require("path").dirname(path);
			projectaccess_ProjectAccess.currentProject = openproject_OpenProject.parseProjectData(data);
			projectaccess_ProjectAccess.path = pathToProject;
			var project = projectaccess_ProjectAccess.currentProject;
			var classpathWalker = parser_ClasspathWalker.get();
			classpathWalker.parseProjectArguments();
			var loadedFilesCount = 0;
			var totalFilesCount;
			if(project.files == null) project.files = []; else {
				totalFilesCount = project.files.length;
				var _g = 0;
				while(_g < totalFilesCount) {
					var i = _g++;
					if(typeof(project.files[i]) == "string") project.files[i] = { path : project.files[i]};
				}
				var _g1 = 0;
				var _g11 = project.files;
				while(_g1 < _g11.length) {
					var file = _g11[_g1];
					++_g1;
					var fullPath = [js_Node.require("path").join(pathToProject,file.path)];
					js_Node.require("fs").exists(fullPath[0],(function(fullPath) {
						return function(exists) {
							if(exists) tabManagerInstance.openFileInNewTab(fullPath[0],false,(function() {
								return function() {
									loadedFilesCount++;
									if(loadedFilesCount == totalFilesCount) {
										var activeFile = project.activeFile;
										if(activeFile != null) {
											var fullPathToActiveFile = js_Node.require("path").join(pathToProject,activeFile);
											js_Node.require("fs").exists(fullPathToActiveFile,(function() {
												return function(exists1) {
													if(exists1) {
														haxe_Log.trace(fullPathToActiveFile,{ fileName : "OpenProject.hx", lineNumber : 172, className : "openproject.OpenProject", methodName : "parseProject"});
														tabManagerInstance.selectDoc(fullPathToActiveFile);
														cm_Editor.editor.focus();
													}
												};
											})());
										}
									}
									openproject_OpenProject.onOpenPeojectComplete();
								};
							})());
						};
					})(fullPath));
				}
			}
			if(project.hiddenItems == null) project.hiddenItems = [];
			if(project.showHiddenItems == null) project.showHiddenItems = false;
			if(project.type == 1) {
				if(project.openFLBuildMode == null) project.openFLBuildMode = "Debug";
			}
			if(project.type == 3) flambeproject_FlambeHeaderMenu.get().create(); else flambeproject_FlambeHeaderMenu.get().destroy();
			projectOptions.updateProjectOptions();
			fileTree.load(project.name,pathToProject);
			splitter.show();
			js_Browser.getLocalStorage().setItem("pathToLastProject",path);
			recentProjectsList.add(path);
		});
		break;
	default:
		var extension = js_Node.require("path").extname(filename);
		switch(extension) {
		case ".hxml":
			openproject_OpenProject.closeProject(true);
			outlinePanel.clearFields();
			outlinePanel.update();
			var pathToProject1 = js_Node.require("path").dirname(path);
			var project1 = new projectaccess_Project();
			var pos = pathToProject1.lastIndexOf(js_Node.require("path").sep);
			project1.name = HxOverrides.substr(pathToProject1,pos,null);
			project1.type = 2;
			projectaccess_ProjectAccess.path = pathToProject1;
			project1.main = js_Node.require("path").basename(path);
			projectaccess_ProjectAccess.currentProject = project1;
			projectOptions.updateProjectOptions();
			var pathToProjectHide = js_Node.require("path").join(pathToProject1,"project.hide");
			projectaccess_ProjectAccess.save(function() {
				fileTree.load(project1.name,pathToProject1);
			});
			splitter.show();
			js_Browser.getLocalStorage().setItem("pathToLastProject",pathToProjectHide);
			recentProjectsList.add(pathToProjectHide);
			break;
		case ".lime":case ".xml":
			openproject_OpenProject.closeProject(true);
			outlinePanel.clearFields();
			outlinePanel.update();
			var options1 = { };
			options1.encoding = "utf8";
			js_Node.require("fs").readFile(path,options1,function(error1,data1) {
				if(error1 == null) {
					var xml = Xml.parse(data1);
					var fast = new haxe_xml_Fast(xml);
					if(fast.hasNode.resolve("project")) openproject_OpenFL.open(path); else alertify.error("This is not an OpenFL project. OpenFL project xml should have 'project' node");
				} else {
					haxe_Log.trace(error1,{ fileName : "OpenProject.hx", lineNumber : 285, className : "openproject.OpenProject", methodName : "parseProject"});
					alertify.error("Can't open file: " + path + "\n" + error1);
				}
			});
			break;
		default:
		}
		tabManagerInstance.openFileInNewTab(path,true,openproject_OpenProject.onOpenPeojectComplete);
	}
};
openproject_OpenProject.onOpenPeojectComplete = function() {
	tools_gradle_GradleTool.get().searchBuildFile();
};
openproject_OpenProject.searchForLastProject = function() {
	var pathToLastProject = js_Browser.getLocalStorage().getItem("pathToLastProject");
	if(pathToLastProject != null) openproject_OpenProject.openProject(pathToLastProject);
};
openproject_OpenProject.closeProject = function(sync) {
	if(sync == null) sync = false;
	var tabManagerInstance = tabmanager_TabManager.get();
	var processHelper = core_ProcessHelper.get();
	if(projectaccess_ProjectAccess.path != null) {
		projectaccess_ProjectAccess.save(openproject_OpenProject.updateProjectData,sync);
		tabManagerInstance.closeAll();
		processHelper.clearErrors();
	} else openproject_OpenProject.updateProjectData();
};
openproject_OpenProject.updateProjectData = function() {
	var splitter = core_Splitter.get();
	projectaccess_ProjectAccess.path = null;
	projectaccess_ProjectAccess.currentProject = null;
	splitter.hide();
	js_Browser.getLocalStorage().removeItem("pathToLastProject");
};
openproject_OpenProject.parseProjectData = function(data) {
	var project = null;
	try {
		project = tjson_TJSON.parse(data);
	} catch( unknown ) {
		if (unknown instanceof js__$Boot_HaxeError) unknown = unknown.val;
		haxe_Log.trace(unknown,{ fileName : "OpenProject.hx", lineNumber : 351, className : "openproject.OpenProject", methodName : "parseProjectData"});
		haxe_Log.trace(data,{ fileName : "OpenProject.hx", lineNumber : 352, className : "openproject.OpenProject", methodName : "parseProjectData"});
		project = js_Node.parse(data);
	}
	return project;
};
var outline_OutlineFormatter = function(treeItemFormats) {
	var outlineItems = $("#outline").jqxTree("getItems");
	var li;
	var item;
	var itemType;
	var item1;
	var _g1 = 0;
	var _g = outlineItems.length;
	while(_g1 < _g) {
		var i = _g1++;
		item1 = outlineItems[i];
		if(i == 0) continue;
		li = js_Boot.__cast(item1.element , HTMLLIElement);
		itemType = treeItemFormats.shift();
		var _g2 = itemType.type;
		switch(_g2) {
		case "enumGroup":
			li.classList.add("outlineEnumGroup");
			break;
		case "class":
			li.classList.add("outlineClass");
			break;
		case "typedef":
			li.classList.add("outlineTypeDef");
			break;
		}
		if(itemType.type == "var" || itemType.type == "function" || itemType.type == "enum") {
			li.classList.add("outlineField");
			var element = window.document.createElement("div");
			li.insertBefore(element,li.firstChild);
			if(!itemType.isPublic) element.classList.add("outlinePrivate"); else {
				element.innerHTML = "&#8226;";
				element.classList.add("outlinePublic");
			}
			element = window.document.createElement("div");
			li.insertBefore(element,li.firstChild);
			var _g21 = itemType.type;
			switch(_g21) {
			case "enum":
				element.classList.add("outlineEnum");
				element.innerHTML = "E";
				break;
			case "var":
				element.classList.add("outlineVar");
				element.innerHTML = "V";
				break;
			case "function":
				element.classList.add("outlineFunction");
				element.innerHTML = "M";
				break;
			}
			element = window.document.createElement("div");
			li.insertBefore(element,li.firstChild);
			if(itemType.isStatic) {
				element.innerHTML = "&#8226;";
				element.classList.add("outlineStatic");
			} else element.classList.add("outlineNotStatic");
		}
	}
};
$hxClasses["outline.OutlineFormatter"] = outline_OutlineFormatter;
outline_OutlineFormatter.__name__ = ["outline","OutlineFormatter"];
outline_OutlineFormatter.prototype = {
	__class__: outline_OutlineFormatter
};
var outline_OutlineItem = function(name,type,pos,len) {
	this.name = name;
	this.type = type;
	this.pos = pos;
	this.len = len;
	this.fields = [];
};
$hxClasses["outline.OutlineItem"] = outline_OutlineItem;
outline_OutlineItem.__name__ = ["outline","OutlineItem"];
outline_OutlineItem.prototype = {
	name: null
	,type: null
	,pos: null
	,len: null
	,fields: null
	,__class__: outline_OutlineItem
};
var outline_OutlineField = function(name,type,pos,len,isPublic,isStatic) {
	this.name = name;
	this.type = type;
	this.pos = pos;
	this.len = len;
	this.isPublic = isPublic;
	this.isStatic = isStatic;
};
$hxClasses["outline.OutlineField"] = outline_OutlineField;
outline_OutlineField.__name__ = ["outline","OutlineField"];
outline_OutlineField.prototype = {
	name: null
	,type: null
	,pos: null
	,len: null
	,isPublic: null
	,isStatic: null
	,__class__: outline_OutlineField
};
var outline_OutlineParser = function() {
};
$hxClasses["outline.OutlineParser"] = outline_OutlineParser;
outline_OutlineParser.__name__ = ["outline","OutlineParser"];
outline_OutlineParser.prototype = {
	parse: function(data,path) {
		var outlineItems = [];
		var enumIndexs = [];
		var types = parser_RegexParser.getTypeDeclarations(data);
		var outlineItem;
		var _g = 0;
		while(_g < types.length) {
			var typeInfo = types[_g];
			++_g;
			outlineItem = new outline_OutlineItem(typeInfo.name,typeInfo.type,typeInfo.pos.pos,typeInfo.pos.len);
			outlineItems.push(outlineItem);
			if(typeInfo.type == "enum") enumIndexs.push(outlineItems.length - 1);
		}
		var _g1 = 0;
		while(_g1 < enumIndexs.length) {
			var enumIndex = [enumIndexs[_g1]];
			++_g1;
			var enumBlock;
			if(outlineItems.length - 1 == enumIndex[0]) enumBlock = data.substring(outlineItems[enumIndex[0]].pos); else enumBlock = data.substring(outlineItems[enumIndex[0]].pos,outlineItems[enumIndex[0] + 1].pos);
			var regEx1 = [new EReg("([A-Za-z0-9_]+);","gm")];
			regEx1[0].map(enumBlock,(function(regEx1,enumIndex) {
				return function(ereg2) {
					var pos = regEx1[0].matchedPos();
					outlineItems[enumIndex[0]].fields.push(new outline_OutlineField(regEx1[0].matched(1),"enum",pos.pos,pos.len));
					return "";
				};
			})(regEx1,enumIndex));
		}
		var methods = this.getFunctionDeclarations(data);
		var methodFields = [];
		var _g2 = 0;
		while(_g2 < methods.length) {
			var methodInfo = methods[_g2];
			++_g2;
			methodFields.push(new outline_OutlineField(methodInfo.name + " (" + methodInfo.params.toString() + ")","function",methodInfo.pos.pos,methodInfo.pos.len,methodInfo.isPublic,methodInfo.isStatic));
		}
		var vars = this.getVariableDeclarations(data);
		var methodIndex = 0;
		var varInfo;
		var varIndex;
		var removedVarCount = 0;
		var hasRemovedVar;
		var varFields = [];
		var _g11 = 0;
		var _g3 = vars.length;
		while(_g11 < _g3) {
			var i = _g11++;
			varIndex = i - removedVarCount;
			varInfo = vars[varIndex];
			hasRemovedVar = false;
			var _g31 = 0;
			var _g21 = methods.length;
			while(_g31 < _g21) {
				var methodIndex1 = _g31++;
				if(varInfo.pos.pos > methods[methodIndex1].pos.pos && varInfo.pos.pos < methods[methodIndex1].endPos) {
					vars.splice(varIndex,1);
					removedVarCount++;
					hasRemovedVar = true;
					break;
				}
			}
			if(hasRemovedVar) continue;
			var typeString = "";
			if(varInfo.type != "") typeString = " : " + varInfo.type;
			varFields.push(new outline_OutlineField(varInfo.name + typeString,"var",varInfo.pos.pos,varInfo.pos.len,varInfo.isPublic,varInfo.isStatic));
		}
		var parentIndex = 0;
		var fieldInfo;
		var usingSmartSort = core_OutlinePanel.get().useSorting;
		if(usingSmartSort) {
			var nameA;
			var nameB;
			var sortFunction = function(a,b) {
				nameA = a.name.toLowerCase();
				nameB = b.name.toLowerCase();
				if(nameA < nameB) return -1;
				if(nameA > nameB) return 1;
				return 0;
			};
			varFields.sort(sortFunction);
			methodFields.sort(sortFunction);
		}
		while(varFields.length != 0 || methodFields.length != 0) {
			if(usingSmartSort) {
				if(varFields.length != 0) {
					fieldInfo = varFields.shift();
					if(varFields.length == 0) {
						parentIndex = 0;
						haxe_Log.trace("length == 0",{ fileName : "OutlineParser.hx", lineNumber : 220, className : "outline.OutlineParser", methodName : "parse"});
					}
				} else fieldInfo = methodFields.shift();
				parentIndex = 0;
			} else {
				if(varFields.length == 0) fieldInfo = methodFields.shift(); else if(methodFields.length == 0) fieldInfo = varFields.shift(); else if(varFields[0].pos < methodFields[0].pos) fieldInfo = varFields.shift(); else fieldInfo = methodFields.shift();
				parentIndex = 0;
			}
			while(parentIndex + 1 < outlineItems.length && fieldInfo.pos > outlineItems[parentIndex + 1].pos) parentIndex++;
			outlineItems[parentIndex].fields.push(fieldInfo);
		}
		return outlineItems;
	}
	,getVariableDeclarations: function(data) {
		var variableDeclarations = [];
		var eregVariables = new EReg("(static)?\\s?(public)?\\s?var +([a-z_0-9]+):?([^=;]+)?","gi");
		eregVariables.map(data,function(ereg2) {
			var pos = ereg2.matchedPos();
			var index = pos.pos + pos.len;
			var isStatic = ereg2.matched(1) == "static";
			var isPublic = ereg2.matched(2) == "public";
			var name = ereg2.matched(3);
			var type = ereg2.matched(4);
			var varDecl1 = { name : name, pos : pos, type : "", params : null, isPublic : isPublic, isStatic : isStatic};
			if(type != null) {
				type = StringTools.trim(type);
				if(type != "") varDecl1.type = type;
			}
			variableDeclarations.push(varDecl1);
			return "";
		});
		return variableDeclarations;
	}
	,getFunctionDeclarations: function(data) {
		var functionDeclarations = [];
		var eregFunctionWithParameters = new EReg("(static)?\\s?(public)?\\s?function *([a-zA-Z0-9_]*) *\\(([^\\)]*)","gm");
		eregFunctionWithParameters.map(data,function(ereg2) {
			var pos = ereg2.matchedPos();
			var isStatic = ereg2.matched(1) == "static";
			var isPublic = ereg2.matched(2) == "public";
			var name = ereg2.matched(3);
			if(name != "") {
				var params = null;
				var str = ereg2.matched(4);
				if(str != null) params = str.split(",");
				var functionBody = HxOverrides.substr(data,pos.pos + pos.len,null);
				var leftBraces = functionBody.split("{");
				var functionBodyLength = leftBraces[0].length + 1;
				var unClosedBraces = 0;
				var leftBrace;
				var rightBrace;
				var _g1 = 1;
				var _g = leftBraces.length;
				while(_g1 < _g) {
					var i = _g1++;
					leftBrace = leftBraces[i];
					unClosedBraces++;
					var rightBraces = leftBrace.split("}");
					if(rightBraces.length == 1) {
						functionBodyLength += rightBraces[0].length;
						continue;
					}
					var _g3 = 0;
					var _g2 = rightBraces.length;
					while(_g3 < _g2) {
						var j = _g3++;
						rightBrace = rightBraces[j];
						if(j != 0) unClosedBraces--;
						if(unClosedBraces == 0) break; else functionBodyLength += rightBrace.length;
					}
					if(unClosedBraces == 0) break;
				}
				functionDeclarations.push({ name : name, params : params, pos : pos, type : "", isPublic : isPublic, isStatic : isStatic, endPos : pos.pos + pos.len + functionBodyLength});
			}
			return "";
		});
		return functionDeclarations;
	}
	,__class__: outline_OutlineParser
};
var parser_ClassParser = function() { };
$hxClasses["parser.ClassParser"] = parser_ClassParser;
parser_ClassParser.__name__ = ["parser","ClassParser"];
parser_ClassParser.parse = function(data,path) {
	var input = byte_js__$ByteData_ByteData_$Impl_$.ofString(data);
	var parser1 = new haxeparser_HaxeParser(input,path);
	var ast = null;
	try {
		ast = parser1.parse();
	} catch( $e0 ) {
		if ($e0 instanceof js__$Boot_HaxeError) $e0 = $e0.val;
		if( js_Boot.__instanceof($e0,hxparse_NoMatch) ) {
			var e = $e0;
		} else if( js_Boot.__instanceof($e0,hxparse_Unexpected) ) {
			var e1 = $e0;
		} else {
		var e2 = $e0;
		}
	}
	return ast;
};
parser_ClassParser.processFile = function(data,path,std) {
	var ast = parser_ClassParser.parse(data,path);
	var mainClass = js_Node.require("path").basename(path,".hx");
	if(ast != null) parser_ClassParser.parseDeclarations(ast,mainClass,std); else {
		var filePackage = parser_RegexParser.getFilePackage(data);
		var typeDeclarations = parser_RegexParser.getTypeDeclarations(data);
		var packages;
		if(filePackage.filePackage != null) packages = filePackage.filePackage.split("."); else packages = [];
		var _g = 0;
		while(_g < typeDeclarations.length) {
			var item = typeDeclarations[_g];
			++_g;
			var className = parser_ClassParser.resolveClassName(packages,mainClass,item.name);
			parser_ClassParser.addClassName(className,std);
		}
	}
};
parser_ClassParser.parseDeclarations = function(ast,mainClass,std) {
	var _g = 0;
	var _g1 = ast.decls;
	while(_g < _g1.length) {
		var decl = _g1[_g];
		++_g;
		{
			var _g2 = decl.decl;
			switch(_g2[1]) {
			case 3:
				var mode = _g2[3];
				var sl = _g2[2];
				break;
			case 5:
				var path = _g2[2];
				break;
			case 2:
				var data = _g2[2];
				var className = parser_ClassParser.resolveClassName(ast.pack,mainClass,data.name);
				parser_ClassParser.addClassName(className,std);
				break;
			case 0:
				var data1 = _g2[2];
				var className1 = parser_ClassParser.resolveClassName(ast.pack,mainClass,data1.name);
				parser_ClassParser.processClass(className1,data1);
				parser_ClassParser.addClassName(className1,std);
				break;
			case 1:
				var data2 = _g2[2];
				var className2 = parser_ClassParser.resolveClassName(ast.pack,mainClass,data2.name);
				parser_ClassParser.addClassName(className2,std);
				break;
			case 4:
				var data3 = _g2[2];
				var className3 = parser_ClassParser.resolveClassName(ast.pack,mainClass,data3.name);
				parser_ClassParser.addClassName(className3,std);
				break;
			}
		}
	}
};
parser_ClassParser.processClass = function(className,type) {
	var completions = [];
	var _g1 = 0;
	var _g = type.data.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(parser_ClassParser.getScope(type.data[i])) completions.push(type.data[i].name);
	}
	if(completions.length > 0) parser_ClassParser.classCompletions.set(className,{ fields : completions});
};
parser_ClassParser.getScope = function(field) {
	var isPublic = false;
	var access = field.access;
	var _g = 0;
	while(_g < access.length) {
		var accessType = access[_g];
		++_g;
		switch(accessType[1]) {
		case 0:
			isPublic = true;
			break;
		case 2:
			break;
		case 6:
			break;
		case 5:
			break;
		case 4:
			break;
		case 3:
			break;
		case 1:
			break;
		}
	}
	return isPublic;
};
parser_ClassParser.resolveClassName = function(pack,mainClass,name) {
	var classPackage = pack.slice();
	if(name == mainClass) classPackage.push(name); else {
		classPackage.push(mainClass);
		classPackage.push(name);
	}
	var className = classPackage.join(".");
	return className;
};
parser_ClassParser.addClassName = function(name,std) {
	var list;
	if(name.indexOf(".") == -1) {
		if(std) list = parser_ClassParser.haxeStdTopLevelClassList; else list = parser_ClassParser.topLevelClassList;
		if(HxOverrides.indexOf(list,name,0) == -1) list.push(name);
	} else {
		if(std) list = parser_ClassParser.haxeStdImports; else list = parser_ClassParser.importsList;
		if(HxOverrides.indexOf(list,name,0) == -1) list.push(name);
	}
};
var parser_ClasspathWalker = function() {
};
$hxClasses["parser.ClasspathWalker"] = parser_ClasspathWalker;
parser_ClasspathWalker.__name__ = ["parser","ClasspathWalker"];
parser_ClasspathWalker.get = function() {
	if(parser_ClasspathWalker.instance == null) parser_ClasspathWalker.instance = new parser_ClasspathWalker();
	return parser_ClasspathWalker.instance;
};
parser_ClasspathWalker.prototype = {
	pathToHaxeStd: null
	,pathToHaxe: null
	,load: function() {
		var localStorage2 = js_Browser.getLocalStorage();
		var pathToHaxe2 = js_Node.process.env.HAXE_STD_PATH;
		if(pathToHaxe2 != null) pathToHaxe2 = js_Node.require("path").dirname(pathToHaxe2);
		var paths = [js_Node.process.env.HAXEPATH,pathToHaxe2,js_Node.process.env.HAXE_HOME];
		if(localStorage2 != null) {
			var path = localStorage2.getItem("pathToHaxe");
			paths.splice(0,0,path);
		}
		var _g = core_Utils.os;
		switch(_g) {
		case 0:
			paths.push("C:/HaxeToolkit/haxe");
			break;
		case 1:case 2:
			paths.push("/usr/lib/haxe");
			break;
		default:
		}
		var _g1 = 0;
		while(_g1 < paths.length) {
			var envVar = paths[_g1];
			++_g1;
			if(envVar != null) {
				this.pathToHaxeStd = this.getHaxeStdFolder(envVar);
				if(this.pathToHaxeStd != null) {
					this.pathToHaxe = envVar;
					localStorage2.setItem("pathToHaxe",this.pathToHaxe);
					core_HaxeHelper.updatePathToHaxe();
					break;
				}
			}
		}
		if(this.pathToHaxeStd == null) this.showHaxeDirectoryDialog(); else this.parseClasspath(this.pathToHaxeStd,true);
	}
	,showHaxeDirectoryDialog: function() {
		var _g = this;
		var localStorage2 = js_Browser.getLocalStorage();
		var currentLocation = "";
		var pathToHaxe2 = localStorage2.getItem("pathToHaxe");
		if(pathToHaxe2 != null) currentLocation = pathToHaxe2;
		dialogs_DialogManager.showBrowseFolderDialog("Please specify path to Haxe compiler(parent folder of std): ",function(path) {
			_g.pathToHaxeStd = _g.getHaxeStdFolder(path);
			if(_g.pathToHaxeStd != null) {
				_g.parseClasspath(_g.pathToHaxeStd,true);
				_g.pathToHaxe = path;
				localStorage2.setItem("pathToHaxe",_g.pathToHaxe);
				core_HaxeHelper.updatePathToHaxe();
				dialogs_DialogManager.hide();
			} else alertify.error(watchers_LocaleWatcher.getStringSync("Can't find 'std' folder in specified path"));
		},currentLocation,"Download Haxe","http://haxe.org/download");
	}
	,getHaxeStdFolder: function(path) {
		var pathToStd = null;
		var fileName = "haxe";
		var _g = core_Utils.os;
		switch(_g) {
		case 0:
			fileName += ".exe";
			break;
		default:
		}
		if(js_Node.require("fs").existsSync(path)) {
			if(js_Node.require("fs").existsSync(js_Node.require("path").join(path,fileName))) {
				path = js_Node.require("path").join(path,"std");
				if(js_Node.require("fs").existsSync(path)) pathToStd = path;
			}
		}
		return pathToStd;
	}
	,getProjectClasspaths: function(project,onComplete) {
		var _g1 = this;
		var classpathsAndLibs = null;
		var _g = project.type;
		switch(_g) {
		case 0:case 2:
			var path;
			if(project.type == 0) path = js_Node.require("path").join(projectaccess_ProjectAccess.path,project.targetData[project.target].pathToHxml); else path = js_Node.require("path").join(projectaccess_ProjectAccess.path,project.main);
			var options = { };
			options.encoding = "utf8";
			var data = js_Node.require("fs").readFileSync(path,options);
			classpathsAndLibs = this.getClasspaths(data.split("\n"));
			this.processHaxelibs(classpathsAndLibs.libs,function(libs) {
				var classpathsAndLibs2 = { classpaths : classpathsAndLibs.classpaths, libs : libs};
				onComplete(classpathsAndLibs2);
			});
			break;
		case 1:
			openflproject_OpenFLTools.getParams(projectaccess_ProjectAccess.path,project.openFLTarget,function(stdout) {
				classpathsAndLibs = _g1.getClasspaths(stdout.split("\n"));
				_g1.processHaxelibs(classpathsAndLibs.libs,function(libs1) {
					var classpathsAndLibs21 = { classpaths : classpathsAndLibs.classpaths, libs : libs1};
					onComplete(classpathsAndLibs21);
				});
			});
			break;
		default:
		}
	}
	,parseProjectArguments: function() {
		var _g2 = this;
		parser_ClassParser.classCompletions = new haxe_ds_StringMap();
		parser_ClassParser.filesList = [];
		parser_ClassParser.topLevelClassList = [];
		parser_ClassParser.importsList = [];
		if(projectaccess_ProjectAccess.path != null) {
			var project = projectaccess_ProjectAccess.currentProject;
			this.getProjectClasspaths(project,function(classpathsAndLibs) {
				var _g = 0;
				var _g1 = classpathsAndLibs.classpaths;
				while(_g < _g1.length) {
					var path = _g1[_g];
					++_g;
					_g2.parseClasspath(path);
				}
				var _g3 = 0;
				var _g11 = classpathsAndLibs.libs;
				while(_g3 < _g11.length) {
					var lib = _g11[_g3];
					++_g3;
					_g2.parseClasspath(lib.path,lib.std);
				}
			});
		}
		this.walkProjectDirectory(projectaccess_ProjectAccess.path);
	}
	,getFileDirectory: function(relativePath) {
		var directory = "";
		if(relativePath.indexOf("/") != -1) directory = relativePath.substring(0,relativePath.lastIndexOf("/")); else if(relativePath.indexOf("\\") != -1) directory = relativePath.substring(0,relativePath.lastIndexOf("\\"));
		return directory;
	}
	,getClasspaths: function(data) {
		var classpaths = [];
		var _g = 0;
		var _g1 = this.parseArg(data,"-cp");
		while(_g < _g1.length) {
			var arg = _g1[_g];
			++_g;
			var classpath = js_Node.require("path").resolve(projectaccess_ProjectAccess.path,arg);
			classpaths.push(classpath);
		}
		var libs = this.parseArg(data,"-lib");
		return { classpaths : classpaths, libs : libs};
	}
	,processHaxelibs: function(libs,onComplete) {
		var n = libs.length;
		var classpaths = [];
		if(n > 0) {
			var _g = 0;
			while(_g < libs.length) {
				var arg = libs[_g];
				++_g;
				var processHelper = core_ProcessHelper.get();
				processHelper.runProcess(core_HaxeHelper.getPathToHaxelib(),["path",arg],null,(function() {
					return function(stdout,stderr) {
						n--;
						var _g1 = 0;
						var _g2 = stdout.split("\n");
						while(_g1 < _g2.length) {
							var path = [_g2[_g1]];
							++_g1;
							if(path[0].indexOf(js_Node.require("path").sep) != -1) {
								path[0] = StringTools.trim(path[0]);
								path[0] = js_Node.require("path").normalize(path[0]);
								js_Node.require("fs").exists(path[0],(function(path) {
									return function(exists) {
										if(exists) classpaths.push({ path : path[0], std : false});
									};
								})(path));
							}
						}
						if(n == 0) onComplete(classpaths);
					};
				})());
			}
		} else onComplete(classpaths);
	}
	,parseArg: function(args,type) {
		var result = [];
		var _g = 0;
		while(_g < args.length) {
			var arg = args[_g];
			++_g;
			arg = StringTools.trim(arg);
			if(StringTools.startsWith(arg,type)) result.push(HxOverrides.substr(arg,type.length + 1,null));
		}
		return result;
	}
	,parseClasspath: function(path,std) {
		if(std == null) std = false;
		var _g = this;
		if(Main.sync) {
			var _g1 = 0;
			var _g11 = Walkdir.walkSync(path);
			while(_g1 < _g11.length) {
				var pathToFile = _g11[_g1];
				++_g1;
				var stat = js_Node.require("fs").lstatSync(pathToFile);
				if(stat.isFile()) this.processFile(pathToFile,std);
			}
		} else {
			var emitter = Walkdir.walk(path,{ });
			emitter.on("file",function(pathToFile1,stat1) {
				_g.processFile(pathToFile1,std);
			});
			emitter.on("error",function(pathToFile2,stat2) {
				haxe_Log.trace(pathToFile2,{ fileName : "ClasspathWalker.hx", lineNumber : 375, className : "parser.ClasspathWalker", methodName : "parseClasspath"});
			});
		}
	}
	,processFile: function(path,std) {
		this.addFile(path,std);
		var options = { };
		options.encoding = "utf8";
		if(js_Node.require("path").extname(path) == ".hx") js_Node.require("fs").readFile(path,options,function(error,data) {
			if(error == null) parser_ClassParser.processFile(data,path,std);
		});
	}
	,getFileIndex: function(pathToFile,list) {
		var index = -1;
		var _g1 = 0;
		var _g = list.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(list[i].path == pathToFile) {
				index = i;
				break;
			}
		}
		return index;
	}
	,addFile: function(path,std) {
		if(std == null) std = false;
		var relativePath;
		var list;
		var completionInstance = core_Completion.get();
		if(!watchers_SettingsWatcher.isItemInIgnoreList(path) && !projectaccess_ProjectAccess.isItemInIgnoreList(path)) {
			if(std) list = parser_ClassParser.haxeStdFileList; else list = parser_ClassParser.filesList;
			if(projectaccess_ProjectAccess.path != null && (core_Utils.os == 0 || !std)) {
				relativePath = js_Node.require("path").relative(projectaccess_ProjectAccess.path,path);
				if(this.getFileIndex(relativePath,list) == -1) list.push({ path : relativePath, directory : this.getFileDirectory(relativePath), displayText : completionInstance.processDisplayText(relativePath), filename : js_Node.require("path").basename(relativePath)});
			} else if(this.getFileIndex(path,list) == -1) list.push({ path : path, directory : this.getFileDirectory(path), displayText : completionInstance.processDisplayText(path), filename : js_Node.require("path").basename(path)});
		}
	}
	,removeFile: function(path) {
		var relativePath;
		var index = -1;
		var _g = 0;
		var _g1 = [parser_ClassParser.haxeStdFileList,parser_ClassParser.filesList];
		while(_g < _g1.length) {
			var list = _g1[_g];
			++_g;
			if(projectaccess_ProjectAccess.path != null) {
				relativePath = js_Node.require("path").relative(projectaccess_ProjectAccess.path,path);
				index = this.getFileIndex(relativePath,list);
				if(index != -1) HxOverrides.remove(list,list[index]);
			}
			index = this.getFileIndex(path,list);
			if(index != -1) HxOverrides.remove(list,list[index]);
		}
	}
	,walkProjectDirectory: function(path) {
		var _g = this;
		if(Main.sync) Walkdir.walkSync(path,{ },function(path1,stat) {
			if(stat.isFile()) _g.addFile(path1);
		}); else {
			var emitter = Walkdir.walk(path,{ });
			var options = { };
			options.encoding = "utf8";
			emitter.on("file",function(path2,stat1) {
				_g.addFile(path2);
			});
			emitter.on("error",function(path3,stat2) {
				haxe_Log.trace(path3,{ fileName : "ClasspathWalker.hx", lineNumber : 508, className : "parser.ClasspathWalker", methodName : "walkProjectDirectory"});
			});
		}
	}
	,__class__: parser_ClasspathWalker
};
var parser_OutlineHelper = function() {
	this.outlineParser = new outline_OutlineParser();
};
$hxClasses["parser.OutlineHelper"] = parser_OutlineHelper;
parser_OutlineHelper.__name__ = ["parser","OutlineHelper"];
parser_OutlineHelper.get = function() {
	if(parser_OutlineHelper.instance == null) parser_OutlineHelper.instance = new parser_OutlineHelper();
	return parser_OutlineHelper.instance;
};
parser_OutlineHelper.prototype = {
	outlineParser: null
	,pathToLastFile: null
	,getList: function(data,path) {
		var outlinePanel = core_OutlinePanel.get();
		var outlineItems = this.outlineParser.parse(data,path);
		if(outlineItems != null) {
			var parsedData = this.parseOutlineItems(outlineItems);
			var mainClass = js_Node.require("path").basename(path);
			var rootItem = { label : mainClass};
			rootItem.items = parsedData.treeItems;
			rootItem.expanded = true;
			this.pathToLastFile = path;
			outlinePanel.clearFields();
			outlinePanel.addField(rootItem);
			outlinePanel.update();
			new outline_OutlineFormatter(parsedData.treeItemFormats);
		}
	}
	,parseOutlineItems: function(outlineItems) {
		var fileImports = [];
		var treeItems = [];
		var treeItemFormats = [];
		var _g = 0;
		while(_g < outlineItems.length) {
			var outlineItem = outlineItems[_g];
			++_g;
			var _g1 = outlineItem.type;
			switch(_g1) {
			case "class":
				var treeItem = { label : outlineItem.name};
				var items = [];
				treeItem.items = items;
				treeItem.expanded = true;
				treeItemFormats.push({ type : outlineItem.type, isPublic : true, isStatic : false});
				var _g2 = 0;
				var _g3 = outlineItem.fields;
				while(_g2 < _g3.length) {
					var item = _g3[_g2];
					++_g2;
					items.push({ label : item.name, value : { min : item.pos, max : item.pos + item.len}});
					treeItemFormats.push({ type : item.type, isPublic : item.isPublic, isStatic : item.isStatic});
				}
				treeItems.push(treeItem);
				break;
			case "typedef":
				var treeItem1 = { label : outlineItem.name};
				var items1 = [];
				treeItem1.items = items1;
				treeItem1.expanded = true;
				treeItemFormats.push({ type : "typedef", isPublic : true, isStatic : false});
				var _g21 = 0;
				var _g31 = outlineItem.fields;
				while(_g21 < _g31.length) {
					var item1 = _g31[_g21];
					++_g21;
					items1.push({ label : item1.name, value : { min : item1.pos, max : item1.pos + item1.len}});
					treeItemFormats.push({ type : item1.type, isPublic : true, isStatic : item1.isStatic});
				}
				treeItems.push(treeItem1);
				break;
			case "enum":
				var treeItem2 = { label : outlineItem.name};
				var items2 = [];
				treeItem2.items = items2;
				treeItem2.expanded = true;
				treeItemFormats.push({ type : "enumGroup", isPublic : true, isStatic : false});
				var _g22 = 0;
				var _g32 = outlineItem.fields;
				while(_g22 < _g32.length) {
					var item2 = _g32[_g22];
					++_g22;
					items2.push({ label : item2.name, value : item2.pos});
					treeItemFormats.push({ type : "enum", isPublic : true, isStatic : false});
				}
				treeItems.push(treeItem2);
				break;
			}
		}
		return { fileImports : fileImports, treeItems : treeItems, treeItemFormats : treeItemFormats};
	}
	,__class__: parser_OutlineHelper
};
var parser_RegexParser = function() { };
$hxClasses["parser.RegexParser"] = parser_RegexParser;
parser_RegexParser.__name__ = ["parser","RegexParser"];
parser_RegexParser.getFileImportsList = function(data) {
	var fileImports = [];
	var ereg = new EReg("^[ \t]*import ([a-z0-9._*]+);$","gim");
	ereg.map(data,function(ereg1) {
		fileImports.push(ereg1.matched(1));
		return "";
	});
	return fileImports;
};
parser_RegexParser.getFilePackage = function(data) {
	var filePackage = null;
	var pos = null;
	var ereg = new EReg("package *([^;]*);$","m");
	if(ereg.match(data)) {
		filePackage = StringTools.trim(ereg.matched(1));
		pos = ereg.matchedPos().pos;
	}
	return { filePackage : filePackage, pos : pos};
};
parser_RegexParser.getTypeDeclarations = function(data) {
	var typeDeclarations = [];
	var ereg = new EReg("(class|typedef|enum|typedef|abstract) +([A-Z][a-zA-Z0-9_]*) *(<[a-zA-Z0-9_,]+>)?","gm");
	ereg.map(data,function(ereg2) {
		var pos = ereg.matchedPos();
		var typeDeclaration = { type : ereg2.matched(1), name : ereg2.matched(2), pos : pos};
		typeDeclarations.push(typeDeclaration);
		return "";
	});
	return typeDeclarations;
};
parser_RegexParser.getFunctionDeclarations = function(data) {
	var functionDeclarations = [];
	var eregFunction = new EReg("function +([^;\\.\\(\\) ]*)","gi");
	var eregFunctionWithParameters = new EReg("function *([a-zA-Z0-9_]*) *\\(([^\\)]*)","gm");
	var eregParamDefault = new EReg("(= *\"*[^\"]*\")","gm");
	eregFunctionWithParameters.map(data,function(ereg2) {
		var pos = ereg2.matchedPos();
		var name = ereg2.matched(1);
		if(name != null) {
			if(name != "new") {
				var params = null;
				var str = ereg2.matched(2);
				if(str != null) params = str.split(",");
				functionDeclarations.push({ name : name, params : params, pos : pos});
			}
		}
		return "";
	});
	return functionDeclarations;
};
parser_RegexParser.getVariableDeclarations = function(data) {
	var variableDeclarations = [];
	var eregVariables = new EReg("var +([a-z_0-9]+):?([^=;]+)?","gi");
	eregVariables.map(data,function(ereg2) {
		var pos = ereg2.matchedPos();
		var index = pos.pos + pos.len;
		var name = ereg2.matched(1);
		var type = ereg2.matched(2);
		var varDecl = Lambda.find(variableDeclarations,function(varDecl1) {
			return varDecl1.name == name;
		});
		if(varDecl == null) {
			var varDecl11 = { name : name, pos : pos};
			if(type != null) {
				type = StringTools.trim(type);
				if(type != "") varDecl11.type = type;
			}
			variableDeclarations.push(varDecl11);
		}
		return "";
	});
	return variableDeclarations;
};
parser_RegexParser.getClassDeclarations = function(data) {
	var classDeclarations = [];
	var eregClass = new EReg("class[\t ]+([a-z_0-9]+)[^;\n]+\n?\\{","gi");
	eregClass.map(data,function(ereg) {
		var pos = ereg.matchedPos();
		classDeclarations.push({ name : ereg.matched(1), pos : pos});
		return "";
	});
	return classDeclarations;
};
parser_RegexParser.getFunctionParameters = function(data,pos) {
	var functionDeclarations = [];
	var functionParams = [];
	var eregFunction = new EReg("[public|private|static|inline|macro\t ]* function[\t ]+([^;\\.\\(\\) ]+)\\((.+)\\)[^;\\.{]+\\{","gi");
	eregFunction.map(data,function(ereg) {
		functionDeclarations.push({ name : ereg.matched(1), params : ereg.matched(2).split(","), pos : ereg.matchedPos()});
		return "";
	});
	var currentFunctionDeclaration = null;
	var _g = 0;
	while(_g < functionDeclarations.length) {
		var item = functionDeclarations[_g];
		++_g;
		if(cm_Editor.editor.indexFromPos(pos) < item.pos.pos + item.pos.len) break;
		currentFunctionDeclaration = item;
	}
	if(currentFunctionDeclaration != null) {
		var ereg1 = new EReg("([a-z_0-9]+):?([^=;]+)?","gi");
		var _g1 = 0;
		var _g11 = currentFunctionDeclaration.params;
		while(_g1 < _g11.length) {
			var param = _g11[_g1];
			++_g1;
			if(ereg1.match(param)) functionParams.push({ name : ereg1.matched(1), type : ereg1.matched(2)});
		}
	}
	return functionParams;
};
var pluginloader_PluginManager = function() {
	this.pluginsTestingData = "  - cd plugins";
	this.firstRun = false;
	this.pluginsMTime = new haxe_ds_StringMap();
	this.requestedPluginsData = [];
	this.inactivePlugins = [];
	this.pathToPlugins = new haxe_ds_StringMap();
};
$hxClasses["pluginloader.PluginManager"] = pluginloader_PluginManager;
pluginloader_PluginManager.__name__ = ["pluginloader","PluginManager"];
pluginloader_PluginManager.get = function() {
	if(pluginloader_PluginManager.instance == null) pluginloader_PluginManager.instance = new pluginloader_PluginManager();
	return pluginloader_PluginManager.instance;
};
pluginloader_PluginManager.prototype = {
	pathToPlugins: null
	,inactivePlugins: null
	,requestedPluginsData: null
	,pluginsMTime: null
	,firstRun: null
	,pluginsTestingData: null
	,loadPlugins: function(compile) {
		if(compile == null) compile = true;
		var _g = this;
		var pathToPluginsFolder = "plugins";
		if(!js_Node.require("fs").existsSync(pathToPluginsFolder)) js_Node.require("fs").mkdirSync(pathToPluginsFolder);
		var pathToPluginsMTime = "pluginsMTime.dat";
		var args;
		if(js_Node.require("fs").existsSync(pathToPluginsMTime)) {
			var options = { };
			options.encoding = "utf8";
			var data = js_Node.require("fs").readFileSync(pathToPluginsMTime,options);
			if(data != "") this.pluginsMTime = haxe_Unserializer.run(data);
		} else this.firstRun = true;
		this.readDir(pathToPluginsFolder,"",function(path,pathToPlugin) {
			var pluginName = StringTools.replace(pathToPlugin,js_Node.require("path").sep,".");
			var relativePathToPlugin = js_Node.require("path").join(path,pathToPlugin);
			_g.pathToPlugins.set(pluginName,relativePathToPlugin);
			var absolutePathToPlugin = js_Node.require("path").resolve(relativePathToPlugin);
			if(_g.firstRun) _g.pluginsMTime.set(pluginName,Std.parseInt(Std.string(new Date().getTime())));
			if(compile && (!_g.pluginsMTime.exists(pluginName) || _g.pluginsMTime.get(pluginName) < _g.walk(absolutePathToPlugin))) _g.compilePlugin(pluginName,absolutePathToPlugin,$bind(_g,_g.loadPlugin)); else _g.loadPlugin(absolutePathToPlugin);
		});
		haxe_Timer.delay(function() {
			if(_g.requestedPluginsData.length > 0) {
				haxe_Log.trace("still not loaded plugins: ",{ fileName : "PluginManager.hx", lineNumber : 117, className : "pluginloader.PluginManager", methodName : "loadPlugins"});
				var _g1 = 0;
				var _g2 = _g.requestedPluginsData;
				while(_g1 < _g2.length) {
					var pluginData = _g2[_g1];
					++_g1;
					haxe_Log.trace(pluginData.name + ": can't load plugin, required plugins are not found",{ fileName : "PluginManager.hx", lineNumber : 121, className : "pluginloader.PluginManager", methodName : "loadPlugins"});
					haxe_Log.trace(pluginData.plugins,{ fileName : "PluginManager.hx", lineNumber : 122, className : "pluginloader.PluginManager", methodName : "loadPlugins"});
				}
				_g.savePluginsMTime();
			}
		},10000);
	}
	,walk: function(pathToPlugin) {
		var pathToItem;
		var time = -1;
		var mtime;
		var extension;
		var _g = 0;
		var _g1 = js_Node.require("fs").readdirSync(pathToPlugin);
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			pathToItem = js_Node.require("path").join(pathToPlugin,item);
			var stat = js_Node.require("fs").statSync(pathToItem);
			extension = js_Node.require("path").extname(pathToItem);
			if(stat.isFile() && (extension == ".hx" || extension == ".hxml")) {
				mtime = stat.mtime.getTime();
				if(time < mtime) time = mtime;
			} else if(stat.isDirectory()) {
				mtime = this.walk(pathToItem);
				if(time < mtime) time = mtime;
			}
		}
		return time;
	}
	,readDir: function(path,pathToPlugin,onLoad) {
		var _g1 = this;
		var pathToFolder;
		js_Node.require("fs").readdir(js_Node.require("path").join(path,pathToPlugin),function(error,folders) {
			if(error != null) haxe_Log.trace(error,{ fileName : "PluginManager.hx", lineNumber : 177, className : "pluginloader.PluginManager", methodName : "readDir"}); else {
				var _g = 0;
				while(_g < folders.length) {
					var item = [folders[_g]];
					++_g;
					if(item[0] != "inactive") {
						pathToFolder = js_Node.require("path").join(path,pathToPlugin,item[0]);
						js_Node.require("fs").stat(pathToFolder,(function(item) {
							return function(error1,stat) {
								if(error1 != null) {
								} else {
									var pluginName = StringTools.replace(pathToPlugin,js_Node.require("path").sep,".");
									if(stat.isDirectory()) _g1.readDir(path,js_Node.require("path").join(pathToPlugin,item[0]),onLoad); else if(item[0] == "plugin.hxml" && !Lambda.has(_g1.inactivePlugins,pluginName)) {
										var levels = "";
										var _g3 = 0;
										var _g2 = pathToPlugin.split("\\").length;
										while(_g3 < _g2) {
											var i = _g3++;
											levels += "../";
										}
										_g1.pluginsTestingData += "\n  - cd " + StringTools.replace(pathToPlugin,"\\","/") + "\n  - haxe plugin.hxml\n  - cd " + levels;
										onLoad(path,pathToPlugin);
										return;
									}
								}
							};
						})(item));
					}
				}
			}
		});
	}
	,loadPlugin: function(pathToPlugin) {
		var pathToMain = js_Node.require("path").join(pathToPlugin,"bin","Main.js");
		js_Node.require("fs").exists(pathToMain,function(exists) {
			if(exists) HIDE.loadJS(null,[pathToMain]); else haxe_Log.trace(pathToMain + " is not found/nPlease compile " + pathToPlugin + " plugin",{ fileName : "PluginManager.hx", lineNumber : 236, className : "pluginloader.PluginManager", methodName : "loadPlugin"});
		});
	}
	,compilePlugin: function(name,pathToPlugin,onSuccess,onFailed) {
		var _g = this;
		var pathToBin = js_Node.require("path").join(pathToPlugin,"bin");
		js_Node.require("fs").exists(pathToBin,function(exists) {
			if(exists) _g.startPluginCompilation(name,pathToPlugin,onSuccess,onFailed); else js_Node.require("fs").mkdir(pathToBin,null,function(error) {
				_g.startPluginCompilation(name,pathToPlugin,onSuccess,onFailed);
			});
		});
	}
	,startPluginCompilation: function(name,pathToPlugin,onSuccess,onFailed) {
		var _g = this;
		var startTime = new Date().getTime();
		var delta;
		var command = ["haxe","--cwd",HIDE.surroundWithQuotes(pathToPlugin),"plugin.hxml"].join(" ");
		haxe_Log.trace(command,{ fileName : "PluginManager.hx", lineNumber : 271, className : "pluginloader.PluginManager", methodName : "startPluginCompilation"});
		var haxeCompilerProcess = js_Node.require("child_process").exec(command,{ },function(err,stdout,stderr) {
			if(err == null) {
				delta = new Date().getTime() - startTime;
				Std.string(haxe_Log.trace(name + " compilation took " + (delta == null?"null":"" + delta),{ fileName : "PluginManager.hx", lineNumber : 279, className : "pluginloader.PluginManager", methodName : "startPluginCompilation"})) + " ms";
				onSuccess(pathToPlugin);
				_g.pluginsMTime.set(name,Std.parseInt(Std.string(new Date().getTime())));
			} else {
				var element = window.document.getElementById("plugin-compilation-console");
				var textarea;
				if(element == null) {
					var _this = window.document;
					textarea = _this.createElement("textarea");
					textarea.id = "plugin-compilation-console";
					textarea.value = "Plugins compile-time errors:\n";
					window.document.body.appendChild(textarea);
				} else textarea = js_Boot.__cast(element , HTMLTextAreaElement);
				haxe_Log.trace(pathToPlugin + " stderr: " + stderr,{ fileName : "PluginManager.hx", lineNumber : 302, className : "pluginloader.PluginManager", methodName : "startPluginCompilation"});
				textarea.value += name + "\n" + stderr + "\n";
				haxe_Log.trace("can't load " + name + " plugin, compilation failed",{ fileName : "PluginManager.hx", lineNumber : 305, className : "pluginloader.PluginManager", methodName : "startPluginCompilation"});
				var regex = new EReg("haxelib install (.+) ","gim");
				regex.map(stderr,function(ereg) {
					haxe_Log.trace(ereg,{ fileName : "PluginManager.hx", lineNumber : 310, className : "pluginloader.PluginManager", methodName : "startPluginCompilation"});
					return "";
				});
				if(onFailed != null) onFailed(stderr);
			}
		});
	}
	,savePluginsMTime: function() {
		var pathToPluginsMTime = js_Node.require("path").join("..","pluginsMTime.dat");
		var data = haxe_Serializer.run(this.pluginsMTime);
		js_Node.require("fs").writeFile(pathToPluginsMTime,data,"utf8",function(error) {
		});
	}
	,compilePlugins: function(onComplete,onFailed) {
		var pluginCount = Lambda.count(this.pathToPlugins);
		var compiledPluginCount = 0;
		var relativePathToPlugin;
		var absolutePathToPlugin;
		if(pluginCount > 0) {
			var $it0 = this.pathToPlugins.keys();
			while( $it0.hasNext() ) {
				var name = $it0.next();
				relativePathToPlugin = this.pathToPlugins.get(name);
				absolutePathToPlugin = js_Node.require("path").resolve(relativePathToPlugin);
				this.compilePlugin(name,absolutePathToPlugin,function() {
					compiledPluginCount++;
					if(compiledPluginCount == pluginCount) onComplete();
				},onFailed);
			}
		} else onComplete();
	}
	,__class__: pluginloader_PluginManager
};
var projectaccess_Project = function() {
	this.targetData = [];
	this.files = [];
	this.openFLBuildMode = "Debug";
	this.hiddenItems = [];
	this.showHiddenItems = false;
};
$hxClasses["projectaccess.Project"] = projectaccess_Project;
projectaccess_Project.__name__ = ["projectaccess","Project"];
projectaccess_Project.prototype = {
	type: null
	,target: null
	,name: null
	,main: null
	,projectPackage: null
	,company: null
	,license: null
	,url: null
	,targetData: null
	,files: null
	,activeFile: null
	,openFLTarget: null
	,openFLBuildMode: null
	,runActionType: null
	,runActionText: null
	,buildActionCommand: null
	,hiddenItems: null
	,showHiddenItems: null
	,__class__: projectaccess_Project
};
var projectaccess_ProjectAccess = function() { };
$hxClasses["projectaccess.ProjectAccess"] = projectaccess_ProjectAccess;
projectaccess_ProjectAccess.__name__ = ["projectaccess","ProjectAccess"];
projectaccess_ProjectAccess.registerSaveOnCloseListener = function() {
	var $window = nodejs_webkit_Window.get();
	var tabManagerInstance = tabmanager_TabManager.get();
	$window.on("close",function() {
		if(projectaccess_ProjectAccess.currentProject != null && tabManagerInstance.getCurrentDocumentPath() != null) cm_Editor.saveFoldedRegions();
		projectaccess_ProjectAccess.save(null,true);
		$window.close();
	});
};
projectaccess_ProjectAccess.save = function(onComplete,sync) {
	if(sync == null) sync = false;
	if(projectaccess_ProjectAccess.path != null) {
		cm_Editor.saveFoldedRegions();
		var pathToProjectHide = js_Node.require("path").join(projectaccess_ProjectAccess.path,"project.hide");
		var data = tjson_TJSON.encode(projectaccess_ProjectAccess.currentProject,"fancy");
		if(sync) js_Node.require("fs").writeFileSync(pathToProjectHide,data,"utf8"); else core_Helper.debounce("saveProject",function() {
			js_Node.require("fs").writeFile(pathToProjectHide,data,"utf8",function(error) {
				if(onComplete != null) onComplete();
			});
		},250);
	} else haxe_Log.trace("project path is null",{ fileName : "ProjectAccess.hx", lineNumber : 73, className : "projectaccess.ProjectAccess", methodName : "save"});
};
projectaccess_ProjectAccess.isItemInIgnoreList = function(path) {
	var ignore = false;
	if(projectaccess_ProjectAccess.path != null && !projectaccess_ProjectAccess.currentProject.showHiddenItems) {
		var relativePath = js_Node.require("path").relative(projectaccess_ProjectAccess.path,path);
		if(HxOverrides.indexOf(projectaccess_ProjectAccess.currentProject.hiddenItems,relativePath,0) != -1) ignore = true;
	}
	return ignore;
};
projectaccess_ProjectAccess.isItemHidden = function(path) {
	var relativePath = js_Node.require("path").relative(projectaccess_ProjectAccess.path,path);
	return HxOverrides.indexOf(projectaccess_ProjectAccess.currentProject.hiddenItems,relativePath,0) != -1;
};
projectaccess_ProjectAccess.hideItem = function(path) {
	var relativePath = js_Node.require("path").relative(projectaccess_ProjectAccess.path,path);
	projectaccess_ProjectAccess.currentProject.hiddenItems.push(relativePath);
};
projectaccess_ProjectAccess.unhideItem = function(path) {
	var relativePath = js_Node.require("path").relative(projectaccess_ProjectAccess.path,path);
	projectaccess_ProjectAccess.currentProject.hiddenItems.push(relativePath);
};
projectaccess_ProjectAccess.getPathToHxml = function() {
	var pathToHxml = null;
	var project = projectaccess_ProjectAccess.currentProject;
	var _g = project.type;
	switch(_g) {
	case 0:
		var targetData = project.targetData[project.target];
		pathToHxml = targetData.pathToHxml;
		break;
	case 2:
		pathToHxml = project.main;
		break;
	default:
	}
	return pathToHxml;
};
projectaccess_ProjectAccess.getFileByPath = function(path) {
	var selectedFile = null;
	if(projectaccess_ProjectAccess.path != null) {
		var relativePath = js_Node.require("path").relative(projectaccess_ProjectAccess.path,path);
		var project = projectaccess_ProjectAccess.currentProject;
		selectedFile = Lambda.find(project.files,function(file) {
			return file.path == relativePath;
		});
	}
	return selectedFile;
};
var projectaccess_ProjectOptions = function() {
};
$hxClasses["projectaccess.ProjectOptions"] = projectaccess_ProjectOptions;
projectaccess_ProjectOptions.__name__ = ["projectaccess","ProjectOptions"];
projectaccess_ProjectOptions.get = function() {
	if(projectaccess_ProjectOptions.instance == null) projectaccess_ProjectOptions.instance = new projectaccess_ProjectOptions();
	return projectaccess_ProjectOptions.instance;
};
projectaccess_ProjectOptions.prototype = {
	page: null
	,projectTargetList: null
	,projectTargetText: null
	,openFLTargetList: null
	,openFLTargetText: null
	,openFLTargets: null
	,openFLBuildModeList: null
	,openFLBuildModeText: null
	,buildModes: null
	,buildActionDescription: null
	,buildActionTextArea: null
	,actionTextArea: null
	,runActionList: null
	,runActionTextAreaDescription: null
	,runActionDescription: null
	,pathToHxmlDescription: null
	,inputGroupButton: null
	,pathToHxmlInput: null
	,create: function() {
		var _g = this;
		var _this = window.document;
		this.page = _this.createElement("div");
		this.createOptionsForMultipleHxmlProjects();
		var _this1 = window.document;
		this.projectTargetText = _this1.createElement("p");
		this.projectTargetText.textContent = watchers_LocaleWatcher.getStringSync("Project target:");
		this.projectTargetText.setAttribute("localeString","Project target:");
		this.projectTargetText.className = "custom-font-size";
		this.page.appendChild(this.projectTargetText);
		var _this2 = window.document;
		this.projectTargetList = _this2.createElement("select");
		this.projectTargetList.id = "project-options-project-target";
		this.projectTargetList.className = "custom-font-size";
		this.projectTargetList.style.width = "100%";
		var _this3 = window.document;
		this.openFLTargetList = _this3.createElement("select");
		this.openFLTargetList.id = "project-options-openfl-target";
		this.openFLTargetList.className = "custom-font-size";
		this.openFLTargetList.style.width = "100%";
		var _this4 = window.document;
		this.openFLTargetText = _this4.createElement("p");
		this.openFLTargetText.textContent = watchers_LocaleWatcher.getStringSync("OpenFL target:");
		this.openFLTargetText.setAttribute("localeString","OpenFL target:");
		this.openFLTargetText.className = "custom-font-size";
		var _this5 = window.document;
		this.openFLBuildModeList = _this5.createElement("select");
		this.openFLBuildModeList.id = "project-options-openfl-build-mode";
		this.openFLBuildModeList.className = "custom-font-size";
		this.openFLBuildModeList.style.width = "100%";
		var _this6 = window.document;
		this.openFLBuildModeText = _this6.createElement("p");
		this.openFLBuildModeText.textContent = watchers_LocaleWatcher.getStringSync("Build mode:");
		this.openFLBuildModeText.setAttribute("localeString","Build mode:");
		this.openFLBuildModeText.className = "custom-font-size";
		var _g1 = 0;
		var _g11 = ["Flash","JavaScript","Neko","OpenFL","PHP","C++","Java","C#","Python"];
		while(_g1 < _g11.length) {
			var target = _g11[_g1];
			++_g1;
			this.projectTargetList.appendChild(this.createListItem(target));
		}
		this.projectTargetList.onchange = function(e) {
			var project = projectaccess_ProjectAccess.currentProject;
			var _g12 = _g.projectTargetList.value;
			switch(_g12) {
			case "Flash":
				project.target = 0;
				break;
			case "JavaScript":
				project.target = 1;
				break;
			case "Neko":
				project.target = 2;
				break;
			case "OpenFL":
				project.target = 1;
				break;
			case "PHP":
				project.target = 3;
				break;
			case "C++":
				project.target = 4;
				break;
			case "Java":
				project.target = 5;
				break;
			case "C#":
				project.target = 6;
				break;
			case "Python":
				project.target = 7;
				break;
			default:
				throw new js__$Boot_HaxeError("Unknown target");
			}
			var classpathWalker = parser_ClasspathWalker.get();
			classpathWalker.parseProjectArguments();
			_g.updateProjectOptions();
		};
		this.openFLTargets = ["flash","html5","neko","android","blackberry","emscripten","webos","tizen","ios","windows","mac","linux"];
		var _g2 = 0;
		var _g13 = this.openFLTargets;
		while(_g2 < _g13.length) {
			var target1 = _g13[_g2];
			++_g2;
			this.openFLTargetList.appendChild(this.createListItem(target1));
		}
		this.openFLTargetList.onchange = function(_) {
			var project1 = projectaccess_ProjectAccess.currentProject;
			_g.updateOpenFLBuildCommand();
			project1.runActionType = 2;
			project1.runActionText = ["haxelib","run","lime","run","\"%path%\"",project1.openFLTarget].join(" ");
			var classpathWalker1 = parser_ClasspathWalker.get();
			classpathWalker1.parseProjectArguments();
			_g.updateProjectOptions();
		};
		this.buildModes = ["Debug","Release"];
		var _g3 = 0;
		var _g14 = this.buildModes;
		while(_g3 < _g14.length) {
			var mode = _g14[_g3];
			++_g3;
			this.openFLBuildModeList.appendChild(this.createListItem(mode));
		}
		this.openFLBuildModeList.onchange = function(_1) {
			var mode1 = _g.buildModes[_g.openFLBuildModeList.selectedIndex];
			var project2 = projectaccess_ProjectAccess.currentProject;
			project2.openFLBuildMode = mode1;
			_g.updateOpenFLBuildCommand();
		};
		var _this7 = window.document;
		this.runActionDescription = _this7.createElement("p");
		this.runActionDescription.className = "custom-font-size";
		this.runActionDescription.textContent = watchers_LocaleWatcher.getStringSync("Run action:");
		this.runActionDescription.setAttribute("localeString","Run action:");
		var _this8 = window.document;
		this.runActionTextAreaDescription = _this8.createElement("p");
		this.runActionTextAreaDescription.textContent = watchers_LocaleWatcher.getStringSync("URL:");
		this.runActionTextAreaDescription.setAttribute("localeString","URL:");
		this.runActionTextAreaDescription.className = "custom-font-size";
		var actions = ["Open URL","Open File","Run command"];
		var _this9 = window.document;
		this.runActionList = _this9.createElement("select");
		this.runActionList.style.width = "100%";
		this.runActionList.onchange = $bind(this,this.update);
		var _g4 = 0;
		while(_g4 < actions.length) {
			var action = actions[_g4];
			++_g4;
			this.runActionList.appendChild(this.createListItem(action));
		}
		var _this10 = window.document;
		this.actionTextArea = _this10.createElement("textarea");
		this.actionTextArea.id = "project-options-action-textarea";
		this.actionTextArea.className = "custom-font-size";
		this.actionTextArea.onchange = function(e1) {
			var project3 = projectaccess_ProjectAccess.currentProject;
			if(project3.type == 0) {
				var targetData = project3.targetData[project3.target];
				targetData.runActionText = _g.actionTextArea.value;
			} else project3.runActionText = _g.actionTextArea.value;
			_g.update(null);
		};
		var _this11 = window.document;
		this.buildActionDescription = _this11.createElement("p");
		this.buildActionDescription.className = "custom-font-size";
		this.buildActionDescription.textContent = watchers_LocaleWatcher.getStringSync("Build command:");
		this.buildActionDescription.setAttribute("localeString","Build command:");
		var _this12 = window.document;
		this.buildActionTextArea = _this12.createElement("textarea");
		this.buildActionTextArea.id = "project-options-build-action-textarea";
		this.buildActionTextArea.className = "custom-font-size";
		this.buildActionTextArea.onchange = function(e2) {
			projectaccess_ProjectAccess.currentProject.buildActionCommand = _g.buildActionTextArea.value;
			projectaccess_ProjectAccess.save();
		};
		this.page.appendChild(this.projectTargetList);
		this.page.appendChild(this.buildActionDescription);
		this.page.appendChild(this.buildActionTextArea);
		this.page.appendChild(this.pathToHxmlDescription);
		this.page.appendChild(this.inputGroupButton.getElement());
		this.page.appendChild(this.openFLTargetText);
		this.page.appendChild(this.openFLTargetList);
		this.page.appendChild(this.openFLBuildModeText);
		this.page.appendChild(this.openFLBuildModeList);
		this.page.appendChild(this.runActionDescription);
		this.page.appendChild(this.runActionList);
		this.page.appendChild(this.runActionTextAreaDescription);
		this.page.appendChild(this.actionTextArea);
	}
	,updateOpenFLBuildCommand: function() {
		var project = projectaccess_ProjectAccess.currentProject;
		project.openFLTarget = this.openFLTargets[this.openFLTargetList.selectedIndex];
		var buildParams = ["haxelib","run","lime","build","\"%path%\"",project.openFLTarget];
		if(project.openFLBuildMode == "Debug") {
			buildParams.push("-debug");
			if(project.openFLTarget == "flash") buildParams.push("-Dfdb");
		}
		var _g = project.openFLTarget;
		switch(_g) {
		case "flash":case "html5":case "neko":
			buildParams = buildParams.concat(["--connect","5000"]);
			break;
		default:
		}
		project.buildActionCommand = buildParams.join(" ");
	}
	,createOptionsForMultipleHxmlProjects: function() {
		var _g = this;
		var _this = window.document;
		this.pathToHxmlDescription = _this.createElement("p");
		this.pathToHxmlDescription.textContent = watchers_LocaleWatcher.getStringSync("Path to Hxml:");
		this.pathToHxmlDescription.setAttribute("localeString","Path to Hxml:");
		this.pathToHxmlDescription.className = "custom-font-size";
		this.inputGroupButton = new bootstrap_InputGroupButton("Browse...");
		this.pathToHxmlInput = this.inputGroupButton.getInput();
		this.pathToHxmlInput.onchange = function(e) {
			if(js_Node.require("fs").existsSync(_g.pathToHxmlInput.value)) {
				var project = projectaccess_ProjectAccess.currentProject;
				project.targetData[project.target].pathToHxml = _g.pathToHxmlInput.value;
				projectaccess_ProjectAccess.save();
			} else alertify.error(_g.pathToHxmlInput.value + " is not found");
		};
		var browseButton = this.inputGroupButton.getButton();
		browseButton.onclick = function(e1) {
			core_FileDialog.openFile(function(path) {
				_g.pathToHxmlInput.value = path;
				var project1 = projectaccess_ProjectAccess.currentProject;
				project1.targetData[project1.target].pathToHxml = _g.pathToHxmlInput.value;
				projectaccess_ProjectAccess.save();
			},".hxml");
		};
		var buttonManager = bootstrap_ButtonManager.get();
		var editButton = buttonManager.createButton("Edit",false,true);
		editButton.onclick = function(e2) {
			var tabManagerInstance = tabmanager_TabManager.get();
			tabManagerInstance.openFileInNewTab(js_Node.require("path").resolve(projectaccess_ProjectAccess.path,_g.pathToHxmlInput.value));
		};
		this.inputGroupButton.getSpan().appendChild(editButton);
	}
	,update: function(_) {
		var project = projectaccess_ProjectAccess.currentProject;
		if(project.type == 1) {
			this.openFLTargetList.style.display = "";
			this.openFLTargetText.style.display = "";
			this.openFLBuildModeList.style.display = "";
			this.openFLBuildModeText.style.display = "";
		} else {
			this.openFLTargetList.style.display = "none";
			this.openFLTargetText.style.display = "none";
			this.openFLBuildModeList.style.display = "none";
			this.openFLBuildModeText.style.display = "none";
		}
		if(project.type == 2) {
			this.buildActionTextArea.style.display = "none";
			this.buildActionDescription.style.display = "none";
			this.projectTargetList.style.display = "none";
			this.projectTargetText.style.display = "none";
		} else {
			this.buildActionTextArea.style.display = "none";
			this.buildActionDescription.style.display = "none";
			this.runActionTextAreaDescription.style.display = "";
			this.runActionList.style.display = "";
			this.runActionDescription.style.display = "";
			this.projectTargetList.style.display = "";
			this.projectTargetText.style.display = "";
			this.actionTextArea.style.display = "";
		}
		if(project.type == 0) {
			this.pathToHxmlDescription.style.display = "";
			this.inputGroupButton.getElement().style.display = "";
		} else {
			this.pathToHxmlDescription.style.display = "none";
			this.inputGroupButton.getElement().style.display = "none";
		}
		var runActionType;
		var _g = this.runActionList.selectedIndex;
		switch(_g) {
		case 0:
			this.runActionTextAreaDescription.innerText = watchers_LocaleWatcher.getStringSync("URL: ");
			runActionType = 0;
			break;
		case 1:
			this.runActionTextAreaDescription.innerText = watchers_LocaleWatcher.getStringSync("Path: ");
			runActionType = 1;
			break;
		case 2:
			this.runActionTextAreaDescription.innerText = watchers_LocaleWatcher.getStringSync("Command: ");
			runActionType = 2;
			break;
		default:
			runActionType = 0;
		}
		var _g1 = project.type;
		switch(_g1) {
		case 0:
			var targetData = project.targetData[project.target];
			targetData.runActionType = runActionType;
			break;
		default:
			project.runActionType = runActionType;
		}
		projectaccess_ProjectAccess.save();
	}
	,updateProjectOptions: function() {
		var project = projectaccess_ProjectAccess.currentProject;
		var runActionType;
		var runActionText;
		var _g = project.type;
		switch(_g) {
		case 0:
			var targetData = project.targetData[project.target];
			runActionType = targetData.runActionType;
			runActionText = targetData.runActionText;
			this.pathToHxmlInput.value = targetData.pathToHxml;
			break;
		default:
			runActionType = project.runActionType;
			runActionText = project.runActionText;
		}
		if(project.type == 1) {
			this.projectTargetList.selectedIndex = 3;
			var i = Lambda.indexOf(this.openFLTargets,project.openFLTarget);
			if(i != -1) this.openFLTargetList.selectedIndex = i; else this.openFLTargetList.selectedIndex = 0;
			this.openFLBuildModeList.selectedIndex = HxOverrides.indexOf(this.buildModes,project.openFLBuildMode,0);
		} else {
			var _g1 = project.target;
			switch(_g1) {
			case 0:
				this.projectTargetList.selectedIndex = 0;
				break;
			case 1:
				this.projectTargetList.selectedIndex = 1;
				break;
			case 2:
				this.projectTargetList.selectedIndex = 2;
				break;
			case 3:
				this.projectTargetList.selectedIndex = 4;
				break;
			case 4:
				this.projectTargetList.selectedIndex = 5;
				break;
			case 5:
				this.projectTargetList.selectedIndex = 6;
				break;
			case 6:
				this.projectTargetList.selectedIndex = 7;
				break;
			case 7:
				this.projectTargetList.selectedIndex = 8;
				break;
			default:
			}
		}
		this.buildActionTextArea.value = project.buildActionCommand;
		if(runActionType != null) switch(runActionType) {
		case 0:
			this.runActionList.selectedIndex = 0;
			break;
		case 1:
			this.runActionList.selectedIndex = 1;
			break;
		case 2:
			this.runActionList.selectedIndex = 2;
			break;
		default:
		} else {
		}
		if(runActionText == null) runActionText = "";
		this.actionTextArea.value = runActionText;
		this.update(null);
	}
	,createListItem: function(text) {
		var option;
		var _this = window.document;
		option = _this.createElement("option");
		option.textContent = watchers_LocaleWatcher.getStringSync(text);
		option.value = text;
		return option;
	}
	,__class__: projectaccess_ProjectOptions
};
var tabmanager_ContextMenu = function() { };
$hxClasses["tabmanager.ContextMenu"] = tabmanager_ContextMenu;
tabmanager_ContextMenu.__name__ = ["tabmanager","ContextMenu"];
tabmanager_ContextMenu.createContextMenu = function() {
	var _this = window.document;
	tabmanager_ContextMenu.contextMenu = _this.createElement("div");
	tabmanager_ContextMenu.contextMenu.className = "dropdown";
	tabmanager_ContextMenu.contextMenu.style.position = "absolute";
	tabmanager_ContextMenu.contextMenu.style.display = "none";
	window.document.addEventListener("click",function(e) {
		tabmanager_ContextMenu.contextMenu.style.display = "none";
	});
	var tabManager = tabmanager_TabManager.get();
	var ul;
	var _this1 = window.document;
	ul = _this1.createElement("ul");
	ul.className = "dropdown-menu";
	ul.style.display = "block";
	ul.appendChild(tabmanager_ContextMenu.createContextMenuItem("New File...",$bind(tabManager,tabManager.createFileInNewTab)));
	ul.appendChild(tabmanager_ContextMenu.createDivider());
	ul.appendChild(tabmanager_ContextMenu.createContextMenuItem("Close",function() {
		tabManager.closeTab(tabmanager_ContextMenu.contextMenu.getAttribute("path"));
	}));
	ul.appendChild(tabmanager_ContextMenu.createContextMenuItem("Close All",function() {
		tabManager.closeAll();
	}));
	ul.appendChild(tabmanager_ContextMenu.createContextMenuItem("Close Other",function() {
		var path = tabmanager_ContextMenu.contextMenu.getAttribute("path");
		tabManager.closeOthers(path);
	}));
	ul.appendChild(tabmanager_ContextMenu.createDivider());
	ul.appendChild(tabmanager_ContextMenu.createContextMenuItem("Show Item In Folder",function() {
		var path1 = tabmanager_ContextMenu.contextMenu.getAttribute("path");
		nodejs_webkit_Shell.showItemInFolder(path1);
	}));
	tabmanager_ContextMenu.contextMenu.appendChild(ul);
	window.document.body.appendChild(tabmanager_ContextMenu.contextMenu);
};
tabmanager_ContextMenu.showMenu = function(path,e) {
	tabmanager_ContextMenu.contextMenu.setAttribute("path",path);
	tabmanager_ContextMenu.contextMenu.style.display = "block";
	tabmanager_ContextMenu.contextMenu.style.left = (e.pageX == null?"null":"" + e.pageX) + "px";
	tabmanager_ContextMenu.contextMenu.style.top = (e.pageY == null?"null":"" + e.pageY) + "px";
};
tabmanager_ContextMenu.createContextMenuItem = function(text,onClick) {
	var li;
	var _this = window.document;
	li = _this.createElement("li");
	li.onclick = function(e) {
		onClick();
	};
	var a;
	var _this1 = window.document;
	a = _this1.createElement("a");
	a.href = "#";
	a.textContent = watchers_LocaleWatcher.getStringSync(text);
	li.appendChild(a);
	return li;
};
tabmanager_ContextMenu.createDivider = function() {
	var li;
	var _this = window.document;
	li = _this.createElement("li");
	li.className = "divider";
	return li;
};
var tabmanager_Tab = function(_name,_path,_doc,_save) {
	var _g = this;
	this.ignoreNextUpdates = 0;
	this.name = _name;
	this.doc = _doc;
	this.path = _path;
	this.loaded = false;
	var _this = window.document;
	this.li = _this.createElement("li");
	this.li.title = this.path;
	this.li.setAttribute("path",this.path);
	var tabManagerInstance = tabmanager_TabManager.get();
	var _this1 = window.document;
	this.span3 = _this1.createElement("span");
	this.span3.textContent = this.name + "\t";
	this.li.addEventListener("click",function(e) {
		if(e.button != 1) tabManagerInstance.selectDoc(_g.path); else tabManagerInstance.closeTab(_g.path);
	});
	this.li.addEventListener("contextmenu",function(e1) {
		tabmanager_ContextMenu.showMenu(_g.path,e1);
	});
	this.li.appendChild(this.span3);
	var span;
	var _this2 = window.document;
	span = _this2.createElement("span");
	span.style.position = "relative";
	span.style.top = "2px";
	span.addEventListener("click",function(e2) {
		tabManagerInstance.closeTab(_g.path);
		e2.stopPropagation();
	});
	var span2;
	var _this3 = window.document;
	span2 = _this3.createElement("span");
	span2.className = "glyphicon glyphicon-remove-circle";
	span.appendChild(span2);
	this.li.appendChild(span);
	if(_save) this.save();
	this.startWatcher();
};
$hxClasses["tabmanager.Tab"] = tabmanager_Tab;
tabmanager_Tab.__name__ = ["tabmanager","Tab"];
tabmanager_Tab.prototype = {
	name: null
	,path: null
	,doc: null
	,loaded: null
	,li: null
	,span3: null
	,watcher: null
	,ignoreNextUpdates: null
	,startWatcher: function() {
		var _g = this;
		this.watcher = watchers_Watcher.watchFileForUpdates(this.path,function() {
			if(_g.ignoreNextUpdates <= 0) dialogs_DialogManager.showReloadFileDialog(_g.path,$bind(_g,_g.reloadFile)); else _g.ignoreNextUpdates--;
		});
	}
	,reloadFile: function() {
		var _g = this;
		var tabManagerInstance = tabmanager_TabManager.get();
		tabManagerInstance.openFile(this.path,function(code) {
			_g.doc.setValue(code);
			_g.doc.markClean();
			_g.setChanged(false);
		});
	}
	,setChanged: function(changed) {
		this.span3.textContent = this.name;
		if(changed) this.span3.textContent += "*";
		this.span3.textContent += "\n";
	}
	,remove: function() {
		this.li.remove();
		if(this.watcher != null) this.watcher.close();
	}
	,save: function() {
		this.ignoreNextUpdates++;
		js_Node.require("fs").writeFileSync(this.path,this.doc.getValue(),"utf8");
		this.doc.markClean();
		this.setChanged(false);
	}
	,getElement: function() {
		return this.li;
	}
	,__class__: tabmanager_Tab
};
var tabmanager_TabManager = function() {
};
$hxClasses["tabmanager.TabManager"] = tabmanager_TabManager;
tabmanager_TabManager.__name__ = ["tabmanager","TabManager"];
tabmanager_TabManager.get = function() {
	if(tabmanager_TabManager.instance == null) tabmanager_TabManager.instance = new tabmanager_TabManager();
	return tabmanager_TabManager.instance;
};
tabmanager_TabManager.prototype = {
	tabs: null
	,tabMap: null
	,selectedPath: null
	,selectedIndex: null
	,load: function() {
		var _g = this;
		this.tabs = js_Boot.__cast(window.document.getElementById("tabs") , HTMLUListElement);
		this.tabMap = new tabmanager_TabMap();
		tabmanager_ContextMenu.createContextMenu();
		var options = { };
		options.labels = { };
		options.labels.ok = watchers_LocaleWatcher.getStringSync("Yes");
		options.labels.cancel = watchers_LocaleWatcher.getStringSync("No");
		alertify.set(options);
		var indentWidthLabel;
		indentWidthLabel = js_Boot.__cast(window.document.getElementById("indent-width-label") , HTMLDivElement);
		var indentWidthInput;
		indentWidthInput = js_Boot.__cast(window.document.getElementById("indent-width-input") , HTMLInputElement);
		indentWidthLabel.onclick = function(e) {
			indentWidthLabel.classList.add("hidden");
			indentWidthInput.classList.remove("hidden");
			indentWidthInput.focus();
			indentWidthInput.select();
			indentWidthInput.onblur = function(_) {
				indentWidthLabel.classList.remove("hidden");
				indentWidthInput.classList.add("hidden");
				indentWidthInput.onblur = null;
				indentWidthInput.onkeyup = null;
				cm_Editor.editor.focus();
				_g.setIndentationSize(Std.parseInt(indentWidthInput.value));
			};
			indentWidthInput.onkeyup = function(event) {
				if(event.keyCode == 13) indentWidthInput.blur(); else if(event.keyCode == 27) _g.resetIndentationSettings();
			};
		};
		var indentType = window.document.getElementById("indent-type");
		indentType.onclick = function(_1) {
			var selectedFile = projectaccess_ProjectAccess.getFileByPath(_g.getCurrentDocumentPath());
			if(selectedFile != null) {
				selectedFile.useTabs = !selectedFile.useTabs;
				haxe_Log.trace(selectedFile.useTabs,{ fileName : "TabManager.hx", lineNumber : 135, className : "tabmanager.TabManager", methodName : "load"});
				_g.updateIndentationSettings(selectedFile);
				_g.loadIndentationSettings(cm_Editor.editor,selectedFile);
			}
		};
	}
	,setIndentationSize: function(indentSize) {
		var selectedFile = projectaccess_ProjectAccess.getFileByPath(this.getCurrentDocumentPath());
		if(selectedFile != null) {
			selectedFile.indentSize = indentSize;
			this.updateIndentationSettings(selectedFile);
			this.loadIndentationSettings(cm_Editor.editor,selectedFile);
		}
	}
	,resetIndentationSettings: function() {
		var selectedFile = projectaccess_ProjectAccess.getFileByPath(this.getCurrentDocumentPath());
		if(selectedFile != null) this.updateIndentationSettings(selectedFile);
	}
	,createNewTab: function(name,path,doc,save) {
		if(save == null) save = false;
		var tab = new tabmanager_Tab(name,path,doc,save);
		this.tabMap.add(tab);
		this.tabs.appendChild(tab.getElement());
		if(projectaccess_ProjectAccess.path != null) {
			var relativePath = js_Node.require("path").relative(projectaccess_ProjectAccess.path,path);
			var selectedFile = projectaccess_ProjectAccess.getFileByPath(path);
			if(selectedFile == null) projectaccess_ProjectAccess.currentProject.files.push({ path : relativePath});
		}
		var recentProjectsList = core_RecentProjectsList.get();
		recentProjectsList.addFile(path);
		cm_Editor.resize();
	}
	,openFile: function(path,onComplete) {
		var options = { };
		options.encoding = "utf8";
		js_Node.require("fs").readFile(path,options,function(error,code) {
			if(error != null) haxe_Log.trace(error,{ fileName : "TabManager.hx", lineNumber : 201, className : "tabmanager.TabManager", methodName : "openFile"}); else onComplete(code);
		});
	}
	,openFileInNewTab: function(path,show,onComplete) {
		if(show == null) show = true;
		var _g = this;
		if(core_Utils.os == 0) {
			var ereg = new EReg("[a-z]:\\\\","i");
			if(ereg.match(path)) path = HxOverrides.substr(path,0,3).toLowerCase() + HxOverrides.substr(path,3,null);
		}
		path = StringTools.replace(path,"\\",js_Node.require("path").sep);
		if(this.isAlreadyOpened(path,show)) {
			if(onComplete != null) onComplete();
			return;
		}
		this.openFile(path,function(code) {
			if(_g.isAlreadyOpened(path,show)) {
				if(onComplete != null) onComplete();
				return;
			}
			if(code != null) {
				var mode = _g.getMode(path);
				var name = js_Node.require("path").basename(path);
				var doc = new CodeMirror.Doc(code,mode);
				_g.createNewTab(name,path,doc);
				if(show) _g.selectDoc(path);
				_g.checkTabsCount();
				if(onComplete != null) onComplete();
			} else haxe_Log.trace("tab-manager: can't load file " + path,{ fileName : "TabManager.hx", lineNumber : 272, className : "tabmanager.TabManager", methodName : "openFileInNewTab"});
		});
	}
	,createFileInNewTab: function(pathToFile) {
		var _g = this;
		var path = pathToFile;
		if(path == null) core_FileDialog.saveFile(function(_selectedPath) {
			_g.createNewFile(_selectedPath);
		}); else this.createNewFile(path);
	}
	,resolvePackage: function(pathToFile,onComplete) {
		var pathToProject = projectaccess_ProjectAccess.path;
		var filePackage = "";
		if(pathToProject != null) {
			var classpathWalker = parser_ClasspathWalker.get();
			classpathWalker.getProjectClasspaths(projectaccess_ProjectAccess.currentProject,function(classpathAndLibs) {
				var classpaths = [];
				var _g = 0;
				var _g1 = classpathAndLibs.classpaths;
				while(_g < _g1.length) {
					var item = _g1[_g];
					++_g;
					classpaths.push(item);
				}
				var _g2 = 0;
				var _g11 = classpathAndLibs.libs;
				while(_g2 < _g11.length) {
					var item1 = _g11[_g2];
					++_g2;
					classpaths.push(item1.path);
				}
				var _g3 = 0;
				while(_g3 < classpaths.length) {
					var classpath = classpaths[_g3];
					++_g3;
					if(StringTools.startsWith(pathToFile,classpath)) {
						var dirname = js_Node.require("path").dirname(pathToFile);
						var relativePath = js_Node.require("path").relative(classpath,dirname);
						var fullPackagePath = StringTools.replace(relativePath,js_Node.require("path").sep,".");
						filePackage = fullPackagePath;
					}
				}
				onComplete(filePackage);
			});
		} else onComplete(filePackage);
	}
	,createNewFile: function(path) {
		var _g = this;
		var name = js_Node.require("path").basename(path);
		var mode = this.getMode(name);
		var code = "";
		var extname = js_Node.require("path").extname(name);
		switch(extname) {
		case ".hx":
			path = HxOverrides.substr(path,0,path.length - name.length) + HxOverrides.substr(name,0,1).toUpperCase() + HxOverrides.substr(name,1,null);
			var options = { };
			options.encoding = "utf8";
			var pathToTemplate = js_Node.require("path").join("core","templates","New.tpl");
			var templateCode = js_Node.require("fs").readFileSync(pathToTemplate,options);
			this.resolvePackage(path,function(filePackage) {
				var data = { };
				data.name = js_Node.require("path").basename(name,extname);
				_g.generateTemplate(data,filePackage);
				code = new haxe_Template(templateCode).execute(data);
				_g.createNewDoc(path,name,code,mode);
			});
			break;
		case ".hxml":
			var options1 = { };
			options1.encoding = "utf8";
			var pathToTemplate1 = js_Node.require("path").join("core","templates","build.tpl");
			var templateCode1 = js_Node.require("fs").readFileSync(pathToTemplate1,options1);
			code = templateCode1;
			this.createNewDoc(path,name,code,mode);
			break;
		default:
			this.createNewDoc(path,name,code,mode);
		}
	}
	,generateTemplate: function(data,filePackage) {
		data.pack = filePackage;
		var project = projectaccess_ProjectAccess.currentProject;
		if(project != null) {
			data.author = project.company;
			data.license = project.license;
			data.url = project.url;
		}
		return data;
	}
	,createNewDoc: function(path,name,code,mode) {
		var doc = new CodeMirror.Doc(code,mode);
		this.createNewTab(name,path,doc,true);
		this.selectDoc(path);
		this.checkTabsCount();
		var fileTreeInstance = filetree_FileTree.get();
		fileTreeInstance.load();
	}
	,checkTabsCount: function() {
		if(window.document.getElementById("editor").style.display == "none" && this.tabMap.getTabs().length > 0) {
			$("#editor").show(0);
			var welcomeScreen = core_WelcomeScreen.get();
			welcomeScreen.hide();
			cm_Editor.editor.refresh();
			cm_Editor.resize();
		}
	}
	,closeAll: function() {
		var _g = 0;
		var _g1 = this.tabMap.keys();
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			this.closeTab(key,false);
		}
	}
	,closeOthers: function(path) {
		var _g = 0;
		var _g1 = this.tabMap.keys();
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			if(key != path) this.closeTab(key,false);
		}
		if(this.tabMap.getTabs().length == 1) this.showNextTab();
	}
	,closeTab: function(path,switchToTab) {
		if(switchToTab == null) switchToTab = true;
		var _g = this;
		cm_Editor.saveFoldedRegions();
		if(this.isChanged(path)) alertify.confirm(watchers_LocaleWatcher.getStringSync("File ") + path + watchers_LocaleWatcher.getStringSync(" was changed. Save it?"),function(e) {
			if(e) _g.saveDoc(path);
			_g.removeTab(path,switchToTab);
		}); else this.removeTab(path,switchToTab);
		cm_Editor.resize();
	}
	,removeTab: function(path,switchToTab) {
		var tab = this.tabMap.get(path);
		this.tabMap.remove(path);
		tab.remove();
		this.selectedPath = null;
		if(this.tabMap.getTabs().length > 0) {
			if(switchToTab) this.showPreviousTab();
		} else {
			$("#editor").hide(0);
			var welcomeScreen = core_WelcomeScreen.get();
			if(projectaccess_ProjectAccess.path != null) welcomeScreen.hide(); else welcomeScreen.show();
			var outlinePanel = core_OutlinePanel.get();
			outlinePanel.clearFields();
			outlinePanel.update();
		}
		if(projectaccess_ProjectAccess.path != null) {
			var selectedFile = projectaccess_ProjectAccess.getFileByPath(path);
			HxOverrides.remove(projectaccess_ProjectAccess.currentProject.files,selectedFile);
		}
	}
	,showPreviousTab: function() {
		var index = this.selectedIndex - 1;
		var tabArray = this.tabMap.getTabs();
		if(index < 0) index = tabArray.length - 1;
		this.selectDoc(tabArray[index].path);
	}
	,showNextTab: function() {
		var index = this.selectedIndex + 1;
		var tabArray = this.tabMap.getTabs();
		if(index > tabArray.length - 1) index = 0;
		this.selectDoc(tabArray[index].path);
	}
	,closeActiveTab: function() {
		this.closeTab(this.selectedPath);
	}
	,isAlreadyOpened: function(path,show) {
		if(show == null) show = true;
		var opened = this.tabMap.exists(path);
		if(opened && show) this.selectDoc(path);
		return opened;
	}
	,getMode: function(path) {
		var mode = null;
		var _g = js_Node.require("path").extname(path);
		switch(_g) {
		case ".hx":
			mode = "haxe";
			break;
		case ".hxml":
			mode = "hxml";
			break;
		case ".js":
			mode = "javascript";
			break;
		case ".css":
			mode = "css";
			break;
		case ".json":
			mode = "application/json";
			break;
		case ".xml":
			mode = "xml";
			break;
		case ".html":
			mode = "text/html";
			break;
		case ".md":
			mode = "markdown";
			break;
		case ".sh":case ".bat":
			mode = "shell";
			break;
		case ".ml":
			mode = "ocaml";
			break;
		case ".yaml":case ".yml":
			mode = "yaml";
			break;
		default:
		}
		return mode;
	}
	,selectDoc: function(path) {
		var found = false;
		var keys = this.tabMap.keys();
		var _g1 = 0;
		var _g = keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(keys[i] == path) {
				this.tabMap.get(keys[i]).getElement().className = "selected";
				this.selectedIndex = i;
				found = true;
			} else this.tabMap.get(keys[i]).getElement().className = "";
		}
		var cm1 = cm_Editor.editor;
		if(found) {
			var project = projectaccess_ProjectAccess.currentProject;
			if(this.selectedPath != null && project != null) {
				cm_Editor.saveFoldedRegions();
				cm1.refresh();
			}
			this.selectedPath = path;
			if(projectaccess_ProjectAccess.path != null) project.activeFile = js_Node.require("path").relative(projectaccess_ProjectAccess.path,this.selectedPath);
			var tab = this.tabMap.get(this.selectedPath);
			var doc = tab.doc;
			cm_Editor.editor.swapDoc(doc);
			core_HaxeLint.updateLinting();
			var completionActive = cm_Editor.editor.state.completionActive;
			if(completionActive != null && completionActive.widget != null) completionActive.widget.close();
			if(projectaccess_ProjectAccess.currentProject != null) {
				var selectedFile = projectaccess_ProjectAccess.getFileByPath(this.selectedPath);
				if(selectedFile != null) {
					if(!tab.loaded) {
						var foldedRegions = selectedFile.foldedRegions;
						if(foldedRegions != null) {
							var _g2 = 0;
							while(_g2 < foldedRegions.length) {
								var pos = foldedRegions[_g2];
								++_g2;
								cm1.foldCode(pos,null,"fold");
							}
						}
						if(selectedFile.activeLine != null) {
							var pos1 = { line : selectedFile.activeLine, ch : 0};
							doc.setCursor(pos1);
							cm1.centerOnLine(pos1.line);
						}
						tab.loaded = true;
					}
					if(selectedFile.useTabs == null || selectedFile.indentSize == null) {
						var indentWithTabs = watchers_SettingsWatcher.settings.indentWithTabs;
						var indentSize = watchers_SettingsWatcher.settings.indentSize;
						if(indentWithTabs == null) indentWithTabs = true;
						if(indentSize == null) indentSize = 4;
						selectedFile.useTabs = indentWithTabs;
						this.setIndentationSize(indentSize);
					}
					this.loadIndentationSettings(cm1,selectedFile);
					this.updateIndentationSettings(selectedFile);
				} else haxe_Log.trace("can't load folded regions for active document",{ fileName : "TabManager.hx", lineNumber : 718, className : "tabmanager.TabManager", methodName : "selectDoc"});
			}
			cm1.focus();
			window.document.getElementById("status-file").textContent = "-" + Std.string(doc.lineCount()) + " Lines";
		}
	}
	,loadIndentationSettings: function(cm,selectedFile) {
		cm.setOption("indentWithTabs",selectedFile.useTabs);
		if(selectedFile.useTabs) cm.setOption("tabSize",selectedFile.indentSize); else cm.setOption("indentUnit",selectedFile.indentSize);
	}
	,updateIndentationSettings: function(selectedFile) {
		var indentType = window.document.getElementById("indent-type");
		if(selectedFile.useTabs) indentType.textContent = "Tab Size:"; else indentType.textContent = "Spaces:";
		var indentWidthInput;
		indentWidthInput = js_Boot.__cast(window.document.getElementById("indent-width-input") , HTMLInputElement);
		if(selectedFile.indentSize == null) indentWidthInput.value = "null"; else indentWidthInput.value = "" + selectedFile.indentSize;
		var indentWidthLabel;
		indentWidthLabel = js_Boot.__cast(window.document.getElementById("indent-width-label") , HTMLDivElement);
		if(selectedFile.indentSize == null) indentWidthLabel.textContent = "null"; else indentWidthLabel.textContent = "" + selectedFile.indentSize;
	}
	,getCurrentDocumentPath: function() {
		return this.selectedPath;
	}
	,getCurrentDocument: function() {
		var doc = null;
		if(this.selectedPath != null) {
			var tab = this.tabMap.get(this.selectedPath);
			if(tab != null) doc = tab.doc;
		}
		return doc;
	}
	,saveDoc: function(path,onComplete) {
		if(this.isChanged(path)) {
			var tab = this.tabMap.get(path);
			tab.save();
		}
		if(onComplete != null) onComplete();
	}
	,isChanged: function(path) {
		var tab = this.tabMap.get(path);
		return !tab.doc.isClean();
	}
	,saveActiveFile: function(onComplete) {
		if(this.selectedPath != null) this.saveDoc(this.selectedPath,onComplete); else haxe_Log.trace(this.selectedPath,{ fileName : "TabManager.hx", lineNumber : 813, className : "tabmanager.TabManager", methodName : "saveActiveFile"});
	}
	,saveActiveFileAs: function() {
		var _g = this;
		var tab = this.tabMap.get(this.selectedPath);
		core_FileDialog.saveFile(function(path) {
			_g.tabMap.remove(_g.selectedPath);
			tab.path = path;
			_g.selectedPath = path;
			_g.tabMap.add(tab);
			_g.saveDoc(_g.selectedPath);
		},tab.name);
	}
	,saveAll: function(onComplete) {
		var _g = 0;
		var _g1 = this.tabMap.keys();
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			this.saveDoc(key);
		}
		if(onComplete != null) onComplete();
	}
	,__class__: tabmanager_TabManager
};
var tabmanager_TabMap = function() {
	this.tabArray = [];
};
$hxClasses["tabmanager.TabMap"] = tabmanager_TabMap;
tabmanager_TabMap.__name__ = ["tabmanager","TabMap"];
tabmanager_TabMap.prototype = {
	tabArray: null
	,get: function(path) {
		var tab = null;
		var _g = 0;
		var _g1 = this.tabArray;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.path == path) {
				tab = t;
				break;
			}
		}
		return tab;
	}
	,exists: function(path) {
		var exists = false;
		var _g = 0;
		var _g1 = this.tabArray;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.path == path) {
				exists = true;
				break;
			}
		}
		return exists;
	}
	,getIndex: function(path) {
		var index = -1;
		var _g1 = 0;
		var _g = this.tabArray.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.tabArray[i].path == path) {
				index = i;
				break;
			}
		}
		return index;
	}
	,add: function(tab) {
		this.tabArray.push(tab);
	}
	,remove: function(path) {
		this.tabArray.splice(this.getIndex(path),1);
	}
	,keys: function() {
		var keys = [];
		var _g = 0;
		var _g1 = this.tabArray;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			keys.push(t.path);
		}
		return keys;
	}
	,getTabs: function() {
		return this.tabArray;
	}
	,__class__: tabmanager_TabMap
};
var tjson_TJSON = function() { };
$hxClasses["tjson.TJSON"] = tjson_TJSON;
tjson_TJSON.__name__ = ["tjson","TJSON"];
tjson_TJSON.parse = function(json,fileName,stringProcessor) {
	if(fileName == null) fileName = "JSON Data";
	var t = new tjson_TJSONParser(json,fileName,stringProcessor);
	return t.doParse();
};
tjson_TJSON.encode = function(obj,style,useCache) {
	if(useCache == null) useCache = true;
	var t = new tjson_TJSONEncoder(useCache);
	return t.doEncode(obj,style);
};
var tjson_TJSONParser = function(vjson,vfileName,stringProcessor) {
	if(vfileName == null) vfileName = "JSON Data";
	this.json = vjson;
	this.fileName = vfileName;
	this.currentLine = 1;
	this.lastSymbolQuoted = false;
	this.pos = 0;
	this.floatRegex = new EReg("^-?[0-9]*\\.[0-9]+$","");
	this.intRegex = new EReg("^-?[0-9]+$","");
	if(stringProcessor == null) this.strProcessor = $bind(this,this.defaultStringProcessor); else this.strProcessor = stringProcessor;
	this.cache = [];
};
$hxClasses["tjson.TJSONParser"] = tjson_TJSONParser;
tjson_TJSONParser.__name__ = ["tjson","TJSONParser"];
tjson_TJSONParser.prototype = {
	pos: null
	,json: null
	,lastSymbolQuoted: null
	,fileName: null
	,currentLine: null
	,cache: null
	,floatRegex: null
	,intRegex: null
	,strProcessor: null
	,doParse: function() {
		try {
			var _g = this.getNextSymbol();
			var s = _g;
			switch(_g) {
			case "{":
				return this.doObject();
			case "[":
				return this.doArray();
			default:
				return this.convertSymbolToProperType(s);
			}
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			if( js_Boot.__instanceof(e,String) ) {
				throw new js__$Boot_HaxeError(this.fileName + " on line " + this.currentLine + ": " + e);
			} else throw(e);
		}
	}
	,doObject: function() {
		var o = { };
		var val = "";
		var key;
		var isClassOb = false;
		this.cache.push(o);
		while(this.pos < this.json.length) {
			key = this.getNextSymbol();
			if(key == "," && !this.lastSymbolQuoted) continue;
			if(key == "}" && !this.lastSymbolQuoted) {
				if(isClassOb && o.TJ_unserialize != null) o.TJ_unserialize();
				return o;
			}
			var seperator = this.getNextSymbol();
			if(seperator != ":") throw new js__$Boot_HaxeError("Expected ':' but got '" + seperator + "' instead.");
			var v = this.getNextSymbol();
			if(key == "_hxcls") {
				var cls = Type.resolveClass(v);
				if(cls == null) throw new js__$Boot_HaxeError("Invalid class name - " + v);
				o = Type.createEmptyInstance(cls);
				this.cache.pop();
				this.cache.push(o);
				isClassOb = true;
				continue;
			}
			if(v == "{" && !this.lastSymbolQuoted) val = this.doObject(); else if(v == "[" && !this.lastSymbolQuoted) val = this.doArray(); else val = this.convertSymbolToProperType(v);
			o[key] = val;
		}
		throw new js__$Boot_HaxeError("Unexpected end of file. Expected '}'");
	}
	,doArray: function() {
		var a = [];
		var val;
		while(this.pos < this.json.length) {
			val = this.getNextSymbol();
			if(val == "," && !this.lastSymbolQuoted) continue; else if(val == "]" && !this.lastSymbolQuoted) return a; else if(val == "{" && !this.lastSymbolQuoted) val = this.doObject(); else if(val == "[" && !this.lastSymbolQuoted) val = this.doArray(); else val = this.convertSymbolToProperType(val);
			a.push(val);
		}
		throw new js__$Boot_HaxeError("Unexpected end of file. Expected ']'");
	}
	,convertSymbolToProperType: function(symbol) {
		if(this.lastSymbolQuoted) {
			if(StringTools.startsWith(symbol,tjson_TJSON.OBJECT_REFERENCE_PREFIX)) {
				var idx = Std.parseInt(HxOverrides.substr(symbol,tjson_TJSON.OBJECT_REFERENCE_PREFIX.length,null));
				return this.cache[idx];
			}
			return symbol;
		}
		if(this.looksLikeFloat(symbol)) return parseFloat(symbol);
		if(this.looksLikeInt(symbol)) return Std.parseInt(symbol);
		if(symbol.toLowerCase() == "true") return true;
		if(symbol.toLowerCase() == "false") return false;
		if(symbol.toLowerCase() == "null") return null;
		return symbol;
	}
	,looksLikeFloat: function(s) {
		return this.floatRegex.match(s) || this.intRegex.match(s) && (function($this) {
			var $r;
			var intStr = $this.intRegex.matched(0);
			$r = HxOverrides.cca(intStr,0) == 45?intStr > "-2147483648":intStr > "2147483647";
			return $r;
		}(this));
	}
	,looksLikeInt: function(s) {
		return this.intRegex.match(s);
	}
	,getNextSymbol: function() {
		this.lastSymbolQuoted = false;
		var c = "";
		var inQuote = false;
		var quoteType = "";
		var symbol = "";
		var inEscape = false;
		var inSymbol = false;
		var inLineComment = false;
		var inBlockComment = false;
		while(this.pos < this.json.length) {
			c = this.json.charAt(this.pos++);
			if(c == "\n" && !inSymbol) this.currentLine++;
			if(inLineComment) {
				if(c == "\n" || c == "\r") {
					inLineComment = false;
					this.pos++;
				}
				continue;
			}
			if(inBlockComment) {
				if(c == "*" && this.json.charAt(this.pos) == "/") {
					inBlockComment = false;
					this.pos++;
				}
				continue;
			}
			if(inQuote) {
				if(inEscape) {
					inEscape = false;
					if(c == "'" || c == "\"") {
						symbol += c;
						continue;
					}
					if(c == "t") {
						symbol += "\t";
						continue;
					}
					if(c == "n") {
						symbol += "\n";
						continue;
					}
					if(c == "\\") {
						symbol += "\\";
						continue;
					}
					if(c == "r") {
						symbol += "\r";
						continue;
					}
					if(c == "/") {
						symbol += "/";
						continue;
					}
					if(c == "u") {
						var hexValue = 0;
						var _g = 0;
						while(_g < 4) {
							var i = _g++;
							if(this.pos >= this.json.length) throw new js__$Boot_HaxeError("Unfinished UTF8 character");
							var nc;
							var index = this.pos++;
							nc = HxOverrides.cca(this.json,index);
							hexValue = hexValue << 4;
							if(nc >= 48 && nc <= 57) hexValue += nc - 48; else if(nc >= 65 && nc <= 70) hexValue += 10 + nc - 65; else if(nc >= 97 && nc <= 102) hexValue += 10 + nc - 95; else throw new js__$Boot_HaxeError("Not a hex digit");
						}
						var utf = new haxe_Utf8();
						utf.__b += String.fromCharCode(hexValue);
						symbol += utf.__b;
						continue;
					}
					throw new js__$Boot_HaxeError("Invalid escape sequence '\\" + c + "'");
				} else {
					if(c == "\\") {
						inEscape = true;
						continue;
					}
					if(c == quoteType) return symbol;
					symbol += c;
					continue;
				}
			} else if(c == "/") {
				var c2 = this.json.charAt(this.pos);
				if(c2 == "/") {
					inLineComment = true;
					this.pos++;
					continue;
				} else if(c2 == "*") {
					inBlockComment = true;
					this.pos++;
					continue;
				}
			}
			if(inSymbol) {
				if(c == " " || c == "\n" || c == "\r" || c == "\t" || c == "," || c == ":" || c == "}" || c == "]") {
					this.pos--;
					return symbol;
				} else {
					symbol += c;
					continue;
				}
			} else {
				if(c == " " || c == "\t" || c == "\n" || c == "\r") continue;
				if(c == "{" || c == "}" || c == "[" || c == "]" || c == "," || c == ":") return c;
				if(c == "'" || c == "\"") {
					inQuote = true;
					quoteType = c;
					this.lastSymbolQuoted = true;
					continue;
				} else {
					inSymbol = true;
					symbol = c;
					continue;
				}
			}
		}
		if(inQuote) throw new js__$Boot_HaxeError("Unexpected end of data. Expected ( " + quoteType + " )");
		return symbol;
	}
	,defaultStringProcessor: function(str) {
		return str;
	}
	,__class__: tjson_TJSONParser
};
var tjson_TJSONEncoder = function(useCache) {
	if(useCache == null) useCache = true;
	this.uCache = useCache;
	if(this.uCache) this.cache = [];
};
$hxClasses["tjson.TJSONEncoder"] = tjson_TJSONEncoder;
tjson_TJSONEncoder.__name__ = ["tjson","TJSONEncoder"];
tjson_TJSONEncoder.prototype = {
	cache: null
	,uCache: null
	,doEncode: function(obj,style) {
		if(!Reflect.isObject(obj)) throw new js__$Boot_HaxeError("Provided object is not an object.");
		var st;
		if(js_Boot.__instanceof(style,tjson_EncodeStyle)) st = style; else if(style == "fancy") st = new tjson_FancyStyle(); else st = new tjson_SimpleStyle();
		var buffer = new StringBuf();
		if((obj instanceof Array) && obj.__enum__ == null || js_Boot.__instanceof(obj,List)) buffer.add(this.encodeIterable(obj,st,0)); else if(js_Boot.__instanceof(obj,haxe_ds_StringMap)) buffer.add(this.encodeMap(obj,st,0)); else {
			this.cacheEncode(obj);
			buffer.add(this.encodeObject(obj,st,0));
		}
		return buffer.b;
	}
	,encodeObject: function(obj,style,depth) {
		var buffer = new StringBuf();
		buffer.add(style.beginObject(depth));
		var fieldCount = 0;
		var fields;
		var dontEncodeFields = null;
		var cls = Type.getClass(obj);
		if(cls != null) fields = Type.getInstanceFields(cls); else fields = Reflect.fields(obj);
		{
			var _g = Type["typeof"](obj);
			switch(_g[1]) {
			case 6:
				var c = _g[2];
				if(fieldCount++ > 0) buffer.add(style.entrySeperator(depth)); else buffer.add(style.firstEntry(depth));
				buffer.add("\"_hxcls\"" + style.keyValueSeperator(depth));
				buffer.add(this.encodeValue(Type.getClassName(c),style,depth));
				if(obj.TJ_noEncode != null) dontEncodeFields = obj.TJ_noEncode();
				break;
			default:
			}
		}
		var _g1 = 0;
		while(_g1 < fields.length) {
			var field = fields[_g1];
			++_g1;
			if(dontEncodeFields != null && HxOverrides.indexOf(dontEncodeFields,field,0) >= 0) continue;
			var value = Reflect.field(obj,field);
			var vStr = this.encodeValue(value,style,depth);
			if(vStr != null) {
				if(fieldCount++ > 0) buffer.add(style.entrySeperator(depth)); else buffer.add(style.firstEntry(depth));
				buffer.add("\"" + field + "\"" + style.keyValueSeperator(depth) + vStr);
			}
		}
		buffer.add(style.endObject(depth));
		return buffer.b;
	}
	,encodeMap: function(obj,style,depth) {
		var buffer = new StringBuf();
		buffer.add(style.beginObject(depth));
		var fieldCount = 0;
		var $it0 = obj.keys();
		while( $it0.hasNext() ) {
			var field = $it0.next();
			if(fieldCount++ > 0) buffer.add(style.entrySeperator(depth)); else buffer.add(style.firstEntry(depth));
			var value = obj.get(field);
			buffer.add("\"" + field + "\"" + style.keyValueSeperator(depth));
			buffer.add(this.encodeValue(value,style,depth));
		}
		buffer.add(style.endObject(depth));
		return buffer.b;
	}
	,encodeIterable: function(obj,style,depth) {
		var buffer = new StringBuf();
		buffer.add(style.beginArray(depth));
		var fieldCount = 0;
		var $it0 = $iterator(obj)();
		while( $it0.hasNext() ) {
			var value = $it0.next();
			if(fieldCount++ > 0) buffer.add(style.entrySeperator(depth)); else buffer.add(style.firstEntry(depth));
			buffer.add(this.encodeValue(value,style,depth));
		}
		buffer.add(style.endArray(depth));
		return buffer.b;
	}
	,cacheEncode: function(value) {
		if(!this.uCache) return null;
		var _g1 = 0;
		var _g = this.cache.length;
		while(_g1 < _g) {
			var c = _g1++;
			if(this.cache[c] == value) return "\"" + tjson_TJSON.OBJECT_REFERENCE_PREFIX + c + "\"";
		}
		this.cache.push(value);
		return null;
	}
	,encodeValue: function(value,style,depth) {
		if(((value | 0) === value) || typeof(value) == "number") return value; else if((value instanceof Array) && value.__enum__ == null || js_Boot.__instanceof(value,List)) {
			var v = value;
			return this.encodeIterable(v,style,depth + 1);
		} else if(js_Boot.__instanceof(value,List)) {
			var v1 = value;
			return this.encodeIterable(v1,style,depth + 1);
		} else if(js_Boot.__instanceof(value,haxe_ds_StringMap)) return this.encodeMap(value,style,depth + 1); else if(typeof(value) == "string") return "\"" + StringTools.replace(StringTools.replace(StringTools.replace(StringTools.replace(Std.string(value),"\\","\\\\"),"\n","\\n"),"\r","\\r"),"\"","\\\"") + "\""; else if(typeof(value) == "boolean") return value; else if(Reflect.isObject(value)) {
			var ret = this.cacheEncode(value);
			if(ret != null) return ret;
			return this.encodeObject(value,style,depth + 1);
		} else if(value == null) return "null"; else return null;
	}
	,__class__: tjson_TJSONEncoder
};
var tjson_EncodeStyle = function() { };
$hxClasses["tjson.EncodeStyle"] = tjson_EncodeStyle;
tjson_EncodeStyle.__name__ = ["tjson","EncodeStyle"];
tjson_EncodeStyle.prototype = {
	beginObject: null
	,endObject: null
	,beginArray: null
	,endArray: null
	,firstEntry: null
	,entrySeperator: null
	,keyValueSeperator: null
	,__class__: tjson_EncodeStyle
};
var tjson_SimpleStyle = function() {
};
$hxClasses["tjson.SimpleStyle"] = tjson_SimpleStyle;
tjson_SimpleStyle.__name__ = ["tjson","SimpleStyle"];
tjson_SimpleStyle.__interfaces__ = [tjson_EncodeStyle];
tjson_SimpleStyle.prototype = {
	beginObject: function(depth) {
		return "{";
	}
	,endObject: function(depth) {
		return "}";
	}
	,beginArray: function(depth) {
		return "[";
	}
	,endArray: function(depth) {
		return "]";
	}
	,firstEntry: function(depth) {
		return "";
	}
	,entrySeperator: function(depth) {
		return ",";
	}
	,keyValueSeperator: function(depth) {
		return ":";
	}
	,__class__: tjson_SimpleStyle
};
var tjson_FancyStyle = function(tab) {
	if(tab == null) tab = "    ";
	this.tab = tab;
	this.charTimesNCache = [""];
};
$hxClasses["tjson.FancyStyle"] = tjson_FancyStyle;
tjson_FancyStyle.__name__ = ["tjson","FancyStyle"];
tjson_FancyStyle.__interfaces__ = [tjson_EncodeStyle];
tjson_FancyStyle.prototype = {
	tab: null
	,beginObject: function(depth) {
		return "{\n";
	}
	,endObject: function(depth) {
		return "\n" + this.charTimesN(depth) + "}";
	}
	,beginArray: function(depth) {
		return "[\n";
	}
	,endArray: function(depth) {
		return "\n" + this.charTimesN(depth) + "]";
	}
	,firstEntry: function(depth) {
		return this.charTimesN(depth + 1) + " ";
	}
	,entrySeperator: function(depth) {
		return "\n" + this.charTimesN(depth + 1) + ",";
	}
	,keyValueSeperator: function(depth) {
		return " : ";
	}
	,charTimesNCache: null
	,charTimesN: function(n) {
		if(n < this.charTimesNCache.length) return this.charTimesNCache[n]; else return this.charTimesNCache[n] = this.charTimesN(n - 1) + this.tab;
	}
	,__class__: tjson_FancyStyle
};
var tools_gradle_GradleConfig = function() {
	this.path = "";
	this.settingsFile = "";
	this.buildFile = "";
	this.showDebug = false;
	this.showStack = false;
};
$hxClasses["tools.gradle.GradleConfig"] = tools_gradle_GradleConfig;
tools_gradle_GradleConfig.__name__ = ["tools","gradle","GradleConfig"];
tools_gradle_GradleConfig.prototype = {
	path: null
	,settingsFile: null
	,buildFile: null
	,showDebug: null
	,showStack: null
	,__class__: tools_gradle_GradleConfig
};
var tools_gradle_Tool = function() {
	this.gradleTool = tools_gradle_GradleTool.get();
};
$hxClasses["tools.gradle.Tool"] = tools_gradle_Tool;
tools_gradle_Tool.__name__ = ["tools","gradle","Tool"];
tools_gradle_Tool.prototype = {
	gradleTool: null
	,__class__: tools_gradle_Tool
};
var tools_gradle_GradleHeaderMenu = function() {
	tools_gradle_Tool.call(this);
};
$hxClasses["tools.gradle.GradleHeaderMenu"] = tools_gradle_GradleHeaderMenu;
tools_gradle_GradleHeaderMenu.__name__ = ["tools","gradle","GradleHeaderMenu"];
tools_gradle_GradleHeaderMenu.__super__ = tools_gradle_Tool;
tools_gradle_GradleHeaderMenu.prototype = $extend(tools_gradle_Tool.prototype,{
	create: function() {
		this.destroy();
		var menu1 = menu_BootstrapMenu.getMenu("Gradle");
		var i = 0;
		this.setupFirstMenu(menu1);
		this.setupSecondMenu(menu1);
		this.setupThirdMenu(menu1);
		menu1.addMenuItem("HotkeyPanel",++i,($_=new tools_gradle_GradleHotkeyPanel(menu1),$bind($_,$_.show)),"Ctrl-Alt-G");
	}
	,setupFirstMenu: function(menu) {
		var submenu = menu.addSubmenu("Tasks");
		var list = this.gradleTool.getTaskList();
		this.createSubmenuItens(submenu,list);
	}
	,setupSecondMenu: function(menu) {
		var submenu = menu.addSubmenu("HelpTasks");
		var list = this.gradleTool.getSetupTaskList();
		this.createSubmenuItens(submenu,list);
	}
	,setupThirdMenu: function(menu) {
		var submenu = menu.addSubmenu("SetupTasks");
		var list = this.gradleTool.getHelpTaskList();
		this.createSubmenuItens(submenu,list);
	}
	,createSubmenuItens: function(submenu,list) {
		var _g1 = this;
		var length = list.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var commandName = [list[i]];
			submenu.addMenuItem(commandName[0],i,(function(commandName) {
				return function() {
					_g1.gradleTool.executeTask(null,[commandName[0]]);
				};
			})(commandName));
		}
	}
	,destroy: function() {
		menu_BootstrapMenu.removeMenu("Gradle");
	}
	,__class__: tools_gradle_GradleHeaderMenu
});
var tools_gradle_GradleHotkeyPanel = function(__menu) {
	flambeproject_HeaderHotkeyPanel.call(this,__menu);
};
$hxClasses["tools.gradle.GradleHotkeyPanel"] = tools_gradle_GradleHotkeyPanel;
tools_gradle_GradleHotkeyPanel.__name__ = ["tools","gradle","GradleHotkeyPanel"];
tools_gradle_GradleHotkeyPanel.__super__ = flambeproject_HeaderHotkeyPanel;
tools_gradle_GradleHotkeyPanel.prototype = $extend(flambeproject_HeaderHotkeyPanel.prototype,{
	show: function() {
		this.setupList();
		this.qickHotkeyPanel.show("Gradle",this.listGroup,true);
	}
	,setupList: function() {
		this.listGroup.clear();
		var submenu = this.menu.getSubmenu("Tasks");
		var items = submenu.getItems();
		var item;
		var length = items.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			item = items[i];
			this.listGroup.addItem(item.menuItem,Std.string(i + 1),item.action);
		}
	}
	,__class__: tools_gradle_GradleHotkeyPanel
});
var tools_gradle_GradleProcess = function() {
	tools_gradle_Tool.call(this);
	this.runningProcessesControl = new tools_gradle_RunningProcessesControl();
};
$hxClasses["tools.gradle.GradleProcess"] = tools_gradle_GradleProcess;
tools_gradle_GradleProcess.__name__ = ["tools","gradle","GradleProcess"];
tools_gradle_GradleProcess.__super__ = tools_gradle_Tool;
tools_gradle_GradleProcess.prototype = $extend(tools_gradle_Tool.prototype,{
	runningProcessesControl: null
	,buildFileOption: null
	,run: function(file,params,onComplete,onFailed) {
		var _g = this;
		var isRunning = this.runningProcessesControl.check(file,params);
		if(isRunning == true) {
			haxe_Log.trace("isRunning->",{ fileName : "GradleProcess.hx", lineNumber : 30, className : "tools.gradle.GradleProcess", methodName : "run", customParams : [file,params]});
			return;
		}
		var key = this.runningProcessesControl.lastKey;
		if(file == null) file = js_Node.require("path").join(projectaccess_ProjectAccess.path,this.gradleTool.config.path,this.gradleTool.config.buildFile);
		this.buildFileOption = ["-b",file];
		if(params == null) params = [];
		params = this.buildFileOption.concat(params);
		var completeHandler = function(stdout,stderr) {
			_g.runningProcessesControl.stopProcesses(key);
			_g.setOutput(stdout,stderr);
			if(onComplete == null) return;
			onComplete(stdout,stderr);
		};
		var failedHandler = function(code,stdout1,stderr1) {
			_g.runningProcessesControl.stopProcesses(key);
			_g.setOutput(stdout1,stderr1,code);
			if(onFailed != null) onFailed(code,stdout1,stderr1);
		};
		var processHelper = core_ProcessHelper.get();
		processHelper.runProcess("gradle",params,projectaccess_ProjectAccess.path,completeHandler,failedHandler);
	}
	,setOutput: function(stdout,stderr,code) {
		if(code == null) code = -1;
		if(stderr == null) stderr = "";
		if(stdout == null) stdout = "";
		this.gradleTool.setOutput();
		this.gradleTool.setOutput("Complete!");
		this.gradleTool.setOutput(stdout,stderr,code);
	}
	,__class__: tools_gradle_GradleProcess
});
var tools_gradle_RunningProcessesControl = function() {
	this.separator = "-";
	this.map = new haxe_ds_StringMap();
};
$hxClasses["tools.gradle.RunningProcessesControl"] = tools_gradle_RunningProcessesControl;
tools_gradle_RunningProcessesControl.__name__ = ["tools","gradle","RunningProcessesControl"];
tools_gradle_RunningProcessesControl.prototype = {
	lastKey: null
	,separator: null
	,map: null
	,check: function(file,params) {
		this.lastKey = this.createKey(file,params);
		if(this.map.exists(this.lastKey) == true) return this.map.get(this.lastKey);
		this.startProcesses(this.lastKey);
		return false;
	}
	,stopProcesses: function(key) {
		this.map.set(key,false);
		return key;
	}
	,startProcesses: function(key) {
		this.map.set(key,true);
		return key;
	}
	,createKey: function(file,params) {
		var key = file;
		var length = params.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			key += this.separator + params[i];
		}
		return key;
	}
	,__class__: tools_gradle_RunningProcessesControl
};
var tools_gradle_GradleTasks = function() {
	tools_gradle_Tool.call(this);
	this.destroy();
};
$hxClasses["tools.gradle.GradleTasks"] = tools_gradle_GradleTasks;
tools_gradle_GradleTasks.__name__ = ["tools","gradle","GradleTasks"];
tools_gradle_GradleTasks.__super__ = tools_gradle_Tool;
tools_gradle_GradleTasks.prototype = $extend(tools_gradle_Tool.prototype,{
	setupTasks: null
	,helpTasks: null
	,otherTasks: null
	,destroy: function() {
		this.setupTasks = [];
		this.helpTasks = [];
		this.otherTasks = [];
	}
	,setup: function() {
		this.searchTasks();
	}
	,searchTasks: function() {
		this.gradleTool.executeTask(null,["tasks --all"],$bind(this,this.onSearchTasksHandler));
	}
	,onSearchTasksHandler: function(stdout,stderr) {
		if(stdout == "") return;
		this.populateLists(stdout);
		this.gradleTool.setupHeaderMenu();
	}
	,populateLists: function(stdout) {
		if(this.setupTasks.length > 0) return;
		var lines = stdout.split("\n");
		var l = lines.length;
		var isSetupTasks = false;
		var isHelpTasks = false;
		var isOtherTasks = false;
		var _g = 5;
		while(_g < l) {
			var i = _g++;
			var value = lines[i];
			if(value.length == 1) continue;
			if(value.indexOf("----------") != -1) continue;
			if(value.indexOf("BUILD SUCCESSFUL") != -1) break;
			if(value.indexOf("Build Setup tasks") != -1) {
				isSetupTasks = true;
				continue;
			}
			if(value.indexOf("Help tasks") != -1) {
				isHelpTasks = true;
				continue;
			}
			var indexSeparator = value.indexOf(" - ");
			if(indexSeparator != -1) value = value.substring(0,indexSeparator);
			if(value.indexOf(" ") != -1) continue;
			if(isOtherTasks == true) this.otherTasks[this.otherTasks.length] = value; else if(isHelpTasks == true) {
				this.helpTasks[this.helpTasks.length] = value;
				if(value == "tasks") isOtherTasks = true;
			} else if(isSetupTasks == true) this.setupTasks[this.setupTasks.length] = value;
		}
	}
	,__class__: tools_gradle_GradleTasks
});
var tools_gradle_GradleTool = function(forceSingleton) {
};
$hxClasses["tools.gradle.GradleTool"] = tools_gradle_GradleTool;
tools_gradle_GradleTool.__name__ = ["tools","gradle","GradleTool"];
tools_gradle_GradleTool.get = function() {
	if(tools_gradle_GradleTool.instance == null) {
		tools_gradle_GradleTool.instance = new tools_gradle_GradleTool(new tools_gradle_ForceSingleton());
		tools_gradle_GradleTool.instance.startTools();
	}
	return tools_gradle_GradleTool.instance;
};
tools_gradle_GradleTool.prototype = {
	process: null
	,headerMenu: null
	,config: null
	,tasks: null
	,tab: null
	,startTools: function() {
		this.process = new tools_gradle_GradleProcess();
		this.headerMenu = new tools_gradle_GradleHeaderMenu();
		this.config = new tools_gradle_GradleConfig();
		this.tasks = new tools_gradle_GradleTasks();
		this.tab = new tools_gradle_GraldeTab();
	}
	,setup: function() {
		this.tab.setup();
		this.searchBuildFile();
	}
	,searchBuildFile: function() {
		var _g = this;
		var t = new haxe_Timer(500);
		t.run = function() {
			if(projectaccess_ProjectAccess.path == null) return;
			var fileName = _g.getFileName();
			var fileExist = js_Node.require("fs").existsSync(fileName);
			if(fileExist == false) fileExist = _g.searchOnDefaultFolder();
			if(fileExist) _g.ready();
			t.stop();
		};
	}
	,getFileName: function() {
		if(this.config.buildFile != "") {
			if(StringTools.endsWith(this.config.buildFile,".gradle") == false) this.config.buildFile += ".gradle";
			this.config.buildFile = this.config.buildFile;
		} else this.config.buildFile = "build" + ".gradle";
		if(this.config.path != "") this.config.path = this.config.path; else this.config.path = "";
		var buildFIle = js_Node.require("path").join(projectaccess_ProjectAccess.path,this.config.path,this.config.buildFile);
		return buildFIle;
	}
	,searchOnDefaultFolder: function() {
		this.config.path = "gradle";
		this.config.buildFile = "build" + ".gradle";
		var buildFile = js_Node.require("path").join(projectaccess_ProjectAccess.path,this.config.path,this.config.buildFile);
		return js_Node.require("fs").existsSync(buildFile);
	}
	,ready: function() {
		this.tab.show();
		this.tasks.setup();
	}
	,setupHeaderMenu: function() {
		this.headerMenu.create();
		this.setOutput();
		this.setOutput("Have a look at menu!");
	}
	,getTaskList: function() {
		return this.tasks.otherTasks;
	}
	,getSetupTaskList: function() {
		return this.tasks.setupTasks;
	}
	,getHelpTaskList: function() {
		return this.tasks.helpTasks;
	}
	,executeTask: function(file,params,onComplete,onFailed) {
		this.tab.set_text("");
		this.tab.set_text("Running...");
		this.process.run(file,params,onComplete,onFailed);
	}
	,setOutput: function(stdout,stderr,code) {
		if(code == null) code = -1;
		if(stderr == null) stderr = "";
		if(stdout == null) stdout = "";
		if(stderr != "" || code != -1) {
			this.tab.set_text("Error:" + stderr);
			this.tab.set_text("ErrorCode:" + code);
		} else this.tab.set_text(stdout);
	}
	,destroy: function() {
		this.tasks.destroy();
		this.tab.destroy();
		this.headerMenu.destroy();
	}
	,__class__: tools_gradle_GradleTool
};
var tools_gradle_ForceSingleton = function() {
};
$hxClasses["tools.gradle.ForceSingleton"] = tools_gradle_ForceSingleton;
tools_gradle_ForceSingleton.__name__ = ["tools","gradle","ForceSingleton"];
tools_gradle_ForceSingleton.prototype = {
	__class__: tools_gradle_ForceSingleton
};
var tools_gradle_Tabs = function(name) {
	this.name = name;
	this.divTag = name + "Tab";
	this.spanTag = name + "OutputTab";
	this.listItemTag = this.spanTag + "LI";
	this.textAreaTag = this.divTag + "TextArea";
};
$hxClasses["tools.gradle.Tabs"] = tools_gradle_Tabs;
tools_gradle_Tabs.__name__ = ["tools","gradle","Tabs"];
tools_gradle_Tabs.prototype = {
	name: null
	,divTag: null
	,listItemTag: null
	,spanTag: null
	,textAreaTag: null
	,textAreaElement: null
	,divElement: null
	,spanElement: null
	,listItemElement: null
	,setup: function() {
		this.setupElements();
		this.hide();
	}
	,setupElements: function() {
		this.setupLine();
		this.setupSpan();
		this.setupDiv();
		this.setupTextArea();
	}
	,setupLine: function() {
		this.listItemElement = window.document.getElementById(this.listItemTag);
	}
	,setupSpan: function() {
		this.spanElement = window.document.getElementById(this.spanTag);
	}
	,setupDiv: function() {
		if(this.divElement != null) return;
		this.divElement = window.document.getElementById(this.divTag);
	}
	,setupTextArea: function() {
		if(this.textAreaElement != null) return;
		var _this = window.document;
		this.textAreaElement = _this.createElement("textarea");
		this.textAreaElement.id = this.textAreaTag;
		this.textAreaElement.style.color = "#838383";
		this.textAreaElement.style.fontSize = "10pt";
		this.textAreaElement.style.width = "100%";
		this.textAreaElement.style.height = "100%";
		this.textAreaElement.style.resize = "none";
		this.textAreaElement.value = "";
		this.textAreaElement.readOnly = true;
		this.divElement.appendChild(this.textAreaElement);
	}
	,show: function() {
		$("#" + this.listItemTag).show();
		$("#" + this.divTag).show();
	}
	,hide: function() {
		$("#" + this.listItemTag).hide();
		$("#" + this.divTag).hide();
	}
	,active: function() {
		this.spanElement.click();
	}
	,set_text: function(value) {
		if(this.textAreaElement == null) return "";
		if(value == "" || value == null) {
			this.textAreaElement.value = "";
			return "";
		}
		this.active();
		this.textAreaElement.scrollTop = this.textAreaElement.scrollHeight;
		return this.textAreaElement.value += value + "\n";
	}
	,destroy: function() {
		this.hide();
		this.set_text("");
	}
	,__class__: tools_gradle_Tabs
};
var tools_gradle_GraldeTab = function() {
	tools_gradle_Tabs.call(this,"Gradle");
};
$hxClasses["tools.gradle.GraldeTab"] = tools_gradle_GraldeTab;
tools_gradle_GraldeTab.__name__ = ["tools","gradle","GraldeTab"];
tools_gradle_GraldeTab.__super__ = tools_gradle_Tabs;
tools_gradle_GraldeTab.prototype = $extend(tools_gradle_Tabs.prototype,{
	__class__: tools_gradle_GraldeTab
});
var watchers_LocaleWatcher = function() { };
$hxClasses["watchers.LocaleWatcher"] = watchers_LocaleWatcher;
watchers_LocaleWatcher.__name__ = ["watchers","LocaleWatcher"];
watchers_LocaleWatcher.load = function() {
	if(watchers_LocaleWatcher.watcher != null) watchers_LocaleWatcher.watcher.close();
	watchers_LocaleWatcher.parse();
	watchers_LocaleWatcher.watcher = watchers_Watcher.watchFileForUpdates(watchers_LocaleWatcher.pathToLocale,function() {
		watchers_LocaleWatcher.parse();
		watchers_LocaleWatcher.processHtmlElements();
	},1000);
	watchers_LocaleWatcher.processHtmlElements();
	if(!watchers_LocaleWatcher.listenerAdded) {
		nodejs_webkit_Window.get().on("close",function(e) {
			if(watchers_LocaleWatcher.watcher != null) watchers_LocaleWatcher.watcher.close();
		});
		watchers_LocaleWatcher.listenerAdded = true;
	}
};
watchers_LocaleWatcher.parse = function() {
	watchers_LocaleWatcher.pathToLocale = js_Node.require("path").join("core","locale",watchers_SettingsWatcher.settings.locale);
	var options = { };
	options.encoding = "utf8";
	var data = js_Node.require("fs").readFileSync(watchers_LocaleWatcher.pathToLocale,options);
	watchers_LocaleWatcher.localeData = tjson_TJSON.parse(data);
};
watchers_LocaleWatcher.getStringSync = function(name) {
	var value = name;
	if(Object.prototype.hasOwnProperty.call(watchers_LocaleWatcher.localeData,name)) value = Reflect.field(watchers_LocaleWatcher.localeData,name); else {
		watchers_LocaleWatcher.localeData[name] = name;
		var data = tjson_TJSON.encode(watchers_LocaleWatcher.localeData,"fancy");
		js_Node.require("fs").writeFileSync(watchers_LocaleWatcher.pathToLocale,data,"utf8");
	}
	return value;
};
watchers_LocaleWatcher.processHtmlElements = function() {
	var element;
	var value;
	var _g = 0;
	var _g1 = window.document.getElementsByTagName("*");
	while(_g < _g1.length) {
		var node = _g1[_g];
		++_g;
		element = js_Boot.__cast(node , HTMLElement);
		value = element.getAttribute("localeString");
		if(value != null) element.textContent = watchers_LocaleWatcher.getStringSync(value);
	}
};
var watchers_SettingsWatcher = function() { };
$hxClasses["watchers.SettingsWatcher"] = watchers_SettingsWatcher;
watchers_SettingsWatcher.__name__ = ["watchers","SettingsWatcher"];
watchers_SettingsWatcher.load = function() {
	var pathToConfigFolder = js_Node.require("path").join("core","config");
	watchers_SettingsWatcher.pathToFolder = nodejs_webkit_App.dataPath;
	if(watchers_SettingsWatcher.pathToFolder != null) {
		watchers_SettingsWatcher.pathToFolder = js_Node.require("path").join(watchers_SettingsWatcher.pathToFolder,".HIDE");
		if(!js_Node.require("fs").existsSync(watchers_SettingsWatcher.pathToFolder)) js_Node.require("fs").mkdirSync(watchers_SettingsWatcher.pathToFolder);
		var configFiles = js_Node.require("fs").readdirSync(pathToConfigFolder);
		var files = js_Node.require("fs").readdirSync(watchers_SettingsWatcher.pathToFolder);
		var options = { };
		options.encoding = "utf8";
		var content;
		var pathToFile = null;
		var _g = 0;
		while(_g < configFiles.length) {
			var file = configFiles[_g];
			++_g;
			if(HxOverrides.indexOf(files,file,0) == -1) {
				pathToFile = js_Node.require("path").join(pathToConfigFolder,file);
				content = js_Node.require("fs").readFileSync(pathToFile,options);
				pathToFile = js_Node.require("path").join(watchers_SettingsWatcher.pathToFolder,file);
				js_Node.require("fs").writeFileSync(pathToFile,content,"utf8");
			}
		}
	} else watchers_SettingsWatcher.pathToFolder = pathToConfigFolder;
	watchers_SettingsWatcher.pathToSettings = js_Node.require("path").join(watchers_SettingsWatcher.pathToFolder,"settings.json");
	watchers_SettingsWatcher.watcher = watchers_Watcher.watchFileForUpdates(watchers_SettingsWatcher.pathToSettings,watchers_SettingsWatcher.parse,3000);
	watchers_SettingsWatcher.parse();
	nodejs_webkit_Window.get().on("close",function(e) {
		if(watchers_SettingsWatcher.watcher != null) watchers_SettingsWatcher.watcher.close();
	});
};
watchers_SettingsWatcher.parse = function() {
	var options = { };
	options.encoding = "utf8";
	var data = js_Node.require("fs").readFileSync(watchers_SettingsWatcher.pathToSettings,options);
	watchers_SettingsWatcher.settings = tjson_TJSON.parse(data);
	var themeWatcher = watchers_ThemeWatcher.get();
	themeWatcher.load();
	watchers_LocaleWatcher.load();
	if(projectaccess_ProjectAccess.path != null) {
		var fileTree = filetree_FileTree.get();
		fileTree.load();
	}
};
watchers_SettingsWatcher.isItemInIgnoreList = function(path) {
	var ignored = false;
	var ereg;
	var _g = 0;
	var _g1 = watchers_SettingsWatcher.settings.ignore;
	while(_g < _g1.length) {
		var item = _g1[_g];
		++_g;
		ereg = new EReg(item,"");
		if(ereg.match(path)) {
			ignored = true;
			break;
		}
	}
	return ignored;
};
var watchers_SnippetsWatcher = function() { };
$hxClasses["watchers.SnippetsWatcher"] = watchers_SnippetsWatcher;
watchers_SnippetsWatcher.__name__ = ["watchers","SnippetsWatcher"];
watchers_SnippetsWatcher.get = function() {
	if(watchers_SnippetsWatcher.instance == null) watchers_SnippetsWatcher.instance = new watchers_ThemeWatcher();
	return watchers_SnippetsWatcher.instance;
};
var watchers_ThemeWatcher = function() {
	this.listenerAdded = false;
};
$hxClasses["watchers.ThemeWatcher"] = watchers_ThemeWatcher;
watchers_ThemeWatcher.__name__ = ["watchers","ThemeWatcher"];
watchers_ThemeWatcher.get = function() {
	if(watchers_ThemeWatcher.instance == null) watchers_ThemeWatcher.instance = new watchers_ThemeWatcher();
	return watchers_ThemeWatcher.instance;
};
watchers_ThemeWatcher.prototype = {
	watcher: null
	,listenerAdded: null
	,pathToTheme: null
	,currentTheme: null
	,load: function() {
		var _g = this;
		this.pathToTheme = js_Node.require("path").join("core",watchers_SettingsWatcher.settings.theme);
		js_Node.require("fs").exists(this.pathToTheme,function(exists) {
			if(exists) _g.continueLoading(); else alertify.log("File " + _g.pathToTheme + " for theme " + watchers_SettingsWatcher.settings.theme + " was not found. CSS files in core folder: [" + _g.getListOfCSSFiles().join(",") + "]","",10000);
		});
	}
	,continueLoading: function() {
		var _g = this;
		this.updateTheme();
		if(this.watcher != null) this.watcher.close();
		this.watcher = watchers_Watcher.watchFileForUpdates(this.pathToTheme,function() {
			_g.updateTheme();
		},1000);
		if(!this.listenerAdded) {
			nodejs_webkit_Window.get().on("close",function(e) {
				if(_g.watcher != null) _g.watcher.close();
			});
			this.listenerAdded = true;
		}
	}
	,getListOfCSSFiles: function() {
		var files = [];
		var _g = 0;
		var _g1 = js_Node.require("fs").readdirSync("core");
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			if(js_Node.require("path").extname(item) == ".css") files.push(js_Node.require("path").basename(item));
		}
		return files;
	}
	,updateTheme: function(type) {
		var theme = watchers_SettingsWatcher.settings.theme;
		$("#theme").attr("href",theme);
		if(this.currentTheme != null && this.currentTheme != theme) {
			var ereg = new EReg("/\\* *codeEditorTheme *= *([^ \\*]*) *\\*/","g");
			var options = { };
			options.encoding = "utf8";
			var data = js_Node.require("fs").readFileSync(js_Node.require("path").join("core",theme),options);
			if(ereg.match(data)) {
				var codeEditorTheme = ereg.matched(1);
				cm_Editor.setTheme(codeEditorTheme);
			}
		}
		this.currentTheme = theme;
	}
	,__class__: watchers_ThemeWatcher
};
var watchers_Watcher = function() { };
$hxClasses["watchers.Watcher"] = watchers_Watcher;
watchers_Watcher.__name__ = ["watchers","Watcher"];
watchers_Watcher.watchFileForUpdates = function(_path,onUpdate,_interval) {
	var config = { path : _path, listener : function(changeType,filePath,fileCurrentStat,filePreviousStat) {
		if(changeType == "update") onUpdate();
	}};
	if(_interval != null) config.interval = _interval;
	var watcher = Watchr.watch(config);
	return watcher;
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
var __map_reserved = {}
haxe_Resource.content = [{ name : "config", data : "ew0KCSJtYXhpbXVtX2xpbmVfbGVuZ3RoIjo4MCwNCgkibW9kaWZpZXJfb3JkZXIiOlsib3ZlcnJpZGUiLCAicHVibGljIiwgInByaXZhdGUiLCAic3RhdGljIiwgImV4dGVybiIsICJkeW5hbWljIiwgImlubGluZSIsICJtYWNybyJdLA0KCSJpbmRlbnRfd2l0aF90YWJzIjpmYWxzZSwNCgkidGFiX3dpZHRoIjo0LA0KCSJwcmludF9yb290X3BhY2thZ2UiOmZhbHNlLA0KCSJlbXB0eV9saW5lX2FmdGVyX3BhY2thZ2UiOnRydWUsDQoJImVtcHR5X2xpbmVfYWZ0ZXJfaW1wb3J0IjpmYWxzZSwNCgkiZW1wdHlfbGluZV9iZWZvcmVfdHlwZSI6dHJ1ZSwNCgkiY3VkZGxlX3R5cGVfYnJhY2VzIjpmYWxzZSwNCgkiY3VkZGxlX21ldGhvZF9icmFjZXMiOmZhbHNlLA0KCSJlbXB0eV9saW5lX2JldHdlZW5fZmllbGRzIjp0cnVlLA0KCSJzcGFjZV9iZXR3ZWVuX3R5cGVfcGFyYW1zIjp0cnVlLA0KCSJzcGFjZV9iZXR3ZWVuX2Fub25fdHlwZV9maWVsZHMiOnRydWUsDQoJInNwYWNlX2JldHdlZW5fdHlwZV9wYXJhbV9jb25zdHJhaW50cyI6dHJ1ZSwNCgkiaW5saW5lX2VtcHR5X2JyYWNlcyI6dHJ1ZSwNCgkiZXh0ZW5kc19vbl9uZXdsaW5lIjpmYWxzZSwNCgkiaW1wbGVtZW50c19vbl9uZXdsaW5lIjpmYWxzZSwNCgkiZnVuY3Rpb25fYXJnX29uX25ld2xpbmUiOmZhbHNlLA0KCSJzcGFjZV9iZXR3ZWVuX2Z1bmN0aW9uX2FyZ3MiOnRydWUsDQoJInNwYWNlX2Fyb3VuZF9mdW5jdGlvbl9hcmdfYXNzaWduIjp0cnVlLA0KCSJzcGFjZV9hcm91bmRfcHJvcGVydHlfYXNzaWduIjp0cnVlLA0KCSJzcGFjZV9iZXR3ZW5fcHJvcGVydHlfZ2V0X3NldCI6dHJ1ZSwNCgkicmVtb3ZlX3ByaXZhdGVfZmllbGRfbW9kaWZpZXIiOnRydWUsDQoJImVtcHR5X2xpbmVfYmV0d2Vlbl9lbnVtX2NvbnN0cnVjdG9ycyI6ZmFsc2UsDQoJImVtcHR5X2xpbmVfYmV0d2Vlbl90eXBlZGVmX2ZpZWxkcyI6ZmFsc2UsDQoJInNwYWNlX2JldHdlZW5fZW51bV9jb25zdHJ1Y3Rvcl9hcmdzIjp0cnVlDQp9"}];
var module, setImmediate, clearImmediate;
js_Node.setTimeout = setTimeout;
js_Node.clearTimeout = clearTimeout;
js_Node.setInterval = setInterval;
js_Node.clearInterval = clearInterval;
js_Node.global = global;
js_Node.process = process;
js_Node.require = require;
js_Node.console = console;
js_Node.module = module;
js_Node.stringify = JSON.stringify;
js_Node.parse = JSON.parse;
var version = HxOverrides.substr(js_Node.process.version,1,null).split(".").map(Std.parseInt);
if(version[0] > 0 || version[1] >= 9) {
	js_Node.setImmediate = setImmediate;
	js_Node.clearImmediate = clearImmediate;
}
js_node_Mkdirp._mkdirp = js_Node.require("mkdirp");
js_node_Mv.mv = js_Node.require("mv");
js_node_Remove.remove = js_Node.require("remove");
Walkdir.walkdir = js_Node.require("walkdir");
var Watchr = js_Node.require("watchr");
HIDE.windows = [];
Xml.Element = 0;
Xml.PCData = 1;
Xml.CData = 2;
Xml.Comment = 3;
Xml.DocType = 4;
Xml.ProcessingInstruction = 5;
Xml.Document = 6;
cm_ColorPreview.top = 0;
cm_ColorPreview.left = 0;
cm_ERegPreview.markers = [];
core_HaxeLint.fileData = new haxe_ds_StringMap();
core_HaxeLint.parserData = new haxe_ds_StringMap();
core_Helper.timers = new haxe_ds_StringMap();
core_Hotkeys.hotkeys = [];
core_Hotkeys.commandMap = new haxe_ds_StringMap();
core_Hotkeys.spanMap = new haxe_ds_StringMap();
core_PreserveWindowState.isMaximizationEvent = false;
core_PreserveWindowState.window = nodejs_webkit_Window.get();
flambeproject_FlambeBuild.enableFlashTarget = false;
flambeproject_FlambeBuild.enabledHtmlTarget = false;
flambeproject_FlambeBuild.enabledFirefoxTarget = false;
flambeproject_FlambeBuild.enabledAndroidTarget = false;
flambeproject_FlambeBuild.retriesMax = 10;
haxe_Serializer.USE_CACHE = false;
haxe_Serializer.USE_ENUM_INDEX = false;
haxe_Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe_Template.splitter = new EReg("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()","");
haxe_Template.expr_splitter = new EReg("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)","");
haxe_Template.expr_trim = new EReg("^[ ]*([^ ]+)[ ]*$","");
haxe_Template.expr_int = new EReg("^[0-9]+$","");
haxe_Template.expr_float = new EReg("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$","");
haxe_Template.globals = { };
haxe_Unserializer.DEFAULT_RESOLVER = Type;
haxe_Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe_crypto_Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe_crypto_Base64.BYTES = haxe_io_Bytes.ofString(haxe_crypto_Base64.CHARS);
haxe_ds_ObjectMap.count = 0;
haxe_xml_Parser.escapes = (function($this) {
	var $r;
	var h = new haxe_ds_StringMap();
	if(__map_reserved.lt != null) h.setReserved("lt","<"); else h.h["lt"] = "<";
	if(__map_reserved.gt != null) h.setReserved("gt",">"); else h.h["gt"] = ">";
	if(__map_reserved.amp != null) h.setReserved("amp","&"); else h.h["amp"] = "&";
	if(__map_reserved.quot != null) h.setReserved("quot","\""); else h.h["quot"] = "\"";
	if(__map_reserved.apos != null) h.setReserved("apos","'"); else h.h["apos"] = "'";
	$r = h;
	return $r;
}(this));
hxparse_LexEngine.EMPTY = [];
hxparse_LexEngine.ALL_CHARS = [{ min : 0, max : 255}];
js_Boot.__toStr = {}.toString;
haxeparser_HaxeLexer.keywords = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	_g.set("abstract",haxeparser_Keyword.KwdAbstract);
	_g.set("break",haxeparser_Keyword.KwdBreak);
	_g.set("case",haxeparser_Keyword.KwdCase);
	_g.set("cast",haxeparser_Keyword.KwdCast);
	_g.set("catch",haxeparser_Keyword.KwdCatch);
	_g.set("class",haxeparser_Keyword.KwdClass);
	_g.set("continue",haxeparser_Keyword.KwdContinue);
	_g.set("default",haxeparser_Keyword.KwdDefault);
	_g.set("do",haxeparser_Keyword.KwdDo);
	_g.set("dynamic",haxeparser_Keyword.KwdDynamic);
	_g.set("else",haxeparser_Keyword.KwdElse);
	_g.set("enum",haxeparser_Keyword.KwdEnum);
	_g.set("extends",haxeparser_Keyword.KwdExtends);
	_g.set("extern",haxeparser_Keyword.KwdExtern);
	_g.set("false",haxeparser_Keyword.KwdFalse);
	_g.set("for",haxeparser_Keyword.KwdFor);
	_g.set("function",haxeparser_Keyword.KwdFunction);
	_g.set("if",haxeparser_Keyword.KwdIf);
	_g.set("implements",haxeparser_Keyword.KwdImplements);
	_g.set("import",haxeparser_Keyword.KwdImport);
	_g.set("in",haxeparser_Keyword.KwdIn);
	_g.set("inline",haxeparser_Keyword.KwdInline);
	_g.set("interface",haxeparser_Keyword.KwdInterface);
	_g.set("macro",haxeparser_Keyword.KwdMacro);
	_g.set("new",haxeparser_Keyword.KwdNew);
	_g.set("null",haxeparser_Keyword.KwdNull);
	_g.set("override",haxeparser_Keyword.KwdOverride);
	_g.set("package",haxeparser_Keyword.KwdPackage);
	_g.set("private",haxeparser_Keyword.KwdPrivate);
	_g.set("public",haxeparser_Keyword.KwdPublic);
	_g.set("return",haxeparser_Keyword.KwdReturn);
	_g.set("static",haxeparser_Keyword.KwdStatic);
	_g.set("switch",haxeparser_Keyword.KwdSwitch);
	_g.set("this",haxeparser_Keyword.KwdThis);
	_g.set("throw",haxeparser_Keyword.KwdThrow);
	_g.set("true",haxeparser_Keyword.KwdTrue);
	_g.set("try",haxeparser_Keyword.KwdTry);
	_g.set("typedef",haxeparser_Keyword.KwdTypedef);
	_g.set("untyped",haxeparser_Keyword.KwdUntyped);
	_g.set("using",haxeparser_Keyword.KwdUsing);
	_g.set("var",haxeparser_Keyword.KwdVar);
	_g.set("while",haxeparser_Keyword.KwdWhile);
	$r = _g;
	return $r;
}(this));
haxeparser_HaxeLexer.buf = new StringBuf();
haxeparser_HaxeLexer.tok = hxparse_Lexer.buildRuleset([{ rule : "", func : function(lexer) {
	return haxeparser_HaxeLexer.mk(lexer,haxeparser_TokenDef.Eof);
}},{ rule : "[\r\n\t ]+", func : function(lexer1) {
	return lexer1.token(haxeparser_HaxeLexer.tok);
}},{ rule : "0x[0-9a-fA-F]+", func : function(lexer2) {
	return haxeparser_HaxeLexer.mk(lexer2,haxeparser_TokenDef.Const(haxe_macro_Constant.CInt(lexer2.current)));
}},{ rule : "[0-9]+", func : function(lexer3) {
	return haxeparser_HaxeLexer.mk(lexer3,haxeparser_TokenDef.Const(haxe_macro_Constant.CInt(lexer3.current)));
}},{ rule : "[0-9]+\\.[0-9]+", func : function(lexer4) {
	return haxeparser_HaxeLexer.mk(lexer4,haxeparser_TokenDef.Const(haxe_macro_Constant.CFloat(lexer4.current)));
}},{ rule : "\\.[0-9]+", func : function(lexer5) {
	return haxeparser_HaxeLexer.mk(lexer5,haxeparser_TokenDef.Const(haxe_macro_Constant.CFloat(lexer5.current)));
}},{ rule : "[0-9]+[eE][\\+\\-]?[0-9]+", func : function(lexer6) {
	return haxeparser_HaxeLexer.mk(lexer6,haxeparser_TokenDef.Const(haxe_macro_Constant.CFloat(lexer6.current)));
}},{ rule : "[0-9]+\\.[0-9]*[eE][\\+\\-]?[0-9]+", func : function(lexer7) {
	return haxeparser_HaxeLexer.mk(lexer7,haxeparser_TokenDef.Const(haxe_macro_Constant.CFloat(lexer7.current)));
}},{ rule : "[0-9]+\\.\\.\\.", func : function(lexer8) {
	return haxeparser_HaxeLexer.mk(lexer8,haxeparser_TokenDef.IntInterval(HxOverrides.substr(lexer8.current,0,-3)));
}},{ rule : "//[^\n\r]*", func : function(lexer9) {
	return haxeparser_HaxeLexer.mk(lexer9,haxeparser_TokenDef.CommentLine(HxOverrides.substr(lexer9.current,2,null)));
}},{ rule : "+\\+", func : function(lexer10) {
	return haxeparser_HaxeLexer.mk(lexer10,haxeparser_TokenDef.Unop(haxe_macro_Unop.OpIncrement));
}},{ rule : "--", func : function(lexer11) {
	return haxeparser_HaxeLexer.mk(lexer11,haxeparser_TokenDef.Unop(haxe_macro_Unop.OpDecrement));
}},{ rule : "~", func : function(lexer12) {
	return haxeparser_HaxeLexer.mk(lexer12,haxeparser_TokenDef.Unop(haxe_macro_Unop.OpNegBits));
}},{ rule : "%=", func : function(lexer13) {
	return haxeparser_HaxeLexer.mk(lexer13,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpAssignOp(haxe_macro_Binop.OpMod)));
}},{ rule : "&=", func : function(lexer14) {
	return haxeparser_HaxeLexer.mk(lexer14,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpAssignOp(haxe_macro_Binop.OpAnd)));
}},{ rule : "|=", func : function(lexer15) {
	return haxeparser_HaxeLexer.mk(lexer15,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpAssignOp(haxe_macro_Binop.OpOr)));
}},{ rule : "^=", func : function(lexer16) {
	return haxeparser_HaxeLexer.mk(lexer16,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpAssignOp(haxe_macro_Binop.OpXor)));
}},{ rule : "+=", func : function(lexer17) {
	return haxeparser_HaxeLexer.mk(lexer17,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpAssignOp(haxe_macro_Binop.OpAdd)));
}},{ rule : "-=", func : function(lexer18) {
	return haxeparser_HaxeLexer.mk(lexer18,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpAssignOp(haxe_macro_Binop.OpSub)));
}},{ rule : "*=", func : function(lexer19) {
	return haxeparser_HaxeLexer.mk(lexer19,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpAssignOp(haxe_macro_Binop.OpMult)));
}},{ rule : "/=", func : function(lexer20) {
	return haxeparser_HaxeLexer.mk(lexer20,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpAssignOp(haxe_macro_Binop.OpDiv)));
}},{ rule : "<<=", func : function(lexer21) {
	return haxeparser_HaxeLexer.mk(lexer21,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpAssignOp(haxe_macro_Binop.OpShl)));
}},{ rule : "==", func : function(lexer22) {
	return haxeparser_HaxeLexer.mk(lexer22,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpEq));
}},{ rule : "!=", func : function(lexer23) {
	return haxeparser_HaxeLexer.mk(lexer23,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpNotEq));
}},{ rule : "<=", func : function(lexer24) {
	return haxeparser_HaxeLexer.mk(lexer24,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpLte));
}},{ rule : "&&", func : function(lexer25) {
	return haxeparser_HaxeLexer.mk(lexer25,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpBoolAnd));
}},{ rule : "|\\|", func : function(lexer26) {
	return haxeparser_HaxeLexer.mk(lexer26,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpBoolOr));
}},{ rule : "<<", func : function(lexer27) {
	return haxeparser_HaxeLexer.mk(lexer27,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpShl));
}},{ rule : "->", func : function(lexer28) {
	return haxeparser_HaxeLexer.mk(lexer28,haxeparser_TokenDef.Arrow);
}},{ rule : "\\.\\.\\.", func : function(lexer29) {
	return haxeparser_HaxeLexer.mk(lexer29,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpInterval));
}},{ rule : "=>", func : function(lexer30) {
	return haxeparser_HaxeLexer.mk(lexer30,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpArrow));
}},{ rule : "!", func : function(lexer31) {
	return haxeparser_HaxeLexer.mk(lexer31,haxeparser_TokenDef.Unop(haxe_macro_Unop.OpNot));
}},{ rule : "<", func : function(lexer32) {
	return haxeparser_HaxeLexer.mk(lexer32,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpLt));
}},{ rule : ">", func : function(lexer33) {
	return haxeparser_HaxeLexer.mk(lexer33,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpGt));
}},{ rule : ";", func : function(lexer34) {
	return haxeparser_HaxeLexer.mk(lexer34,haxeparser_TokenDef.Semicolon);
}},{ rule : ":", func : function(lexer35) {
	return haxeparser_HaxeLexer.mk(lexer35,haxeparser_TokenDef.DblDot);
}},{ rule : ",", func : function(lexer36) {
	return haxeparser_HaxeLexer.mk(lexer36,haxeparser_TokenDef.Comma);
}},{ rule : "\\.", func : function(lexer37) {
	return haxeparser_HaxeLexer.mk(lexer37,haxeparser_TokenDef.Dot);
}},{ rule : "%", func : function(lexer38) {
	return haxeparser_HaxeLexer.mk(lexer38,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpMod));
}},{ rule : "&", func : function(lexer39) {
	return haxeparser_HaxeLexer.mk(lexer39,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpAnd));
}},{ rule : "|", func : function(lexer40) {
	return haxeparser_HaxeLexer.mk(lexer40,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpOr));
}},{ rule : "^", func : function(lexer41) {
	return haxeparser_HaxeLexer.mk(lexer41,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpXor));
}},{ rule : "+", func : function(lexer42) {
	return haxeparser_HaxeLexer.mk(lexer42,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpAdd));
}},{ rule : "*", func : function(lexer43) {
	return haxeparser_HaxeLexer.mk(lexer43,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpMult));
}},{ rule : "/", func : function(lexer44) {
	return haxeparser_HaxeLexer.mk(lexer44,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpDiv));
}},{ rule : "-", func : function(lexer45) {
	return haxeparser_HaxeLexer.mk(lexer45,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpSub));
}},{ rule : "=", func : function(lexer46) {
	return haxeparser_HaxeLexer.mk(lexer46,haxeparser_TokenDef.Binop(haxe_macro_Binop.OpAssign));
}},{ rule : "[", func : function(lexer47) {
	return haxeparser_HaxeLexer.mk(lexer47,haxeparser_TokenDef.BkOpen);
}},{ rule : "]", func : function(lexer48) {
	return haxeparser_HaxeLexer.mk(lexer48,haxeparser_TokenDef.BkClose);
}},{ rule : "{", func : function(lexer49) {
	return haxeparser_HaxeLexer.mk(lexer49,haxeparser_TokenDef.BrOpen);
}},{ rule : "}", func : function(lexer50) {
	return haxeparser_HaxeLexer.mk(lexer50,haxeparser_TokenDef.BrClose);
}},{ rule : "\\(", func : function(lexer51) {
	return haxeparser_HaxeLexer.mk(lexer51,haxeparser_TokenDef.POpen);
}},{ rule : "\\)", func : function(lexer52) {
	return haxeparser_HaxeLexer.mk(lexer52,haxeparser_TokenDef.PClose);
}},{ rule : "?", func : function(lexer53) {
	return haxeparser_HaxeLexer.mk(lexer53,haxeparser_TokenDef.Question);
}},{ rule : "@", func : function(lexer54) {
	return haxeparser_HaxeLexer.mk(lexer54,haxeparser_TokenDef.At);
}},{ rule : "\"", func : function(lexer55) {
	haxeparser_HaxeLexer.buf = new StringBuf();
	var pmin = new hxparse_Position(lexer55.source,lexer55.pos - lexer55.current.length,lexer55.pos);
	var pmax;
	try {
		pmax = lexer55.token(haxeparser_HaxeLexer.string);
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		if( js_Boot.__instanceof(e,haxe_io_Eof) ) {
			throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.UnterminatedString,haxeparser_HaxeLexer.mkPos(pmin)));
		} else throw(e);
	}
	var token = haxeparser_HaxeLexer.mk(lexer55,haxeparser_TokenDef.Const(haxe_macro_Constant.CString(haxeparser_HaxeLexer.unescape(haxeparser_HaxeLexer.buf.b,haxeparser_HaxeLexer.mkPos(pmin)))));
	token.pos.min = pmin.pmin;
	return token;
}},{ rule : "'", func : function(lexer56) {
	haxeparser_HaxeLexer.buf = new StringBuf();
	var pmin1 = new hxparse_Position(lexer56.source,lexer56.pos - lexer56.current.length,lexer56.pos);
	var pmax1;
	try {
		pmax1 = lexer56.token(haxeparser_HaxeLexer.string2);
	} catch( e1 ) {
		if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
		if( js_Boot.__instanceof(e1,haxe_io_Eof) ) {
			throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.UnterminatedString,haxeparser_HaxeLexer.mkPos(pmin1)));
		} else throw(e1);
	}
	var token1 = haxeparser_HaxeLexer.mk(lexer56,haxeparser_TokenDef.Const(haxe_macro_Constant.CString(haxeparser_HaxeLexer.unescape(haxeparser_HaxeLexer.buf.b,haxeparser_HaxeLexer.mkPos(pmin1)))));
	token1.pos.min = pmin1.pmin;
	return token1;
}},{ rule : "~/", func : function(lexer57) {
	haxeparser_HaxeLexer.buf = new StringBuf();
	var pmin2 = new hxparse_Position(lexer57.source,lexer57.pos - lexer57.current.length,lexer57.pos);
	var info;
	try {
		info = lexer57.token(haxeparser_HaxeLexer.regexp);
	} catch( e2 ) {
		if (e2 instanceof js__$Boot_HaxeError) e2 = e2.val;
		if( js_Boot.__instanceof(e2,haxe_io_Eof) ) {
			throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.UnterminatedRegExp,haxeparser_HaxeLexer.mkPos(pmin2)));
		} else throw(e2);
	}
	var token2 = haxeparser_HaxeLexer.mk(lexer57,haxeparser_TokenDef.Const(haxe_macro_Constant.CRegexp(haxeparser_HaxeLexer.buf.b,info.opt)));
	token2.pos.min = pmin2.pmin;
	return token2;
}},{ rule : "/\\*", func : function(lexer58) {
	haxeparser_HaxeLexer.buf = new StringBuf();
	var pmin3 = new hxparse_Position(lexer58.source,lexer58.pos - lexer58.current.length,lexer58.pos);
	var pmax2;
	try {
		pmax2 = lexer58.token(haxeparser_HaxeLexer.comment);
	} catch( e3 ) {
		if (e3 instanceof js__$Boot_HaxeError) e3 = e3.val;
		if( js_Boot.__instanceof(e3,haxe_io_Eof) ) {
			throw new js__$Boot_HaxeError(new haxeparser_LexerError(haxeparser_LexerErrorMsg.UnclosedComment,haxeparser_HaxeLexer.mkPos(pmin3)));
		} else throw(e3);
	}
	var token3 = haxeparser_HaxeLexer.mk(lexer58,haxeparser_TokenDef.Comment(haxeparser_HaxeLexer.buf.b));
	token3.pos.min = pmin3.pmin;
	return token3;
}},{ rule : "(#)(_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*)", func : function(lexer59) {
	return haxeparser_HaxeLexer.mk(lexer59,haxeparser_TokenDef.Sharp(HxOverrides.substr(lexer59.current,1,null)));
}},{ rule : "$[_a-zA-Z0-9]*", func : function(lexer60) {
	return haxeparser_HaxeLexer.mk(lexer60,haxeparser_TokenDef.Dollar(HxOverrides.substr(lexer60.current,1,null)));
}},{ rule : "_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*", func : function(lexer61) {
	var kwd = haxeparser_HaxeLexer.keywords.get(lexer61.current);
	if(kwd != null) return haxeparser_HaxeLexer.mk(lexer61,haxeparser_TokenDef.Kwd(kwd)); else return haxeparser_HaxeLexer.mk(lexer61,haxeparser_TokenDef.Const(haxe_macro_Constant.CIdent(lexer61.current)));
}},{ rule : "_*[A-Z][a-zA-Z0-9_]*", func : function(lexer62) {
	return haxeparser_HaxeLexer.mk(lexer62,haxeparser_TokenDef.Const(haxe_macro_Constant.CIdent(lexer62.current)));
}}],"tok");
haxeparser_HaxeLexer.string = hxparse_Lexer.buildRuleset([{ rule : "\\\\\\\\", func : function(lexer) {
	haxeparser_HaxeLexer.buf.b += "\\\\";
	return lexer.token(haxeparser_HaxeLexer.string);
}},{ rule : "\\\\", func : function(lexer1) {
	haxeparser_HaxeLexer.buf.b += "\\";
	return lexer1.token(haxeparser_HaxeLexer.string);
}},{ rule : "\\\\\"", func : function(lexer2) {
	haxeparser_HaxeLexer.buf.b += "\"";
	return lexer2.token(haxeparser_HaxeLexer.string);
}},{ rule : "\"", func : function(lexer3) {
	return new hxparse_Position(lexer3.source,lexer3.pos - lexer3.current.length,lexer3.pos).pmax;
}},{ rule : "[^\\\\\"]+", func : function(lexer4) {
	if(lexer4.current == null) haxeparser_HaxeLexer.buf.b += "null"; else haxeparser_HaxeLexer.buf.b += "" + lexer4.current;
	return lexer4.token(haxeparser_HaxeLexer.string);
}}],"string");
haxeparser_HaxeLexer.string2 = hxparse_Lexer.buildRuleset([{ rule : "\\\\\\\\", func : function(lexer) {
	haxeparser_HaxeLexer.buf.b += "\\\\";
	return lexer.token(haxeparser_HaxeLexer.string2);
}},{ rule : "\\\\", func : function(lexer1) {
	haxeparser_HaxeLexer.buf.b += "\\";
	return lexer1.token(haxeparser_HaxeLexer.string2);
}},{ rule : "\\\\'", func : function(lexer2) {
	haxeparser_HaxeLexer.buf.b += "'";
	return lexer2.token(haxeparser_HaxeLexer.string2);
}},{ rule : "'", func : function(lexer3) {
	return new hxparse_Position(lexer3.source,lexer3.pos - lexer3.current.length,lexer3.pos).pmax;
}},{ rule : "[^\\\\']+", func : function(lexer4) {
	if(lexer4.current == null) haxeparser_HaxeLexer.buf.b += "null"; else haxeparser_HaxeLexer.buf.b += "" + lexer4.current;
	return lexer4.token(haxeparser_HaxeLexer.string2);
}}],"string2");
haxeparser_HaxeLexer.comment = hxparse_Lexer.buildRuleset([{ rule : "*/", func : function(lexer) {
	return new hxparse_Position(lexer.source,lexer.pos - lexer.current.length,lexer.pos).pmax;
}},{ rule : "*", func : function(lexer1) {
	haxeparser_HaxeLexer.buf.b += "*";
	return lexer1.token(haxeparser_HaxeLexer.comment);
}},{ rule : "[^\\*]+", func : function(lexer2) {
	if(lexer2.current == null) haxeparser_HaxeLexer.buf.b += "null"; else haxeparser_HaxeLexer.buf.b += "" + lexer2.current;
	return lexer2.token(haxeparser_HaxeLexer.comment);
}}],"comment");
haxeparser_HaxeLexer.regexp = hxparse_Lexer.buildRuleset([{ rule : "\\\\/", func : function(lexer) {
	haxeparser_HaxeLexer.buf.b += "/";
	return lexer.token(haxeparser_HaxeLexer.regexp);
}},{ rule : "\\\\r", func : function(lexer1) {
	haxeparser_HaxeLexer.buf.b += "\r";
	return lexer1.token(haxeparser_HaxeLexer.regexp);
}},{ rule : "\\\\n", func : function(lexer2) {
	haxeparser_HaxeLexer.buf.b += "\n";
	return lexer2.token(haxeparser_HaxeLexer.regexp);
}},{ rule : "\\\\t", func : function(lexer3) {
	haxeparser_HaxeLexer.buf.b += "\t";
	return lexer3.token(haxeparser_HaxeLexer.regexp);
}},{ rule : "\\\\[\\\\$\\.*+\\^|{}\\[\\]()?\\-0-9]", func : function(lexer4) {
	if(lexer4.current == null) haxeparser_HaxeLexer.buf.b += "null"; else haxeparser_HaxeLexer.buf.b += "" + lexer4.current;
	return lexer4.token(haxeparser_HaxeLexer.regexp);
}},{ rule : "\\\\[wWbBsSdDx]", func : function(lexer5) {
	if(lexer5.current == null) haxeparser_HaxeLexer.buf.b += "null"; else haxeparser_HaxeLexer.buf.b += "" + lexer5.current;
	return lexer5.token(haxeparser_HaxeLexer.regexp);
}},{ rule : "/", func : function(lexer6) {
	return lexer6.token(haxeparser_HaxeLexer.regexp_options);
}},{ rule : "[^\\\\/\r\n]+", func : function(lexer7) {
	if(lexer7.current == null) haxeparser_HaxeLexer.buf.b += "null"; else haxeparser_HaxeLexer.buf.b += "" + lexer7.current;
	return lexer7.token(haxeparser_HaxeLexer.regexp);
}}],"regexp");
haxeparser_HaxeLexer.regexp_options = hxparse_Lexer.buildRuleset([{ rule : "[gimsu]*", func : function(lexer) {
	return { pmax : new hxparse_Position(lexer.source,lexer.pos - lexer.current.length,lexer.pos).pmax, opt : lexer.current};
}}],"regexp_options");
menu_BootstrapMenu.menus = new haxe_ds_StringMap();
menu_BootstrapMenu.menuArray = [];
newprojectdialog_NewProjectDialog.categories = new haxe_ds_StringMap();
newprojectdialog_NewProjectDialog.categoriesArray = [];
parser_ClassParser.haxeStdTopLevelClassList = ["Int","Float","String","Void","Std","Bool","Dynamic","Array","null","this","break","continue","extends","implements","in","override","package","inline","throw","untyped","using","import","return","extern"];
parser_ClassParser.topLevelClassList = [];
parser_ClassParser.haxeStdImports = [];
parser_ClassParser.importsList = [];
parser_ClassParser.classCompletions = new haxe_ds_StringMap();
parser_ClassParser.haxeStdFileList = [];
parser_ClassParser.filesList = [];
projectaccess_ProjectAccess.currentProject = new projectaccess_Project();
tjson_TJSON.OBJECT_REFERENCE_PREFIX = "@~obRef#";
watchers_LocaleWatcher.listenerAdded = false;
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);

//# sourceMappingURL=HIDE.js.map