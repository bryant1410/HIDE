package ;
import jQuery.JQuery;
import js.Browser;

/**
 * ...
 * @author ...
 */
class Layout
{
	static private var layout:Dynamic;

	public function new() 
	{
		
	}
	
	public static function init():Void
	{
		layout = untyped new JQuery("#panel").layout(
		{
			center__paneSelector:	".outer-center",
			west__paneSelector:		".outer-west",
			west__size:				120,
			spacing_open:			8,  // ALL panes
			spacing_closed:			12, // ALL panes
			
			center__childOptions: {
				center__paneSelector:	".middle-center",
				south__paneSelector:	".middle-south",
				south__size:			100,
				spacing_open:			8,  // ALL panes
				spacing_closed:			12 // ALL panes
			},
			
			animatePaneSizing:			true,
			stateManagement__enabled:	true
		});
		
		initPreserveLayout();
	}
	
	static private function initPreserveLayout():Void
	{
		var localStorage = Browser.getLocalStorage();
		
		Utils.window.on("close", function (e):Void
		{
			var stateString = JSON.stringify(layout.readState());
			localStorage.setItem("state", stateString);
		
		});
		
		var state = localStorage.getItem("state");
		
		if (state != null)
		{
			layout.loadState(JSON.parse(state), true);
		}
	}
	
}