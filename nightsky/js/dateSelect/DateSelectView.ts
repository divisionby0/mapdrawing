///<reference path="../../../common/lib/events/EventBus.ts"/>
import min = moment.min;
class DateSelectView{
    private j$:any;    
    
    private calendar:any;
    private hourInput:any;
    private minuteInput:any;
    
    constructor(j$:any){
        this.j$ = j$;
        this.createDatepicker();
    }
    
    private createDatepicker():void{
        var todayDate:any = new Date();
        var day:string = todayDate.getUTCDate().toString();
        var month:string = (parseInt(todayDate.getMonth())+1).toString();
        var year:string = todayDate.getFullYear().toString();

        var hour:string = todayDate.getHours().toString();
        var minute:string = todayDate.getMinutes().toString();

        if(day.length<2){
            day = "0"+day;
        }
        if(month.length<2){
            month = "0"+month;
        }

        console.log("hour:minute="+hour+":"+minute);

        if(hour.length<2){
            hour = "0"+hour;
        }
        if(minute.length<2){
            minute = "0"+minute;
        }

        this.j$("#datepicker").val(day+"-"+month+"-"+year);

        this.j$( "#datepicker" ).datepicker({
            dateFormat : "dd-mm-yy",
            monthNames : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
            dayNamesMin : ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
        });

        this.j$("#hourInput").val(hour);
        this.j$("#minuteInput").val(minute);

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

    private createUserDate():any{
        var userDate:string = this.j$("#datepicker").val();
        var userHours:string = this.j$("#hourInput").val();
        var userMinutes:string = this.j$("#minuteInput").val();

        var userSelectedDate:string = userDate+" "+userHours+":"+userMinutes;
        console.log(userSelectedDate);
        
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
        EventBus.dispatchEvent("ON_USER_DATE_CHANGED", newDate);
    }
}
