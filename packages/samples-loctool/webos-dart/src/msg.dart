
translate("Search", key: "Search_all");
translate("Back button");
translate("Delete All");
translate("App List");
translate("App Rating", args: {"arg1": "music_track"});

translatePlural('plural.demo', _counter);
translatePlural('1#At least 1 letter|#At least {num} letters', num);

translate("OK");

translate(
  '{appName} app cannot be deleted.',
    args: {'appName': 'Settings'}
    ),

translate('The first option is {arg1}.', args: <String, String>{'arg1': 'music'});


static String sn_home_0016(tvModel) => translate(
        'Exclusive features for {%TV_model} are all gathered here.',
        args: {'%TV_model': tvModel},
      );