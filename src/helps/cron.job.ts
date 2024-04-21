import cron from "node-cron";
import { db } from "../database/models/index";
import sendPasswordUpdateNotification from "../utils/sendChangePasswordNofication";
import dotenv from "dotenv";

dotenv.config();

const startCronJob = (): void => {
    const cronSchedule = process.env.CRON_SCHEDULE || '* * * * *';
    const passwordExpirationPeriodMinutes = parseInt(process.env.PASSWORD_EXPIRATION_PERIOD_MINUTES || '1', 10);

    cron.schedule(cronSchedule, async () => {
        const users = await db.User.findAll();
        
        users.forEach(async (user: any) => {
            const lastPasswordChangeDate: Date = user.passwordLastChanged;
            const minutesSinceLastChange: number = Math.floor((new Date().getTime() - lastPasswordChangeDate.getTime()) / (1000 * 60));
            console.log(minutesSinceLastChange);
            console.log(passwordExpirationPeriodMinutes);
            if (minutesSinceLastChange >= passwordExpirationPeriodMinutes && minutesSinceLastChange < 2 * passwordExpirationPeriodMinutes) {
                sendPasswordUpdateNotification(user);
            }
        });
    });
};

export default startCronJob;
