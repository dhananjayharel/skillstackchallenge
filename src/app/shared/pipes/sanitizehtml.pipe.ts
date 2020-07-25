import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'sanitizehtml'})
export class SanitizeHtmlPipe implements PipeTransform {
  transform(value: string, args: string[]): any {

    if (!value) return value;

    let size = '11';
    if (args[0]) {
        size = args[0];
    }
    return value.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}