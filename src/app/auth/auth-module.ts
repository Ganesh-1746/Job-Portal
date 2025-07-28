import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing-module';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginComponent,       
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    RouterModule
  ]
})
export class AuthModule { }
