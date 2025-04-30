const checkDeviceList = (list, bAddMyplaylist, rtl) => {
	sampleMusicDevice = temp.splice(temp.length - 1, 1);
	filteredDevices = temp.sort(compare);
	//* Order by Port Number

	const
		myPlaylistObj = {
			caption: $L('My Playlist'),	// i18n This string is for My Playlist in Select Music Popup
			deviceId: 'playlist',
			deviceType: 'playlist'
		},
		blueToothObj = {
			caption: $L('Bluetooth'),
			deviceId: 'bluetooth',
			deviceType: 'bluetooth'
		};
	if (bAddMyplaylist) {
		filteredDevices.unshift(myPlaylistObj);
	}
	filteredDevices.push(blueToothObj);
	return {filteredDevices, mobileTVPlusList};
};

/* ActionCreatror - getThumbnail of TNM */
const getListThumbnailAction = (res, item) => (dispatch, getState) => {
	// encode thumbanil path
}

//i18n $L("This is a test");

/// RB.getString("This is a test2"); // i18n: this is a translator\'s comment\n\tfoo("This is not");

$L("Hello"); // i18n: this is an i18n comments.

//** $L("This is a test3");