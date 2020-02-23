///<reference path="DateSelectView.ts"/>
class DateSelectModel{
    private view:DateSelectView;

    private currentDate:any;

    constructor(view:DateSelectView){
        this.view = view;
        this.currentDate = this.createCurrentDate();
        this.view.setDate(this.currentDate);
    }

    public setCurrentDate():void{
        var todayDate:any = new Date();
        this.currentDate = this.parseDate(todayDate);
        this.view.setDate(this.currentDate);
    }

    private createCurrentDate():any {
        var todayDate:any = new Date();
        todayDate.setHours(12);
        todayDate.setMinutes(0);

        return this.parseDate(todayDate);
    }
    
    private parseDate(date:any):any{
        var day:string = date.getUTCDate().toString();
        var month:string = (parseInt(date.getMonth())+1).toString();
        var year:string = date.getFullYear().toString();

        var hour:string = date.getHours().toString();
        var minute:string = date.getMinutes().toString();

        if(day.length<2){
            day = "0"+day;
        }
        if(month.length<2){
            month = "0"+month;
        }

        if(hour.length<2){
            hour = "0"+hour;
        }
        if(minute.length<2){
            minute = "0"+minute;
        }

        return {day:day, month:month, year:year, hour:hour, minute:minute};
    }
}
