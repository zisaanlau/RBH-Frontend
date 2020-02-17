import { Component, OnInit } from '@angular/core';
import ApiClient from '../api-client';
import { StorageServiceService } from '../storage-service.service';
import { Router } from '@angular/router';
const HOME_STORAGE_KEY = 'local_homeId';
const STORAGE_KEY = 'local_userInfo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AddRoommateDialogComponent } from '../add-roommate-dialog/add-roommate-dialog.component';
import { RemoveRoommateDialogComponent } from '../remove-roommate-dialog/remove-roommate-dialog.component';
import { RecurrentBillDialogComponent } from '../recurrent-bill-dialog/recurrent-bill-dialog.component'

@Component({
    selector: 'app-home-detail-page',
    templateUrl: './home-detail-page.component.html',
    styleUrls: ['./home-detail-page.component.scss']
})
export class HomeDetailPageComponent implements OnInit {
    homeId;
    home;
    roommate_array;
    roommate_string = '';
    owner;
    isowner;
    billArray: IBill[];
    recurrentbillArray: IBillRecurrent[];
    date = new Date()
    user = this.StorageService.getLocalStorage(STORAGE_KEY).userInfo;
    constructor(
        private router: Router,
        private StorageService: StorageServiceService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<any>
    ) { }

    async ngOnInit() {
        this.home = this.StorageService.getHomeLocalStorage(HOME_STORAGE_KEY);
        this.owner = this.home.admin_name;
        this.isowner = this.owner == this.user.userName;
        this.homeId = this.StorageService.getHomeLocalStorage(HOME_STORAGE_KEY).HouseId;
        this.convertRoommateString();
        this.billArray = await ApiClient.bill.getBillByHome(this.homeId);
        this.recurrentbillArray = await ApiClient.bill.getRecurrentBill(this.homeId)
        if (this.recurrentbillArray.length > 0) {
            this.recurrentbillArray.forEach(element => {
                console.info(element)
                if (this.date.getTime() >= new Date(element.isRecurentdatetime).getTime() && element.ownerId == this.user.id) {
                    let thisDialogRef = this.dialog.open(RecurrentBillDialogComponent, { data: { billName: element.full_name, interval: this.convertRecurrentBillInterval(element.recurrentInterval), rm: element.userName, ratio: element.ratio, element: element, user: this.user, home: this.home }, disableClose: true });
                    thisDialogRef.updatePosition({ top: '1%', right: '1%' });
                    thisDialogRef.afterClosed().subscribe(async (result) => {
                    })
                }
            });
        }

        console.log(this.recurrentbillArray)
        console.log(this.billArray);
    }

    convertRecurrentBillInterval = (num) => {
        switch (num) {
            case 30:
                return "Month"
            case 7:
                return "Week"
            case 90:
                return "Quarter of Year"
            case 180:
                return "Half of Year"
            default:
                ""
        }
    }



    convertRoommateString = () => {
        this.roommate_array = this.home.roommates.trim().split('  ');
        this.roommate_string = this.owner + '(Owner) ';
        for (let roommate in this.roommate_array) {
            if (this.roommate_array[roommate] != this.owner) {
                this.roommate_string = this.roommate_string + ' ' + this.roommate_array[roommate];
            }
        }
    };

    handleBack = () => {
        this.router.navigateByUrl('/home');
    };

    addRoommate = () => {
        let thisDialogRef = this.dialog.open(AddRoommateDialogComponent, { data: { houseId: this.home.HouseId }, disableClose: true });
    };
    removeRoommate = () => {
        if (this.isowner) {
            let thisDialogRef = this.dialog.open(RemoveRoommateDialogComponent, {
                data: { roommates: this.roommate_array, isOwner: this.isowner, HouseId: this.home.HouseId },
                disableClose: true
            });
            thisDialogRef.afterClosed().subscribe(async () => {
                let homes = await ApiClient.home.getHome(this.user.id);
                homes.forEach((element) => {
                    if (element.id == this.home.id) {
                        this.home = element;
                    }
                });
                this.StorageService.storeHomeOnLocalStorage(this.home);
                this.convertRoommateString();
            });
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

    redirectToDetail = (billId: numId) => {
        // console.info(billId);
        this.router.navigateByUrl(`/billdetail/${billId}`);
    };

    deleteBill = (billId) => {
        console.info(billId)
        let index;
        for (let bill of this.billArray) {
            if (bill.id == billId) {
                index = this.billArray.indexOf(bill);
                if (index !== -1) {
                    this.billArray.splice(index, 1);
                }
            }
        }
        ApiClient.bill.deleteBill(billId)
    }

    deleteRoommate(msg: string) {
        const index: number = this.roommate_array.indexOf(msg);
        if (index !== -1) {
            this.roommate_array.splice(index, 1);
        }
    }
    redirectToPaymentHistory = () => {
        this.router.navigateByUrl('/paymenthistory');
    };
}
