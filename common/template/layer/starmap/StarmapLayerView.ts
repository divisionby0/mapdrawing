///<reference path="../../element/LayerView.ts"/>
///<reference path="../DivTemplateLayer.ts"/>
///<reference path="./StarmapLayerModel.ts"/>
///<reference path="../../../../nightsky/js/starmap/Starmap.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
//declare var canvasApp:Function;
class StarmapLayerView extends LayerView{
    private canvas:any;
    private starmap:Starmap;

    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider, coeff:number){
        super(j$, layer, parentId, selfId,  templateSizeProvider, coeff);
    }

    public setHasConstellations(value:boolean):void{
        this.starmap.setHasConstellations(value);
    }
    public setHasColoredStars(value:boolean):void{
        this.starmap.setHasColoredStars(value);
    }
    public setHasCircleBorder(value:boolean):void{
        this.starmap.setHasBorder(value);
    }

    public setDate(date:string):void{
        this.j$("#user_date").val(date);
        this.starmap.setDate(date);
    }
    
    public setCoord(data:any):void{
        console.log("setCoorinates data=",data);
        this.starmap.setCoord(data);
    }
    
    protected onDestroy() {
        if(this.starmap){
            this.starmap.destroy();
            this.starmap = null;
        }
    }
    
    protected create():void{
        var backgroundColor:string = "";
        var starsColor:string = "";
        var constellationColor:string = "";
        var hasMulticoloredStars:boolean = false;
        var hasBorder:boolean = (this.layer as StarmapLayerModel).hasBorder();
        
        if((this.layer as StarmapLayerModel).hasBackgroundColor()){
            backgroundColor = (this.layer as StarmapLayerModel).getBackgroundColor();
        }
        if((this.layer as StarmapLayerModel).hasStarsColor()){
            starsColor = (this.layer as StarmapLayerModel).getStarsColor();
        }
        if((this.layer as StarmapLayerModel).hasConstellationColor()){
            constellationColor = (this.layer as StarmapLayerModel).getConstellationColor();
        }

        hasMulticoloredStars = (this.layer as StarmapLayerModel).getHasMulticoloredStars();
        
        this.layerContainer = this.j$("<div style='"+this.style+"'></div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
        
        this.canvas = this.j$("<canvas id='"+this.selfId+"' style='position:absolute; width: 100%; height: 100%;'></canvas>");
        this.canvas.appendTo(this.layerContainer);
        
        this.starmap = new Starmap(this.j$, this.selfId, this.coeff, {
            backgroundColor:backgroundColor,
            starColor:starsColor,
            constellationColor:constellationColor,
            hasConstellations:true,
            hasColoredStars:false,
            hasBorder:hasBorder,
            borderColor:(this.layer as StarmapLayerModel).getBorderColor(),
            borderWeight:(this.layer as StarmapLayerModel).getBorderWeight()
        });

        this.onResize();

        super.create();
    }

    private onUpdateStarmapRequest():void{
        if(this.starmap){
            this.starmap.refresh();
        }
    }

    protected onResize():void{
        super.onResize();

        this.layerContainer.height(this.layerContainer.width());

        var left:any = this.layerContainer.width()/100 * parseInt(this.layer.getLeft());
        var right:any = this.layerContainer.width()/100 * parseInt(this.layer.getRight());

        if(this.layer.hasTop()){
            var top:any = this.currentHeight / 100 * parseInt(this.layer.getTop());
        }

        this.layerContainer.css({"top":top});
        this.layerContainer.css({"left":left});
        this.layerContainer.css({"right":right});

        var newWidth:number = this.layerContainer.width();
        
        this.canvas.attr("width", newWidth);
        this.canvas.attr("height", newWidth);

        this.canvas.width(newWidth+"px");
        this.canvas.height(newWidth+"px");

        this.starmap.resize(newWidth, newWidth);
        
        this.starmap.refresh();
    }
}
