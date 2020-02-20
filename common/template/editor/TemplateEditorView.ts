///<reference path="EditorEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../layer/TextTemplateLayer.ts"/>
///<reference path="../element/LayerView.ts"/>
class TemplateEditorView{
    private j$:any;

    //public static DEFAULT_TEXT_LAYER_1_ID:string = "text_1";
    //public static DEFAULT_TEXT_LAYER_2_ID:string = "text_2";

    private constellationLinesButton:any;
    private dateButton:any;
    private timeButton:any;
    private placeButton:any;
    private borderButton:any;
    private circleBorderButton:any;
    private coordinatesButton:any;
    
    private text_1_input:any;
    private text_2_input:any;

    constructor(j$:any){
        this.j$ = j$;
        this.addControls();
        this.createListeners();
    }

    public setData(template:Template):void {
        var layersIterator:ListIterator = template.getLayersIterator();
        while(layersIterator.hasNext()){
            var layer:TemplateLayer = layersIterator.next();

            if(layer instanceof TextTemplateLayer){
                var textLayer:TextTemplateLayer = (layer as TextTemplateLayer);

                var layerId:string = textLayer.getId();
                var layerText:string = textLayer.getText();

                if(layerId == LayerView.DEFAULT_TEXT_LAYER_1_ID){
                    this.text_1_input.val(layerText);
                }
                if(layerId == LayerView.DEFAULT_TEXT_LAYER_2_ID){
                    this.text_2_input.val(layerText);
                }
            }
        }
    }

    public reset(settings:any):void {
        settings.constellations ? this.constellationLinesButton.bootstrapToggle('on') : this.constellationLinesButton.bootstrapToggle('off');
        settings.date ? this.dateButton.bootstrapToggle('on') : this.dateButton.bootstrapToggle('off');
        settings.time ? this.timeButton.bootstrapToggle('on') : this.timeButton.bootstrapToggle('off');
        settings.place ? this.placeButton.bootstrapToggle('on') : this.placeButton.bootstrapToggle('off');
        settings.border ? this.borderButton.bootstrapToggle('on') : this.borderButton.bootstrapToggle('off');
        settings.circle ? this.circleBorderButton.bootstrapToggle('on') : this.circleBorderButton.bootstrapToggle('off');
        settings.coordinates ? this.coordinatesButton.bootstrapToggle('on') : this.coordinatesButton.bootstrapToggle('off');
    }

    
    private createListeners():void {
        this.constellationLinesButton.change(()=>this.onConstellationsChanged());
        this.circleBorderButton.change(()=>this.onCircleBorderChanged());
        this.borderButton.change(()=>this.onBorderChanged());
        
        this.text_1_input.on("input", ()=>this.onText1Changed());
        this.text_2_input.on("input", ()=>this.onText2Changed());
    }

    private addControls():void {
        this.constellationLinesButton = this.j$('#constellationLinesButton');
        this.dateButton = this.j$('#dateButton');
        this.timeButton = this.j$('#timeButton');
        this.placeButton = this.j$('#placeButton');
        this.borderButton = this.j$('#borderButton');
        this.circleBorderButton = this.j$('#circleBorderButton');
        this.coordinatesButton = this.j$('#coordinatesButton');

        this.text_1_input = this.j$("#text_1_input");
        this.text_2_input = this.j$("#text_2_input");
        
        this.constellationLinesButton.bootstrapToggle({
            style:"starmapEditorButton ",
            on: 'Созвездия',
            off: 'Созвездия',
            onstyle: 'primary'
        });
        this.dateButton.bootstrapToggle({
            style:"starmapEditorButton ",
            on: 'Дата',
            off: 'Дата',
            onstyle: 'primary'
        });
        this.timeButton.bootstrapToggle({
            style:"starmapEditorButton ",
            on: 'Время',
            off: 'Время',
            onstyle: 'primary'
        });
        this.placeButton.bootstrapToggle({
            style:"starmapEditorButton ",
            on: 'Место',
            off: 'Место',
            onstyle: 'primary'
        });
        this.borderButton.bootstrapToggle(
            {
                style:"starmapEditorButton ",
                on: 'Рамка',
                off: 'Рамка',
                onstyle: 'primary'
            }
        );
        this.circleBorderButton.bootstrapToggle({
            style:"starmapEditorButton ",
            on: 'Окружность',
            off: 'Окружность',
            onstyle: 'primary'
        });
        this.coordinatesButton.bootstrapToggle({
            style:"starmapEditorButton ",
            on: 'Координаты',
            off: 'Координаты',
            onstyle: 'primary'
        });
    }

    private onConstellationsChanged():void {
        EventBus.dispatchEvent(EditorEvent.CONSTELLATIONS_CHANGED, this.constellationLinesButton.is(':checked'));
    }

    private onCircleBorderChanged():void {
        EventBus.dispatchEvent(EditorEvent.CIRCLE_BORDER_CHANGED, this.circleBorderButton.is(':checked'));
    }

    private onBorderChanged():void {
        EventBus.dispatchEvent(EditorEvent.BORDER_CHANGED, this.borderButton.is(':checked'));
    }

    private onText1Changed():void {
        console.log("onText1Changed");
        EventBus.dispatchEvent(EditorEvent.TEXT_1_CHANGED, {text:this.text_1_input.val(), elementId:LayerView.DEFAULT_TEXT_LAYER_1_ID});
    }

    private onText2Changed():void {
        EventBus.dispatchEvent(EditorEvent.TEXT_2_CHANGED, {text:this.text_2_input.val(), elementId:LayerView.DEFAULT_TEXT_LAYER_2_ID});
    }
}