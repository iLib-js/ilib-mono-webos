var strings = {
	"test1": qsTr("1: Test String for qsTr"),
	"test2": qsTrNoOp("2: Test String for qsTrNoOp"),
	"test3": QT_TR_NOOP("3: Test String for QT_TR_NOOP"),
	"test4": QT_TR_N_NOOP("4: Test String for QT_TR_N_NOOP"),
	"test5": qsTr("5: Test String for qsTr with disambiguation", "5: disambiguation string"),
	"test6": qsTrNoOp("6: Test String for qsTrNoOp with disambiguation", "6: disambiguation string"),
	"test7": QT_TR_NOOP("7: Test String for QT_TR_NOOP with disambiguation", "7: disambiguation string"),
	"test8": QT_TR_N_NOOP("8: Test String for QT_TR_N_NOOP with disambiguation", "8: disambiguation string"),
	"test9": qsTranslate("context", "9: Test String for qsTranslate"),
	"test10": qsTranslateNoOp("context", "10: Test String for qsTranslateNoOp"), 
	"test11": QT_TRANSLATE_NOOP("context", "11: Test String for QT_TRANSLATE_NOOP"),
	"test12": QT_TRANSLATE_NOOP3("context", "12: Test String for QT_TRANSLATE_NOOP3"),
	"test13": QT_TRANSLATE_N_NOOP("context", "13: Test String for QT_TRANSLATE_N_NOOP"),
	"test14": qsTranslate("context", "14: Test String for qsTranslate with disambiguation", "14: disambiguation string"),
	"test15": qsTranslateNoOp("context", "15: Test String for qsTranslateNoOp with disambiguation", "15: disambiguation string"),
	"test16": QT_TRANSLATE_NOOP3("context", "16: Test String for QT_TRANSLATE_NOOP3 with disambiguation", "16: disambiguation string"),
}