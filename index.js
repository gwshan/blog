var MenuStrings = new Array(
    "Kernel->generic->jump label->kernel/generic/jump_label.txt",
    "Virtualization->kvm->CHAR-KVM_CREATE_VM->virt/CHAR-KVM_CREATE_VM.txt",
    "openBMC->uboot->Palmetto bootup->openbmc/uboot/palmetto_bootup.txt",
    "openBMC->uboot->bss/data/rodata section->openbmc/uboot/bss_data_rodata.txt",
    "openBMC->uboot->Command [ping]->openbmc/uboot/command_ping.txt",
    "About->Myself->about/myself.html",
    "About->TODO->PCI_VF_MPS_not_configurable->todo/PCI_VF_MPS_not_configurable.txt"
);
var RootButton;
var Iframe;

var IframeEx = {
    createNew:function() {
        var IframeEx = {};
        var iframe;
        var xmlHttpRequest = new XMLHttpRequest();

        iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.color = "black";
        iframe.backgroundColor = "ece5e5";
        iframe.id = "IframeEx";
        iframe.style.position = "absolute";
        iframe.style.left = "0px";
        iframe.style.top = "0px";
        document.body.appendChild(iframe);

        function doResize() {
            w = Number(iframe.style.left.substr(0, iframe.style.left.length - 2));
            w = document.body.clientWidth - w - 20;
            h = Number(iframe.style.top.substr(0, iframe.style.top.length - 2));
            h = document.body.clientHeight - h - 20;

            iframe.style.width = String(w) + "px";
            iframe.style.height = String(h) + "px";
        }

        IframeEx.set = function(x, y) {
            var w, h;

            iframe.style.left = x;
            iframe.style.top  = y;
            doResize();
        }

        IframeEx.onResize = function() {
            doResize();
        }

        IframeEx.load = function(fname) {
            var type, pos;

            /* Bail if the file doesn't exist */
            xmlHttpRequest.open('HEAD', fname, false);
            xmlHttpRequest.send();
            if (xmlHttpRequest.status != 200)
                return;

            /* Check the file type and load it if possible */
            pos = fname.lastIndexOf(".");
            if (pos < 0)
                return;

            type = fname.substr(pos + 1, fname.length - pos - 1);
            if (type == "txt" || type == "html")
                iframe.src = fname;
            else
                alert("IframeEx.load(): File type '" + type + "' not supported");
        }

        IframeEx.show = function(visible) {
            if (visible)
               iframe.style.display = "block";
            else
               iframe.style.display = "none";
        }

        return IframeEx;
    }
}

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

var ButtonEx = {
    createNew:function() {
        var ButtonEx = {};
        var isRoot;
        var parent;
        var button;
        var children = [];

        var childLeftMargin;

        /* Create button that is invisible */
        button = document.createElement("input");
        button.type = "button";
        button.style.display = "none";
        button.style.border = "none";
        button.style.color = "black";
        button.style.backgroundColor = "ece5e5";

        /* Set button's properties to default */
        button.id = "default";
        button.value = "default";
        button.style.position = "absolute";
        button.style.left = "0px";
        button.style.top = "0px";

        function ButtonEx_mouseover() {
            this.style.backgroundColor = "0eceec";
            this.style.border = "outset";
        }

        function ButtonEx_mouseout() {
            this.style.backgroundColor = "ece5e5";
            this.style.border = "none";
        }

        function ButtonEx_click() {
            /* Hide the iframe anyway */
            Iframe.show(false);

            /* Hide all buttons when root button is clicked */
            if (isRoot || (children.length == 0))
                RootButton.show(false, false);

            /*
             * When there are child buttons, just show them. Otherwise,
             * we need load the real content to be shown.
             */
            if (children.length > 0) {
                var b, i;

                if (!isRoot) {
                    var list = parent.getChildren();

                    for (i = 0; i < list.length; i++) {
                        list[i].show(false, true);
                    }
                }

                for (i = 0; i < children.length; i++) {
                    b = children[i].getButton();
                    b.style.display = "block";
                }
            } else {
                Iframe.load(button.id);
                Iframe.show(true);
            }
        }

        button.onmouseover = ButtonEx_mouseover;
        button.onmouseout  = ButtonEx_mouseout;
        button.onclick     = ButtonEx_click;
        document.body.appendChild(button);

        /* Set button's properties */ 
        ButtonEx.set = function(root, p, id, caption) {
            isRoot = root;
            parent = p;

            button.id = id;
            button.value = caption;
        }

        ButtonEx.isRoot = function() {
            return isRoot;
        }

        ButtonEx.getButton = function() {
            return button;
        }

        ButtonEx.getParent = function() {
            return parent;
        }

        ButtonEx.getChildren = function() {
            return children;
        }

        ButtonEx.add = function(c) {
            children[children.length] = c;
        }

        ButtonEx.getChildLeftMargin = function() {
            return childLeftMargin;
        }

        ButtonEx.setChildLeftMargin = function(margin) {
            childLeftMargin = margin;
        }

        function calChildLeftMargin(p) {
            var list = p.getChildren();
            var i, b, margin = 0;

            for (i = 0; i < list.length; i++) {
                b = list[i].getButton();
                if (b.value.length > margin)
                    margin = b.value.length;
            }

            for (i = 0; i < list.length; i++) {
                list[i].setChildLeftMargin(margin);

                calChildLeftMargin(list[i]);
            }
        }

        function finalizeOne(p) {
            var x = 0, y = 0;
            var list, b, i;

            list = p.getChildren();
            for (i = 0; i < list.length; i++) {
                if (p == RootButton) {
                    if (i == 0) {
                        x = y = 20;
                        Iframe.set(String(x) + "px", String (y + 40) + "px");
                    } else {
                        b = list[i - 1].getButton();
                        x = Number(b.style.left.substr(0, b.style.left.length - 2));
                        x += (b.value.length * 12 + 25);
                        y = Number(b.style.top.substr(0, b.style.top.length - 2));
                    }

                    b = list[i].getButton();
                    b.style.left = String(x) + "px";
                    b.style.top = String(y) + "px";

                    /* Top menus are always visible */
                    b.style.display = "block";
                } else if (p.getParent() == RootButton) {
                    if (i == 0) {
                        b = p.getButton();
                        x = Number(b.style.left.substr(0, b.style.left.length - 2));
                        y = Number(b.style.top.substr(0, b.style.top.length - 2));
                        y += 40;
                    } else {
                        b = list[i - 1].getButton();
                        x = Number(b.style.left.substr(0, b.style.left.length - 2));
                        y = Number(b.style.top.substr(0, b.style.top.length - 2));
                        y += 25;
                   }

                   b = list[i].getButton();
                   b.style.left = String(x) + "px";
                   b.style.top = String(y) + "px";
                } else {
                    if (i == 0) {
                        b = p.getButton();

                        x = Number(b.style.left.substr(0, b.style.left.length - 2));
                        x += (p.getChildLeftMargin() * 12);
                        x += 25;
                        y = Number(b.style.top.substr(0, b.style.top.length - 2));
                    } else {
                        b = list[i - 1].getButton();

                        x = Number(b.style.left.substr(0, b.style.left.length - 2));
                        y = Number(b.style.top.substr(0, b.style.top.length - 2));
                        y += 25;
                    }
                }

                b = list[i].getButton();
                b.style.left = String(x) + "px";
                b.style.top = String(y) + "px";

                finalizeOne(list[i]);
            }
        }

        ButtonEx.finalize = function(p) {
            if (p != RootButton)
                return;

            calChildLeftMargin(p);
            finalizeOne(p);
        }

        ButtonEx.search = function(s) {
            var i;

            for (i = 0; i < children.length; i++) {
                if (children[i].getButton().value == s)
                    return children[i];
            }

            return null;
        }

        ButtonEx.show = function(visible, child_only) {
            var s = visible ? "block" : "none";
            var i;

            /*
             * The root button is always invisible as it's just a container.
             * The buttons under the root button directly are always visible
             * since they are for main menu. The left buttons are selectable
             * according to the input arguments.
             */
            if (this == RootButton)
                button.style.display = "none";
            else if (parent == RootButton)
                button.style.display = "block";
            else if (!child_only)
                button.style.display = s;

            for (i = 0; i < children.length; i++)
                children[i].show(visible, false);
        }

        return ButtonEx;
    }
}

function populateButtons(inputString)
{
    var button, curButton = RootButton;
    var curString, pos;
    var level = 0;

    for (pos = inputString.search("->");
         pos != -1;
         pos = inputString.search("->"), level++) {

        curString = inputString.substr(0, pos);
        inputString = inputString.substr(pos + 2, inputString.length - pos - 2);
        button = curButton.search(curString);
        if (button) {
            curButton = button;
            continue;
        }

        button = ButtonEx.createNew();
        if (level == 0)
            button.set(true, curButton, curString, curString);
        else
            button.set(false, curButton, curString, curString);
        curButton.add(button);
        curButton = button;
    }

    /*
     * The leaf menu should have been created. Its 'id' property
     * tracks the name of the file where the real content is
     * stored. Its 'value' property is readed from menu's config.
     */
    button.set(false, curButton.getParent(), inputString, curString);
}

function window_onresize()
{
    if (!RootButton)
        return;

    Iframe.onResize();
}

function window_onload()
{
    var i;

    if (RootButton)
        return;

    /*
     * The iframe's position will be determined when the first
     * primary menu (button) is added.
     */
    Iframe = IframeEx.createNew();
    Iframe.set("0px", "0px");

    RootButton = ButtonEx.createNew();
    RootButton.set(true, null, "RootButton", "RootButton");
    for (i = 0; i < MenuStrings.length; i++)
        populateButtons(MenuStrings[i]);
    RootButton.finalize(RootButton);
}
