import { USERID } from "../controller/account-controller"
import type { Account } from "../models/account"

const getAccount = async(email: string, password: string):Promise<Account[]> => {
    try{
        const response = await fetch(`http://localhost:3000/account?email=${email}&password=${password}`)
        if(!response.ok) throw new Error('Failed to fetch account')
        return response.json()
    }catch(error){
        throw new Error(`Failed to get account ${error}`)
    }
}

const getAccountById = async() => {
    try {
        const response = await fetch(`http://localhost:3000/account/${USERID}`)
        if(!response.ok) throw new Error(`Failed to fetch account ${USERID}`)
        return response.json()
    } catch(error){
        throw new Error (`Failed to account id ${USERID}`)
    }
}

const createAccount = async(
    fullname: string,
    email: string,
    username: string,
    password: string
):Promise<Account> => {
    try{
        const response = await fetch('http://localhost:3000/account', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({fullname, email, username, password})
        })
        if (!response.ok) throw new Error ('Failed to create account')
        return response.json()
    } catch(error) {
        throw new Error (`Failed to create account ${error}`)
    }
}

const updateAccount = async(fullname: string, email: string, username: string, password: string, address: string, phoneNumber:string):Promise<Account> => {
    try{
        const response = await fetch(`http://localhost:3000/account/${USERID}`, {
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
    }catch(error) {
        throw new Error(`Failed to update ${error}`)
    }
}

export const accountAPI = {
    get: getAccount,
    getById: getAccountById,
    create: createAccount,
    update: updateAccount
}