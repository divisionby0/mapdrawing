class Utils{
    public static updateFontSizeString(sourceFontSizeString:string, coeff:any):string{
        
        var valueParsed:any = Utils.parseValueAndPoints(sourceFontSizeString);
        
        var fontSizeIntVal:number = valueParsed[0];
        var points:string = valueParsed[1];

        return ((fontSizeIntVal*coeff).toFixed(2)).toString()+""+points;
    }
    
    public static updateBorderString(sourceBorderString:string, coeff:any):string{
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

        var borderWidthValue:string = newArray[0];
        var valueParsed:any = Utils.parseValueAndPoints(borderWidthValue);
        
        var newBorderString:string = (parseFloat(valueParsed[0])*coeff).toFixed(2)+""+valueParsed[1];

        for(i=0; i< restDataArray.length; i++){
            newBorderString+=" "+restDataArray[i];
        }
        
        return newBorderString;
    }
    
    private static parseValueAndPoints(value:string):any{
        var intVal:number = parseFloat(value);
        var pointsIndex:number = value.indexOf(intVal.toString())+intVal.toString().length;
        var points:string = value.substring(pointsIndex, value.length);
        
        return [intVal, points];
    }
}
