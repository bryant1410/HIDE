package flambeproject;
import js.Browser;

/**
 * ...
 * @author ...
 */
class FlambeAlert
{

	public static function creteCSS():Void
	{
		var cssStyleSheet = Browser.document.createElement("style");
		cssStyleSheet.innerText = ".alertify-log-"+FlambeConstants.LOG_STYLE_NAME+" {	color: #0eb5b5;		background: #a0dede;		border: 1px solid #c6e9e9;	}";
		Browser.document.head.appendChild(cssStyleSheet);
	}
	public static function action():Void 
	{
		Alertify.log("Doing...", FlambeConstants.LOG_STYLE_NAME);
	}
	
}