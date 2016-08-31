(function (console, $global) { "use strict";
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); };
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
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
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
var List = function() { };
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	h: null
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
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
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
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : true, __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
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
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
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
var about_Presentation = function() { };
$hxClasses["about.Presentation"] = about_Presentation;
about_Presentation.__name__ = ["about","Presentation"];
about_Presentation.main = function() {
	nodejs_webkit_Window.get().showDevTools();
	window.onload = function(e) {
		watchers_SettingsWatcher.load();
		var _this = window.document;
		about_Presentation.impressDiv = _this.createElement("div");
		about_Presentation.impressDiv.id = "impress";
		var start;
		var _this1 = window.document;
		start = _this1.createElement("div");
		start.id = "start";
		start.className = "step";
		start.setAttribute("data-transition-duration","1000");
		about_Presentation.impressDiv.appendChild(start);
		var p;
		var _this2 = window.document;
		p = _this2.createElement("p");
		p.style.width = "1000px";
		p.style.fontSize = "80px";
		p.style.textAlign = "center";
		p.setAttribute("localeString","HIDE - cross platform extensible IDE for Haxe");
		p.textContent = watchers_LocaleWatcher.getStringSync("HIDE - cross platform extensible IDE for Haxe");
		start.appendChild(p);
		about_Presentation.slidesCount = 1;
		var slide;
		slide = about_Presentation.createSlide(watchers_LocaleWatcher.getStringSync("'Feature request' perk backer and project sponsor"));
		slide = about_Presentation.createSlide("Haxe Foundation ","http://haxe-foundation.org/","haxe-foundation.org","120px");
		slide = about_Presentation.createSlide(watchers_LocaleWatcher.getStringSync("'Link to your website' perk backers"));
		slide = about_Presentation.createSlide("FlashDevelop","http://www.flashdevelop.org/","www.flashdevelop.org","100px");
		slide = about_Presentation.createSlide("OpenFL","http://www.openfl.org/","www.openfl.org","100px");
		slide = about_Presentation.createSlide("Hypersurge","http://hypersurge.com/","hypersurge.com","100px");
		slide = about_Presentation.createSlide("Adrian Cowan","http://blog.othrayte.net/","blog.othrayte.net","100px");
		slide = about_Presentation.createSlide("Justin Donaldson","http://scwn.net/","scwn.net","100px");
		slide = about_Presentation.createSlide("Jonas Malaco Filho",null,null,"100px");
		slide = about_Presentation.createSlide("tommy62",null,null,"100px");
		slide = about_Presentation.createSlide(watchers_LocaleWatcher.getStringSync("'Contributor' perk backers"));
		var contributors = ["Allan Dowdeswell","Samuel Batista","JongChan Choi","Patric Vormstein","Harry.french","Vincent Blanchet","zaynyatyi","qzix13","free24speed","franco.ponticelli","william.shakour","frabbit","Nick Holder","fintanboyle","Katsuomi Kobayashi","grigoruk","jessetalavera","bradparks","pchertok","Masahiro Wakame","Stojan Ilic","Renaud Bardet","Filip Loster","MatejTyc","Tiago Ling Alexandre","Skial Bainn","lars.doucet","Ido Yehieli","Ronan Sandford","brutfood","Matan Uberstein","rcarcasses","vic.cvc","Richard Lovejoy","Tarwin Stroh-Spijer","obutovich","erik.escoffier","Robert Wahler","Louis Tovar","L Pope","Florian Landerl","shohei 909","Andy Li","dionjw","Aaron Spjut","sebpatu","brycedneal","Sam Twidale","Phillip Louderback","Mario Vormstein","deepnight","Daniel Freeman"];
		while(contributors.length > 0) slide = about_Presentation.createSlide(contributors.splice(Std.random(contributors.length),1)[0]);
		slide = about_Presentation.createSlide(watchers_LocaleWatcher.getStringSync("Also there is anonymous contributors, people who helped us to spread the word and people who helped us through pull requests, bug reports and feature requests and by giving feedbacks"));
		slide = about_Presentation.createSlide(watchers_LocaleWatcher.getStringSync("Without your help, this would not have been possible to make it"));
		slide = about_Presentation.createSlide(watchers_LocaleWatcher.getStringSync("Thanks for your support!"));
		slide = about_Presentation.createSlide(watchers_LocaleWatcher.getStringSync("(in case if you want to change website or name, just let me know - AS3Boyan)"));
		window.document.body.appendChild(about_Presentation.impressDiv);
		about_Presentation.runImpressJS();
		var $window = nodejs_webkit_Window.get();
		$window.on("close",function(e1) {
			$window.close(true);
		});
	};
};
about_Presentation.createSlide = function(text,url,linkText,_fontSize) {
	if(_fontSize == null) _fontSize = "80px";
	about_Presentation.slidesCount++;
	var slide;
	var _this = window.document;
	slide = _this.createElement("div");
	slide.id = "slide" + Std.string(about_Presentation.slidesCount);
	slide.className = "step";
	slide.setAttribute("data-rotate",Std.string(Std.random(360)));
	slide.setAttribute("data-scale",Std.string(Math.random() * 25 + 1));
	slide.setAttribute("data-x",Std.string(Math.random() * 100000));
	slide.setAttribute("data-y",Std.string(Math.random() * 100000));
	slide.setAttribute("data-z",Std.string(-Math.random() * 3000));
	slide.setAttribute("data-rotate-x",Std.string(Std.random(360)));
	slide.setAttribute("data-rotate-y",Std.string(Std.random(360)));
	var p;
	var _this1 = window.document;
	p = _this1.createElement("p");
	p.style.width = "1000px";
	p.style.fontSize = _fontSize;
	p.innerText = text;
	slide.appendChild(p);
	if(url != null) {
		var _this2 = window.document;
		p = _this2.createElement("p");
		p.className = "footnote";
		p.innerText = watchers_LocaleWatcher.getStringSync("Website: ");
		p.setAttribute("localeString","Website: ");
		p.style.fontSize = "24px";
		slide.appendChild(p);
		var a;
		var _this3 = window.document;
		a = _this3.createElement("a");
		a.href = url;
		a.innerText = linkText;
		a.target = "_blank";
		p.appendChild(a);
	}
	about_Presentation.impressDiv.appendChild(slide);
	return slide;
};
about_Presentation.runImpressJS = function() {
	var impressInstance = impress();
	impressInstance.init();
	window.document.addEventListener("impress:stepenter",function(e) {
		if(about_Presentation.autoplay) {
			var duration;
			if(e.target.getAttribute("data-transition-duration") != null) duration = e.target.getAttribute("data-transition-duration"); else duration = 2500 + Std.random(1500);
			haxe_Timer.delay(function() {
				if(about_Presentation.autoplay) impressInstance.next();
			},duration);
		}
	});
	window.document.addEventListener("keyup",function(e1) {
		about_Presentation.autoplay = false;
		if(about_Presentation.timer != null) {
			about_Presentation.timer.stop();
			about_Presentation.timer = null;
		}
		about_Presentation.timer = new haxe_Timer(15000);
		about_Presentation.timer.run = function() {
			about_Presentation.autoplay = true;
			impressInstance.next();
			about_Presentation.timer.stop();
			about_Presentation.timer = null;
		};
	});
};
var cm_Editor = function() { };
$hxClasses["cm.Editor"] = cm_Editor;
cm_Editor.__name__ = ["cm","Editor"];
cm_Editor.setTheme = function(theme) {
	cm_Editor.editor.setOption("theme",theme);
	js_Browser.getLocalStorage().setItem("theme",theme);
};
var core_Completion = function() {
};
$hxClasses["core.Completion"] = core_Completion;
core_Completion.__name__ = ["core","Completion"];
core_Completion.get = function() {
	if(core_Completion.instance == null) core_Completion.instance = new core_Completion();
	return core_Completion.instance;
};
core_Completion.prototype = {
	processDisplayText: function(displayText) {
		if(displayText.length > 70) displayText = HxOverrides.substr(displayText,0,35) + " ... " + HxOverrides.substr(displayText,displayText.length - 35,null);
		return displayText;
	}
	,__class__: core_Completion
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	get: null
	,keys: null
	,__class__: haxe_IMap
};
var haxe_ds_StringMap = function() { };
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
	,rh: null
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
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
var nodejs_webkit_Window = require("nw.gui").Window;
var core_Utils = function() { };
$hxClasses["core.Utils"] = core_Utils;
core_Utils.__name__ = ["core","Utils"];
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
var haxe_Log = function() { };
$hxClasses["haxe.Log"] = haxe_Log;
haxe_Log.__name__ = ["haxe","Log"];
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
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
var haxe_Utf8 = function(size) {
	this.__b = "";
};
$hxClasses["haxe.Utf8"] = haxe_Utf8;
haxe_Utf8.__name__ = ["haxe","Utf8"];
haxe_Utf8.prototype = {
	__b: null
	,__class__: haxe_Utf8
};
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
var haxe_io_Eof = function() { };
$hxClasses["haxe.io.Eof"] = haxe_io_Eof;
haxe_io_Eof.__name__ = ["haxe","io","Eof"];
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
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
var js_Node = function() { };
$hxClasses["js.Node"] = js_Node;
js_Node.__name__ = ["js","Node"];
var nodejs_webkit_App = require("nw.gui").App;
var parser_ClassParser = function() { };
$hxClasses["parser.ClassParser"] = parser_ClassParser;
parser_ClassParser.__name__ = ["parser","ClassParser"];
var parser_ClasspathWalker = function() {
};
$hxClasses["parser.ClasspathWalker"] = parser_ClasspathWalker;
parser_ClasspathWalker.__name__ = ["parser","ClasspathWalker"];
parser_ClasspathWalker.get = function() {
	if(parser_ClasspathWalker.instance == null) parser_ClasspathWalker.instance = new parser_ClasspathWalker();
	return parser_ClasspathWalker.instance;
};
parser_ClasspathWalker.prototype = {
	getFileDirectory: function(relativePath) {
		var directory = "";
		if(relativePath.indexOf("/") != -1) directory = relativePath.substring(0,relativePath.lastIndexOf("/")); else if(relativePath.indexOf("\\") != -1) directory = relativePath.substring(0,relativePath.lastIndexOf("\\"));
		return directory;
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
	,__class__: parser_ClasspathWalker
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
	,main: null
	,targetData: null
	,files: null
	,openFLBuildMode: null
	,hiddenItems: null
	,showHiddenItems: null
	,__class__: projectaccess_Project
};
var projectaccess_ProjectAccess = function() { };
$hxClasses["projectaccess.ProjectAccess"] = projectaccess_ProjectAccess;
projectaccess_ProjectAccess.__name__ = ["projectaccess","ProjectAccess"];
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
var Watchr = js_Node.require("watchr");
about_Presentation.autoplay = true;
js_Boot.__toStr = {}.toString;
parser_ClassParser.haxeStdFileList = [];
parser_ClassParser.filesList = [];
projectaccess_ProjectAccess.currentProject = new projectaccess_Project();
tjson_TJSON.OBJECT_REFERENCE_PREFIX = "@~obRef#";
watchers_LocaleWatcher.listenerAdded = false;
about_Presentation.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);

//# sourceMappingURL=Presentation.js.map