///<reference path="ImageLayerView.ts"/>
///<reference path="../../lib/Utils.ts"/>
///<reference path="../layer/BlobImageTemplateLayer.ts"/>
class BlobImageLayerView extends ImageLayerView{
    protected create():void{
        super.create();
        
        var url:string = (this.layer as BlobImageTemplateLayer).getUrl();

        this.style+='background-image:url("'+url+'"); background-size:cover;';

        var border:string = (this.layer as BlobImageTemplateLayer).getBorder();
        border = Utils.updateBorderString(border, this.coeff);

        this.style+="; border:"+border+";";
        
        this.layerContainer = this.j$("<div style='"+this.style+"'></div>");

        this.layerContainer.appendTo(this.j$("#"+this.parentId));
    }
}
