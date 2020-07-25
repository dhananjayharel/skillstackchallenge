import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanitizeHtmlPipe } from './sanitizehtml.pipe';
import { SafePipe } from './safeurl.pipe';
@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [SanitizeHtmlPipe, SafePipe],
    exports: [SanitizeHtmlPipe, SafePipe]
})
export class SharedPipesModule { }
