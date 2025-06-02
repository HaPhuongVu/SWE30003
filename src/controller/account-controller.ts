import type { Account } from "../models/account"
import { accountAPI } from "../repository/account-repository"


export const USERID = localStorage.getItem('userId')
export const USERNAME = localStorage.getItem('username')


export const handleSubmit = async(
    e: React.FormEvent,
    userData: Account,
    fullName: string,
    email: string,
    username: string,
    password: string,
    address: string,
    phoneNumber: string
) => {
    e.preventDefault()
    try{
        if (!userData) return null
        const response = await accountAPI.update(fullName, email, username, password, address, phoneNumber)
        if (response) {
            alert("Updated!")
            window.location.reload()
        }
    }catch(error){
        throw new Error(`Faild to update account ${error}`)
    }
}