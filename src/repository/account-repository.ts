import { Account } from "../models/account";

class AccountRepository {
    private static _instance: AccountRepository;
    private baseUrl = 'http://localhost:3000/account';

    private constructor() {}

    public static get instance(): AccountRepository {
        if (!AccountRepository._instance) {
            AccountRepository._instance = new AccountRepository();
        }
        return AccountRepository._instance;
    }

    async get(email: string, password: string): Promise<Account[]> {
        try {
            const response = await fetch(`${this.baseUrl}?email=${email}&password=${password}`)
            if (!response.ok) throw new Error('Failed to fetch account')
            return response.json()
        } catch (error) {
            throw new Error(`Failed to get account: ${error}`)
        }
    }

    async getById(id: string): Promise<Account> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`)
            if (!response.ok) throw new Error(`Failed to fetch account ${id}`)
            return response.json()
        } catch (error) {
            throw new Error(`Failed to get account id ${id}: ${error}`)
        }
    }

    async create(
        fullname: string,
        email: string,
        username: string,
        password: string
    ): Promise<Account> {
        try {
            const response = await fetch(`${this.baseUrl}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({fullname, email, username, password})
            })
            if (!response.ok) throw new Error('Failed to create account')
            return response.json()
        } catch (error) {
            throw new Error(`Failed to create account: ${error}`)
        }
    }

    async update(
        id: string,
        fullname: string,
        email: string,
        username: string,
        password: string,
        address: string,
        phoneNumber: string
    ): Promise<Account> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    fullname,
                    email,
                    username,
                    password,
                    address,
                    phoneNumber
                })
            })
            return response.json()
        } catch (error) {
            throw new Error(`Failed to update: ${error}`)
        }
    }
}

export { AccountRepository };