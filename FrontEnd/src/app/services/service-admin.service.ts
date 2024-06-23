import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Service } from '../models/service';

@Injectable({
  providedIn: 'root'
})
export class ServiceAdminService {
  auth: AxiosInstance
  constructor() {
    this.auth = axios.create({
      baseURL: "http://127.0.0.1:8000/api",

    })
  }

  async getServices() {
    try {
      const res = await this.auth.get('/servicio', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error: any) {
      return error.response.status;
    }
  }

  async createService(servicio: FormData) {
    try {
      const res = await this.auth.post('/servicio', servicio, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error: any) {
      return error.response.status;
    }
  }

  async deleteService(id: number|null) {
    try {
      const res = await this.auth.delete(`/servicio/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data.status
    } catch (error: any) {
      return error.response.status;
    }
  }

  async updateService(id: number | null, data: Service) {
    try {
      const res = await this.auth.post(`/servicio/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data.status
    } catch (error: any) {
      return error.response.status;
    }
  }

  async getService(id: number) {
    try {
      const res = await this.auth.get(`/servicio/${id}`, {
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
