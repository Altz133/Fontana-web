import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { RoleType } from '../../shared/enums/role-dto';
import SpyObj = jasmine.SpyObj;
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field'; // corrected path
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; // corrected path

TestBed.configureTestingModule({
    declarations: [ UsersComponent ],
    imports: [
        HttpClientTestingModule,
        MatFormFieldModule
    ],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
    ]
});

describe('UsersComponent', () => {
    let component: UsersComponent;
    let fixture: ComponentFixture<UsersComponent>;
    let mockUserService: SpyObj<UserService>;

    beforeEach(() => {
        mockUserService = jasmine.createSpyObj('UserService', ['getUsers', 'updateUserRole']); // Name of the class and the methods to mock
        TestBed.configureTestingModule({
            declarations: [UsersComponent],
            providers: [
                { provide: UserService, useValue: mockUserService }
            ]
        });

        fixture = TestBed.createComponent(UsersComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load users on ngOnInit', () => {
        // Updated mock data to match User type
        const users = [
            { username: 'john', firstName: 'John', lastName: 'Doe', role: { id: 1, name: 'ADMIN' } },
            { username: 'jane', firstName: 'Jane', lastName: 'Doe', role: { id: 2, name: 'OPERATOR' } }
        ];

        mockUserService.getUsers.and.returnValue(of(users));

        fixture.detectChanges();

        expect(component.users.length).toBe(2);
        expect(component.users[0].username).toBe('john');
        expect(component.users[1].username).toBe('jane');
    });

    it('should update user role', () => {
        mockUserService.updateUserRole.and.returnValue(of(null));
        component.updateUserRole('john', 'OPERATOR');

        expect(mockUserService.updateUserRole).toHaveBeenCalledWith('john', RoleType.OPERATOR);
    });

    it('should filter users based on selection', () => {
        const users = [
            { username: 'john', firstName: 'John', lastName: 'Doe', role: { id: 1, name: 'ADMIN' } },
            { username: 'jane', firstName: 'Jane', lastName: 'Doe', role: { id: 2, name: 'OPERATOR' } }
        ];

        mockUserService.getUsers.and.returnValue(of(users));
        fixture.detectChanges(); // Trigger ngOnInit

        component.onUserChange('john');

        expect(component.users.length).toBe(1);
        expect(component.users[0].username).toBe('john');
    });
});
