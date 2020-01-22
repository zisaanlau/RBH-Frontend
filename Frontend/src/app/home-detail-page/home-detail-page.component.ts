import { Component, OnInit } from '@angular/core';
import ApiClient from '../api-client';
import { StorageServiceService } from '../storage-service.service';
import { Router } from '@angular/router';
const HOME_STORAGE_KEY = 'local_homeId';
const STORAGE_KEY = 'local_userInfo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AddRoommateDialogComponent } from '../add-roommate-dialog/add-roommate-dialog.component';
import { RemoveRoommateDialogComponent } from '../remove-roommate-dialog/remove-roommate-dialog.component';

@Component({
    selector: 'app-home-detail-page',
    templateUrl: './home-detail-page.component.html',
    styleUrls: ['./home-detail-page.component.scss']
})
export class HomeDetailPageComponent implements OnInit {
    home;
    roommate_array;
    roommate_string = '';
    owner;
    isowner;
    user = this.StorageService.getLocalStorage(STORAGE_KEY).userInfo;
    constructor(
        private router: Router,
        private StorageService: StorageServiceService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<any>
    ) {}
    // user = this.StorageService.getLocalStorage(STORAGE_KEY).userInfo;
    // username = this.user.full_name;

    async ngOnInit() {
        this.home = this.StorageService.getHomeLocalStorage(HOME_STORAGE_KEY);
        this.owner = this.home.admin_name;
        this.isowner = this.owner == this.user.userName;
        console.info(this.home.roommates)
        this.convertRoommateString()
        console.info(this.roommate_array);
    }

    convertRoommateString = () =>{
        this.roommate_array = this.home.roommates.trim().split('  ');
        this.roommate_string = this.owner + '(Owner) ';
        for (let roommate in this.roommate_array) {
            if (this.roommate_array[roommate] != this.owner) {
                this.roommate_string = this.roommate_string + this.roommate_array[roommate];
            }
        }
    }

    handleBack = () => {
        this.router.navigateByUrl('/home');
    };

    addRoommate = () => {
        let thisDialogRef = this.dialog.open(AddRoommateDialogComponent, { data: { houseId: this.home.HouseId},disableClose: true });
        thisDialogRef.afterClosed().subscribe(async()=>{

        })
    };
    removeRoommate = () => {
        if (this.isowner) {
            let thisDialogRef = this.dialog.open(RemoveRoommateDialogComponent, {
                data: { roommates: this.roommate_array, isOwner: this.isowner, HouseId: this.home.HouseId }, 
                disableClose: true 
            });
            thisDialogRef.afterClosed().subscribe(async () =>{
                this.home = ApiClient.home.getHomeDetail(this.home.HouseId)
            })
        } else {
            alert('you are not the owner');
        }
    };
    removeMyself = async () => {
        await ApiClient.home.removeRoommate(this.user.userName, this.home.houseId);
    };

    redirectToBill = () => {
        this.router.navigateByUrl('/billoption');
    };
}