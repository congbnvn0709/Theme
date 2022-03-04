import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseModel} from '../_models/response.model';
import {CONFIG} from '../../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  initHeader: {};

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(CONFIG.KEY.TOKEN);
    const language = localStorage.getItem(CONFIG.KEY.LOCALIZATION);
    this.initHeader = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      language
    };
  }

  // public methods
  post(url: string, data: {}, headers: {}): Observable<ResponseModel> {
    headers = {
      ...headers,
      ...this.initHeader
    };

    return this.http.post<ResponseModel>(url, data, { headers: new HttpHeaders(headers) });
  }

  get(url: string, params: {}, headers: {}): Observable<ResponseModel> {
    headers = {
      ...headers,
      ...this.initHeader
    };

    return this.http.get<ResponseModel>(url, {
      headers: new HttpHeaders(headers),
      params
    });
  }
}
