package ui;
import core.FileDialog;
import haxe.ds.StringMap;
import haxe.Timer;
import jQuery.JQuery;
import js.Browser;
import js.html.AnchorElement;
import js.html.ButtonElement;
import js.html.DivElement;
import js.html.Event;
import js.html.HeadingElement;
import js.html.InputElement;
import js.html.LabelElement;
import js.html.LIElement;
import js.html.MouseEvent;
import js.html.OptionElement;
import js.html.ParagraphElement;
import js.html.SelectElement;
import js.html.SpanElement;
import js.html.UListElement;

/**
 * ...
 * @author AS3Boyan
 */
class NewProjectDialog
{
	private static var modal:DivElement;
	private static var list:SelectElement;
	private static var selectedCategory:String;
	static private var description:ParagraphElement;
	static private var helpBlock:ParagraphElement;
	static private var projectName:InputElement;
	static private var projectLocation:InputElement;
	static private var checkbox:InputElement;
	static private var page1:DivElement;
	static private var page2:DivElement;
	static private var backButton:ButtonElement;
	static private var textfieldsWithCheckboxes:StringMap<InputElement>;
	static private var checkboxes:StringMap<InputElement>;
	
	public function new() 
	{
		
	}
	
	public static function init():Void
	{
		modal = Browser.document.createDivElement();
		modal.className = "modal fade";
		
		var dialog:DivElement = Browser.document.createDivElement();
		dialog.className = "modal-dialog";
		modal.appendChild(dialog);
		
		var content:DivElement = Browser.document.createDivElement();
		content.className = "modal-content";
		dialog.appendChild(content);
		
		var header:DivElement = Browser.document.createDivElement();
		header.className = "modal-header";
		content.appendChild(header);
		
		var button:ButtonElement = Browser.document.createButtonElement();
		button.type = "button";
		button.className = "close";
		button.setAttribute("data-dismiss", "modal");
		button.setAttribute("aria-hidden", "true");
		button.innerHTML = "&times;";
		header.appendChild(button);
		
		var h4:HeadingElement = cast(Browser.document.createElement("h4"), HeadingElement);
		h4.className = "modal-title";
		h4.textContent = "New Project";
		header.appendChild(h4);
		
		var body:DivElement = Browser.document.createDivElement();
		body.className = "modal-body";
		body.style.overflow = "hidden";
		content.appendChild(body);
		
		textfieldsWithCheckboxes = new StringMap();
		checkboxes = new StringMap();
		
		createPage1();
		body.appendChild(page1);
		
		createPage2();
		page2.style.display = "none";
		body.appendChild(page2);
		
		var footer:DivElement = Browser.document.createDivElement();
		footer.className = "modal-footer";
		content.appendChild(footer);
		
		backButton = Browser.document.createButtonElement();
		backButton.type = "button";
		backButton.className = "btn btn-default disabled";
		backButton.textContent = "Back";
		
		footer.appendChild(backButton);
		
		var nextButton:ButtonElement = Browser.document.createButtonElement();
		nextButton.type = "button";
		nextButton.className = "btn btn-default";
		nextButton.textContent = "Next";
		
		backButton.onclick = function (e:MouseEvent)
		{
			if (backButton.className.indexOf("disabled") == -1)
			{
				new JQuery(page1).show(300);
				new JQuery(page2).hide(300);
				backButton.className = "btn btn-default disabled";
				nextButton.className = "btn btn-default";
			}
		}
		;
		
		nextButton.onclick = function (e:MouseEvent)
		{
			if (nextButton.className.indexOf("disabled") == -1)
			{
				if (selectedCategory != "OpenFL/Samples")
				{
					projectName.value = StringTools.replace(selectedCategory, "/", "") + StringTools.replace(list.value, " ", "") + "1";
				}
				else
				{
					projectName.value = list.value;
				}
				
				new JQuery(page1).hide(300);
				new JQuery(page2).show(300);
				backButton.className = "btn btn-default";
				nextButton.className = "btn btn-default disabled";
			}
		}
		;
		
		footer.appendChild(nextButton);
		
		var finishButton:ButtonElement = Browser.document.createButtonElement();
		finishButton.type = "button";
		finishButton.className = "btn btn-default";
		finishButton.textContent = "Finish";
		
		finishButton.onclick = function (e:MouseEvent)
		{
			if (projectLocation.value != "" && projectName.value != "")
			{
				saveData("Package");
				saveData("Company");
				saveData("License");
				saveData("URL");
				
				hide();
			}
		}
		;
		
		footer.appendChild(finishButton);
		
		var cancelButton:ButtonElement = Browser.document.createButtonElement();
		cancelButton.type = "button";
		cancelButton.className = "btn btn-default";
		cancelButton.setAttribute("data-dismiss", "modal");
		cancelButton.textContent = "Cancel";
		
		footer.appendChild(cancelButton);
		
		Browser.document.body.appendChild(modal);
		
		updateListItems("Haxe");
		
		Browser.window.addEventListener("keyup", function (e)
		{
			if (e.keyCode == 27)
			{
				untyped new JQuery(modal).modal("hide");
			}
		}
		);
		
		var location:String = Browser.getLocalStorage().getItem("Location");
		
		if (location != null)
		{
			projectLocation.value = location;
		}
		
		loadData("Package");
		loadData("Company");
		loadData("License");
		loadData("URL");
		
		loadCheckboxState("Package");
		loadCheckboxState("Company");
		loadCheckboxState("License");
		loadCheckboxState("URL");
	}
	
	public static function show():Void
	{		
		if (page1.style.display == "none")
		{
			backButton.click();
		}
		
		untyped new JQuery(modal).modal("show");
	}
	
	public static function hide():Void
	{
		untyped new JQuery(modal).modal("hide");
	}
	
	private static function loadData(_text:String):Void
	{
		var text:String = Browser.getLocalStorage().getItem(_text);
		
		if (text != null)
		{
			textfieldsWithCheckboxes.get(_text).value = text;
		}
	}
	
	private static function saveData(_text:String):Void
	{
		if (checkboxes.get(_text).checked)
		{
			Browser.getLocalStorage().setItem(_text, textfieldsWithCheckboxes.get(_text).value);
		}
	}
	
	private static function loadCheckboxState(_text:String):Void
	{
		var text:String = Browser.getLocalStorage().getItem(_text + "Checkbox");
		
		if (text != null)
		{
			checkboxes.get(_text).checked = JSON.parse(text);
		}
	}
	
	private static function saveCheckboxState(_text:String):Void
	{
		Browser.getLocalStorage().setItem(_text, JSON.stringify(checkboxes.get(_text + "Checkbox").checked));
	}
	
	private static function createPage1():DivElement
	{
		page1 = Browser.document.createDivElement();
		
		var well:DivElement = Browser.document.createDivElement();
		well.className = "well";
		//well.style.overflow = "auto";
		//well.classList.add("pull-left");
		well.style.float = "left";
		well.style.width = "50%";
		well.style.height = "250px";
		well.style.marginBottom = "0";
		page1.appendChild(well);
		
		var tree:UListElement = Browser.document.createUListElement();
		tree.className = "nav nav-list";
		well.appendChild(tree);
		
		tree.appendChild(createCategory("Haxe"));
		tree.appendChild(createCategoryWithSubcategories("OpenFL", ["Samples"]));
		
		list = createList();
		list.style.float = "left";
		list.style.width = "50%";
		list.style.height = "250px";
		
		page1.appendChild(list);
		
		page1.appendChild(Browser.document.createBRElement());
		
		description = Browser.document.createParagraphElement();
		description.style.width = "100%";
		description.style.height = "50px";
		description.style.overflow = "auto";
		description.textContent = "Description";
		
		page1.appendChild(description);
		
		return page1;
	}
	
	private static function createPage2():DivElement
	{
		page2 = Browser.document.createDivElement();
		page2.style.padding = "15px";
		
		var row:DivElement = Browser.document.createDivElement();
		row.className = "row";
		
		projectName = Browser.document.createInputElement();
		projectName.type = "text";
		projectName.className = "form-control";
		projectName.placeholder = "Name";
		projectName.style.width = "100%";
		row.appendChild(projectName);
		
		page2.appendChild(row);
		
		//var row:DivElement = Browser.document.createDivElement();
		//row.className = "row";
		
		//var col:DivElement  = Browser.document.createDivElement();
		//col.className = "col-md-8";
		//row.appendChild(col);
		
		//var inputGroup:DivElement = Browser.document.createDivElement();
		//inputGroup.className = "input-group";
		//row.appendChild(inputGroup);
		
		row = Browser.document.createDivElement();
		row.className = "row";
		
		var inputGroup:DivElement = Browser.document.createDivElement();
		inputGroup.className = "input-group";
		inputGroup.style.display = "inline";
		row.appendChild(inputGroup);
		
		projectLocation = Browser.document.createInputElement();
		projectLocation.type = "text";
		projectLocation.className = "form-control";
		projectLocation.placeholder = "Location";
		projectLocation.style.width = "80%";
		inputGroup.appendChild(projectLocation);
		
		//var inputGroupAddon:SpanElement = Browser.document.createSpanElement();
		//inputGroupAddon.className = "input-group-addon";
		//inputGroup.appendChild(inputGroupAddon);
		
		//var col2:DivElement  = Browser.document.createDivElement();
		//col2.className = "col-md-4";
		//row.appendChild(col2);
		//
		//var inputGroup2:DivElement = Browser.document.createDivElement();
		//inputGroup2.className = "input-group";
		//col2.appendChild(inputGroup2);
		
		var browseButton:ButtonElement = Browser.document.createButtonElement();
		browseButton.type = "button";
		browseButton.className = "btn btn-default";
		browseButton.textContent = "Browse...";
		browseButton.style.width = "20%";
		
		browseButton.onclick = function (e:MouseEvent)
		{
			FileDialog.openFolder(function (path:String):Void
			{
				projectLocation.value = path;
				updateHelpBlock();
				
				Browser.getLocalStorage().setItem("Location", path);
			}
			);
		};
		
		inputGroup.appendChild(browseButton);
		
		page2.appendChild(row);
		
		createTextWithCheckbox(page2, "Package");
		createTextWithCheckbox(page2, "Company");
		createTextWithCheckbox(page2, "License");
		createTextWithCheckbox(page2, "URL");
		
		row = Browser.document.createDivElement();
		row.className = "row";
		
		var checkboxDiv:DivElement = Browser.document.createDivElement();
		checkboxDiv.className = "checkbox";
		row.appendChild(checkboxDiv);
		
		var label:LabelElement = Browser.document.createLabelElement();
		checkboxDiv.appendChild(label);
		
		checkbox = Browser.document.createInputElement();
		checkbox.type = "checkbox";
		checkbox.checked = true;
		label.appendChild(checkbox);
		
		checkbox.onchange = function (e):Void
		{
			updateHelpBlock();
		};
		
		label.appendChild(Browser.document.createTextNode("Create directory for project"));
		
		page2.appendChild(row);
		
		row = Browser.document.createDivElement();
		
		helpBlock = Browser.document.createParagraphElement();
		helpBlock.className = "help-block";
		row.appendChild(helpBlock);
		
		projectLocation.onchange = function (e):Void
		{
			updateHelpBlock();
		};
		
		projectName.onchange = function (e):Void
		{			
			updateHelpBlock();
		}
		
		page2.appendChild(row);
		
		return page2;
	}
	
	private static function updateHelpBlock():Void
	{
		if (projectLocation.value != "")
		{
			var str:String = "";
			
			if (checkbox.checked == true && projectName.value != "")
			{
				str = projectName.value;
			}
			
			helpBlock.innerText = "Project will be created in: " + projectLocation.value + str;
		}
		else
		{
			helpBlock.innerText = "";
		}
	}
	
	private static function createTextWithCheckbox(_page2:DivElement, _text:String):Void
	{
		var row:DivElement = Browser.document.createDivElement();
		row.className = "row";
		
		var inputGroup:DivElement = Browser.document.createDivElement();
		inputGroup.className = "input-group";
		row.appendChild(inputGroup);
		
		var inputGroupAddon:SpanElement = Browser.document.createSpanElement();
		inputGroupAddon.className = "input-group-addon";
		inputGroup.appendChild(inputGroupAddon);
		
		var checkbox:InputElement = Browser.document.createInputElement();
		checkbox.type = "checkbox";
		checkbox.checked = true;
		inputGroupAddon.appendChild(checkbox);
		
		checkboxes.set(_text, checkbox);
		
		var text:InputElement = Browser.document.createInputElement();
		text.type = "text";
		text.className = "form-control";
		text.placeholder = _text;
		
		textfieldsWithCheckboxes.set(_text, text);
		
		checkbox.onchange = function (e)
		{
			if (checkbox.checked)
			{
				text.disabled = false;
			}
			else
			{
				text.disabled = true;
			}
		};
		
		inputGroup.appendChild(text);
		
		_page2.appendChild(row);
	}
	
	private static function createCategory(text:String):LIElement
	{
		var li:LIElement = Browser.document.createLIElement();
			
		var a:AnchorElement = Browser.document.createAnchorElement();
		a.href = "#";
		
		a.addEventListener("click", function (e:MouseEvent):Void
		{
			var parent = li.parentElement.parentElement;
			var topA:AnchorElement = cast(parent.getElementsByTagName("a")[0], AnchorElement);
			
			if (parent.className == "well")
			{
				updateListItems(a.textContent);
			}
			else
			{
				updateListItems(topA.innerText + "/" + a.textContent);
			}
		}
		);
		
		var span = Browser.document.createSpanElement();
		span.className = "glyphicon glyphicon-folder-open";
		a.appendChild(span);
		
		span = Browser.document.createSpanElement();
		span.textContent = text;
		span.style.marginLeft = "5px";
		a.appendChild(span);
		
		li.appendChild(a);
		
		return li;
	}
	
	static private function updateListItems(category:String):Void
	{		
		selectedCategory = category;
		
		new JQuery(list).children().remove();
		
		switch (category) 
		{
			case "Haxe":
				setListItems(list, ["Flash Project", "JavaScript Project", "Neko Project", "PHP Project", "C++ Project", "Java Project", "C# Project"]);
			case "OpenFL":
				setListItems(list, ["OpenFL Project", "OpenFL Extension"]);
			case "OpenFL/Samples":
				setListItems(list, ["ActuateExample", "AddingAnimation", "AddingText", "DisplayingABitmap", "HandlingKeyboardEvents", "HandlingMouseEvent", "HerokuShaders", "PiratePig", "PlayingSound", "SimpleBox2D", "SimpleOpenGLView"]);
			default:
					
		}
		
		checkSelectedOptions();
	}
	
	public static function createCategoryWithSubcategories(text:String, subcategories:Array<String>):LIElement
	{
		var li:LIElement = createCategory(text);
		
		var a:AnchorElement = cast(li.getElementsByTagName("a")[0], AnchorElement);
		a.className = "tree-toggler nav-header";
		
		a.onclick = function (e:MouseEvent):Void
		{
			new JQuery(li).children('ul.tree').toggle(300);
		};
		
		var ul:UListElement = Browser.document.createUListElement();
		ul.className = "nav nav-list tree";
		li.appendChild(ul);
		
		li.onclick = function (e:MouseEvent):Void
		{
			for (subcategory in subcategories)
			{
				ul.appendChild(createCategory(subcategory));
			}
			
			e.stopPropagation();
			e.preventDefault();
			li.onclick = null;
			
			new JQuery(ul).show(300);
		};
		
		return li;
	}
	
	private static function createList():SelectElement
	{
		var select:SelectElement = Browser.document.createSelectElement();
		select.size = 10;		
		
		select.onchange = function (e)
		{
			checkSelectedOptions();
		}
		
		return select;
	}
	
	private static function checkSelectedOptions():Void
	{
		if (list.selectedOptions.length > 0)
		{
			var option:OptionElement = cast(list.selectedOptions[0], OptionElement);
			updateDescription(selectedCategory, option.label);
		}
	}
	
	static private function updateDescription(category:String, selectedOption:String):Void
	{
		switch (category) 
		{
			case "Haxe":
				switch (selectedOption) 
				{
					//["Flash Project", "JavaScript Project", "Neko Project", "PHP Project", "C++ Project", "Java Project", "C# Project"]
					case "Flash Project":
						//description.textContent = selectedOption;
					default:
						
				}
			case "OpenFL":
			case "OpenFL/Samples":
				
			default:
				
		}
		
		description.textContent = selectedOption;
	}
	
	private static function setListItems(list:SelectElement, items:Array<String>):Void
	{
		for (item in items)
		{
			list.appendChild(createListItem(item));
		}
		
		list.selectedIndex = 0;
	}
	
	private static function createListItem(text:String):OptionElement
	{		
		var option:OptionElement = Browser.document.createOptionElement();
		option.textContent = text;
		option.value = text;
		return option;
	}
	
}