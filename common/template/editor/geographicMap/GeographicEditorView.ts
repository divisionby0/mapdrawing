///<reference path="../TemplateEditorView.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../EditorEvent.ts"/>
class GeographicEditorView extends TemplateEditorView{
    
    private placeLabelsButton:any;

    protected createListeners():void {
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onCityChanged(data));
        this.placeLabelsButton.change(()=>this.onPlaceLabelsChanged());
        
        this.text_1_input.on("input",()=>this.onText_1_changed());
        this.text_2_input.on("input",()=>this.onText_2_changed());
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
        var country:string = data.country;
        this.text_1_input.val(city);
        this.text_2_input.val(country);
    }

    private onText_1_changed():void {
        console.log("onText_1_changed");
        EventBus.dispatchEvent(EditorEvent.TEXT_1_CHANGED, this.text_1_input.val());
    }

    private onText_2_changed():void {
        EventBus.dispatchEvent(EditorEvent.TEXT_2_CHANGED, this.text_2_input.val());
    }
}
