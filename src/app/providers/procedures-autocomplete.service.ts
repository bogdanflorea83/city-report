import {Injectable} from '@angular/core';

import {AutoCompleteService} from 'ionic4-auto-complete';
import { AssetsService } from './assets.service';

@Injectable()
export class ProceduresAutocompleteService implements AutoCompleteService {
  formValueAttribute = '';

  constructor(private assertService: AssetsService) {
  
  }

  getResults(keyword:string) {
     if (!keyword) { return false; }

     return this.assertService.procedures.filter(
        (item) => {
           return (item.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
        }
     );
  }
}