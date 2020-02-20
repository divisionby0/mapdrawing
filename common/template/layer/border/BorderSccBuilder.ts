///<reference path="Border.ts"/>
class BorderSccBuilder{
    public static build(border:Border):string{
        var i:number;
        var cssString:string = "";
        var restParameters:any[] = border.getRest();
        
        cssString+=border.getWeight().getValue()+border.getWeight().getPoints()+" "+border.getColor()+" ";
        
        for(i=0; i< restParameters.length; i++){
            cssString+=restParameters[i]+" ";
        }
        
        return cssString;
    }
}
