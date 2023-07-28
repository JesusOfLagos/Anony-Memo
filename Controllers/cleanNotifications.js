


import cron from 'node-cron'
import { notificationSchema } from "../Models/Notification";

cron.schedule('0 0 * * *', async () => {

  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await notificationSchema.deleteMany({ timestamp: { $lt: oneWeekAgo } });
    await notificationSchema.deleteMany({ isRead: true });

    console.log('Notification cleanup completed.');
  } catch (error) {
    console.error('Notification cleanup error:', error);
  }
});
