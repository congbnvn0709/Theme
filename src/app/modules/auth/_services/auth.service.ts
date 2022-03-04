import {Inject, Injectable, Injector, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {catchError, finalize, map, switchMap} from 'rxjs/operators';
import {UserModel} from '../_models/user.model';
import {AuthModel} from '../_models/auth.model';
import {AuthHTTPService} from './auth-http';
import {Router} from '@angular/router';
import {ResponseModel} from '../_models/response.model';
import {CONFIG} from '../../../utils/constants';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = CONFIG.KEY.TOKEN;

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;


  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    @Inject(Injector) private readonly injector: Injector
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    // const subscr = this.getUserByToken().subscribe();
    // this.unsubscribe.push(subscr);
  }

  // public methods
  login(username: string, password: string): Observable<UserModel> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(username, password).pipe(
      map((response: ResponseModel) => {
        if (!response.status) {
          throw new Error(response.message);
        }

        const auth = response.data as AuthModel;
        return this.setAuthFromLocalStorage(auth);
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        this.toastService.error(err.message);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserModel> {
    const token = this.getAuthFromLocalStorage();
    if (!token) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(token).pipe(
      // map((user: UserModel) => {
      map((responseModel: ResponseModel) => {
        let user = null;

        if (responseModel.status) {
          user = responseModel.data as UserModel;
        }

        if (user) {
          this.currentUserSubject = new BehaviorSubject<UserModel>(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth token in local storage to keep user logged in between page refreshes
    if (auth && auth.token) {
      localStorage.setItem(this.authLocalStorageToken, auth.token);
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): string {
    try {
      return localStorage.getItem(this.authLocalStorageToken);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public get toastService() {
    return this.injector.get(ToastrService);
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
