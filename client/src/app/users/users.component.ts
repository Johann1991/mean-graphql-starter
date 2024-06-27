import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const GET_USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation createUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  name = '';
  email = '';

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo.watchQuery({ query: GET_USERS }).valueChanges.subscribe((result: any) => {
      this.users = result?.data?.users;
    });
  }

  createUser() {
    this.apollo.mutate({
      mutation: CREATE_USER,
      variables: { name: this.name, email: this.email },
      refetchQueries: [{ query: GET_USERS }]
    }).subscribe(() => {
      this.name = '';
      this.email = '';
    });
  }
}