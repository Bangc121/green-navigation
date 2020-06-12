/**
 * @see https://github.com/ptelad/react-native-iphone-x-helper/blob/master/index.js
 */

import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

const isIphoneX =
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((height === 812 || width === 812) || (height === 896 || width === 896));
    // Platform.OS === 'ios' &&
    // !Platform.isPad &&
    // !Platform.isTVOS &&
    // (height >= 812 || width >= 812);

const bottomSpace = isIphoneX ? 34 : 0;

// this method it for creating stylesheets with the iPhone X in mind
// ifIphoneX(iphoneXStyle, [regularStyle])
// ...ifIphoneX({
//     paddingTop: 50
// }, {
//     paddingTop: 20
// })
// },
export function ifIphoneX(iphoneXStyle, regularStyle) {
    if (isIphoneX) {
        return iphoneXStyle;
    }
    return regularStyle;
}

// safe - whether you want for get safe area height or not
// 44 for safe iPhoneX, 30 for unsafe iPhoneX, 20 for other iOS devices and StatusBar.currentHeight for Android.
// If you are using the the unsafe statusbar height, make sure to add 14dp of padding to your content,
// otherwise it's going to be flush against the notch
export function getStatusBarHeight(safe) {
    return Platform.select({
        ios: ifIphoneX(safe ? 44 : 30, 20),
        android: StatusBar.currentHeight
    });
}

export default {
    isIphoneX,
    bottomSpace,
    ifIphoneX,
    getStatusBarHeight,
}
