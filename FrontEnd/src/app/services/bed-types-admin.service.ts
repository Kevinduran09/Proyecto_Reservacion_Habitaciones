import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { BedType } from '../models/bedType';

@Injectable({
  providedIn: 'root'
})
export class BedTypesAdminService {
  auth: AxiosInstance
  constructor() {
    this.auth = axios.create({
      baseURL: "http://127.0.0.1:8000/api",

    })
  }

  async getBedTypes() {
    try {
      const res = await this.auth.get('/tipoCama', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error: any) {
      return error.response.status;
    }
  }

  async createBedType(bedtype: FormData) {
    try {
      const res = await this.auth.post('/tipoCama', bedtype, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error: any) {
      return error.response.status;
    }
  }

  async deleteBedType(id: number|null) {
    try {
      const res = await this.auth.delete(`/tipoCama/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data.status
    } catch (error: any) {
      return error.response.status;
    }
  }

  async updateBedType(id: number | null, data: BedType) {
    try {
      const res = await this.auth.put(`/tipoCama/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data.status
    } catch (error: any) {
      return error.response.status;
    }
  }

  async getBedType(id: number) {
    try {
      const res = await this.auth.get(`/tipoCama/${id}`, {
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