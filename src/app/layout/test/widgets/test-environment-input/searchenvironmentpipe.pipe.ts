import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchenvironmentpipe'
})
export class SearchenvironmentpipePipe implements PipeTransform {

  transform(value: any, input: string): any {
    if (input) {
            input = input.toLowerCase();
            return value.filter(function (obj: any) {
                return obj.name.toLowerCase().indexOf(input) > -1;
            })
        }
        return value;;
  }

}
