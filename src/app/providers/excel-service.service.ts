import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';

//eclare var cordova: any;
// const fs:string = cordova.file.dataDirectory;
//const fs: string = cordova.file.externalDataDirectory;
import * as XLSX from 'ts-xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelServiceService {

  sheetNames: string[] = []
  sheets: any;
  constructor(private file: File) { }

  createXSLX(data:any): Promise<any> {

    return new Promise((resolve) => {
      let ws_name = "OrderDetails";

      let wb: XLSX.IWorkBook = {
        SheetNames: [],
        Sheets: {},
        Props: {}

      };
      let ws = this.sheet_from_array_of_arrays(data, {});

      /* add worksheet to workbook */
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;
      let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });


      let xslxBlob = new Blob([this.s2ab(wbout)],{type:"application/octet-stream"});
      resolve(xslxBlob);
    });
  }


  datenum(v, date1904): any {
    if (date1904) v += 1462;
    let epoch: any = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30)).getTime()) / (24 * 60 * 60 * 1000);
  }

  sheet_from_array_of_arrays(data, opts) {
    let ws = {};
    let range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    for (let R = 0; R != data.length; ++R) {
      for (let C = 0; C != data[R].length; ++C) {
        if (range.s.r > R) range.s.r = R;
        if (range.s.c > C) range.s.c = C;
        if (range.e.r < R) range.e.r = R;
        if (range.e.c < C) range.e.c = C;
        let cell: any = { v: data[R][C] };
        if (cell.v == null) continue;
        let cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

        if (typeof cell.v === 'number') cell.t = 'n';
        else if (typeof cell.v === 'boolean') cell.t = 'b';
        else if (cell.v instanceof Date) {
          cell.t = 'n';
          //cell.z = XLSX.SSF._table[14];
          cell.v = this.datenum(cell.v, null);
        }
        else cell.t = 's';

        ws[cell_ref] = cell;
      }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range.s, range.e);
    return ws;
  }

  s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
}
