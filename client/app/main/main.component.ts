import { Component } from '@angular/core';


function getWindow(): any {
  return window;
}

@Component({
  selector: 'app-root',
  templateUrl: './main.template.html'
})
export class MainComponent {
  manifestURI: string = '...';
  location: string = getWindow().location.origin;
  isSignedId: boolean = false;
  blockstack: any = null;
  name = 'World';
  userData: any;
  user = {};

  constructor() {
    this.blockstack = getWindow().blockstack;
    console.log('construct', this.blockstack);
    console.log('signed in??? ' + this.blockstack.isUserSignedIn())
    console.log('pending' + this.blockstack.isSignInPending())

    if (this.blockstack.isUserSignedIn()) {
      console.log('hey');
      this.isSignedId = true;

      this.userData = this.blockstack.loadUserData()
      console.log('user', this.userData)
      this.user = new this.blockstack.Person(this.userData.profile)
      this.user.username = this.userData.username
      console.log('user', this.userData)
    } else if (this.blockstack.isSignInPending()) {
      console.log('nope signing in')
      this.blockstack.handlePendingSignIn().then((userData) => {
        getWindow().location = getWindow().location.origin;
      })
    }
  }

  signIn() {
    console.log('signin in')
    this.blockstack.redirectToSignIn(this.location, this.manifestURI);
  }
}
