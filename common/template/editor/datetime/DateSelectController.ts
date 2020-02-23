///<reference path="DateSelectModel.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
class DateSelectController{

    private model:DateSelectModel;
    
    constructor(model:DateSelectModel){
        this.model = model;
        EventBus.addEventListener(EditorEvent.SET_CURRENT_DATE_TIME, ()=>this.onSetCurrentDateTimeRequest());
    }

    private onSetCurrentDateTimeRequest() {
        this.model.setCurrentDate();
    }
}