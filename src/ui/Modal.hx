package ui;

import jQuery.*;
	
class Modal
{
	public var id:String;
	public var title:String;
	public var content:String;
	public var ok_text:String;
	public var cancel_text:String;
	
	
	
	
	public function new()
	{
		title = '';
		id = '';
		content = '';
		ok_text = '';
		cancel_text = '';
	}
	
	
	
	public function show()
	{
		var retStr = ["<div class='modal fade' id='"+id+"' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>",
				   "<div class='modal-dialog'>",
				   "<div class='modal-content'>",
				   "<div class='modal-header'>",
				   "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>",
				   "<h4 class='modal-title'>"+title+"</h4>",
				   "</div>",
				   "<div class='modal-body'>",
				   content,
				   "</div>",
				   "<div class='modal-footer'>",
				   "<button type='button' class='btn btn-default' data-dismiss='modal'>"+cancel_text+"</button>",
				   "<button type='button' class='btn btn-primary button_ok'>"+ok_text+"</button>",
				   "</div>",
				   "</div>",
				   "</div>",
				   "</div>"].join("\n");
		
		new JQuery("#modal_position").html(retStr);		
		
		
		// using untyped
		// http://haxe.org/doc/js/extern_libraries
		untyped new JQuery("#"+id).modal("show");
		
		
		new JQuery('#'+id).on('hidden.bs.modal', function () {
			new JQuery("#"+id).remove();
		});			
		
	}
	
	
	public function hide()
	{
		// using untyped
		// http://haxe.org/doc/js/extern_libraries
		untyped new JQuery("#"+id).modal("hide");
	}
}