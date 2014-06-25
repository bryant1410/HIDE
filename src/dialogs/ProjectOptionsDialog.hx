package dialogs;
import bootstrap.ButtonManager;
import projectaccess.ProjectOptions;

/**
 * ...
 * @author AS3Boyan
 */
class ProjectOptionsDialog extends ModalDialog
{

	public function new() 
	{
		super("Project Options");
		
		var projectOptions = ProjectOptions.get();
		
		getBody().appendChild(projectOptions.page);
		getFooter().appendChild(ButtonManager.createButton("OK", false, true, true));
	}
	
}