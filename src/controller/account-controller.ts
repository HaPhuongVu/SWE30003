import { Account } from "../models/account"
import { Cart } from "../models/cart";
import type { NotificationObserver } from "../models/notification-observer";
import { AccountRepository } from "../repository/account-repository"
import { CartController } from "./cart-controller";
import { NotificationController } from "./notification-controller";

type FormValidation = {
    fullName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    address: string;
};

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateFullName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name) && name.trim().length > 0 && name.trim().length <= 50;
};

const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[A-Za-z0-9]+$/;
    return usernameRegex.test(username) && username.length >= 8 && username.length <= 12;
};

const validatePassword = (password: string): boolean => {
    const hasAlpha = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    return password.length >= 8 && password.length <= 12 && hasAlpha && hasNumber && hasSpecialChar;
};

const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[\d]+$/;
    return phoneRegex.test(phone) && phone.trim().length == 10;
};

const validateAddress = (address: string): boolean => {
    const addressRegex = /^[A-Za-z0-9,/\s]+$/;
    return addressRegex.test(address) && address.trim().length > 0;
};

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
            this.instance.notify(`Logged in successfully.`);
        } else {
            localStorage.removeItem('userId');
            this.instance.notify('Logged out successfully.');
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


    validateField(field: string, value: string, password?:string): string {
        switch (field) {
            case 'fullName':
                if (!value.trim()) return "Full name is required";
                if (!validateFullName(value)) return "Full name must contain only letters and spaces, max 50 characters";
                return "";
            case 'email':
                if (!value.trim()) return "Email is required";
                if (!validateEmail(value)) return "Please enter a valid email address";
                return "";
            case 'username':
                if (!value.trim()) return "Username is required";
                if (!validateUsername(value)) return "Username must be 8-12 characters, alphanumeric only";
                return "";
            case 'password':
                if (!value) return "Password is required";
                if (!validatePassword(value)) return "Password must be 8-12 characters with letters, numbers, and special characters";
                return "";
            case 'confirmPassword':
                if (!value) return "Password confirmation is required";
                if (value !== password) return "Passwords do not match";
                return "";
            case 'phoneNumber':
                if (value.trim() && !validatePhoneNumber(value)) return "Phone number must be 10 digits";
                return "";
            case 'address':
                if (value.trim() && !validateAddress(value)) return "Address must contain only letters, numbers, commas, slashes, and spaces";
                return "";
            default:
                return "";
        }
    };

    validateForm(data: Partial<FormValidation>): FormValidation {
        return {
            fullName: data.fullName ? this.validateField('fullName', data.fullName) : "",
            email: data.email ? this.validateField('email', data.email) : "",
            username: data.username ? this.validateField('username', data.username) : "",
            password: data.password ? this.validateField('password', data.password) : "",
            confirmPassword: data.confirmPassword ? this.validateField('confirmPassword', data.confirmPassword, data.password) : "",
            phoneNumber: data.phoneNumber ? this.validateField('phoneNumber', data.phoneNumber) : "",
            address: data.address ? this.validateField('address', data.address) : ""
        };

    };

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
export type { FormValidation };