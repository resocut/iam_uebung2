/**
 * @author Jörn Kreutel
 */
import {mwf} from "../Main.js";
import {entities} from "../Main.js";
import {GenericCRUDImplLocal} from "../Main.js";

export default class ListviewViewController extends mwf.ViewController {

    constructor() {
        super();
        this.resetDatabaseElement = null;
        this.crudops =
            GenericCRUDImplLocal.newInstance("MediaItem");



        console.log("ListviewViewController()");

        this.items =[
            new
                entities.MediaItem("m1", "https://placeimg.com/100/100/music"),
            new
                entities.MediaItem("m2", "https://placeimg.com/200/150/arch"),
            new
                entities.MediaItem("m3", "https://placeimg.com/300/300/nature"),
        ];

        this.addNewMediaItem = null;

        this.crudops.readAll().then((items) => {
            this.initialiseListview(items);
        });
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        //New element with plus Button
        this.addNewMediaItemElement =
            this.root.querySelector("#addNewMediaItem");

        this.addNewMediaItemElement.onclick = (() => {

            this.crudops.create(new entities.MediaItem("m","https://placeimg.com/100/100/city")).then((created) =>
            {
                this.addToListview(created);
            }

        );

        });

        //Datenbank zurücksetzen
        this.resetDatabaseElement =
            this.root.querySelector("#resetDatabase");

        this.resetDatabaseElement.onclick = (() => {

            if (confirm("Soll die Datenbank wirklich zurückgesetzt werden?")) {
                indexedDB.deleteDatabase("mwftutdb");
            }
        });

        this.crudops.readAll().then((items) => {
            this.initialiseListview(items);
        });

        this.initialiseListview(this.items);

        // call the superclass once creation is done
        super.oncreate();


    }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    // bindListItemView(viewid, itemview, item) {
    //     // TODO: implement how attributes of item shall be displayed in itemview
    //     itemview.root.getElementsByTagName("img")[0].src = item.src;
    //     itemview.root.getElementsByTagName("h2")[0].textContent =
    //     item.title + item._id;
    //     itemview.root.getElementsByTagName("h3")[0].textContent =
    //     item.added;
    // }

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(listitem, listview) {
        // TODO: implement how selection of listitem shall be handled
        super.onListItemMenuItemSelected(option, listitem, listview);
        alert("Element " + listitem.title + listitem._id+ " wurde ausgewählt!");
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

    deleteItem(item) {
        this.crudops.delete(item._id).then(() => {
            this.removeFromListview(item._id);
        });
    }

    editItem(item) {
        item.title = (item.title + item.title);
        this.crudops.update(item._id,item).then(() => {
            this.updateInListview(item._id,item);
        });
    }
}

