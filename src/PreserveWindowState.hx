package ;
import haxe.Timer;
import js.Browser;

//Ported to Haxe from https://github.com/rogerwang/node-webkit/wiki/Preserve-window-state-between-sessions

// Cross-platform window state preservation.
// Yes this code is quite complicated, but this is the best I came up with for 
// current state of node-webkit Window API (v0.7.3).
// Known issues:
// - unmaximization not always sets the window (x, y) in the lastly used coordinates
// - unmaximization animation sometimes looks wierd

/**
 * ...
 * @author ...
 */
 
class PreserveWindowState
{
	static private var winState:Dynamic;
    static private var currWinMode:String;
    static private var resizeTimeout:Timer;
    static private var isMaximizationEvent:Bool = false;

	public function new() 
	{
		
	}
	
	public static function init():Void
	{		
		initWindowState();
    
		Utils.window.on('maximize', function ():Void
		{
			isMaximizationEvent = true;
			currWinMode = 'maximized';
		});
    
		Utils.window.on('unmaximize', function ():Void
		{
			currWinMode = 'normal';
			restoreWindowState();
		});
    
		Utils.window.on('minimize', function ():Void
		{
			currWinMode = 'minimized';
		});
    
		Utils.window.on('restore', function ():Void
		{
			currWinMode = 'normal';
		});
		
		Utils.window.window.addEventListener('resize', function (e) 
		{
			// resize event is fired many times on one resize action,
			// this hack with setTiemout forces it to fire only once
			
			if (resizeTimeout != null)
			{
				resizeTimeout.stop();
			}
			
			resizeTimeout = new Timer(500);
			resizeTimeout.run = 
			function () 
			{
				// on MacOS you can resize maximized window, so it's no longer maximized
				if (isMaximizationEvent) 
				{
					// first resize after maximization event should be ignored
					isMaximizationEvent = false;
				} 
				else 
				{
					if (currWinMode == 'maximized') 
					{
						currWinMode = 'normal';
					}
				}
				
				resizeTimeout.stop();
				
				dumpWindowState();	
			};
			
		}, false);
		
		Utils.window.on("close", function (e):Void
		{
			saveWindowState();
			Utils.window.close(true);
		}
		);
	}
	
	private static function initWindowState():Void
	{
		var windowState = Browser.getLocalStorage().getItem("windowState");
		
		if (windowState != null)
		{
			winState = JSON.parse(windowState);
		}
		
        if (winState != null) 
		{
            currWinMode = winState.mode;
            if (currWinMode == 'maximized') 
			{
                Utils.window.maximize();
            } 
			else 
			{
                restoreWindowState();
            }
        } 
		else 
		{
            currWinMode = 'normal';
            dumpWindowState();
        }
        
        Utils.window.show();
    }
    
    private static function dumpWindowState():Void
	{
        if (winState == null) 
		{
            winState = {};
        }
        
        // we don't want to save minimized state, only maximized or normal
        if (currWinMode == 'maximized') 
		{
            winState.mode = 'maximized';
        }
		else 
		{
            winState.mode = 'normal';
        }
        
        // when window is maximized you want to preserve normal
        // window dimensions to restore them later (even between sessions)
        if (currWinMode == 'normal') 
		{
            winState.x = Utils.window.x;
            winState.y = Utils.window.y;
            winState.width = Utils.window.width;
            winState.height = Utils.window.height;
        }
    }
    
    private static function restoreWindowState():Void
	{
        Utils.window.resizeTo(winState.width, winState.height);
        Utils.window.moveTo(winState.x, winState.y);
    }
    
    private static function saveWindowState():Void
	{
        dumpWindowState();
        Browser.getLocalStorage().setItem("windowState", JSON.stringify(winState));
    }
	
}