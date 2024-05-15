import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ImageUploadService } from 'src/app/serevice/image-upload.service';
import { UserService } from 'src/app/serevice/user/user.service';
import { ActivatedRoute } from '@angular/router';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: number;
  state: string;
  country: string;
  addressType: string;
  homeAddress1?: string;
  homeAddress2?: string;
  companyAddress1?: string;
  companyAddress2?: string;
  subscribeToNewsletter: boolean;
  interests: string[];
  profileImage: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentId=1;
  submitted = false;
  userForm: FormGroup;
  user: User = {
    id: 1,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    age: null,
    state: '',
    country: '',
    addressType: '',
    subscribeToNewsletter: false,
    profileImage: '',
    interests: []
  };
  imagePath = '';
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private fileUploadService: ImageUploadService,
    private userSer: UserService,private activatedRouter: ActivatedRoute) {
      this.activatedRouter.params.subscribe((res: any) => {
            if (res.id) {
                this.currentId = res.id;
                this.userSer.get(this.currentId);
              }
      })

 }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      age: ['', [Validators.required, Validators.max(100)]],
      state: ['', Validators.required],
      country: ['', Validators.required],
      addressType: ['', Validators.required],
      homeAddress1: [''],
      homeAddress2: [''],
      companyAddress1: [''],
      companyAddress2: [''],
      interests: [''],
      subscribeToNewsletter: [''],
      image: [''] // <-- Add this line
    });
  }

  get firstName() {
    return this.userForm.get('firstName');
  }
  get lastName() {
    return this.userForm.get('lastName');
  }
  get email() {
    return this.userForm.get('email');
  }
  get phoneNumber() {
    return this.userForm.get('phoneNumber');
  }
  get age() {
    return this.userForm.get('age');
  }
  get state() {
    return this.userForm.get('state');
  }
  get country() {
    return this.userForm.get('country');
  }
  get addressType() {
    return this.userForm.get('addressType');
  }
  get homeAddress1() {
    return this.userForm.get('homeAddress1');
  }
  get homeAddress2() {
    return this.userForm.get('homeAddress2');
  }
  get companyAddress1() {
    return this.userForm.get('companyAddress1');
  }
  get companyAddress2() {
    return this.userForm.get('companyAddress2');
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userForm.patchValue({
        image: file
      });
      this.uploadImage();
    }
  }

  uploadImage() {
    const formData = new FormData();
    formData.append('image', this.userForm.get('image').value);

    this.fileUploadService.uploadImage(this.userForm.get('image').value).subscribe(
      (response) => {
        console.log('Image uploaded successfully', response);
        this.imagePath = response.imagePath;
      },
      (error) => {
        console.error('Error uploading image', error);
      }
    );
  }

  addInterest(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value.trim();
    if (value !== '' && this.user.interests.indexOf(value) === -1) {
      this.user.interests.push(value);
      this.userForm.get('interests').setValue('');
    }
  }

  removeInterest(index: number) {
    this.user.interests.splice(index, 1);
  }

  saveUser(): void {
    const postdata ={...this.userForm.value};

 this.userSer.create(postdata).subscribe(
      (response) => {
        if (response) {
          alert('Registration successful');
          this.submitted = true;
        } else {
          alert('Registration failed');
        }
      },
      (error) => {
        console.log(error);
        alert('Registration failed');
      }
    );
 }


}
