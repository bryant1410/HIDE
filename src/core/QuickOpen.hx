package core;

import js.html.DivElement;
import jQuery.JQuery;
import bootstrap.ListGroup;
import bootstrap.InputGroup;


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
        listGroup.clear();
        
        for (item in list)
        {
        	listGroup.addItem(js.Node.path.basename(item.text), item.displayText);
		}
        
        panel.style.display = "";
        inputGroup.getInput().focus();
    	
    	js.Browser.document.addEventListener("keyup", onKeyUp);
    }

	static function onKeyUp(e:js.html.KeyboardEvent)
	{
        switch (e.keyCode)
        {
            case 27:
                panel.style.display = "none";
            default:

        }
    }


}