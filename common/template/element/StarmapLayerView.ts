///<reference path="LayerView.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
///<reference path="../layer/StarmapTemplateLayer.ts"/>
///<reference path="../../../nightsky/js/starmap/Starmap.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
declare var canvasApp:Function;
declare var get_user_obs:Function;
declare var setConstellationColor:Function;
declare var setStarNameColor:Function;
declare var setBackgroundColor:Function;
declare var setContainer:Function;
class StarmapLayerView extends LayerView{
    private canvas:any;
    private starmap:Starmap;
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider, coeff:number){
        super(j$, layer, parentId, selfId,  templateSizeProvider, coeff);
    }

    protected create():void{
        var backgroundColor:string = "";
        var starsColor:string = "";
        var constellationColor:string = "";
        
        if((this.layer as StarmapTemplateLayer).hasBackgroundColor()){
            backgroundColor = (this.layer as StarmapTemplateLayer).getBackgroundColor();
        }
        if((this.layer as StarmapTemplateLayer).hasStarsColor()){
            starsColor = (this.layer as StarmapTemplateLayer).getStarsColor();
        }
        if((this.layer as StarmapTemplateLayer).hasConstellationColor()){
            constellationColor = (this.layer as StarmapTemplateLayer).getConstellationColor();
        }
        
        this.layerContainer = this.j$("<div style='"+this.style+"'></div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
        
        this.canvas = this.j$("<canvas id='"+this.selfId+"' style='width: 100%; height: 100%;'></canvas>");
        this.canvas.appendTo(this.layerContainer);
        
        console.log("backgroundColor="+backgroundColor);
        this.starmap = new Starmap(this.j$, this.selfId, this.coeff);
        this.starmap.setBackgroundColor(backgroundColor);
        this.starmap.setStarColor(starsColor);
        this.starmap.setConstellationColor(constellationColor);
        this.starmap.create();

        this.onResize();

        EventBus.addEventListener("UPDATE_STARMAP", ()=>this.onUpdateStarmapRequest());
        
        this.j$("#user_conline").change((event)=>this.onConstLinesCheckboxChanged(event));

        super.create();
    }

    private onUpdateStarmapRequest():void{
        if(this.starmap){
            this.starmap.update();
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

        this.canvas.attr("width", this.layerContainer.width());
        this.canvas.attr("height", this.layerContainer.width());

        this.canvas.width(this.layerContainer.width()+"px");
        this.canvas.height(this.layerContainer.width()+"px");

        this.starmap.update();
        //get_user_obs();

        /*
        this.canvas.attr("width", this.layerContainer.width());
        this.canvas.attr("height", this.layerContainer.width());

        this.canvas.width(this.layerContainer.width()+"px");
        this.canvas.height(this.layerContainer.width()+"px");
        */
    }

    private onConstLinesCheckboxChanged(event:any):void {
        if(this.starmap){
            this.starmap.update();
        }
    }
}
