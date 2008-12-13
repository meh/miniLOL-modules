include("js" , "modules/shjs/sh_main.min.js");
include("css", "modules/shjs/css/"+miniLOL.config.shjsStyle);

function highlight () {
    try {
        sh_highlightDocument('modules/shjs/lang/', '.min.js');
    }
    catch (e) {
        setTimeout('highlight()', 5);
    }
}
