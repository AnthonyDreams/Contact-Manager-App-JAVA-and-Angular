import {Injectable}             from '@angular/core';
import {Subject}                from 'rxjs';
import {Router } from '@angular/router';
import { values, concat} from 'lodash';
import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import { Observable } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
const contact_data = 'https://contactmanagertestapp.herokuapp.com/api/contact'; 
interface Contact {
  name: string;
  email: string;
  phone_number: string;
}
@Injectable()
export class ContactService {


    private contacts$: Observable<Contact[]> = localStorage.getItem('contacts') ? values(JSON.parse(localStorage.getItem('contacts'))) : localStorage.getItem('contacts');
    public status: Boolean = false;
    private contact: Contact;
    
   
    constructor(private http: HttpClient, public router: Router) {
     }
  
    private getUsers() : Observable<Contact>{
       return this.http
       .get<Contact[]>(contact_data)
       .pipe(map(data => values(data)))
     }

     public addContact(data) :  Promise<void> {
      let resolveRef;
      let rejectRef;
  
      let dataPromise: Promise<void> = new Promise((resolve, reject) => {
        resolveRef = resolve;
        rejectRef = reject;
    });
      this.http.post<Boolean>('https://contactmanagertestapp.herokuapp.com/api/contact', data).subscribe(
        res => {
          this.status = res; 
          resolveRef(null)
      },

      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      });
      
      return dataPromise;
     }

     editContact(data, id) : Promise<void>{
      let resolveRef;
      let rejectRef;
  
      let dataPromise: Promise<void> = new Promise((resolve, reject) => {
        resolveRef = resolve;
        rejectRef = reject;
    });
        this.http.put<Contact>(`https://contactmanagertestapp.herokuapp.com/api/contact/${id}`, data).subscribe(
          res => {
            this.contact = res;
            resolveRef(null)
        },
  
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        });
        
        return dataPromise;
     }

     phonesUpdates(id, data): Promise<void>{
      let resolveRef;
      let rejectRef;
  
      let dataPromise: Promise<void> = new Promise((resolve, reject) => {
        resolveRef = resolve;
        rejectRef = reject;
    });
        this.http.put<Contact>(`https://contactmanagertestapp.herokuapp.com/api/contact/${id}/phone`, data).subscribe(
          res => {
            this.contact = res;
            resolveRef(null)
        },
  
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        });
        
        return dataPromise;
     }


     removeContact(id) : Promise<void>{
      let resolveRef;
      let rejectRef;
  
      let dataPromise: Promise<void> = new Promise((resolve, reject) => {
        resolveRef = resolve;
        rejectRef = reject;
    });
      this.http.delete<Boolean>(`https://contactmanagertestapp.herokuapp.com/api/contact/${id}`).subscribe(
        res => {
          this.status = res; 
          resolveRef(null);
      },

      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      });
      
      return dataPromise;
     }

     removePhone(contact_id, phone_id) : Promise<void>{
      let resolveRef;
      let rejectRef;
  
      let dataPromise: Promise<void> = new Promise((resolve, reject) => {
        resolveRef = resolve;
        rejectRef = reject;
    });
      this.http.delete<Boolean>(`https://contactmanagertestapp.herokuapp.com/api/contact/${contact_id}/phone/${phone_id}`).subscribe(
        res => {
          this.status = res; 
          resolveRef(null);
      },

      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      });
      
      return dataPromise;
     }

     public observableData(){
         var O = this.getUsers()
         this.setData(O)
         return O;
    }

    private setData(Observable) {
        if(this.contacts$ == undefined){

            Observable.subscribe((data) => {
             this.contacts$ = values(data)
              localStorage.setItem('contacts', JSON.stringify(data))
            })
      
          }
     }

    

      getData() : Observable<Contact[]> {
        return this.contacts$

     }

     routeTo(TO) : void {
       this.contacts$ = values(JSON.parse(localStorage.getItem('contacts')))
       this.router.navigate(TO);
     }
}