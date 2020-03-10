///<reference path="ImageLayerView.ts"/>
///<reference path="../../lib/Utils.ts"/>
///<reference path="../layer/BlobImageTemplateLayer.ts"/>
class BlobImageLayerView extends ImageLayerView{
    private printWidth:number = 2481;
    private printHeight:number = 3509;

    protected create():void{
        
        var url:string = (this.layer as BlobImageTemplateLayer).getUrl();

        this.style+='left:'+this.layer.getLeft()+'; right:'+this.layer.getRight()+'; top:'+this.layer.getTop()+'; bottom:'+this.layer.getBottom()+';';

        //var imageWidth:number = this.printWidth - this.printWidth/100*parseFloat(this.layer.getLeft()) - this.printWidth/100*parseFloat(this.layer.getRight());
        //var imageHeight:number = this.printHeight - this.printHeight/100*parseFloat(this.layer.getTop()) - this.printHeight/100*parseFloat(this.layer.getBottom());

        var border:string = (this.layer as BlobImageTemplateLayer).getBorder();
        border = Utils.updateBorderString(border, this.coeff);

        this.style+="; border:"+border+";";

        var img:any = this.j$("<img src='"+url+"' style='width:100%; height:100%'>");

        this.layerContainer = this.j$("<div style='"+this.style+"'></div>");

        this.layerContainer.append(img);

        this.layerContainer.appendTo(this.j$("#"+this.parentId));
    }
}
