var top_objs=new Array("submenu_kernel",
                       "submenu_virt",
                       "submenu_bmc",
                       "submenu_me");

function button_mouseover(obj)
{
    obj.style.backgroundColor = "0eceec";
    obj.style.border = "outset";
}

function button_mouseout(obj)
{
    obj.style.backgroundColor = "ece5e5";
    obj.style.border = "none";
}

function L1_button_click(obj)
{
    var x, i, j;

    /* Hide the frame showing content */
    x = document.getElementById("right");
    if (x)
        x.style.display = "none";

    /* Hide all menu blocks */
    for (i = 0;i < top_objs.length; i++) {
        for (j = 0; j < 1; j++) {
            x = document.getElementById(top_objs[i]+"_"+String(j));
            if (!x)
                continue;
            x.style.display = "none";
        }

        x = document.getElementById(top_objs[i]);
        if (!x)
            continue;
        x.style.display="none";
    }

    x = document.getElementById("submenu"+obj.id.replace(/button/,""));
    if (x)
        x.style.display = "block";
}

function L2_button_click(obj)
{
    var x, i, j;

    /* Hide the frame showing content */
    x=document.getElementById("right");
    if (x)
        x.style.display = "none";

    /* Hide all menu blocks */
    for (i = 0;i < top_objs.length; i++) {
        for (j = 0; j < 1000; j++) {
            x = document.getElementById(top_objs[i]+"_"+String(j));
            if (!x)
                continue;
            x.style.display = "none";
        }
    }

    /* Show the child menus */
    x = document.getElementById("submenu"+obj.id.replace(/button/,""));
    if (x)
        x.style.display = "block";
}

function L3_button_click(obj)
{
    var s, x, i;
    var f = new XMLHttpRequest();

    /*
     * Get the text file name that is figured out from the
     * button's ID, meaning the button's ID should be correlated
     * to the button's ID correctly in advance.
     */
    s = obj.id.replace(/button_/,"");
    s = s.replace(/_/,"/");
    s = s+".txt";

    /* Get the division */
    x = document.getElementById("right");
    if (!x)
        return;
    x.style.display = "none";

    /* Get the iframe */
    i = document.getElementById("iframe");
    if (!i)
        return;
    i.style.display = "none";

    /* Check the text file exists */
    f.open('HEAD', s, false);
    f.send();
    if (f.status != 200)
        return;

    /*
     * Load the iframe with text file. Make the division and
     * iframe visible. Their width and height are adjusted
     * dynamically before that.
     */
    i.src = s;

    x.style.width = String(document.body.clientWidth - 250 - 10) + "px";
    x.style.height = String(document.body.clientHeight - 150 - 10) + "px"; 
    i.style.width = x.style.width;
    i.style.height = x.style.height;
    x.style.display = "block";
    i.style.display = "block";
}

function window_onresize()
{
    /*
     * The size of iframe and its parent division is changed
     * according to the window's size.
     */
    x = document.getElementById("right");
    i = document.getElementById("iframe");
    if (!x || !i)
        return;

    x.style.width = String(document.body.clientWidth - 250 - 10) + "px";
    x.style.height = String(document.body.clientHeight - 150 - 10) + "px";
    i.style.width = x.style.width;
    i.style.height = x.style.height;
}
