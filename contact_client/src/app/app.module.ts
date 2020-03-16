import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent,DialogOverviewExampleDialog } from './app.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactComponent, Message } from './contact/contact.component';
import { ContactService } from './contact/contact.service';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {  FormsModule } from '@angular/forms'
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {MatDialogRef} from '@angular/material/dialog';
const appRoutes: Routes = [
 
  { path: '',
    component: ContactComponent,
    data: { title: 'contact List' }
  }
];


@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    Message,
    DialogOverviewExampleDialog,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    HttpClientModule,
    Ng2SmartTableModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,

    MaterialModule,
  ],
  providers: [ContactService, ContactComponent],
  entryComponents:[DialogOverviewExampleDialog, Message],
  bootstrap: [AppComponent]
})
export class AppModule { }
