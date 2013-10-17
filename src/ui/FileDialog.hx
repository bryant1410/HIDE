package ui;

import jQuery.*;
import js.Browser;

class FileDialog
{
	public function new(_onClick:Dynamic)
	{
		new JQuery('#temp').html("<input id='temp_fileDialog' type='file' />");		
		new JQuery("#temp_fileDialog").click();
		new JQuery("#temp_fileDialog").on("change",function():Void
			{
			_onClick(new JQuery("#temp_fileDialog").val());
			});
		new JQuery('#temp').html();
	}
}