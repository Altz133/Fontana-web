import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/user.type';
import { UserService } from '../../services/user.service';
import { RoleType } from '../../shared/enums/role-dto';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    allUsers: User[] = []; // For dropdown
    users: User[] = []; // For table display
    selectedUser: User | null = null;
    roles = [
        { id: 1, name: 'ADMIN' },
        { id: 2, name: 'OPERATOR' },
        { id: 3, name: 'VIEWER' }
    ];

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userService.getUsers().subscribe(users => {
            this.allUsers = users;
            this.users = users; // By default, show all users in the table
        });
    }

    updateUserRole(username: string, roleType: string): void {
        this.userService.updateUserRole(username, roleType as RoleType).subscribe(() => {
            this.loadUsers();
        });
    }

    onUserChange(selectedUsername: string) {
        if (selectedUsername) {
            this.selectedUser = this.allUsers.find(user => user.username === selectedUsername) ?? null;
            if (this.selectedUser) {
                this.users = [this.selectedUser];
            }
        } else {
            this.users = [...this.allUsers]; // Reset to show all users in the table
        }
    }
}
