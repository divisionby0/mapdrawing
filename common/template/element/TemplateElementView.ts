///<reference path="../Template.ts"/>
///<reference path="../layer/LayerType.ts"/>
///<reference path="../layer/TextTemplateLayer.ts"/>
///<reference path="DivLayerView.ts"/>
///<reference path="TextLayerView.ts"/>
///<reference path="BorderCircleLayerView.ts"/>
///<reference path="../layer/starmap/StarmapLayerView.ts"/>
///<reference path="ImageLayerView.ts"/>
///<reference path="ITemplateSizeProvider.ts"/>
///<reference path="CityLayerView.ts"/>
///<reference path="CoordinatesLayerView.ts"/>
///<reference path="DateTimeLayerView.ts"/>
///<reference path="../layer/geographicMap/MapLayerView.ts"/>
///<reference path="../layer/geographicMap/MapLayerModel.ts"/>
///<reference path="CountryLayerView.ts"/>
///<reference path="BlobImageLayerView.ts"/>
///<reference path="LabelsContainerLayerView.ts"/>
///<reference path="MapCityLayerView.ts"/>
///<reference path="MapCountryLayerView.ts"/>
///<reference path="MapCoordinatesLayerView.ts"/>
class TemplateElementView implements ITemplateSizeProvider{
    private j$:any;
    private parentContainerId:string;
    private selfContainerId:string;
    private data:Template;
    private coeff:number;
    
    constructor(j$:any, parentContainerId:string, selfContainerId:string, coeff:number){
        this.j$ = j$;
        this.parentContainerId = parentContainerId;
        this.selfContainerId = selfContainerId;
        this.coeff = coeff;
    }

    public destroy():void{
    }
    
    public getTemplateWidth():number{
        return this.j$("#"+this.parentContainerId).outerWidth();
    }
    
    public getTemplateHeight():number{
        var aspectRatio:any = parseFloat(this.data.getAspectRatio());
        return this.getTemplateWidth()*aspectRatio;
    }

    public setData(data:Template):void{
        this.data = data;
        var layersIterator:ListIterator = data.getLayersIterator();

        console.log("total layers: "+data.totalLayers());

        while(layersIterator.hasNext()){
            var layer:TemplateLayer = layersIterator.next();
            
            var layerType:string = layer.getType();

            //console.log("layerType=",layerType);

            // TODO в шаблоне сделать слой-контейнер для текстов, добавить его, во вьюхах добавлять их в этот контейнер
            switch(layerType){
                case LayerType.DIV_LAYER_TYPE:
                    new DivLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.LABELS_CONTAINER:
                    new LabelsContainerLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.TEXT_LAYER_TYPE:
                    new TextLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.CITY_LAYER_TYPE:
                    new CityLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.COUNTRY_LAYER_TYPE:
                    new CountryLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.COORDINATES_LAYER_TYPE:
                    new CoordinatesLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.DATE_TIME_LAYER_TYPE:
                    new DateTimeLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.IMAGE_LAYER_TYPE:
                    new ImageLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.BLOB_IMAGE_LAYER_TYPE:
                    new BlobImageLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.BORDER_CIRCLE_LAYER_TYPE:
                    new BorderCircleLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.STARMAP_LAYER_TYPE:
                    var layerView:LayerView = new StarmapLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    layer.setView(layerView);
                    break;
                case LayerType.MAP_LAYER_TYPE:
                    var layerView:LayerView = new MapLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    layer.setView(layerView);
                    break;
                case LayerType.MAP_CITY_LAYER_TYPE:
                    var layerView:LayerView = new MapCityLayerView(this.j$, layer, "labelsContainer", this.selfContainerId, this, this.coeff);
                    layer.setView(layerView);
                    break;
                case LayerType.MAP_COUNTRY_LAYER_TYPE:
                    var layerView:LayerView = new MapCountryLayerView(this.j$, layer, "labelsContainer", this.selfContainerId, this, this.coeff);
                    layer.setView(layerView);
                    break;
                case LayerType.MAP_COORDINATES_LAYER_TYPE:
                    var layerView:LayerView = new MapCoordinatesLayerView(this.j$, layer, "labelsContainer", this.selfContainerId, this, this.coeff);
                    layer.setView(layerView);
                    break;
            }
        }
        this.resize();
    }
    
    private resize():void{
        this.j$("#"+this.parentContainerId).height(this.getTemplateHeight());
    }
}

