import { Platform, Dimensions, PixelRatio, StatusBar } from 'react-native';
import Constants from './Constants';
import Device from './Device';
import Color from './Color';
import Config from './Config';

const { height, width } = Dimensions.get('window');

const androidStatusBarHeight = StatusBar.currentHeight;
const iosStatusBarHeight = 20;
const iPhoneXStatusBarHeight = 30;
const iPhoneXSafeStatusBarHeight = 44;
const iPhoneXBottomSpaceHeight = 34;
const navigationHeaderHeight = 56; // 40 ?

const Styles = {
    width,
    ...Platform.select({
        ios: {
            height: Device.ifIphoneX(height - iPhoneXSafeStatusBarHeight -iPhoneXBottomSpaceHeight,
                Config.showStatusBar ? height - iosStatusBarHeight : height),
            statusBarHeight: Device.getStatusBarHeight(true),
            navigationHeaderHeight,
            navigationHeaderBase: {
                height: navigationHeaderHeight,
            },
        },
        android: {
            height,
            statusBarHeight: androidStatusBarHeight,
            navigationHeaderHeight: navigationHeaderHeight + androidStatusBarHeight,
            navigationHeaderBase: {
                height: navigationHeaderHeight + androidStatusBarHeight,
                paddingTop: androidStatusBarHeight,
            },
        },
    }),
    iosStatusBarHeight,
    androidStatusBarHeight,
    iPhoneXStatusBarHeight,
    iPhoneXSafeStatusBarHeight,
    iPhoneXBottomSpaceHeight,
    actualScreenSize: PixelRatio.getPixelSizeForLayoutSize(width),
    app: {
        flex: 1,
        backgroundColor: Device.isIphoneX ? '#FFF' : '#000',
    },
    FontSize: {
        tiny: 12,
        small: 14,
        medium: 16,
        big: 18,
        large: 20,
    },
    IconSize: {
        TextInput: 25,
        ToolBar: 18,
        Inline: 20,
        SmallRating: 14,
    },
    FontFamily: {},
};

Styles.Common = {
    ColumnCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    ColumnCenterTop: {
        alignItems: 'center',
    },
    ColumnCenterBottom: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    ColumnCenterLeft: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    ColumnCenterRight: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    Row: {
        flexDirection: 'row',

        ...Platform.select({
            ios: {
                top: !Config.showStatusBar
                    ? Device.isIphoneX
                        ? -20
                        : -8
                    : Device.isIphoneX
                        ? -15
                        : 0,
            },
            android: {
                top: 0,
            },
        }),
    },
    RowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    RowCenterTop: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    RowCenterBottom: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    RowCenterLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    RowCenterRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    RowCenterBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
};

export default Styles;
