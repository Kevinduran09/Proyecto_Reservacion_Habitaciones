import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isAuth:boolean = false
  constructor(private service: AuthService,
    private swal: SweetAlertService, 
    private router: Router, 
    private viewportScroller: ViewportScroller){
  this.getIndentity()
  }
  ngOnInit(): void {
    this.getIndentity()
  }

  async getIndentity(){
    const current = await this.service.getIndentityFromStorage()
    console.log(current);
    
    if(current){
      this.isAuth = current ? true : false
      console.log(this.isAuth);
      
    }
  }
  scrollTo(anchor: string) {
    this.router.navigate([], { fragment: anchor });
    this.viewportScroller.scrollToAnchor(anchor);
  }

  

  logout(){
    sessionStorage.clear()
    this.isAuth = false
    this.swal.showAlert({text:"Se cerro la sesion con exito!"})
    this.router.navigate(["/"])
  }
}
