## Infinite Scroll Grid

General purpose infinite scroll grid, which works with any dom structure like table, div, ul li etc...

### Some Key features
1. Keeps only visible rows in the DOM Tree. Hiddens elements are removed to make DOM tree light weight.
2. Allows to jump from any page to any page. No need to browse pages one by one.
3. Currently assumes all rows data are loaded in the array before hand, but can be tweaked little bit to support server side pagination. Therefore no need to load the array before hand. Making it possible to support large data range.
4. Its super fast, easy to integrate and it works well.

### Demo
view [demo](http://plnkr.co/edit/ngxVQLuATOef010r79I6?p=preview) on plnkr


### Usage
1. add app.infinite.scroll.component.ts, app.infinite.scroll.service.ts in your source code directory.
2. in your app.module.ts, 
	1. import InfiniteScrollingGrid, RowItemParentComponent  and declare them in component declarations.
	2. import InfiniteScrollService and declare it in the providers.
3. You need to supply below inputs to the infinite-scroll library
   1. define the fixed height dom element where the scroll will appear
   2. define the parent of each row element. this will be child of fixed height dom element.
   3. define the height of each row. Row should be of fixed height.
   4. define the template to render reach row.
   5. define the dataList. Array of data. Currently it assumes, you have all the rows loaded in the array. You can tweak the renderPageData method to implement server side pagination. In any case, you need to make sure dataList.length returns the total count of the items. this count determines the total height of the component which brings right scrollbar and allows user to jump to any page from any page.

### Sample code
HTML Changes.
```
	 <infinite-scroll-grid [gridDataSettings]="gridDataSettings" 
        (beforeRenderingRowsEvent)="onBeforeRenderingRow($event)"
        (afterRenderingRowsEvent)="onAfterRenderingRowsEvent($event)">
      <!-- defined row template in the ng-template -->
      <ng-template let-item="item" let-currentStartIndex="currentStartIndex" let-index="index">
      	<li class="width-100-per list-item" (click)="onRowClick(item)">
            <div>({{currentStartIndex+index}}) {{item.name}}, {{item.company}} </div>
            <div>{{item.email}} {{item.phone}}</div>
		</li>
      </ng-template>
      <!-- define outer html structure -->
      <div id="list-component">
          <ul id="list-body" class="list-body" row-item-parent>
          	<!-- ng-template will be rendered here by the infinite-scroll library -->
          </ul>
      </div>
    </infinite-scroll-grid>

```
1. in the exmample, element with id #list-component is a fixed height element.
2. "list-body" is the parent element, it's height will be calculated as rowHeight * number of items in the list.
3. You can use any kind of outer structure based on your needs.
4. let-* attributes in ng-template are set by the infinite-scroll component. 
	1. item is the array row item.
	2. currentStartIndex gives the current start range index
	3. currentStartIndex + index gives the index of the current row item
5. You can add more properties here and access them with let by passing them inside createEmbeddedView function in the infiniteScrollComponent class
6. #list-body element contains the [row-item-parent]. This is used by the scroll component to render all the rows.

```
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

```

7. gridDataSettings will have following properties
	1. fixedHeightParent dom element reference. its height should be fixed and scroll should be set as overflow.
	2. parentElem dom element reference. Its height will be calcuated dynamically
	3. rowSelector, CSS selector to get the row elements from the list
	4. rowHeight, specify height of a single row.
	5. list, contains the array of items to be rendered in the grid. 
8. element with directive [row-item-parent], its mostly same as parentElem.

9. After setting above properties, your scroll grid should load.

10. beforeRenderingRowsEvent, afterRenderingRowsEvent are events.


##### Feedback
You can provide feedback, then I can try to take a look. Send all possible details along with plnkr, jsfiddle or some online link.