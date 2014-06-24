package completion;
import cm.Editor;
import core.Completion;

/**
* @author 
 */
class GoToDeclaration
{
	static var instance:GoToDeclaration = null;
	
	public function new()
	{
			
	}
	
	public static function get()
	{
		if (instance == null)
		{
			instance = new GoToDeclaration();
		}
		
		return instance;
	}
	
	public function start()
	{
		var cm = Editor.editor;
		
		Completion.getCompletion(function ()
								 {
									 //
								 }
								, cm.getCursor(), "position", false);
	}


}