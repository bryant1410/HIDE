package ;
import haxe.ds.StringMap.StringMap;
import haxe.Timer;

/**
 * ...
 * @author AS3Boyan
 */
class TernAddon
{

	private static var options:Dynamic;
	static private var server:Dynamic;
	static private var docs:Dynamic;
	static private var cachedArgHints:Dynamic;
	static private var activeArgHints:Dynamic;
	static private var jumpStack:Dynamic;
	static private var trackChange:Dynamic;
	
	public function new() 
	{
		
	}
	
	public static  function init():Void
	{
		var ternServer = untyped __js__("CodeMirror.TernServer");
		
		ternServer = function(_options) 
		{
			//var self = this;
			if (_options != null)
			{
				options = _options;
			}
			else
			{
				options = {};
			}
			
			var plugins = null;
			
			if (options.plugins == null)
			{
				options.plugins = {};
			}
			
			plugins = options.plugins;
			
			if (plugins.doc_comment == null) 
			{
				plugins.doc_comment = true;
			}
			
			options.defs = [];
			
			if (options.useWorker) 
			{
			  //server = new WorkerServer(this);
			} 
			else 
			{
			  server = new Tern({
				getFile: function(name, c) { return getFile(ternServer, name, c); },
				async: true,
				defs: options.defs,
				plugins: plugins
			  });
			}
			//docs = Object.create(null);
			docs = { };
			trackChange = function(doc, change) { trackChange(ternServer, doc, change); };

			cachedArgHints = null;
			activeArgHints = null;
			jumpStack = [];
	  };
	  
	  CodeMirror.TernServer.prototype = {
		addDoc: function(name, doc, path) {
		  var data = {doc: doc, name: name, changed: null, path: path};
		  this.server.addFile(name, docValue(this, data));
		  CodeMirror.on(doc, "change", this.trackChange);
		  return this.docs[name] = data;
		},

		delDoc: function(name) {
		  var found = this.docs[name];
		  if (!found) return;
		  CodeMirror.off(found.doc, "change", this.trackChange);
		  this.docs[name] = null;
		  this.server.delFile(name);
		},

		hideDoc: function(name) {
		  closeArgHints(this);
		  var found = this.docs[name];
		  if (found && found.changed) sendDoc(this, found);
		},

		complete: function(cm) {
		  var self = this;
		  CodeMirror.showHint(cm, function(cm, c) { return hint(self, cm, c); }, {async: true});
		},

		getHint: function(cm, c) { return hint(this, cm, c); },

		showType: function(cm) { showType(this, cm); },

		updateArgHints: function(cm) { updateArgHints(this, cm); },

		jumpToDef: function(cm) { jumpToDef(this, cm); },

		jumpBack: function(cm) { jumpBack(this, cm); },

		rename: function(cm) { rename(this, cm); },

		request: function (cm, query, c) {
		  var self = this;
		  var doc = findDoc(this, cm.getDoc());
		  var request = buildRequest(this, doc, query);

		  this.server.request(request, function (error, data) {
			if (!error && self.options.responseFilter)
			  data = self.options.responseFilter(doc, query, request, error, data);
			c(error, data);
		  });
		}
	  };

	  var Pos = CodeMirror.Pos;
	  var cls = "CodeMirror-Tern-";
	  var bigDoc = 250;
	}
	
	static function getFile(ts, name, c) 
	{
		var buf = ts.docs[name];
		if (buf)
		  c(docValue(ts, buf));
		else if (ts.options.getFile)
		  ts.options.getFile(name, c);
		else
		  c(null);
	}
	
	function findDoc(ts, doc, name) {
    for (n in ts.docs) {
      var cur = ts.docs[n];
      if (cur.doc == doc) return cur;
    }
    if (name == null) 
	{
		var i = 0;
		
		while (true) 
		{
			n = "[doc" + Std.string(i) + "]";
			
			if (ts.docs[n] != n) 
			{ 
				name = n; break; 
			}
			
			++i;
		}
	}
    return ts.addDoc(name, doc);
  }

  static function trackChange(ts, doc, change) {
    var data = findDoc(ts, doc);

    var argHints = ts.cachedArgHints;
    if (argHints && argHints.doc == doc && cmpPos(argHints.start, change.to) <= 0)
      ts.cachedArgHints = null;

    var changed = data.changed;
    if (changed == null)
      data.changed = changed = {from: change.from.line, to: change.from.line};
    var end = change.from.line + (change.text.length - 1);
    if (change.from.line < changed.to) changed.to = changed.to - (change.to.line - end);
    if (end >= changed.to) changed.to = end + 1;
    if (changed.from > change.from.line) changed.from = change.from.line;

    if (doc.lineCount() > bigDoc && change.to - changed.from > 100) setTimeout(function() {
      if (data.changed && data.changed.to - data.changed.from > 100) sendDoc(ts, data);
    }, 200);
  }

  static function sendDoc(ts, doc) {
    ts.server.request({files: [{type: "full", name: doc.name, text: docValue(ts, doc)}]}, function(error) {
      if (error) console.error(error);
      else doc.changed = null;
    });
  }

  // Completion

  static function hint(ts, cm, c) {
	 
    ts.request(cm, {type: "completions", types: true, docs: true, urls: true, caseInsensitive:true, sort:false, filter:false}, function(error, data) {
      if (error) return showError(ts, cm, error);
      var completions = [], after = "";
      var from = data.start, to = data.end;
      if (cm.getRange(Pos(from.line, from.ch - 2), from) == "[\"" &&
          cm.getRange(to, Pos(to.line, to.ch + 2)) != "\"]")
        after = "\"]";
		
		var word = cm.getRange(from, to).toLowerCase();
		
		var doc = cm.getDoc();
		
		console.log(doc.indexFromPos(from));
		
		var filtered_results = [];
		var sorted_results = [];
		
		for (i in 0...data.completions.length) 
		{
			var completion = data.completions[i];
			  
			var completion_name = completion.name.toLowerCase();
			
			var b = true;
		  
			  for (j in 0...word.length)
			  {
				  if (completion_name.indexOf(word.charAt(j)) == -1)
				  {
					  b = false;
					  break;
				  }
			  }
			  //
			  //.indexOf(word) != 0
			
			if (b)
			{
				filtered_results.push(completion);
			}
		}
		
		for (i in 0...filtered_results.length) 
		{
			var completion = filtered_results[i];
			
			if (completion.name.toLowerCase().indexOf(word) == 0)
			{
				sorted_results.push(completion);
				filtered_results.splice(i, 1);
			}
		}
		
	  for (i in 0...sorted_results.length) 
	  {
        var completion = sorted_results[i];
		
		var className = typeToIcon(completion.type);
        if (data.guess) className += " " + cls + "guess";
        completions.push({text: completion.name + after,
                          displayText: completion.name,
                          className: className,
                          data: completion});
      }
		
		
      for (i in 0...filtered_results.length) 
	  {
        var completion = filtered_results[i];
		
		var className = typeToIcon(completion.type);
        if (data.guess) className += " " + cls + "guess";
        completions.push({text: completion.name + after,
                          displayText: completion.name,
                          className: className,
                          data: completion});
      }

      var obj = {from: from, to: to, list: completions};
      var tooltip = null;
      CodeMirror.on(obj, "close", function() { remove(tooltip); });
      CodeMirror.on(obj, "update", function() { remove(tooltip); });
      CodeMirror.on(obj, "select", function(cur, node) {
        remove(tooltip);
        var content = ts.options.completionTip ? ts.options.completionTip(cur.data) : cur.data.doc;
        if (content) {
          tooltip = makeTooltip(node.parentNode.getBoundingClientRect().right + window.pageXOffset,
                                node.getBoundingClientRect().top + window.pageYOffset, content);
          tooltip.className += " " + cls + "hint-doc";
        }
      });
      c(obj);
    });
  }

  static function typeToIcon(type) {
    var suffix;
    if (type == "?") suffix = "unknown";
    else if (type == "number" || type == "string" || type == "bool") suffix = type;
    //else if (/^fn\(/.test(type)) suffix = "fn";
    //else if (/^\[/.test(type)) suffix = "array";
    else suffix = "object";
    return cls + "completion " + cls + "completion-" + suffix;
  }

  // Type queries

  static function showType(ts, cm) {
    ts.request(cm, "type", function(error, data) {
      if (error) return showError(ts, cm, error);
      if (ts.options.typeTip) {
        var tip = ts.options.typeTip(data);
      } else {
        var tip = elt("span", null, elt("strong", null, data.type || "not found"));
        if (data.doc)
          tip.appendChild(document.createTextNode(" — " + data.doc));
        if (data.url) {
          tip.appendChild(document.createTextNode(" "));
          tip.appendChild(elt("a", null, "[docs]")).href = data.url;
        }
      }
      tempTooltip(cm, tip);
    });
  }

  // Maintaining argument hints

  static function updateArgHints(ts, cm) {
    closeArgHints(ts);

    if (cm.somethingSelected()) return;
    var state = cm.getTokenAt(cm.getCursor()).state;
    var inner = CodeMirror.innerMode(cm.getMode(), state);
    if (inner.mode.name != "javascript") return;
    var lex = inner.state.lexical;
    if (lex.info != "call") return;

    var ch, pos = lex.pos || 0, tabSize = cm.getOption("tabSize");
	
	var line;
	var e;
	
	while (line >= e)
	{
		line = cm.getCursor().line;
		e = Math.max(0, line - 9);
		var found = false;
		
		var str = cm.getLine(line), extra = 0;
		
		var pos = 0;
		
		while (true)
		{
			var tab = str.indexOf("\t", pos);
			if (tab == -1) break;
			extra += tabSize - (tab + extra) % tabSize - 1;
			pos = tab + 1;
		}
		
		ch = lex.column - extra;
		if (str.charAt(ch) == "(") {found = true; break;}
		
		--line;
	}
    if (!found) return;

    var start = Pos(line, ch);
    var cache = ts.cachedArgHints;
    if (cache && cache.doc == cm.getDoc() && cmpPos(start, cache.start) == 0)
      return showArgHints(ts, cm, pos);

    ts.request(cm, {type: "type", preferFunction: true, end: start}, function(error, data) {
      //if (error || !data.type || !(/^fn\(/).test(data.type)) return;
      ts.cachedArgHints = {
        start: pos,
        type: parseFnType(data.type),
        name: data.exprName || data.name || "fn",
        guess: data.guess,
        doc: cm.getDoc()
      };
      showArgHints(ts, cm, pos);
    });
  }

  static function showArgHints(ts, cm, pos) {
    closeArgHints(ts);

    var cache = ts.cachedArgHints, tp = cache.type;
    var tip = elt("span", cache.guess ? cls + "fhint-guess" : null,
                  elt("span", cls + "fname", cache.name), "(");
    for (i = 0...tp.args.length) 
	{
      if (i) tip.appendChild(document.createTextNode(", "));
      var arg = tp.args[i];
      tip.appendChild(elt("span", cls + "farg" + (i == pos ? " " + cls + "farg-current" : ""), arg.name || "?"));
      if (arg.type != "?") {
        tip.appendChild(document.createTextNode(": "));
        tip.appendChild(elt("span", cls + "type", arg.type));
      }
    }
	
	var str:String = null;
	
	if (tp.rettype != null)
	{
		str = ") -> ";
	}
	else
	{
		str = ")";
	}
	
    tip.appendChild(document.createTextNode(str));
    if (tp.rettype) tip.appendChild(elt("span", cls + "type", tp.rettype));
    var place = cm.cursorCoords(null, "page");
    ts.activeArgHints = makeTooltip(place.right + 1, place.bottom, tip);
  }

  static function parseFnType(text) {
    var args = [], pos = 3;

    function skipMatching(upto) {
      var depth = 0, start = pos;
      while (true) 
	  {
        var next = text.charAt(pos);
        if (upto.test(next) && !depth) return text.slice(start, pos);
        if (/[{\[\(]/.test(next)) ++depth;
        else if (/[}\]\)]/.test(next)) --depth;
        ++pos;
      }
    }

    // Parse arguments
    if (text.charAt(pos) != ")") for (;;) {
      var name = text.slice(pos).match(/^([^, \(\[\{]+): /);
      if (name) {
        pos += name[0].length;
        name = name[1];
      }
      args.push({name: name, type: skipMatching(/[\),]/)});
      if (text.charAt(pos) == ")") break;
      pos += 2;
    }

    var rettype = text.slice(pos).match(/^\) -> (.*)$/);

    return {args: args, rettype: rettype && rettype[1]};
  }

  // Moving to the definition of something

  static function jumpToDef(ts, cm) {
    function inner(varName) {
      var req = {type: "definition", variable: varName || null};
      var doc = findDoc(ts, cm.getDoc());
      ts.server.request(buildRequest(ts, doc, req), function(error, data) {
        if (error) return showError(ts, cm, error);
        if (!data.file && data.url) { window.open(data.url); return; }

        if (data.file) {
          var localDoc = ts.docs[data.file], found;
          if (localDoc && (found = findContext(localDoc.doc, data))) {
            ts.jumpStack.push({file: doc.name,
                               start: cm.getCursor("from"),
                               end: cm.getCursor("to")});
            moveTo(ts, doc, localDoc, found.start, found.end);
            return;
          }
        }
        showError(ts, cm, "Could not find a definition.");
      });
    }

    if (!atInterestingExpression(cm))
      dialog(cm, "Jump to variable", function(name) { if (name) inner(name); });
    else
      inner();
  }

  static function jumpBack(ts, cm) {
    var pos = ts.jumpStack.pop(), doc = pos && ts.docs[pos.file];
    if (!doc) return;
    moveTo(ts, findDoc(ts, cm.getDoc()), doc, pos.start, pos.end);
  }

  static function moveTo(ts, curDoc, doc, start, end) {
    doc.doc.setSelection(end, start);
    if (curDoc != doc && ts.options.switchToDoc) {
      closeArgHints(ts);
      ts.options.switchToDoc(doc.name);
    }
  }

  // The {line,ch} representation of positions makes this rather awkward.
  static function findContext(doc, data) {
    var before = data.context.slice(0, data.contextOffset).split("\n");
    var startLine = data.start.line - (before.length - 1);
    var start = Pos(startLine, (before.length == 1 ? data.start.ch : doc.getLine(startLine).length) - before[0].length);

    var text = doc.getLine(startLine).slice(start.ch);
    for (var cur = startLine + 1; cur < doc.lineCount() && text.length < data.context.length; ++cur)
      text += "\n" + doc.getLine(cur);
    if (text.slice(0, data.context.length) == data.context) return data;

    var cursor = doc.getSearchCursor(data.context, 0, false);
    var nearest, nearestDist = Infinity;
    while (cursor.findNext()) {
      var from = cursor.from(), dist = Math.abs(from.line - start.line) * 10000;
      if (!dist) dist = Math.abs(from.ch - start.ch);
      if (dist < nearestDist) { nearest = from; nearestDist = dist; }
    }
    if (!nearest) return null;

    if (before.length == 1)
      nearest.ch += before[0].length;
    else
      nearest = Pos(nearest.line + (before.length - 1), before[before.length - 1].length);
    if (data.start.line == data.end.line)
      var end = Pos(nearest.line, nearest.ch + (data.end.ch - data.start.ch));
    else
      var end = Pos(nearest.line + (data.end.line - data.start.line), data.end.ch);
    return {start: nearest, end: end};
  }

  static function atInterestingExpression(cm) 
  {
    var pos = cm.getCursor("end"), tok = cm.getTokenAt(pos);
    if (tok.start < pos.ch && (tok.type == "comment" || tok.type == "string")) return false;
    return /\w/.test(cm.getLine(pos.line).slice(Math.max(pos.ch - 1, 0), pos.ch + 1));
  }

  // Variable renaming

  static function rename(ts, cm) 
  {
    var token = cm.getTokenAt(cm.getCursor());
    if (!/\w/.test(token.string)) showError(ts, cm, "Not at a variable");
    dialog(cm, "New name for " + token.string, function(newName) {
      ts.request(cm, {type: "rename", newName: newName, fullDocs: true}, function(error, data) {
        if (error) return showError(ts, cm, error);
        applyChanges(ts, data.changes);
      });
    });
  }

  var nextChangeOrig = 0;
  static function applyChanges(ts, changes) {
    var perFile = Object.create(null);
    for (var i = 0; i < changes.length; ++i) {
      var ch = changes[i];
      (perFile[ch.file] || (perFile[ch.file] = [])).push(ch);
    }
    for (var file in perFile) {
      var known = ts.docs[file], chs = perFile[file];;
      if (!known) continue;
      chs.sort(function(a, b) { return cmpPos(b, a); });
      var origin = "*rename" + (++nextChangeOrig);
      for (var i = 0; i < chs.length; ++i) {
        var ch = chs[i];
        known.doc.replaceRange(ch.text, ch.start, ch.end, origin);
      }
    }
  }

  // Generic request-building helper

  static function buildRequest(ts, doc, query) {
    var files = [], offsetLines = 0, allowFragments = !query.fullDocs;
    if (!allowFragments) delete query.fullDocs;
    if (typeof query == "string") query = {type: query};
    query.lineCharPositions = true;
    if (query.end == null) {
      query.end = doc.doc.getCursor("end");
      if (doc.doc.somethingSelected())
        query.start = doc.doc.getCursor("start");
    }
    var startPos = query.start || query.end;

    if (doc.changed) {
      if (doc.doc.lineCount() > bigDoc && allowFragments !== false &&
          doc.changed.to - doc.changed.from < 100 &&
          doc.changed.from <= startPos.line && doc.changed.to > query.end.line) {
        files.push(getFragmentAround(doc, startPos, query.end));
        query.file = "#0";
        var offsetLines = files[0].offsetLines;
        if (query.start != null) query.start = Pos(query.start.line - -offsetLines, query.start.ch);
        query.end = Pos(query.end.line - offsetLines, query.end.ch);
      } else {
        files.push({type: "full",
                    name: doc.name,
                    text: docValue(ts, doc)});
        query.file = doc.name;
        doc.changed = null;
      }
    } else {
      query.file = doc.name;
    }
    for (var name in ts.docs) {
      var cur = ts.docs[name];
      if (cur.changed && cur != doc) {
        files.push({type: "full", name: cur.name, text: docValue(ts, cur)});
        cur.changed = null;
      }
    }

    return {query: query, files: files};
  }

  static function getFragmentAround(data, start, end) {
    var doc = data.doc;
    var minIndent = null, minLine = null, endLine, tabSize = 4;
    for (var p = start.line - 1, min = Math.max(0, p - 50); p >= min; --p) {
      var line = doc.getLine(p), fn = line.search(/\bfunction\b/);
      if (fn < 0) continue;
      var indent = CodeMirror.countColumn(line, null, tabSize);
      if (minIndent != null && minIndent <= indent) continue;
      minIndent = indent;
      minLine = p;
    }
    if (minLine == null) minLine = min;
    var max = Math.min(doc.lastLine(), end.line + 20);
    if (minIndent == null || minIndent == CodeMirror.countColumn(doc.getLine(start.line), null, tabSize))
      endLine = max;
    else for (endLine = end.line + 1; endLine < max; ++endLine) {
      var indent = CodeMirror.countColumn(doc.getLine(endLine), null, tabSize);
      if (indent <= minIndent) break;
    }
    var from = Pos(minLine, 0);

    return {type: "part",
            name: data.name,
            offsetLines: from.line,
            text: doc.getRange(from, Pos(endLine, 0))};
  }

  // Generic utilities

  static function cmpPos(a, b) { return a.line - b.line || a.ch - b.ch; }

  static function elt(tagname, cls /*, ... elts*/) {
    var e = document.createElement(tagname);
    if (cls) e.className = cls;
    for (var i = 2; i < arguments.length; ++i) {
      var elt = arguments[i];
      if (typeof elt == "string") elt = document.createTextNode(elt);
      e.appendChild(elt);
    }
    return e;
  }

  static function dialog(cm, text, f) {
    if (cm.openDialog)
      cm.openDialog(text + ": <input type=text>", f);
    else
      f(prompt(text, ""));
  }

  // Tooltips

  static function tempTooltip(cm, content) {
    var where = cm.cursorCoords();
    var tip = makeTooltip(where.right + 1, where.bottom, content);
    function clear() {
      if (!tip.parentNode) return;
      cm.off("cursorActivity", clear);
      fadeOut(tip);
    }
    setTimeout(clear, 1700);
    cm.on("cursorActivity", clear);
  }

  static function makeTooltip(x, y, content) {
    var node = elt("div", cls + "tooltip", content);
    node.style.left = x + "px";
    node.style.top = y + "px";
    document.body.appendChild(node);
    return node;
  }

  static function remove(node) {
    var p = node && node.parentNode;
    if (p) p.removeChild(node);
  }

  static function fadeOut(tooltip) {
    tooltip.style.opacity = "0";
	Timer.delay(remove(tooltip), 1100);
  }

  static function showError(ts, cm, msg) 
  {
    if (ts.options.showError)
	{
		ts.options.showError(cm, msg);
	}
    else
	{
		tempTooltip(cm, String(msg));
	}
  }

  static function closeArgHints(ts) 
  {
    if (ts.activeArgHints) 
	{ 
		remove(ts.activeArgHints); ts.activeArgHints = null; 
	}
  }

  static function docValue(ts, doc) 
  {
    var val = doc.doc.getValue();
    if (ts.options.fileFilter) 
	{
		val = ts.options.fileFilter(val, doc.name, doc.doc);
	}
	return val;
  }
	
}