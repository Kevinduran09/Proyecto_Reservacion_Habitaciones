import { Injectable } from "@angular/core";
import axios, { AxiosInstance } from "axios";
import { filterRoom } from "../models/rooms";

@Injectable({
  providedIn: 'root'
})
export class roomsService {
  roomsApi: AxiosInstance

  constructor() {
    this.roomsApi = axios.create({
      baseURL: 'http://127.0.0.1:8000/api'
    })
  }


  
  async getTipoHabitaciones(): Promise<any[]> {
    try {
      const response = await this.roomsApi.get('/tipoHabitacion');
      return response.data;
    } catch (error) {
      console.error('Error fetching tipo_habitaciones:', error);
      throw error;
    }
  }

  async getTipoCamas(): Promise<any[]> {
    try {
      const response = await this.roomsApi.get('/tipoCama', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tipo_camas:', error);
      throw error;
    }
  }

  async getTypes() {
    try {
      const res = await this.roomsApi.get('/tipoHabitacion');
      return res.data
    } catch (error) {
      console.log(error);
    }
  }

  async getFilterRooms(formData: filterRoom) {
    try {
      const res = await this.roomsApi.post('habitaciones/filterSearch', formData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error) {
      console.error('Error fetching filtered rooms:', error);
      throw error;
    }
  }

  async getRooms() {
    try {
      const res = await this.roomsApi.get('/habitacion', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error: any) {
      return error.response.status;
    }
  }

  async getRoom(id: number) {
    try {
      const res = await this.roomsApi.get(`/habitacion/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error: any) {
      return error.response.status;
    }
  }

  async deleteRoom(id: number) {
    try {
      await this.roomsApi.delete(`/habitacion/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
    } catch (error: any) {
      return error.response.status;
    }
  }

  async updateRoom(id: number | null, data: FormData) {
    try {
      const res = await this.roomsApi.post(`/habitacionEdit/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data.status
    } catch (error: any) {
      return error.response.status;
    }
  }

  async createRoom(room: FormData) {
    try {
      const res = await this.roomsApi.post('/habitacion', room, {
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
