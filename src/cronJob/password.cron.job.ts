import cron from 'node-cron';
import { db } from '../database/models/index';
import sendPasswordUpdateNotification from '../utils/sendChangePasswordNofication';
import { generateToken } from '../helps/generateToken';
import dotenv from 'dotenv';

dotenv.config();

const startCronJob = (): void => {
  const cronSchedule = process.env.CRON_SCHEDULE || '* * * * *';
  const passwordExpirationPeriodMinutes = parseInt(
    process.env.PASSWORD_EXPIRATION_PERIOD_MINUTES || '261561.6',
    10,
  );

  cron.schedule(cronSchedule, async () => {
    const users = await db.User.findAll();

    users.forEach(async (user: any) => {
      const lastPasswordChangeDate: Date = user.passwordLastChanged;
      const minutesSinceLastChange: number = Math.floor(
        (new Date().getTime() - lastPasswordChangeDate.getTime()) / (1000 * 60),
      );
      if (
        minutesSinceLastChange >= passwordExpirationPeriodMinutes &&
        minutesSinceLastChange < 2 * passwordExpirationPeriodMinutes
      ) {
        const token = generateToken(
          user.userId,
          user.email,
          user.firstName,
          user.lastName,
          user.role,
          user.passwordLastChanged,
          user.isVerified,
        );
        sendPasswordUpdateNotification(user, token);
      }
    });
  });
};

export default startCronJob;
