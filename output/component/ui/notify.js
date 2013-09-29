function ui_notify(type_error,content)
{
    var type_text = "";
    if (type_error == "error")
    {
        type_error = "danger";
        type_text = "Error";

    }

    if (type_error == "warning")
    {
        type_error = "warning";
        type_text = "Warning";
    }

    skip = false;
    if (content == undefined)
    {
        skip = true;
    }



var retstr = ['<div style="margin-left:10px;margin-top:12px;margin-right:10px;" class="alert alert-'+type_error+' fade in">',
'<a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a>',
'<strong>'+type_text+' :</strong><br/>'+content,
'</div>'].join("\n");

if (skip ==false)
    {
    $('#notify_position').html(retstr);    
    
    }

}
