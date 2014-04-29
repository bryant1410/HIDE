package ;

//CodeMirror.hx from "try-haxe"
//https://github.com/clemos/try-haxe/blob/master/src/js/codemirror/CodeMirror.hx
//With few additional functions
//==========

import js.html.DivElement;
import js.html.Element;

typedef Completions = {
list : Array<String>,
from : Pos,
to : Pos,
}

typedef Pos = {
line : Int,
ch : Int
}

typedef MarkedText = {
clear : Void->Void,
find : Void->Pos
}

typedef LineHandle = {};

typedef ChangeEvent = {
from : Pos,
to : Pos,
text : Array<String>,
?next : ChangeEvent
}

typedef LineWidgetOptions = {
	coverGutter: Bool,
	noHScroll: Bool
}

typedef DocHistory = {
	var generation:Int;
}

@:native('CodeMirror.Doc') extern class Doc 
{
	public function new(body: Dynamic, mode: String, ?firstLineNumber:Int);
	function getValue():String;
	function somethingSelected():Bool;
	function setValue(value:String):Void;
	function getSelection(?lineSep:String):String;
	function markClean():Void;
	function changeGeneration(?closeEvent:Bool):Int;
	function isClean(?generation: Int):Bool;
	function clearHistory():Void;
	function historySize():Int;
	function getMode(): { name:String };
	function lineCount():Int;
	var history:DocHistory;
}

@:native('CodeMirror') extern class CodeMirror {

static var keyMap:Dynamic;
public var gutters:Array<String>;
public var state:Dynamic;

public static var prototype:Dynamic;

public static var commands (default,null) : Dynamic<CodeMirror->Void>;
//public static function simpleHint( cm : CodeMirror , getCompletions : CodeMirror -> Completions ) : Void;

public static function fromTextArea( textarea : Dynamic , ?config : Dynamic ) : CodeMirror;

public static function registerHelper(type:String, mode:String, onCompletion:Dynamic):Void;

@:overload(function (object:Dynamic, event:String, callback_function:Dynamic):Void {})
function on(event:String, callback_function:Dynamic):Void;

function setValue( v : String ) : Void;
function getValue() : String;
function refresh() : Void;

function getCursor( ?start : Bool ) : Pos;

function getLine(line:Int):String;
function getLineNumber(pos:Pos):Int;
	
function firstLine():Dynamic;
function lastLine():Dynamic;

function setOption(option:String, value:Dynamic):Void;
function swapDoc(doc:Dynamic):Void;
function getDoc():Dynamic;

@:overload(function (lineHandle: LineHandle, gutterID: String, value: Element):LineHandle {})
function setGutterMarker(line: Int, gutterID: String, value: Element):LineHandle;
function indexFromPos(pos:Pos):Int;
function posFromIndex(index:Int):Pos;
function getMode():Dynamic;

function addLineWidget(line:Int, msg:DivElement, options:LineWidgetOptions):Dynamic;
function removeLineWidget(widget:Dynamic):Void;

function getScrollInfo():Dynamic;
function scrollTo(param1:Dynamic, y:Int):Void;
function charCoords(param1:Dynamic, param2:String):Dynamic;
function cursorCoords(start:Bool):{left:Int, right:Int, top:Int, bottom:Int};
function getScrollerElement():Dynamic;
function scrollIntoView(from:Pos, to:Pos):Dynamic;
static function defineExtension(name:String, func:Dynamic):Void;
function centerOnLine(line:Int):Void;
function scanForBracket(pos:CodeMirror.Pos, dir:Int, ?style:Dynamic, ?config:Dynamic): { ch:String, pos:CodeMirror.Pos };
function execCommand(command:String):Void;
function replaceRange(replacement: String, from: Pos, to: Pos, ?origin: String):Void;
function setSelection(anchor: Pos, ?head: Pos, ?options: Dynamic):Void;
function getSelection(?lineSep: String):String;
function replaceSelection(replacement: String, ?select: String):Void;
function lineCount():Int;

function markText(from : Pos, to : Pos, options:{className : String} ) : MarkedText;
function getAllMarks():Array<MarkedText>;

function setMarker( line : Int , ?text : String , ?className : String ) : LineHandle;
@:overload( function( line : LineHandle ) : Void {})
function clearMarker(line:Int) : Void;

function getWrapperElement() : DivElement;

function somethingSelected() : Bool;
function focus() : Void;

}