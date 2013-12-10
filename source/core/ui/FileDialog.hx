package core.ui;

import jQuery.*;
import js.Browser;


@:keep @:expose  class FileDialog
{
	public function new(event_name:String, saveAs:Bool=false)
	{
		if (saveAs == false)
		{
		new JQuery('#temp').html("<input id='temp_fileDialog' type='file' />");
		}
		else
		{
		new JQuery('#temp').html("<input id='temp_fileDialog' type='file' nwsaveas />");			
		}


		if (event_name != "init")
		{
		var chooser = new JQuery("#temp_fileDialog");
		chooser.change(function(evt) {
			var filepath = chooser.val();
			//new JQuery(js.Browser.document).triggerHandler(event_name,filepath);
			untyped $(document).triggerHandler(event_name,filepath);
			});
		chooser.trigger('click'); 
		}

	}
}
