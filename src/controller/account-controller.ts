import { Account } from "../models/account"
import { Cart } from "../models/cart";
import type { NotificationObserver } from "../models/notification-observer";
import { AccountRepository } from "../repository/account-repository"
import { CartController } from "./cart-controller";
import { NotificationController } from "./notification-controller";

class AccountController {
    private static _instance: AccountController;

    observers: NotificationObserver[] = [];

    private constructor() {
        this.subscribe(NotificationController.instance);
    }

    static get instance(): AccountController {
        if (!AccountController._instance) {
            AccountController._instance = new AccountController();
        }
        return AccountController._instance;
    }

    static get loggedInUser(): string | null {
        return localStorage.getItem('userId');
    }

    static set loggedInUser(user: string | null) {
        if (user) {
            localStorage.setItem('userId', user);
            this.instance.notify(`User ${user} logged in successfully.`);
        } else {
            localStorage.removeItem('userId');
            this.instance.notify('User logged out successfully.');
        }
    }

    async getAccount(id: string): Promise<Account> {
        const account = await AccountRepository.instance.getById(id);
        if (!account) throw new Error('Account not found');
        if (account.role === 'customer') {
            account.cart = await CartController.instance.getCart(account.id);
        }
        return account;
    }

    async createAccount(
        fullName: string,
        email: string,
        username: string,
        password: string,
        address: string,
        phoneNumber: string
    ): Promise<Account> {
        const account = await AccountRepository.instance.create(fullName, email, username, password, address, phoneNumber);
        if (account.role === 'customer') {
            account.cart = new Cart(account.id);
        }
        this.notify(`Account ${account.id} created successfully.`);
        return account;
    }

    /**
     * Fetches and verifies the account by email and password.
     * If the account is not found, it throws an error.
     * @param email - The email of the account to verify.
     * @param password - The password of the account to verify.
     * @return A promise that resolves to the Account object if found.
     * @throws Error if the account is not found.
     */
    async verifyAccount(email: string, password: string): Promise<Account> {
        const account = await AccountRepository.instance.getByCredentials(email, password);
        if (!account) throw new Error('Account not found');
        return account;
    }

    async updateAccount(
        id: string,
        fullname: string,
        email: string,
        username: string,
        password: string,
        address: string,
        phoneNumber: string
    ): Promise<Account> {
        const updatedAccount = await AccountRepository.instance.update(id, {fullname, email, username, password, address, phoneNumber});
        this.notify(`Account ${id} updated successfully.`);
        return updatedAccount;
    }

    subscribe(observer: NotificationObserver): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    unsubscribe(observer: NotificationObserver): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    notify(notification: string): void {
        this.observers.forEach(observer => observer.update(notification));
    }
}

export { AccountController };