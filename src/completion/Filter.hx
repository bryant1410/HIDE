package completion;
import core.Completion;

/**
 * ...
 * @author AS3Boyan
 */
class Filter
{
	public static function filter(completions:Array<Hxml.CompletionData>, word:String, completionType:CompletionType):Array<Hxml.CompletionData>
	{
		var list:Array<Hxml.CompletionData> = [];
		
		if (completionType == OPENFILE) 
		{            
            completions.sort(function(a:Hxml.CompletionData, b:Hxml.CompletionData):Int
            {
                var aCount:Int;
                var bCount:Int;
                
                var aHaxeFile:Bool = StringTools.endsWith(a.text, ".hx");
                var bHaxeFile:Bool = StringTools.endsWith(b.text, ".hx");
                
                if (aHaxeFile && !bHaxeFile) return -1;
                if (!aHaxeFile && bHaxeFile) return 1;
                
                aCount = a.text.split("\\").length + a.text.split("/").length;
                bCount = b.text.split("\\").length + b.text.split("/").length;
                if (aCount < bCount) return -1;
                if (aCount > bCount) return 1;
                return 0;
            } );
		}
		
		if (word != null) 
		{
			var filtered_results = [];
			var sorted_results = [];
			
			word = word.toLowerCase();
			
			for (completion in completions) 
			{
				var n = completion.text.toLowerCase();
				var b = true;
			  
				  for (j in 0...word.length)
				  {
					  if (n.indexOf(word.charAt(j)) == -1)
					  {
						  b = false;
						  break;
					  }
				  }

				if (b)
				{
					filtered_results.push(completion);
				}
			}
			
			var results = [];
			var filtered_results2 = [];
			var exactResults = [];
			
			for (i in 0...filtered_results.length) 
			{
				var str = filtered_results[i].text.toLowerCase();
				var index:Int = str.indexOf(word);
				
				if (word == str) 
				{
					exactResults.push(filtered_results[i]);
				}
				else if (index == 0)
				{
					sorted_results.push(filtered_results[i]);
				}
				else if (index != -1) 
				{
					filtered_results2.push(filtered_results[i]);
				}
				else
				{
					results.push(filtered_results[i]);
				}
			}
			
			for (completion in exactResults) 
			{
				list.push(completion);
			}
			
			for (completion in sorted_results) 
			{
				list.push(completion);
			}
			
			for (completion in filtered_results2) 
			{
				list.push(completion);
			}
			
			for (completion in results) 
			{
				list.push(completion);
			}
		}
		else 
		{
			list = completions;
		}
		
		return list;
	}
}