///<reference path="./TextTemplateLayer.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
class DateTimeTemplateLayer extends TextTemplateLayer{
    private dateVisible:boolean = true;
    private timeVisible:boolean = true;
    
    private data:any;
    private monthNames:string[] = new Array("Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря");
    
    constructor(id:string, aspectRatio:number, type:string, text:string, color:string, fontSize:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean, textAlign:string, fontWeight:string){
        super(id, aspectRatio, type,  text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
        this.createListener();
    }

    protected createListener() {
        EventBus.addEventListener(EditorEvent.DATE_TIME_CHANGED, (data)=>this.onDateTimeChanged(data));
        EventBus.addEventListener(EditorEvent.DATE_VISIBILITY_CHANGED, (data)=>this.onDateVisibilityChanged(data));
        EventBus.addEventListener(EditorEvent.TIME_VISIBILITY_CHANGED, (data)=>this.onTimeVisibilityChanged(data));
    }

    private onDateTimeChanged(data:any):void {
        this.data = data;
        this.updateText();
    }

    private updateText():void{
        this.text = "";
        var day:string;
        var month:string;
        var hours:string;
        var minutes:string;
        
        if(!this.data){
            return;
        }

        if(this.dateVisible){
            if(this.data.day.toString().length < 2){
                day = "0"+this.data.day;
            }
            else{
                day = this.data.day;
            }
            month = this.parseMonthName(parseInt(this.data.month)-1);
            this.text+=day+" "+month+" "+this.data.year;
        }
        if(this.timeVisible){
            if(this.dateVisible){
                this.text+=",";
            }

            if(this.data.hours.toString().length < 2){
                hours = "0"+this.data.hours;
            }
            else{
                hours = this.data.hours;
            }
            if(this.data.minutes.toString().length < 2){
                minutes = "0"+this.data.minutes;
            }
            else{
                minutes = this.data.minutes;
            }
            this.text+= " "+hours+":"+minutes;
        }
    }

    private parseMonthName(monthNumber:number):string{
        return this.monthNames[monthNumber].toUpperCase();
    }

    private onDateVisibilityChanged(data:any):void {
        this.dateVisible = data.visible;
        this.updateText();
    }
    private onTimeVisibilityChanged(data:any):void {
        this.timeVisible = data.visible;
        this.updateText();
    }
}
