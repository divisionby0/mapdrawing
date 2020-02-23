///<reference path="DateSelectView.ts"/>
///<reference path="DateSelectModel.ts"/>
///<reference path="DateSelectController.ts"/>
class DateTimeSelector{
    private j$:any;
    private controller:DateSelectController;
    
    constructor(j$:any){
        this.j$ = j$;
        
        var dateSelectView = new DateSelectView(this.j$);
        var dateSelectModel = new DateSelectModel(dateSelectView);
        this.controller = new DateSelectController(dateSelectModel);
        
        this.createListener();
    }

    private createListener():void {
        EventBus.addEventListener(EditorEvent.DATE_TIME_CHANGED, (newDate)=>this.onDateTimeChanged(newDate));
    }

    private onDateTimeChanged(newDate:any):void {
        var userDate = new Date();
        userDate.setFullYear(newDate.year);
        userDate.setMonth(newDate.month);
        userDate.setDate(newDate.day);
        userDate.setHours(newDate.hours);
        userDate.setMinutes(newDate.minutes);
        
        this.controller.setDateTime(userDate.toString());
    }
}
