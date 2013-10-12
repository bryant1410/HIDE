package ;
import haxe.ds.StringMap.StringMap;

/**
 * ...
 * @author AS3Boyan
 */
class TernAddon
{

	var options:Dynamic;
	
	public function new() 
	{
		var ternServer = untyped __js__("CodeMirror.TernServer");
		
		ternServer = function(_options) {
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
		
		if (this.options.plugins == null)
		{
			this.options.plugins = {};
		}
		
		plugins = this.options.plugins;
		
		if (!plugins.doc_comment) plugins.doc_comment = true;
		if (this.options.useWorker) {
		  this.server = new WorkerServer(this);
		} else {
		  this.server = new tern.Server({
			getFile: function(name, c) { return getFile(self, name, c); },
			async: true,
			defs: this.options.defs || [],
			plugins: plugins
		  });
		}
		this.docs = Object.create(null);
		this.trackChange = function(doc, change) { trackChange(self, doc, change); };

		this.cachedArgHints = null;
		this.activeArgHints = null;
		this.jumpStack = [];
	  };
	}
	
}