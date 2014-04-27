package dialogs;
import bootstrap.ButtonManager;
import bootstrap.InputGroupButton;
import bootstrap.RadioElement;
import js.Browser;

/**
 * ...
 * @author AS3Boyan
 */
class InstallHaxelibDialog extends ModalDialog
{
	var inputGroupButton:InputGroupButton;

	public function new()
	{
		super("Missing haxelib");
		
		var form = Browser.document.createFormElement();
		form.setAttribute("role", "form");
		
		inputGroupButton = new InputGroupButton("Run command");
		inputGroupButton.getButton().onclick = function (e):Void 
		{
			
		};
		
		var installLibRadio = new RadioElement("haxelibInstallOptions", "installLib", "install from haxelib", function ():Void 
		{
			inputGroupButton.getInput().value = "haxelib install";
		});
		installLibRadio.getInput().checked = true;
		form.appendChild(installLibRadio.getElement());
		
		var installHxmlLibsRadio = new RadioElement("haxelibInstallOptions", "installHxmlLibs", "install all libs for hxml from haxelib", function ():Void 
		{
			inputGroupButton.getInput().value = "haxelib install build.hxml";
		});
		installHxmlLibsRadio.getInput().checked = true;
		form.appendChild(installHxmlLibsRadio.getElement());
		
		var installLibFromGitRadio = new RadioElement("haxelibInstallOptions", "installLibFromGit", "install from git", function ():Void 
		{
			inputGroupButton.getInput().value = "haxelib git";
		});
		installLibFromGitRadio.getInput().checked = true;
		form.appendChild(installLibFromGitRadio.getElement());
		
		getBody().appendChild(form);
		
		//var installHaxelibButton = ButtonManager.createButton("haxelib install", false, false);
		
		getBody().appendChild(inputGroupButton.getElement());
		
		//var cancelButton = ButtonManager.createButton("Cancel", false, true);
		//getFooter().appendChild(cancelButton);
		
		var okButton = ButtonManager.createButton("OK", false, true, true);
		getFooter().appendChild(okButton);
	}
	
}