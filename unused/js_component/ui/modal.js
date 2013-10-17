function ui_modal(modal_id,modal_title,modal_content,modal_ok,modal_cancel)
{
var str = ["<div class='modal fade' id='"+modal_id+"' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>",
"<div class='modal-dialog'>",
"<div class='modal-content'>",
"<div class='modal-header'>",
"<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>",
"<h4 class='modal-title'>"+modal_title+"</h4>",
"</div>",
"<div class='modal-body'>",
modal_content,
"</div>",
"<div class='modal-footer'>",
"<button type='button' class='btn btn-default' data-dismiss='modal'>"+modal_cancel+"</button>",
"<button type='button' class='btn btn-primary' id='"+modal_id+"_buttonOk'>"+modal_ok+"</button>",
"</div>",
"</div>",
"</div>",
"</div>"].join("\n");

$("body").append(str);
}
