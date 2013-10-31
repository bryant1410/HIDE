package ui;

@:native('ui.Notify') extern class Notify
{
public  var type:String;
public  var content:String;

public function new(_onClick:Dynamic);
public function show();
}