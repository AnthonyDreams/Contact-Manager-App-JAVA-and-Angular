import { Component, OnInit, ViewChild, ApplicationRef  } from '@angular/core';
import {Router, NavigationEnd } from '@angular/router';
import { orderBy, map, find,findIndex, concat} from 'lodash';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { promise } from 'protractor';
import {ContactService} from './contact.service'
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
const contact_data = 'https://jsonplaceholder.typicode.com/users'; 

interface Contact {
   name: string;
   email: string;
   phone_number: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contacts$: any;
  private email_regex : RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  dataLoaded: Promise<boolean>;
  phonesToSave_: any = [];
  phonesToEdit: any = [];
  Opened : number[] = [];
  vista :string = "Contacts";
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  dataSource = new MatTableDataSource();
  id : number = 0;
  contact : any = { email: "", name: ""};
  displayedColumns: string[] = ['actions', 'name', 'email', 'phones'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  settings = {
    add: {
      confirmCreate: true,
    },
    columns: {
     
      name: {
        title: 'Full Name'
      },
      email: {
        title: 'Email'
      },
      phones: {
        title: 'Phones'
      }
    }
  };

  constructor(public router: Router, private contactService: ContactService, private ref: ApplicationRef,private _snackBar : MatSnackBar) {
     this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
   }

   this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
         this.router.navigated = false;
         window.scrollTo(0, 0);
      }
  }); 
  
  }

 

     ngOnInit() {
        this.getContacts()
           
  }

  getContacts(){
    this.isLoadingResults = true;
    this.contactService.observableData().subscribe(data => {
      this.contacts$ = map(data, function(contact){
        contact['first'] = contact.phones[0] ? contact.phones[0].number : ""
        return contact;

      })
      this.dataSource = new MatTableDataSource(orderBy(this.contacts$, ['id'], [ 'desc']));

      this.dataSource.paginator = this.paginator;
      this.isLoadingResults = false;
      
    });

    

  }
  public is_valid() : boolean | string {
    if(this.contact.name.replace(/\s/g, '') == "" || this.contact.email.replace(/\s/g, '') == "" ){
      return "all fields are required"
    } else {
      if(this.contact.email.search(this.email_regex) === -1){
        return "Email error"
      }
      return true
    }
  }

  public save(contact){
    return this.contactService.addContact(contact)
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showEdit(id: number){
    this.id = id;
    this.contact = find(this.contacts$, (contact) => {return contact.id === id})

  }

  async editContact(){
    this.isLoadingResults = true;
    delete this.contact['phones'];
    delete this.contact['id']
    this.contactService.editContact(this.contact, this.id).then( () => {
      this.getContacts()
       this.hideEdit()
       this.openSnackBar("Contact edited")
      }

    );
    
  }
  removeContact(id){
    this.isLoadingResults = true;
    this.contactService.removeContact(id).then(() => {
      this.getContacts();
      this.hideEdit();
      this.openSnackBar("Contact deleted")
    })
   
  }

  hideEdit(){
    this.id = 0;
  }

  // Aqui comienza el desastre para trabajar con array de phones. No he usado ninguna libreria en este aspecto

  setPhoneInArray(id, phone){
    let phones = findIndex(this.phonesToEdit, (phone_) => phone_.id == id)
    if(phones != -1){
      if(!find(this.phonesToEdit[phones].phone, (phone_b) => phone_b.id == phone.id)){
        this.phonesToEdit[phones].phone.push(phone);
      }
  } else {
      this.phonesToEdit.push({id: id, phone:[phone]})
    }
    
  }

  getIndexOfPhone(contact_id, phone_id){
    let phones = findIndex(this.phonesToEdit, (phone_) => phone_.id === contact_id)
    if(phones != -1){
      return findIndex(this.phonesToEdit[phones].phone, (phone) => phone.id === phone_id)
      } else {
        return -1
    }

  }

  phonesToSave(id){
    return findIndex(this.phonesToSave_, (phone) => phone.id === id) != -1 ? findIndex(this.phonesToSave_, (phone) => phone.id === id) : null
  }
  allPhonesvalidation(id){
    let valid = true;
    let index_save = findIndex(this.phonesToSave_, (phone) => phone.id === id)
    let index_edit = findIndex(this.phonesToEdit, (phone) => phone.id === id)
   
    for(let a = 0; a < 2; ++a){
      let list = a == 1 ? this.phonesToSave_ : this.phonesToEdit;
      let index = a == 1 ? index_save : index_edit;
      if(list[index] && index > -1){
        for(var i in list[index].phone){
          if(list[index].phone[i].number.replace(/\s/g, '') == "" || list[index].phone[i].type.replace(/\s/g, '') == ""){
            valid = false
            break;
          }
        }
    } 

    
      if(valid == false){
        break;
      }

  }

    return valid;

  }
  addPhone(id){
    let index = findIndex(this.phonesToSave_, (phone) => phone.id === id)
    if(!this.allPhonesvalidation(id)){return false}
    if(index > -1){
      console.log(this.phonesToSave_[index].phone)

        if(this.phonesToSave_[index].phone[this.phonesToSave_[index].phone.length - 1].number.replace(/\s/g, '') != "" && this.phonesToSave_[index].phone[this.phonesToSave_[index].phone.length -1].type.replace(/\s/g, '') != ""){
          this.phonesToSave_[index].phone.unshift({type: "", number:""})
      }
  } else {
    this.phonesToSave_.push({id: id, phone:[{type: "", number:""}]})
  }
  }

  public trackByIndex(index: number, obj: any): any {
    return index;
  }

  savePhones(id){
    this.isLoadingResults = true;
    let index_save = findIndex(this.phonesToSave_, (phone) => phone.id === id)
    let index_edit = findIndex(this.phonesToEdit, (phone) => phone.id === id)
    this.contactService.phonesUpdates(id, concat(this.phonesToSave_[index_save] ? this.phonesToSave_[index_save].phone : [], this.phonesToEdit[index_edit] ? this.phonesToEdit[index_edit].phone : [])).then(() => {
      this.phonesToSave_.splice(index_save, 1)
      this.phonesToEdit.splice(index_edit, 1)
      this.openSnackBar("Phone saved")
      this.getContacts()
      
    })
  }

  removePhoneTable(type, index, id=null){
    if(type=="save"){
      let index_save = findIndex(this.phonesToSave_, (phone) => phone.id === id)
      this.phonesToSave_[index_save].phone.splice(index, 1)
      if(this.phonesToSave_[index_save].phone.length == 0){
        this.phonesToSave_.splice(index_save, 1)
      }
      this.allPhonesvalidation(id)
    } else if(type == "edit"){
      this.isLoadingResults = true;
      let index_edit = findIndex(this.phonesToEdit, (phone) => phone.id === id)
      if(index_edit > -1){
      this.contactService.removePhone(id, this.phonesToEdit[index_edit].phone[index].id).then(() => {
        this.phonesToEdit.splice(index, 1);
        this.openSnackBar("Phone deleted")
      })
    } else {
      this.contactService.removePhone(id, index).then(() => {
        this.openSnackBar("Phone deleted")
        this.getContacts()
      })
    }
    }
  }

  // aqui termina xD.
  
  showSave(id){
    let index_save = findIndex(this.phonesToSave_, (phone) => phone.id === id)
    let index_edit = findIndex(this.phonesToEdit, (phone) => phone.id === id)
    
    return index_save + index_edit;
  }

  setOpen(index){

    if(!this.isOpen(index)){
      this.Opened.push(index)
    }
    

  }

  isOpen(index){
    return findIndex(this.Opened,(item) => item == index ) > -1 ? true : false 
  }

  setClose(index){
      this.Opened.splice(findIndex(this.Opened,(item) => item == index ), 1)

  }

  openSnackBar(msg) {
    this._snackBar.open(msg, null, {
      duration: 2000,
    });
  }

}

// Never Used

@Component({
  selector: 'app-contact',
  templateUrl: 'snack-bar-component-example-snack.html',
  styles: [`
    .example-pizza-party {
      color: hotpink;
    }
  `],
})
export class Message{
   public msg = ""
}

   


