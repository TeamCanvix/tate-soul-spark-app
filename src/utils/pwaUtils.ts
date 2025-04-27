
export const registerForPushNotifications = async () => {
  // Check if the browser supports service workers and push notifications
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications are not supported by your browser');
    return false;
  }

  try {
    // Request permission for notifications
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission was not granted.');
      return false;
    }

    // In a real application, you would send the subscription to your server
    console.log('Notification permission granted! Ready to receive notifications.');
    return true;
  } catch (error) {
    console.error('Error while setting up push notifications:', error);
    return false;
  }
};

export const scheduleDailyNotification = () => {
  // In a real application, this would set up a recurring notification on the server
  // For now, we'll just log that it's been scheduled
  console.log('Daily notification scheduled');
  
  // Return a mock function to cancel the notification
  return {
    cancel: () => console.log('Daily notification canceled')
  };
};

export const checkIfPWA = () => {
  // Check if the app is running in standalone mode (installed as PWA)
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

export const isPushNotificationSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};
