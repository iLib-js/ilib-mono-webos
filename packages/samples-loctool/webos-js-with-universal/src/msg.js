import $L from '@enact/i18n/$L';
export function findMsgByCode (code) {
    switch (code) {
        case 1:
            msg.reason = $L('Hello'); // i18n : i18n comments
            break;
        case 2:
            msg.reason = $L('Thank you');
            break;
        case 3:
            msg.reason = $L('Congratulation');
            break;
        case 4:
            msg.reason = $L('Antenna NEXTGEN TV');
            break;
        case 5:
            msg.reason = $L('Game Optimizer');
            break;
        case 6:
            msg.reason = $L('HDMI Deep Color');
            break;
        case 7:
            msg.reason = $L('Exit');
            break;
        case 8:
            msg.reason = $L('OK');
            break;
        case 9:
            msg.reason = $L('Restart');
            break;
        case 10:
            msg.reason = $L('%deviceType% Speaker');
        default:
            msg.reason = $L('Bye');
            break;
    }
    return msg;
}
export function findMsgByCode2 (code) {
    switch (code) {
        case 1:
            msg.reason = $L('Agree');
            break;
        case 2:
            msg.reason = $L('Ivory Coast');
            break;
        default:
            msg.reason = $L('Programme');
            break;
    }
    return msg;
}
export function findMsgByCode3 (code) {
    switch (code) {
        case 1:
            msg.reason = $L('Live TV'); // xliff_target: nbsp
            break;
        case 2:
            msg.reason = $L('Space NBSP'); // xliff_source: nbsp
            break;
        case 3:
            msg.reason = $L('To read the Terms and Conditions, go to Settings > Support >            Privacy & Terms.'); // multi-spaces
            break;
        case 4:
            msg.reason = $L('TV Name : '); // xliff_target trim
            break;
        case 5:
            msg.reason = $L('Sound Out');
            break;
        case 6:
            msg.reason = $L('TV Program Locks');
            break;
        case 7:
            msg.reason = $L('Service Area Zip Code');
            break;
        case 8:
            msg.reason = $L('Time Settings');
            break;
        case 9:
            msg.reason = $L('Please enter password.');
            break;
        case 10:
            msg.reason = $L('Others');
        case 11:
            $L("Go to  'Settings > General > Channels > Channel Tuning & Settings > Transponder Edit' and add one.")
            break;
        case 12:
            $L({key: 'volumeModeHigh', value: 'High' });
            break;
        case 13:
            $L("TV On Screen");
            break;
        case 14:
            toIString($L("IPv6 e.g.: \n{ipAddress}")).format({ipAddress: "fe80::1ff:fe23:4567:890a:5900"})
        case 15:
            toIString($L("IPv4 e.g.: \t{ip4Address}")).format({ipAddress: "123.123.456.456"})
        default:
            msg.reason = $L('MAC Address'); // xliff_target trim
            break;
    }
    return msg;
}

