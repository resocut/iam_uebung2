import {mwf} from "../Main.js";
import {entities} from "../Main.js";

export default class EditviewViewController extends mwf.ViewController {
    constructor() {
        super();
        console.log("EditviewViewController()");
    }
    /*
     * for any view: initialise the view
     *
     * In case of editing an existing item
     *
     *
     */
    async oncreate() {
        this.mediaItem = (this.args && this.args.item) ? this.args.item : new entities.MediaItem();
        this.bindElement("mediaEditviewTemplate", {
            item: this.mediaItem
        }, this.root);
        console.log("....creating Edit View Controller..." + this.mediaItem.title + this.mediaItem.src);
        this.viewProxy = this.bindElement("mediaEditviewTemplate", {
            item: this.mediaItem
        }, this.root)
            .viewProxy;
        this.viewProxy.bindAction("deleteItem", (() => {
            this.mediaItem.delete()
                .then(() => {
                    this.notifyListeners(new mwf.Event("crud", "deleted", "MediaItem", this.mediaItem._id));
                    this.previousView({
                        deletedItem: this.mediaItem
                    });
                })
        }));
        // TODO: do databinding, set listeners, initialise the view
        // this.previewImg = this.root.querySelector("main img");
        this.preview = this.root.querySelector("main .preview");
        this.editForm = this.root.querySelector("main form");
        this.urlInput = this.editForm.url;
        this.fileInput = this.editForm.srcUpload;
        this.urlInput.onblur = () => {
            // this.previewImg.src = this.urlInput.value;
            this.preview.src = this.urlInput.value;
        };
        this.fileInput.onchange = () => {
            console.log("changing file....");
            if (this.fileInput.files[0]) {
                // var objecturl = URL.createObjectURL(this.fileInput.files[0]);
                // this.previewImg.src = objecturl;
                // this.mediaItem.src = objecturl;
                // this.viewProxy.update({item:this.mediaItem});
                var contentType = this.fileInput.files[0].type;
                // This is not working. no contentType or mediaType is ever set. -> the if else statement in the app.html can never work.
                var previewUrl = URL.createObjectURL(this.fileInput.files[0]);
                // this.previewImg.src = previewUrl;
                this.preview = this.root.querySelector("main .preview");
                this.preview.src = previewurl;
                this.mediaItem.src = previewUrl;
                this.mediaItem.contentType = contentType;
                this.viewProxy.update({
                    item: this.mediaItem
                });
            }
        }
        this.editForm.onsubmit = () => {
            if (this.fileInput.files[0]) {
                var data = new FormData();
                data.append("srcUpload", this.fileInput.files[0]);
                var xhreq = new XMLHttpRequest();
                xhreq.open("POST", "api/upload");
                xhreq.send(data);
                xhreq.onreadystatechange = () => {
                    if (xhreq.readyState == 4 && xhreq.status == 200) {
                        var responseData = JSON.parse(xhreq.responseText);
                        this.mediaItem.src = responseData.data.srcUpload;
                        this.createOrEditMediaItem();
                    }
                }
            } else {
                this.createOrEditMediaItem();
            }
            return false;
        }
        // call the superclass once creation is done
        super.oncreate();
    }
    createOrEditMediaItem() {
        //if mediaItem already exitst, then update
        if (this.mediaItem.created) {
            this.mediaItem.update()
                .then(() => this.previousView({
                    item: this.mediaItem
                }, "updated"));
        } else {
            this.mediaItem.create()
                .then(() => this.previousView({
                    item: this.mediaItem
                }, "created"));
        }
    }
    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    bindListItemView(viewid, itemview, item) {
        // TODO: implement how attributes of item shall be displayed in itemview
    }
    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(listitem, listview) {
        // TODO: implement how selection of listitem shall be handled
    }
    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(option, listitem, listview) {
        // TODO: implement how selection of option for listitem shall be handled
    }
    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
    bindDialog(dialogid, dialog, item) {
        // call the supertype function
        super.bindDialog(dialogid, dialog, item);
        // TODO: implement action bindings for dialog, accessing dialog.root
    }
    /*
     * for views that initiate transitions to other views
     */
    async onReturnFromSubview(subviewid, returnValue, returnStatus) {
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
    }
    async onpause() {
        if (this.preview && this.preview.tagName == "VIDEO" && !this.preview.paused && !this.preview.ended) {
            this.preview.pause();
        }
        super.onpause();
    }
}