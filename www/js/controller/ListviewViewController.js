/**
 * @author Jörn Kreutel
 */
import {mwf} from "../Main.js";
import {entities} from "../Main.js";
export default class ListviewViewController extends mwf.ViewController {
    constructor() {
        super();
        this.resetDatabaseElement = null;
        this.detail = this.root.querySelector("main .detail");
        console.log("ListviewViewController()");
        this.items = [
            new
            entities.MediaItem("m1", "https://placeimg.com/100/100/music"),
            new
            entities.MediaItem("m2", "https://placeimg.com/200/150/arch"),
            new
            entities.MediaItem("m3", "https://placeimg.com/300/300/nature"),
        ];
        this.addNewMediaItem = null;
    }
    /*
     * for any view: initialise the view
     */
    async oncreate() {
        //New element with plus Button
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
        this.addNewMediaItemElement.onclick = (() => {
            this.nextView("mediaEditView");
        });
        //Datenbank zurücksetzen
        this.resetDatabaseElement = this.root.querySelector("#resetDatabase");
        this.resetDatabaseElement.onclick = (() => {
            if (confirm("Soll die Datenbank wirklich zurückgesetzt werden?")) {
                console.log("creating request to delete database...");
                var DBDeleteRequest = indexedDB.deleteDatabase("toDoList");
                DBDeleteRequest.onerror = function(event) {
                    console.log("Error deleting database.");
                };
                DBDeleteRequest.onsuccess = function(event) {
                    console.log("Database deleted successfully.");
                    console.log(event.result);
                    /*
                     * TODO: update listview after database deletion *
                     */
                };
            }
        });
        entities.MediaItem.readAll()
            .then((items) => {
                this.initialiseListview(this.items);
            });
        // call the superclass once creation is done
        super.oncreate();
    }
    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    // TODO: implement how attributes of item shall be displayed in itemview
    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(listitem, listview) {
        // TODO: implement how selection of listitem shall be handled
        this.nextView("mediaReadview", {
            item: listitem
        });
    }
    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(option, listitem, listview) {
        // TODO: implement how selection of option for listitem shall be handled
        super.onListItemMenuItemSelected(option, listitem, listview);
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
        if (subviewid == "mediaReadview") {
            if (returnStatus == "deleted" && returnValue) {
                this.removeFromListview(returnValue.item._id);
            }
        }
        if (subviewid == "mediaReadview" && returnValue && returnValue.deletedItem) {
            this.removeFromListview(returnValue.deletedItem._id);
        } else if (subviewid == "mediaEditView") {
            if (returnStatus == "created" && returnValue) {
                this.addToListview(returnValue.item)
            } else if (returnStatus == "updated" && returnValue) {
                this.updateInListview(returnValue.item._id, returnValue.item)
            } else if (returnValue && returnValue.deletedItem) {
                this.removeFromListview(returnValue.deletedItem._id);
            }
        }
    }
    deleteItem(item) {
        item.delete()
            .then(() => {
                this.removeFromListview(item._id);
            });
    }
}