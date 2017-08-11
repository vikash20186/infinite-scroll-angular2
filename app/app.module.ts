import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here
import { HttpModule }    from '@angular/http';
import { AppComponent }  from './app.component';
import {InfiniteScrollingGrid, RowItemParentComponent} from './app.infinite.scroll.component.ts';
import {InfiniteScrollService} from './app.infinite.scroll.service.ts';
import {DataService} from './app.data.service.ts';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers : [InfiniteScrollService, DataService],
  declarations: [
    AppComponent, InfiniteScrollingGrid, RowItemParentComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }