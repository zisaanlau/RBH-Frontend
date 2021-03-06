import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StorageServiceService } from '../storage-service.service';
import { HomePageComponent } from './home-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogRef, MatProgressSpinnerModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import ApiClient from '../api-client';
import { of } from 'rxjs';
import { compileComponentFromRender2 } from '@angular/compiler/src/render3/view/compiler';
export class MdDialogMock {
    // When the component calls this.dialog.open(...) we'll return an object
    // with an afterClosed method that allows to subscribe to the dialog result observable.
    open() {
        return {
            afterClosed: () => of(),
            updatePosition: () => {}
        };
    }
}
let sampleStorage = {
    userInfo: {
        id: 111111,
        full_name: 'full_name',
        balance: 0,
        userName: 'username',
        hashedPassword: 'hashedPass',
        email: 'some@gmail.com'
    },
    token: 'some-token'
};

let sampleGetHome = [
    { id: 0, full_name: 'home0', admin_name: 'admin_name0', admin_id: 0, roommates: 'roommates0' },
    { id: 1, full_name: 'home1', admin_name: 'admin_name1', admin_id: 1, roommates: 'roommates1' }
];
let sampleInvitation = [
    { id: 0, userName: 'user0', houseName: 'home0', userId: 0, houseId: 0, created_at: new Date().getDate() },
    { id: 1, userName: 'user1', houseName: 'home1', userId: 1, houseId: 1, created_at: new Date().getDate() }
];
// const storageSpy = jasmine.createSpyObj('StorageServiceService', ['storeOnLocalStorage', 'getLocalStorage', 'storeHomeOnLocalStorage', 'getHomeLocalStorage']);

const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
describe('HomePageComponent', () => {
    let component: HomePageComponent;
    let fixture: ComponentFixture<HomePageComponent>;
    let fixture1: ComponentFixture<HomePageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomePageComponent],
            imports: [RouterTestingModule, MatProgressSpinnerModule],
            providers: [
                { provide: Router, useValue: routerSpy },
                StorageServiceService,
                { provide: MatDialog, useValue: MdDialogMock },
                { provide: MatDialogRef, useValue: {} }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;

        component.user = sampleStorage.userInfo;

        component.homes = sampleGetHome;
        component.loaded = true;

        fixture.detectChanges();
        spyOnProperty(ApiClient, 'home').and.returnValue({ getHome: () => Promise.resolve(sampleGetHome) });
    });
    describe('Basic Tests', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should show correct user info', () => {
            const greeting = fixture.debugElement.query(By.css('.home-page-user-info')).nativeElement;
            expect(greeting.textContent).toContain('username');
        });

        it('should create user Icon', () => {
            let userIcon = fixture.debugElement.queryAll(By.css('.home-page-user-icon'));
            expect(userIcon).toBeTruthy();
        });
    });
});
