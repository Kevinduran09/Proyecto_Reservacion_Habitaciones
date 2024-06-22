import { Injectable } from "@angular/core";
import axios, { AxiosInstance } from "axios";
import { filterRoom } from "../models/rooms";
@Injectable({
    providedIn: 'root'
})
export class roomsService{
    roomsApi:AxiosInstance

    constructor(){
        this.roomsApi = axios.create({
            baseURL:'http://127.0.0.1:8000/api'
        })
    }

    async getTypes(){
        try {
            const res = await this.roomsApi.get('/tipoHabitacion');
            return res.data
        } catch (error) {
            console.log(error);    
        }
    }
    async getFilterRooms(formData:filterRoom){
        try {
            const res = await this.roomsApi.post('habitaciones/filterSearch',formData,{
                headers:{
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
            return res.data
        } catch (error) {
            
        }
    }

    async getRoom(id:number) {
        try {
          const res = await this.roomsApi.get(`/users/${id}`, {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
          })
          return res.data
        } catch (error: any) {
          return error.response.status;
        }
      }
}