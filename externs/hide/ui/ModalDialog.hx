package ui;

@:native('ui.ModalDialog') extern class ModalDialog
{
public var id:String;
public var title:String;
public var content:String;
public var ok_text:String;
public var cancel_text:String;
public var footer:Bool;
public var header:Bool;

public function new(_onClick:Dynamic);
public function updateModalDialog();
public function show();
public function hide();
}

	