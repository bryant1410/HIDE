package dialogs;
import bootstrap.ButtonManager;
import js.html.ButtonElement;
import nodejs.webkit.Shell;

/**
 * ...
 * @author AS3Boyan
 */
class BrowseDirectoryWithDownloadButtonDialog extends BrowseDirectoryDialog
{
	var downloadButton:ButtonElement;

	public function new(?title:String) 
	{
		super(title);
		
		downloadButton = ButtonManager.createButton("Download");
		
		inputGroupButton.getSpan().appendChild(downloadButton);
	}
	
	public function setDownloadButtonOptions(text:String, url:String)
	{
		downloadButton.textContent = text;
		
		downloadButton.onclick = function (e):Void 
		{
			Shell.openExternal(url);
		};
	}
	
}