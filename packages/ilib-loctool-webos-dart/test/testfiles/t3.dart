staticString home_298(arg1) =>
    rtlCode +
    translate("WOWCAST ({arg1})", args: {'arg1': arg1}) +
    emptyString; //  Text displayed for LG WOWCAST (Note= no need to translate. english only)

  static String home_79(arg1) =>
      rtlCode +
      translate("GO TO {arg1}", args: {'arg1': arg1}) + emptyString;

  static String home_327(arg1) =>
      rtlCode +
      translate('Add ({arg1} card)', args: {"arg1": arg1}) + emptyString;

Text(
    translate(
        '{appName} app cannot be deleted.',
        args: {'appName': 'Settings'}
    ),
    style: Style.textStyle),
Text(
    translate(
        'The lowest temp is {arg1} and the highest temp is {arg2}.',
        args: {'arg1': 15, 'arg2': 30}                 ),
    style: Style.textStyle),

static String sn_home_0016(tvModel) => translate(
        'Exclusive features for {%model} are all gathered here.',
        args: {'%model': tvModel},    // not extracted
      );