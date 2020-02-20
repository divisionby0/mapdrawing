///<reference path="../template/layer/Parameter.ts"/>
///<reference path="../template/layer/border/Border.ts"/>
class Utils{
    public static parseBorderParameters(sourceBorderString:string):any {
        var i:number;
        var borderParseResult:any = this.parseBorderWeightAndRestParameters(sourceBorderString);

        var borderWeight:string = borderParseResult[0][0];
        var borderRestParameters:string[] = borderParseResult[1];
        var borderWeightAndPointsParsed:any = Utils.parseValueAndPoints(borderWeight);
        var borderWeightParameter:Parameter = new Parameter(borderWeightAndPointsParsed[0], borderWeightAndPointsParsed[1]);

        var color:string = "rgba(0,0,0,0)"; // by default transparent
        var colorCurrentIndex:number = -1;

        for(i=0; i<borderRestParameters.length; i++){
            var restParameter:string = borderRestParameters[i];
            var colorPrefixPosition:number = restParameter.indexOf("#");
            if(colorPrefixPosition!=-1){
                color = restParameter;
                colorCurrentIndex = i;
                break;
            }
        }

        borderRestParameters.splice(colorCurrentIndex, 1);

        return new Border(borderWeightParameter, color, borderRestParameters);
        //return {weight:borderWeightParameter, color:color, rest:borderRestParameters};
    }
    
    public static updateFontSizeString(sourceFontSizeString:string, coeff:any):string{
        
        var valueParsed:any = Utils.parseValueAndPoints(sourceFontSizeString);
        
        var fontSizeIntVal:number = valueParsed[0];
        var points:string = valueParsed[1];

        return ((fontSizeIntVal*coeff).toFixed(2)).toString()+""+points;
    }
    
    public static updateBorderString(sourceBorderString:string, coeff:any):string{
        var i:number;
        var borderParseResult:any = this.parseBorderWeightAndRestParameters(sourceBorderString);
        
        var borderWeight:string = borderParseResult[0][0];
        var borderRestParameters:string[] = borderParseResult[1];
        
        var borderValueAndPointsParsed:any = Utils.parseValueAndPoints(borderWeight);
        
        var newBorderString:string = (parseFloat(borderValueAndPointsParsed[0])*coeff).toFixed(2)+""+borderValueAndPointsParsed[1];

        for(i=0; i< borderRestParameters.length; i++){
            newBorderString+=" "+borderRestParameters[i];
        }
        return newBorderString;
    }
    
    private static parseBorderWeightAndRestParameters(sourceBorderString:string):any{
        var borderStringParts:string[] = sourceBorderString.split(" ");
        var newArray:string[] = new Array();
        var restDataArray:string[] = new Array();

        for(var i:number=0; i<borderStringParts.length; i++){
            var stringPart:string = borderStringParts[i];
            var isHexColor:boolean = stringPart.indexOf("#")!=-1;

            var isNumber:boolean = !isNaN(parseInt(stringPart));

            if(!isHexColor && isNumber){
                newArray.push(stringPart);
            }
            else{
                restDataArray.push(stringPart);
            }
        }
        
        return [newArray, restDataArray];
    }

    public static parseValueAndPoints(value:string):any{
        var intVal:number = parseFloat(value);
        var pointsIndex:number = value.indexOf(intVal.toString())+intVal.toString().length;
        var points:string = value.substring(pointsIndex, value.length);
        
        return [intVal, points];
    }
}
