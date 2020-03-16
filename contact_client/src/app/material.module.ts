import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';


import { MatPaginatorModule } from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar'
@NgModule({
imports: [
MatToolbarModule,
MatCardModule,
MatButtonModule,
MatIconModule,
MatFormFieldModule,
MatInputModule,
MatTableModule,
MatTooltipModule,
MatDialogModule,
MatPaginatorModule,
MatExpansionModule,
MatProgressSpinnerModule,
MatSnackBarModule
],
exports: [
MatToolbarModule,
MatCardModule,
MatButtonModule,
MatIconModule,
MatFormFieldModule,
MatInputModule,
MatTableModule,
MatTooltipModule,
MatDialogModule,
MatPaginatorModule,
MatExpansionModule,
MatProgressSpinnerModule,
MatSnackBarModule
],
})
export class MaterialModule { }