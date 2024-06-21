import { Injectable } from "@angular/core";
import axios, { AxiosInstance } from "axios";
@Injectable({
    providedIn: 'root'
})
export class roomsService{
    roomsApi:AxiosInstance

    constructor(){
        this.roomsApi = axios.create({
            baseURL:'http://127.0.0.1:8000/api/tipoHabitacion'
        })
    }

    async getTypes(){
        try {
            const res = await this.roomsApi.get('');
            return res.data
        } catch (error) {
            console.log(error);    
        }
    }
}