import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/datasource/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  private fb: FormBuilder = new FormBuilder();

  constructor(private authService: AuthService, private router: Router, private loadingController: LoadingController) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async login(form: any) {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(form.value).subscribe(
      async _ => {
        await loading.dismiss();
        this.router.navigateByUrl('/members');
      },
      async (res) => {        
        await loading.dismiss();
      }
    )
  }

}
