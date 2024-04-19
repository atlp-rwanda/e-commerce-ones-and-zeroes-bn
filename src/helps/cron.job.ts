import cron from "node-cron";
import { db } from "../database/models/index";
import sendPasswordUpdateNotification from "../utils/sendChangePasswordNofication";



const startCronJob = (): void => {
    cron.schedule('* * * * *', async () => {
        const users = await db.User.findAll();
        const passwordExpirationTime: number = 1;
        users.forEach(async (user: any) => {
            const lastPasswordChangeDate: Date = user.passwordLastChanged;
            const minutesSinceLastChange: number = Math.floor((new Date().getTime() - lastPasswordChangeDate.getTime()) / (1000 * 60));
            console.log(minutesSinceLastChange)
            console.log(passwordExpirationTime)
            if ((minutesSinceLastChange >= passwordExpirationTime) && minutesSinceLastChange < 2*passwordExpirationTime) {
                sendPasswordUpdateNotification(user);
            }
        });
    });
};

export default startCronJob;
