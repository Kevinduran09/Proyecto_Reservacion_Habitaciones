import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { User, UserCreate, UserResponse } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  auth: AxiosInstance
  constructor() {
    this.auth = axios.create({
      baseURL: "http://127.0.0.1:8000/api",

    })
  }

  async getClients() {
    try {
      const res = await this.auth.get('/users', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error: any) {
      return error.response.status;
    }
  }

  async createClient(user:UserCreate) {
    try {
      const res = await this.auth.post('/users', user, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data
    } catch (error: any) {
      return error.response.status;
    }
  }

  async deleteClient(id:number){
    try {
      const res = await this.auth.delete(`/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
    } catch (error: any) {
      return error.response.status;
    }
  }

  async updateClient(user:User){
    try {
      const res = await this.auth.put(`/users/${user.id}`, user, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      return res.data.status
    } catch (error: any) {
      return error.response.status;
    }
  }

  async getClient(id:number) {
    try {
      const res = await this.auth.get(`/users/${id}`, {
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
