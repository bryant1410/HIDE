package dialogs;

/**
 * ...
 * @author AS3Boyan
 */
class DialogManager
{
	static var browseDirectoryDialog:BrowseDirectoryDialog;
	static var haxelibManagerDialog:HaxelibManagerDialog;
	static var projectOptionsDialog:ProjectOptionsDialog;
	static var browseDirectoryWithDownloadButtonDialog:BrowseDirectoryWithDownloadButtonDialog;
	static var installHaxelibDialog:InstallHaxelibDialog;
	
	public static function load():Void
	{
		browseDirectoryDialog =  new BrowseDirectoryDialog();
		browseDirectoryWithDownloadButtonDialog = new BrowseDirectoryWithDownloadButtonDialog();
		haxelibManagerDialog = new HaxelibManagerDialog();
		projectOptionsDialog = new ProjectOptionsDialog();
		installHaxelibDialog = new InstallHaxelibDialog();
	}
	
	public static function showBrowseFolderDialog(title:String, onComplete:String->Void, ?defaultValue:String = "", ?downloadButtonText:String, ?downloadButtonURL:String):Void
	{
		var dialog = browseDirectoryDialog;
		
		if (downloadButtonText != null && downloadButtonURL != null) 
		{
			dialog = browseDirectoryWithDownloadButtonDialog;
			browseDirectoryWithDownloadButtonDialog.setDownloadButtonOptions(downloadButtonText, downloadButtonURL);
		}
		
		dialog.setTitle(title);
		dialog.setCallback(onComplete);
		dialog.setDefaultValue(defaultValue);
		dialog.show();
	}
	
	public static function showHaxelibManagerDialog()
	{
		haxelibManagerDialog.show();
	}
	
	public static function showProjectOptions()
	{
		projectOptionsDialog.show();
	}
	
	public static function showInstallHaxelibDialog(lib:String, pathToHxml:String):Void 
	{
		installHaxelibDialog.setLib(lib);
		installHaxelibDialog.setPathToHxml(pathToHxml);
		installHaxelibDialog.show();
	}
	
	public static function hide():Void 
	{
		browseDirectoryDialog.hide();
		browseDirectoryWithDownloadButtonDialog.hide();
		haxelibManagerDialog.hide();
	}
}