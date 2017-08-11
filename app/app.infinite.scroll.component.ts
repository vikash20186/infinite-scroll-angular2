import { Component, Input, Output, EventEmitter,
          ViewContainerRef, ElementRef, 
          ChangeDetectionStrategy, TemplateRef,
          ContentChild, Directive} from '@angular/core';

import {InfiniteScrollService} from './app.infinite.scroll.service.ts';


@Directive({
  selector: '[row-item-parent]',
})
export class RowItemParentComponent{
  constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
  selector: 'infinite-scroll-grid',
  template : `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteScrollingGrid{
  
  
  private _gridDataSettings:Object;
  private viewCacheMap = {};
  
  @ContentChild(RowItemParentComponent)
  public rowItemParentInstance: RowItemParentComponent;

  @ContentChild(TemplateRef)
  template: TemplateRef<Object>;
  
  constructor(private infiniteScrollService: InfiniteScrollService, 
              private element: ElementRef, 
              private viewContainer: ViewContainerRef) {
    this.infiniteScrollServiceInstance = infiniteScrollService.getInfiniteScrollServiceObject()
  }
  
  
  @Output() beforeRenderingRowsEvent: EventEmitter<any> = new EventEmitter();
  @Output() afterRenderingRowsEvent: EventEmitter<any> = new EventEmitter();
  
  @Input()
  set gridDataSettings(val:Object) {
    this._gridDataSettings = val;
    if (this._gridDataSettings && this._gridDataSettings.list){
      this.init();
    }
  }
  
  private renderCurrentRows(currentRange){
    var arr = this._gridDataSettings.list.slice(currentRange.startCount, currentRange.endCount);
    var fragment = document.createDocumentFragment();
    var rowHeight = 50;
    var currentStartIndex = currentRange.startCount;
    arr.forEach((item, index) => {
      
      /*
      if you want to use cache then check the object in the map before creating it.
      this is used when you want to use detach instead of destroy in destroyViews method
      */
      var embeddedView = this.viewCacheMap[currentStartIndex+index];
      if (!embeddedView){
        var embeddedView = this.template.createEmbeddedView({
          item : item,
          currentStartIndex : currentRange.startCount,
          index : index,
          rowHeight : rowHeight
        });
      } else {
        console.log("resusing the view", currentStartIndex+index);
      }
        
      this.viewCacheMap[currentStartIndex+index] = embeddedView;
      
      this.rowItemParentInstance.viewContainerRef.insert(embeddedView);
      
      for(let viewNode of embeddedView.rootNodes) {
        if (viewNode.nodeName === "LI"){
          viewNode.style.top = (currentStartIndex+index)*rowHeight + 'px';
          viewNode.style.position = "absolute";
          viewNode.setAttribute("data-indexNumber" , currentStartIndex+index);
        }
        fragment.appendChild(viewNode);
      }
    })
    var nativeElem  = this.rowItemParentInstance.viewContainerRef.element.nativeElement;
    if (currentRange.appendChild){
      nativeElem.appendChild(fragment);
    } else {
      nativeElem.insertBefore(fragment, nativeElem.querySelector(this._gridDataSettings.rowSelector));
    }
  }
  
  private destroyViews(dataIndexNumbers){
    dataIndexNumbers.forEach(indexNumber => {
      //use detach to keep rows in cache and avoid recreating them again and again.
      //this.viewCacheMap[indexNumber].detach();
      if (this.viewCacheMap[indexNumber]){
        this.viewCacheMap[indexNumber].destroy();
        this.viewCacheMap[indexNumber] = undefined;
      } else {
        console.log("viewCacheMap doesnt have child");
      }
      
    });
  }

  
  private init(){
    
    if (this.infiniteScrollServiceInstance){
      this.infiniteScrollServiceInstance.destroyGrid();
    }
      
    this.infiniteScrollServiceInstance.initializeGrid({
    		fixedHeightContainerElem : this._gridDataSettings.fixedHeightParent,
    		parentElem : this._gridDataSettings.parentElem,
    		rowSelector : this._gridDataSettings.rowSelector,
    		rowHeight : this._gridDataSettings.rowHeight,
    		rowParentElem : this.rowItemParentInstance.viewContainerRef.element.nativeElement,
    		dataList : this._gridDataSettings.list,
    		afterGridRenderCallback : (obj => {
    		  this.afterRenderingRowsEvent.emit(obj);
    		}),
    		renderRowsCallback : (obj => {
    		    this.beforeRenderingRowsEvent.emit(obj);
    		    this.renderCurrentRows(obj);
    		}),
    		removeRowsCallback : (dataIndexNumbers => {
    		  this.destroyViews(dataIndexNumbers);
    		})
    });
  }
}