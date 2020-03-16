import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import   {ContactService} from './contact/contact.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ContactComponent} from './contact/contact.component';
import { MatTableDataSource } from '@angular/material/table';
import { Route } from '@angular/compiler/src/core';

interface Contact {
  name: string;
  email: string;
  phones: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  contact : any;
  vista :string = "Contacts"
  validation : boolean = true;
  dialogRef : any;
  constructor(public dialog: MatDialog, private contactComponent: ContactComponent, private router: Router) {}

  openDialog(): void {
    this.dialogRef =  this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {name: "", email: "", phones:[{type: "", number: ""}]}
    });

    
    this.dialogRef.afterClosed().subscribe(result => {
      this.contactComponent.save(result).then(() => {
        this.contactComponent.openSnackBar("Contact Created")
        this.router.navigate([''])})
      
      
    });
  }

 
 
}


@Component({
  selector: 'app-root',
  templateUrl: './dialog.html',
  styleUrls: ['./app.component.scss']
})
export class DialogOverviewExampleDialog {
  public validation: boolean = true;
  public msg: string = "";
  public phone_focus: number = 0;
  constructor(private contactComponent: ContactComponent,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Contact) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  showInput(index: number){
    this.phone_focus = index;
    console.log(index)
  }

  addPhones(){
    let phones_obj = this.data.phones[this.phone_focus]
    if(phones_obj.type.replace(/\s/g, '') != "" && phones_obj.number.replace(/\s/g, '') != ""){
      this.data.phones.push({type: "", number: ""})
    } else {
      this.validation = false;
      this.msg = "all phone fields are required";
    }
  }

  removePhoneFromList(index: number){
    if(this.data.phones.length > 1 ){
      this.data.phones.splice(index, 1);
    }
  }

  save(data){
    let valid = true
      
     
    this.contactComponent.contact = data;
    if(this.contactComponent.is_valid() === true){
      for(var i in this.data.phones){
        if(this.data.phones[i].number.replace(/\s/g, '') == "" || this.data.phones[i].type.replace(/\s/g, '') == ""){
          if(this.data.phones[i].number.replace(/\s/g, '') == "" && this.data.phones[i].type.replace(/\s/g, '') == ""){
            this.data.phones.splice(i, 1);
            valid = true
            continue;
          }
          valid = false
          break;
        }
      }
      if(!valid){
        this.msg = "all phone fields are required"
        this.validation = false;
        return false;
      }
      this.validation = true;
      this.dialogRef.close(data)


    } else {
      this.msg = this.contactComponent.is_valid().toString();
      this.validation = false;
    }
    
    
  }


}
