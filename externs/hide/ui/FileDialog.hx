package ui;

@:native('ui.FileDialog') extern class FileDialog
{
public function new(event_name:String, saveAs:Bool=false):Void;
}