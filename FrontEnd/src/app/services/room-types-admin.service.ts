import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { RoomType } from '../models/roomType';

@Injectable({
  providedIn: 'root'
})
export class RoomTypesAdminService {
  auth: AxiosInstance
  constructor() {
    this.auth = axios.create({
      baseURL: "http://127.0.0.1:8000/api",

    })
  }

  async getRoomTypes() {
    try {
      const res = await this.auth.get('/tipoHabitacion', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error: any) {
      return error.response.status;
    }
  }

  async createRoomType(roomtype: FormData) {
    try {
      const res = await this.auth.post('/tipoHabitacion', roomtype, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error: any) {
      return error.response.status;
    }
  }

  async deleteRoomType(id: number|null) {
    try {
      const res = await this.auth.delete(`/tipoHabitacion/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data.status
    } catch (error: any) {
      return error.response.status;
    }
  }

  async updateRoomType(id: number | null, data: RoomType) {
    try {
      const res = await this.auth.post(`/tipoHabitacion/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data.status
    } catch (error: any) {
      return error.response.status;
    }
  }

  async getRoomType(id: number) {
    try {
      const res = await this.auth.get(`/tipoHabitacion/${id}`, {
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
