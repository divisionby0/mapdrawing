///<reference path="LayerView.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
///<reference path="../layer/StarmapTemplateLayer.ts"/>
declare var canvasApp:Function;
declare var get_user_obs:Function;
declare var setConstellationColor:Function;
declare var setStarNameColor:Function;
declare var setBackgroundColor:Function;
declare var setContainer:Function;
class StarmapLayerView extends LayerView{
    private canvas:any;
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider){
        super(j$, layer, parentId, selfId,  templateSizeProvider);
    }

    protected create():void{
        super.create();
        
        if((this.layer as StarmapTemplateLayer).hasBackgroundColor()){
            var backgroundColor:string = (this.layer as StarmapTemplateLayer).getBackgroundColor();
            this.style+="background-color:"+backgroundColor+";";
        }
        
        this.layerContainer = this.j$("<div style='"+this.style+"'></div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
        
        this.canvas = this.j$("<canvas id='"+this.selfId+"' style='width: 100%; height: 100%;'></canvas>");
        //this.canvas = this.j$("<canvas id='planicanvas' style='width:700px; height: 700px;' width='700' height='700'></canvas>");

        this.canvas.appendTo(this.layerContainer);

        setContainer(this.selfId);        
        
        canvasApp();

        this.onResize();
        //this.j$('input[id="user_dsos"]').prop("checked", true).trigger("change");
        //get_user_obs();
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

        get_user_obs();

        /*
        this.canvas.attr("width", this.layerContainer.width());
        this.canvas.attr("height", this.layerContainer.width());

        this.canvas.width(this.layerContainer.width()+"px");
        this.canvas.height(this.layerContainer.width()+"px");
        */
    }
}
