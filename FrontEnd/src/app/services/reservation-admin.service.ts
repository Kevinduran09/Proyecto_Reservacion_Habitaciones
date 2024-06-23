import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ReservationAdminService {
  auth: AxiosInstance
  constructor() {
    this.auth = axios.create({
      baseURL: "http://127.0.0.1:8000/api",

    })
  }

  async getReservations() {
    try {
      const res = await this.auth.get('/reservacion', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error: any) {
      return error.response.status;
    }
  }

  async createReservation(reservation: FormData) {
    try {
      const res = await this.auth.post('/reservacion', reservation, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error: any) {
      return error.response.status;
    }
  }

  async deleteReservation(id: number|null) {
    try {
      const res = await this.auth.delete(`/reservacion/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
    } catch (error: any) {
      return error.response.status;
    }
  }

  async updateReservation(id: number | null, data: FormData) {
    try {
      const res = await this.auth.put(`/reservacion/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data.status
    } catch (error: any) {
      return error.response.status;
    }
  }

  async getReservation(id: number) {
    try {
      const res = await this.auth.get(`/reservacion/${id}`, {
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