///<reference path="../TemplateEditorView.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../EditorEvent.ts"/>
class GeographicEditorView extends TemplateEditorView{
    
    private placeLabelsButton:any;

    protected createListeners():void {
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onCityChanged(data));
        this.placeLabelsButton.change(()=>this.onPlaceLabelsChanged());
    }
    
    protected addControls():void {
        this.text_1_input = this.j$("#text_1_Input");
        this.text_2_input = this.j$("#text_2_Input");
        this.placeLabelsButton = this.j$('#placeLabelsButton');

        this.placeLabelsButton.bootstrapToggle({
            style:"starmapEditorButton ",
            on: 'Улицы',
            off: 'Улицы',
            onstyle: 'primary'
        });
    }

    private onPlaceLabelsChanged():void {
        EventBus.dispatchEvent(EditorEvent.PLACE_LABELS_CHANGED, this.placeLabelsButton.is(':checked'));
    }

    private onCityChanged(data:any):void {
        var city:string = data.city;
        this.text_1_input.val(city);
    }
}
