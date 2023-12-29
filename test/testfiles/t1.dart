public void BookmarkDialogAssistant(Character params) {
   switch (params) {
   case 'a':
       this.actionBtnTitle = translate("Save Bookmark");
       break;
   case 'b':
       this.actionBtnTitle = translate(  "Add Bookmark");
       break;
   case 'c':
       this.actionBtnTitle = translate(  "Add Bookmark", key: "Setting");
       break;
   default:
       this.actionBtnTitle = translate(  " Save  "    );
   }
};