/*=========================
Name: Brittany Dockter
Date: March 20, 2020
Assignment: app.routing.js
Description: routes for components
==========================*/

import { Routes } from "@angular/router";
import { BaseLayoutComponent } from "./shared/base-layout/base-layout.component";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";

export const AppRoutes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    children: [
      {
        path: "",
        component: HomeComponent
      },
      /*
        New components go here...
       */
      {
        path: "login",
        component: LoginComponent
      }
    ]
  }
];