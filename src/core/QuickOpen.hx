package core;

import js.html.DivElement;
import jQuery.JQuery;
import bootstrap.ListGroup;
import bootstrap.InputGroup;
import js.html.InputElement;
import js.Node;
import projectaccess.ProjectAccess;
import tabmanager.TabManager;


/**
* @author 
 */
class QuickOpen
{
    static var div:DivElement;
    static var panel:DivElement;
    static var panelBody:DivElement;
    static var inputGroup:InputGroup;
    static var listGroup:ListGroup;
    static var input:InputElement;
    
    static var activeItemIndex:Int;
    
    static var fileList:Array<completion.Hxml.CompletionData>;
    
    static var currentList:Array<completion.Hxml.CompletionData>;
    
    public static function load()
    {        
        panel = js.Browser.document.createDivElement();
        panel.className = "panel panel-default";
        panel.id = "quickOpen";
        
        panelBody = js.Browser.document.createDivElement();
        panelBody.className = "panel-body";
        panel.appendChild(panelBody);
        
        div = js.Browser.document.createDivElement();
        
        inputGroup = new InputGroup();
        inputGroup.getElement().id = "quickOpenInputGroup";
        
        input = inputGroup.getInput();
        
        listGroup = new ListGroup();
        listGroup.getElement().id = "quickOpenListGroup";
        
        div.appendChild(inputGroup.getElement());
        div.appendChild(listGroup.getElement());
        panel.style.display = "none";
        panelBody.appendChild(div);
        
        new JQuery(js.Browser.document.body).append(panel);
    }
    
    public static function show(list:Array<completion.Hxml.CompletionData>)
    {
        activeItemIndex = 0;
        
        fileList = list;
        
		currentList = fileList;
        
        update();
    
        input.value = "";
        panel.style.display = "";
        input.focus();
    	
    	registerListeners();
    }

	static function onKeyUp(e:js.html.KeyboardEvent)
	{
        switch (e.keyCode)
        {
            case 27:
                hide();
            default:

        }
    }

	static function onInput(e)
	{
		currentList = completion.Filter.filter(fileList, input.value, Completion.CompletionType.OPENFILE);
        update();
    }
    
    static function onKeyDown(e)
    {        
        switch (e.keyCode)
        {
			//up
			case 38:
                if (activeItemIndex > 0)
                {
					activeItemIndex--;
                	makeSureActiveItemVisible();
        		}
            //down
			case 40:
                if (activeItemIndex < fileList.length - 1)
                {
                	activeItemIndex++;
                    makeSureActiveItemVisible();
                }
            case 13:
                listGroup.getItems()[activeItemIndex].click();
        }
    }
    
    static function onClick(e)
    {
        hide();
    }

    static function registerListeners()
    {
        js.Browser.document.addEventListener("keyup", onKeyUp);
        js.Browser.document.addEventListener("click", onClick);
    	input.addEventListener("input", onInput);
        input.addEventListener("keydown", onKeyDown);
	}
    
	static function unregisterListeners()
	{
        js.Browser.document.removeEventListener("keyup", onKeyUp);
        js.Browser.document.removeEventListener("click", onClick);
    	input.removeEventListener("input", onInput);
        input.removeEventListener("keydown", onKeyDown);
    }

    static function hide()
    {
        panel.style.display = "none";
        unregisterListeners();
    }
    
    static function update()
    {
        listGroup.clear();
        
        for (item in currentList)
        {
        	listGroup.addItem(js.Node.path.basename(item.text), item.displayText, openFile.bind(item.text));
		}
    
    	makeSureActiveItemVisible();
    }
	
	static function makeSureActiveItemVisible()
	{        
        var items = listGroup.getItems();
        
        for (i in 0...items.length)
        {
        	if (i != activeItemIndex)
            {
                if (items[i].classList.contains("active"))
                {
                    items[i].classList.remove("active");
                }
            }
            else
            {
                if (!items[i].classList.contains("active"))
                {
                    items[i].classList.add("active");
                }
            }
        }
		
		var container = listGroup.getElement();

		var node = items[activeItemIndex];

		if (node.offsetTop < container.scrollTop)
        {
        	container.scrollTop = node.offsetTop - 150;   
        }
      	else if (node.offsetTop + node.offsetHeight > container.scrollTop + container.clientHeight)
        {
          	container.scrollTop = node.offsetTop + node.offsetHeight - container.clientHeight + 3;  
        }
    }

	static function openFile(path:String)
	{
		if (ProjectAccess.path != null) 
		{
			path = Node.path.resolve(ProjectAccess.path, path);
		}
		
		TabManager.openFileInNewTab(path);
	}

}