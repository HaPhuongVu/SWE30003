import type { NotificationObserver } from "../models/notification-observer";

class NotificationController implements NotificationObserver {
    private static _instance: NotificationController;

    private constructor() {}

    static get instance(): NotificationController {
        if (!NotificationController._instance) {
            NotificationController._instance = new NotificationController();
        }
        return NotificationController._instance;
    }

    update(notification: string): void {
        alert(notification);
    }
}

export { NotificationController };