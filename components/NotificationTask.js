import * as Notifications from 'expo-notifications';

const TRIGGER_MORNING = new Date(
    new Date().setHours(6, 0, 0, 0)
); // Set to 6 AM every day
const TRIGGER_EVENING = new Date(   
    new Date().setHours(18, 0, 0, 0)
); // Set to 6 PM every day

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
}),
});

export default async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Good morning!',
            body: 'Rise and shine! Have a great day.',
        },
        trigger: TRIGGER_MORNING,
    });

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Good evening!',
            body: 'Time to unwind and relax.',
        },
        trigger: TRIGGER_EVENING,
    });
}