///<reference path="TextTemplateLayer.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
class CountryTemplateLayer extends TextTemplateLayer{
    
    protected createListener() {
        EventBus.addEventListener(EditorEvent.TEXT_2_CHANGED, (text)=>this.onText_2_changed(text));
    }

    private onText_2_changed(text:string):void {
        this.text = text;
    }
}
