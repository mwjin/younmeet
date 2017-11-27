import { Injectable } from '@angular/core';
import { Besttime } from '../models/besttime';
import { Partialattendinfo } from '../models/partialattendinfo';
import { Http } from '@angular/http';

@Injectable()
export class BesttimeService {

  constructor(private http: Http) { }

}
