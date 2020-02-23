///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../EditorEvent.ts"/>
class DateSelectView{
    private j$:any;    
    
    private calendar:any;
    private hourInput:any;
    private minuteInput:any;
    
    constructor(j$:any){
        this.j$ = j$;
        this.j$("#currentTimeButton").click(()=>this.onCurrentTimeButtonClicked());
    }
    
    public setDate(data:any):void{
        this.createDatepicker(data);
    }
    
    private createDatepicker(currentDate:any):void{

        this.j$("#datepicker").val(currentDate.day+"-"+currentDate.month+"-"+currentDate.year);

        this.j$( "#datepicker" ).datepicker({
            dateFormat : "dd-mm-yy",
            monthNames : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
            dayNamesMin : ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
        });

        this.j$("#hourInput").val(currentDate.hour);
        this.j$("#minuteInput").val(currentDate.minute);

        this.j$("#datepicker").change(()=>this.onDateChanged());
        this.j$("#hourInput").change(()=>this.onHourChanged());
        this.j$("#minuteInput").change(()=>this.onMinuteChanged());

        var userDate:string = this.createUserDate();
        this.onUserDateChanged(userDate);
    }

    private onDateChanged():void {
        var userDate:string = this.createUserDate();
        this.onUserDateChanged(userDate);
    }

    private onHourChanged():void {
        var userDate:string = this.createUserDate();
        this.onUserDateChanged(userDate);
    }

    private onMinuteChanged() {
        var userDate:string = this.createUserDate();
        this.onUserDateChanged(userDate);
    }

    private onCurrentTimeButtonClicked():void {
        EventBus.dispatchEvent(EditorEvent.SET_CURRENT_DATE_TIME, null);
    }

    private createUserDate():any{
        var userDate:string = this.j$("#datepicker").val();
        var userHours:string = this.j$("#hourInput").val();
        var userMinutes:string = this.j$("#minuteInput").val();

        var userSelectedDate:string = userDate+" "+userHours+":"+userMinutes;
        
        var day;
        var month;
        var year;
        
        var jsDate:any = this.j$('#datepicker').datepicker('getDate');
        if (jsDate !== null) { // if any date selected in datepicker
            jsDate instanceof Date; // -> true
            day = jsDate.getDate();
            month = parseInt(jsDate.getMonth())+1;
            year = jsDate.getFullYear();
        }

        return {day:day, month:month, year:year, hours:userHours, minutes:userMinutes};
    }
    
    private onUserDateChanged(newDate:string):void{
        EventBus.dispatchEvent(EditorEvent.DATE_TIME_CHANGED, newDate);
    }
}
