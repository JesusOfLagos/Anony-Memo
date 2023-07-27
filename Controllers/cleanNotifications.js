


const cron = require("node-cron")
const Notification = require('./models/Notification'); // Update the path as needed

// Define the cleanup task using node-cron
cron.schedule('0 0 * * *', async () => {
  // The cleanup task runs every day at midnight (0:00)

  try {
    // Delete old notifications that are more than 7 days old
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await Notification.deleteMany({ timestamp: { $lt: oneWeekAgo } });

    // Delete read notifications (assuming isRead is a boolean field)
    await Notification.deleteMany({ isRead: true });

    console.log('Notification cleanup completed.');
  } catch (error) {
    console.error('Notification cleanup error:', error);
  }
});
