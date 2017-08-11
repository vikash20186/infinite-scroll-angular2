import {Component, OnInit, ElementRef} from '@angular/core';

import {DataService} from './app.data.service.ts';


@Component({
  selector: 'my-app',
  template: `
    <infinite-scroll-grid [gridDataSettings]="gridDataSettings" 
        (beforeRenderingRowsEvent)="onBeforeRenderingRow($event)"
        (afterRenderingRowsEvent)="onAfterRenderingRowsEvent($event)">
      <ng-template let-item="item" let-currentStartIndex="currentStartIndex" let-index="index">
          <li class="width-100-per list-item" (click)="onRowClick(item)">
            <div>({{currentStartIndex+index}}) {{item.name}}, {{item.company}} </div>
            <div>{{item.email}} {{item.phone}}</div>
					</li>
      </ng-template>
      <div id="list-component">
          <ul id="list-body" class="list-body" row-item-parent></ul>
      </div>
    </infinite-scroll-grid>
    `
})
export class AppComponent implements OnInit {
  
  
  gridDataSettings = {};
  
  constructor(private dataService:DataService, private elementElemRef:ElementRef) { 
    dataService.getData().then(data => {
      this.gridDataSettings = Object.assign({list : data} , this.gridDataSettings);
    });
  }
  
  ngOnInit(){
    var domElement = this.elementElemRef.nativeElement;
    
    Object.assign(this.gridDataSettings, {
      fixedHeightParent  : domElement.querySelector("#list-component"),
      rowHeight : 50,
      parentElem : domElement.querySelector("#list-body"),
      rowSelector : ".list-item",
    });

  }
  
  onBeforeRenderingRow(obj){
    console.log("new rows are about to be rendered");
  }
  
  onAfterRenderingRowsEvent(obj){
    console.log("new rows are rendered");
  }
  
  onRowClick(obj){
    console.log("onRowClick");
    obj.phone = Math.random();
  }
  
}