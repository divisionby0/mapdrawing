///<reference path="../TemplateLayer.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../../editor/EditorEvent.ts"/>
///<reference path="StarmapLayerView.ts"/>
class StarmapLayerModel extends TemplateLayer{
    private starsColor:string;
    private backgroundColor:string;
    private constellationColor:string;
    private borderColor:string;
    private borderWeight:number;
    private borderVisible:boolean = true;
    private hasColoredStars:boolean = false;
    private hasConstellations:boolean = true;

    private cachedBorderColor:string;
    private cachedConstellationColor:string;

    private currentCoord:any;
    private currentCity:string;
    private currentDate:string;

    constructor(id:string, aspectRatio:number, type:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean = false, color:string = "0", backgroundColor:string, constellationColor:string, borderColor:string, borderWeight:number){
        super(id, aspectRatio, type, left, top, right, bottom, changeable);
        this.starsColor = color;
        this.backgroundColor = backgroundColor;
        this.constellationColor = constellationColor;
        this.borderColor = borderColor;
        this.borderWeight = borderWeight;
        
        this.cachedBorderColor = borderColor;
        this.cachedConstellationColor = constellationColor;
    }

    public setView(view:LayerView):void{
        super.setView(view);
        
        if(this.currentDate){
            (this.view as StarmapLayerView).setDate(this.currentDate);
            (this.view as StarmapLayerView).setHasConstellations(this.hasConstellations);
            (this.view as StarmapLayerView).setHasColoredStars(this.hasColoredStars);
            (this.view as StarmapLayerView).setHasCircleBorder(this.borderVisible);
            (this.view as StarmapLayerView).setCoord(this.currentCoord);
        }
    }
    
    public onDateTimeChanged(date:any):void {
        var userDate = new Date();
        userDate.setFullYear(date.year);
        userDate.setMonth(date.month);
        userDate.setDate(date.day);
        userDate.setHours(date.hours);
        userDate.setMinutes(date.minutes);

        this.currentDate = userDate.toString();
        if(this.view){
            (this.view as StarmapLayerView).setDate(this.currentDate);
        }
    }

    public onCityChanged(data:any):void {
        console.log("onCityChanged data=",data);
        this.currentCity = data.city;
        this.currentCoord = data.coord;

        try{
            (this.view as StarmapLayerView).setCoord(data.coord);
        }
        catch(error){
        }
    }
    
    
    public hasBackgroundColor():boolean{
        if(this.backgroundColor!=null && this.backgroundColor!=undefined && this.backgroundColor!=""){
            return true;
        }
        else{
            return false;
        }
    }
    public hasConstellationColor():boolean{
        if(this.constellationColor!=null && this.constellationColor!=undefined && this.constellationColor!=""){
            return true;
        }
        else{
            return false;
        }
    }
    
    public hasStarsColor():boolean{
        if(this.starsColor!=null && this.starsColor!=undefined && this.starsColor!=""){
            return true;
        }
        else{
            return false;
        }
    }
    
    public getBackgroundColor():string{
        return this.backgroundColor;
    }

    public getStarsColor():string{
        return this.starsColor;
    }
    public getConstellationColor():string{
        return this.constellationColor;
    }
    
    public getBorderColor():string{
        return this.borderColor;
    }
    public getBorderWeight():number{
        return this.borderWeight;
    }
    
    public hasBorder():boolean{
        return this.borderVisible;
    }
    
    public setBorderVisible(visible:boolean):void{
        this.borderVisible = visible;

        if(visible){
            this.borderColor = this.cachedBorderColor
        }
        else{
            this.borderColor = "rgba(0,0,0,0)";
        }
    }

    public setConstellationVisible(visible:boolean):void{
        if(visible){
            this.constellationColor = this.cachedConstellationColor
        }
        else{
            this.constellationColor = "rgba(0,0,0,0)";
        }
    }

    public getHasMulticoloredStars():boolean{
        return this.hasColoredStars;
    }
    public setStarsMulticolored(isMulticolored:boolean):void{
        this.hasColoredStars = isMulticolored;
    }
    public setHasConstellations(value:boolean):void {
        this.hasConstellations = value;
        try{
            (this.view as StarmapLayerView).setHasConstellations(this.hasConstellations);
        }
        catch(error){
        }
    }

    public setHasColoredStars(value:boolean):void {
        this.hasColoredStars = value;
        
        try{
            (this.view as StarmapLayerView).setHasColoredStars(this.hasColoredStars);
        }
        catch(error){
        }
    }

    public hasCircleBorder(value:boolean):void {
        this.borderVisible = value;
        try{
            (this.view as StarmapLayerView).setHasCircleBorder(this.borderVisible);
        }
        catch(error){
        }
    }
}
