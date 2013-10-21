package ui;
import haxe.Timer;
import jQuery.JQuery;
import js.Browser;
import js.html.AnchorElement;
import js.html.ButtonElement;
import js.html.DivElement;
import js.html.Event;
import js.html.HeadingElement;
import js.html.InputElement;
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
		
		var page1:DivElement = createPage1();
		body.appendChild(page1);
		
		var page2:DivElement = createPage2();
		page2.style.display = "none";
		body.appendChild(page2);
		
		var footer:DivElement = Browser.document.createDivElement();
		footer.className = "modal-footer";
		content.appendChild(footer);
		
		var backButton:ButtonElement = Browser.document.createButtonElement();
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
	}
	
	public static function show():Void
	{
		untyped new JQuery(modal).modal("show");
	}
	
	private static function createPage1():DivElement
	{
		var page1:DivElement = Browser.document.createDivElement();
		
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
		var page2:DivElement = Browser.document.createDivElement();
		
		var projectName:InputElement = Browser.document.createInputElement();
		projectName.type = "text";
		projectName.className = "form-control";
		projectName.placeholder = "Name";
		page2.appendChild(projectName);
		
		var row:DivElement = Browser.document.createDivElement();
		row.className = "row";
		
		var col:DivElement  = Browser.document.createDivElement();
		col.className = "col-md-8";
		row.appendChild(col);
		
		var inputGroup:DivElement = Browser.document.createDivElement();
		inputGroup.className = "input-group";
		col.appendChild(inputGroup);
		
		var projectLocation:InputElement = Browser.document.createInputElement();
		projectLocation.type = "text";
		projectLocation.className = "form-control";
		projectLocation.placeholder = "Location";
		inputGroup.appendChild(projectLocation);
		
		var col2:DivElement  = Browser.document.createDivElement();
		col2.className = "col-md-4";
		row.appendChild(col2);
		
		var inputGroup2:DivElement = Browser.document.createDivElement();
		inputGroup2.className = "input-group";
		col2.appendChild(inputGroup2);
		
		var browseButton:ButtonElement = Browser.document.createButtonElement();
		browseButton.type = "button";
		browseButton.className = "btn btn-default";
		browseButton.textContent = "Browse...";
		
		browseButton.onclick = function (e:MouseEvent)
		{
			
		};
		
		inputGroup2.appendChild(browseButton);
		
		page2.appendChild(row);
		
		createTextWithCheckbox(page2, "Package");
		createTextWithCheckbox(page2, "Company");
		createTextWithCheckbox(page2, "License");
		createTextWithCheckbox(page2, "URL");
		
		return page2;
	}
	
	private static function createTextWithCheckbox(_page2:DivElement, _text:String)
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
		
		var text:InputElement = Browser.document.createInputElement();
		text.type = "text";
		text.className = "form-control";
		text.placeholder = _text;
		
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