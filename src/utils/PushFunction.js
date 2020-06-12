import {Notifications, Permissions} from "expo";
const PUSH_ENDPOINT = 'https://f8nc8nsmka.execute-api.ap-northeast-2.amazonaws.com/production/api/accounts/users/push-token/';

export async function registerForPushNotificationsAsync(user_type, user_idx) {
    console.log('registerForPushNotificationsAsync 2');
    const {status: existingStatus} = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    console.log(finalStatus);
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        console.log('ask permission!');
        finalStatus = status;
        console.log(finalStatus)
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token);

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return fetch(PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            push_token: token,
            user: {
                user_type: user_type,
                user_idx: user_idx
            }
        }),
    });
}

