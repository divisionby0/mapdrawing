///<reference path="../TemplateEditorView.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../EditorEvent.ts"/>
class GeographicEditorView extends TemplateEditorView{
    
    private placeLabelsButton:any;

    public reset():void{
        if(this.placeLabelsButton){
            this.placeLabelsButton.bootstrapToggle('off');
        }
    }
    
    protected createListeners():void {
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onCityChanged(data));
        EventBus.addEventListener(EditorEvent.COORDINATES_CHANGED, (data)=>this.onCoordinatesChanged(data));
        this.placeLabelsButton.change(()=>this.onPlaceLabelsChanged());
        
        this.text_1_input.on("input",()=>this.onText_1_changed());
        this.text_2_input.on("input",()=>this.onText_2_changed());
        this.text_3_input.on("input",()=>this.onText_3_changed());
    }
    
    protected addControls():void {
        this.text_1_input = this.j$("#text_1_Input");
        this.text_2_input = this.j$("#text_2_Input");
        this.text_3_input = this.j$("#text_3_Input");
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

        console.log("GeographicEditorView onCityChanged data=",data);

        var coord:any[] = data.coord;

        this.text_1_input.val(city);
        this.text_2_input.val(country);
        this.text_3_input.val(parseFloat(coord[0]).toFixed(5)+" "+parseFloat(coord[1]).toFixed(5));
    }

    private onCoordinatesChanged(data:any[]):void {
        this.text_3_input.val(parseFloat(data[0]).toFixed(5)+" "+parseFloat(data[1]).toFixed(5));
    }

    private onText_1_changed():void {
        EventBus.dispatchEvent(EditorEvent.TEXT_1_CHANGED, this.text_1_input.val());
    }

    private onText_2_changed():void {
        EventBus.dispatchEvent(EditorEvent.TEXT_2_CHANGED, this.text_2_input.val());
    }

    private onText_3_changed():void {
        EventBus.dispatchEvent(EditorEvent.TEXT_3_CHANGED, this.text_3_input.val());
    }
}
