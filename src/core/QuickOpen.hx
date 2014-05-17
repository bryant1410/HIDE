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
    
    static var fileList:Array<parser.ClassParser.FileData>;
    
    static var currentList:Array<parser.ClassParser.FileData>;
    
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
    
    public static function show(list:Array<parser.ClassParser.FileData>)
    {        
        activeItemIndex = 0;
        
        fileList = completion.Filter.sortFileList(list);
        
		currentList = fileList;
    
        input.value = "";
        
        update();
        
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
        activeItemIndex = 0;
        
        core.Helper.debounce("openfilecompletion", function ()
                          	{
                            	currentList = completion.Filter.filterFiles(fileList, input.value);
        						update();    
                            }, 100);
    }
    
    static function onKeyDown(e:js.html.KeyboardEvent)
    {
        switch (e.keyCode)
        {
			//up
			case 38:                
                e.preventDefault();
                
                activeItemIndex--;
                
                if (activeItemIndex < 0)
                {
                	activeItemIndex = currentList.length - 1;
        		}
                
                makeSureActiveItemVisible();
            //down
			case 40:
                e.preventDefault();
                
                activeItemIndex++;
                
                if (activeItemIndex >= currentList.length)
                {
                	activeItemIndex = 0;
                }
                    
                makeSureActiveItemVisible();
            //Page Up
            case 33:
                e.preventDefault();
                
                activeItemIndex += -5;
                
                if (activeItemIndex < 0)
                {
                	activeItemIndex = 0;
        		}
                
                makeSureActiveItemVisible();
            //Page Down
            case 34:
                e.preventDefault();
                
                activeItemIndex += 5;
                
                if (activeItemIndex >= currentList.length)
                {
                	activeItemIndex = currentList.length - 1;
                }
                    
                makeSureActiveItemVisible();
                
           	//End
            case 35:
                if (!e.shiftKey)
                {
                	e.preventDefault();
                
                    activeItemIndex = currentList.length - 1;

                    makeSureActiveItemVisible();
        		}
            //Home
            case 36:
                if (!e.shiftKey)
                {
                    e.preventDefault();
                    activeItemIndex = 0;

                    makeSureActiveItemVisible();
				}
            //Enter
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
                
        if (tabmanager.TabManager.selectedPath != null)
        {
        	cm.Editor.editor.focus();
        }
    }
    
    static function update()
    {
        listGroup.clear();
        
        for (item in currentList)
        {
        	listGroup.addItem(item.filename, item.displayText, openFile.bind(item.path));
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
                
        if (activeItemIndex > 0)
        {
        	var node = items[activeItemIndex];

            if (node.offsetTop - node.offsetHeight < container.scrollTop)
            {
                container.scrollTop = node.offsetTop - 48;
            }
            else if (node.offsetTop > container.scrollTop + container.clientHeight)
            {
                container.scrollTop = node.offsetTop - container.clientHeight;  
            }	
        }
        else
        {
        	container.scrollTop = 0;
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