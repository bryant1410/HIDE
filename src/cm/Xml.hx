package cm;
import haxe.Timer;

/**
* @author 
 */
class Xml
{
    static var tags:Dynamic;
    
    public static function generateXmlCompletion()
    {
        var dummy = {
        attrs: {
          color: ["red", "green", "blue", "purple", "white", "black", "yellow"],
          size: ["large", "medium", "small"],
          description: null
        },
        children: []
    };
        
//         var a = untyped __js__("class");
        
        tags = {
        "!top": ["top"],
        "!attrs": {
          id: null
//           a: ["A", "B", "C"]
        },
        top: {
          attrs: {
            lang: ["en", "de", "fr", "nl"],
            freeform: null
          },
          children: ["animal", "plant"]
        },
        animal: {
          attrs: {
            name: null,
            isduck: ["yes", "no"]
          },
          children: ["wings", "feet", "body", "head", "tail"]
        },
        plant: {
          attrs: {name: null},
          children: ["leaves", "stem", "flowers"]
        },
        wings: dummy, feet: dummy, body: dummy, head: dummy, tail: dummy,
        leaves: dummy, stem: dummy, flowers: dummy
      };
        
      cm.Editor.editor.setOption("hintOptions", {schemaInfo: tags});
	}
    
	public static function completeAfter(cm:CodeMirror, ?pred:Dynamic) 
    {
        trace("completeAfter");
        var cur = cm.getCursor();
        if (pred == null || pred() != null)
        {
			Timer.delay(function() 
            {
                if (cm.state.completionActive == null)
                {
                    cm.showHint({completeSingle: false});
                }
            }, 100);
        }
        
        return CodeMirrorStatic.Pass;
    }
    
    public static function completeIfAfterLt(cm:CodeMirror) 
    {
        trace("completeIfAfterLt");
        return completeAfter(cm, function() {
          var cur = cm.getCursor();
            return cm.getRange({line: cur.line, ch: cur.ch - 1}, cur) == "<";
        });
    }
    
	public static function completeIfInTag(cm:CodeMirror) 
    {
        trace("completeIfInTag");
        return completeAfter(cm, function() {
          var tok = cm.getTokenAt(cm.getCursor());
          if (tok.type == "string" && (!~/['"]/.match(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
          var inner = CodeMirrorStatic.innerMode(cm.getMode(), tok.state).state;
          return inner.tagName;
        });
	}
}