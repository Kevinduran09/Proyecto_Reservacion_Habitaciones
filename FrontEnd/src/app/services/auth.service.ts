import { Injectable } from "@angular/core";
import axios, {AxiosInstance} from "axios";
import { UserCreate, UserLogin } from "../models/user";
@Injectable({
    providedIn:'root'
})

export class AuthService {
    auth: AxiosInstance
    constructor(){
        this.auth = axios.create({
            baseURL: "http://127.0.0.1:8000/api/auth",
            
        })
    }

    async login(userLogin:UserLogin){
        const resp = await this.auth.post('/login',userLogin)
      return resp.data
    }

    async isAutenticated(){
       try {
           const res = await this.auth.post('/current',null,{
               headers: {
                   'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Agrega el token al encabezado Authorization
               }
           })
           return res.data.status
       } catch (error:any) {
           return error.response.status;
       }
    }
    async getIndentityFromStorage(){
        try {
            const current = sessionStorage.getItem('current')
            if(!current){
                return null
            }

            return JSON.parse(current)
        } catch (error) {
            console.log(error);
            return false
        }
    }
    async getIndentityFromAPI(){
        try {
            const res = await this.auth.get('/me',{
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Agrega el token al encabezado Authorization
                }
            })
            
            return res.data
        } catch (error) {
             console.log(error);
             return false
        }
    }
    async register(user:UserCreate){
        try {
            const res = await this.auth.post('/register', user)
            return res.data
        } catch (error) {
            console.log(error);
            
            return false
        }
    }

}
