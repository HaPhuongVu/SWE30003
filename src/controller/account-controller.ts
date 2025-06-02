import { Account } from "../models/account"
import { Cart } from "../models/cart";
import { AccountRepository } from "../repository/account-repository"
import { CartController } from "./cart-controller";

// export const USERID = localStorage.getItem('userId')
// export const USERNAME = localStorage.getItem('username')


// export const handleSubmit = async(
//     e: React.FormEvent,
//     userData: Account,
//     fullName: string,
//     email: string,
//     username: string,
//     password: string,
//     address: string,
//     phoneNumber: string
// ) => {
//     e.preventDefault()
//     try{
//         if (!userData) return null
//         const response = await AccountRepository.instance.update(userData.id, fullName, email, username, password, address, phoneNumber)
//         if (response) {
//             alert("Updated!")
//             window.location.reload()
//         }
//     }catch(error){
//         throw new Error(`Faild to update account ${error}`)
//     }
// }

class AccountController {
    private static _instance: AccountController;

    private constructor() {}

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
        } else {
            localStorage.removeItem('userId');
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
        return AccountRepository.instance.update(id, {fullname, email, username, password, address, phoneNumber});
    }
}

export { AccountController };