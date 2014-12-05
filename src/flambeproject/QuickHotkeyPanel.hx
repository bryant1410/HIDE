package flambeproject;
import bootstrap.InputGroup;
import bootstrap.ListGroup;
import core.Helper;
import haxe.Timer;
import js.Browser;
import js.html.AnchorElement;
import js.html.DivElement;
import js.html.InputElement;
import jQuery.JQuery;
import js.html.KeyboardEvent;
import js.html.Node;
import js.html.NodeList;
import js.html.ParagraphElement;
import tabmanager.TabManager;
/**
 * ...
 * @author ... espigah
 * see -> QuickOpen
 */
class QuickHotkeyPanel
{
	var div:DivElement;
    var panel:DivElement;
    var panelBody:DivElement;
    var inputGroup:InputGroup;
    var listGroup:ListGroup;
    var input:InputElement;
    
    var activeItemIndex:Int;
	var title:String;
	var visible:Bool;
	public function new() 
	{
		setup();
	}
	static var instance:QuickHotkeyPanel;
	
	
	public static function get()
	{
		if (instance == null)
		{
			instance = new QuickHotkeyPanel();
		}
			
		return instance;
	}
    
	function setup():Void
	{
		visible = false;
		activeItemIndex = 0;
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
        input.disabled= true;
        //listGroup = new ListGroup();
        //listGroup.getElement().id = "quickOpenListGroup";
        
        div.appendChild(inputGroup.getElement());
       
        panel.style.display = "none";
        panelBody.appendChild(div);
        
        new JQuery(js.Browser.document.body).append(panel);
	}
		

	public function show(__title:String, __listGroup:ListGroup, ?__enabeAutoAction:Bool)
    {   
		if (visible == true)
		{
			return;
		}
		visible = true;
		
		title = __title;
		updateList(__listGroup);		
		makeSureActiveItemVisible();
       
        input.value = "";       
		
        panel.style.display = "";
        input.focus();
    	
		
		var t:Timer = new Timer(300); //workaround to click at menu and shortcut
		t.run = function ()
		{
			input.disabled = false;
			input.focus();
			//input.click();
			registerListeners();
			makeSureActiveItemVisible();
			onInput(null);
			t.stop();
		}
    	
    }
	
	function updateList(__listGroup:ListGroup) 
	{
		listGroup = __listGroup;
		listGroup.getElement().id = "quickOpenListGroup";
		div.appendChild(listGroup.getElement());		
	}
	
	function onKeyUp(e:js.html.KeyboardEvent)
	{
        switch (e.keyCode)
        {
            case 27:
                hide();
            default:
        }
    }
	
	function onInput(e)
	{		
        activeItemIndex = 0;        
        core.Helper.debounce("actioncompletion", function ()
                          	{
								var valueList = StringTools.trim(input.value);								
								valueList = valueList.split(" ")[0];
								var value = Std.parseInt(valueList);							
								var length = listGroup.length;
								if (value == null || value < 0 || value >= length)
								{
									return;
								}
								var anchorElementList:Array<AnchorElement> = listGroup.getItems();
								var anchorElement:AnchorElement;
								var paragraphElement:Node;
								for (i in 0...length)
								{
									anchorElement = anchorElementList[i];
									paragraphElement = anchorElement.getElementsByClassName("list-group-item-text").item(0);	

									if (Std.parseInt(paragraphElement.textContent) == value)
									{
										//__enabeAutoAction?
										anchorElement.click();
										hide();
										break;
									};
								}							 
                            }, 100);
    }
    
    function onKeyDown(e:js.html.KeyboardEvent)
    {
        switch (e.keyCode)
        {
			//up
			case 38:                
                e.preventDefault();
                
                activeItemIndex--;
                
                if (activeItemIndex < 0)
                {
                	activeItemIndex = listGroup.length - 1; 
        		}
                
                makeSureActiveItemVisible();
            //down
			case 40:
                e.preventDefault();
                
                activeItemIndex++;
                
                if (activeItemIndex >= listGroup.length)
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
                
                if (activeItemIndex >= listGroup.length)
                {
                	activeItemIndex = listGroup.length - 1;
                }
                    
                makeSureActiveItemVisible();
                
           	//End
            case 35:
                if (!e.shiftKey)
                {
                	e.preventDefault();
                
                    activeItemIndex = listGroup.length - 1;

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
                e.preventDefault();
                listGroup.getItems()[activeItemIndex].click();
        }
    }
    
    function onClick(e)
    {
        hide();
    }

    function registerListeners()
    {
        js.Browser.document.addEventListener("keyup", onKeyUp);
        js.Browser.document.addEventListener("click", onClick);
    	input.addEventListener("input", onInput);
        input.addEventListener("keydown", onKeyDown);
	}
    
	function unregisterListeners()
	{
        js.Browser.document.removeEventListener("keyup", onKeyUp);
        js.Browser.document.removeEventListener("click", onClick);
    	input.removeEventListener("input", onInput);
        input.removeEventListener("keydown", onKeyDown);
    }

    function hide()
    {		
		if (visible == false)
		{
			return;
		}
		onInput(null);
		visible = false;
        panel.style.display = "none";
        unregisterListeners();
				
		var tabManagerInstance = TabManager.get();
                
        if (tabManagerInstance.selectedPath != null)
        {
        	cm.Editor.editor.focus();
        }
		if (listGroup != null)
		{
			listGroup.getElement().remove();			
		}
		input.disabled = true;
		input.value = "";
    }
	
	function makeSureActiveItemVisible()
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
	
}