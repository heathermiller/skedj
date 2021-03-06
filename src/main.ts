import generateTable from './tablegen';
import {Config} from './config';
import Papa from 'papaparse';

// wishlist:
// [x] indicate which columns to skip
// [x] markdown parsing
// [ ] toggle markdown parsing
// [ ] freeze/generate html to save in case google docs url stops working
// [ ] let user pass stylesheet
// [x] color specific rows (numbers)
// [x] color specific rows (containing text)
// [x] week alternate color
// [x] let user pass config object

export default function Skedj(url: string, divname: string, conf: Config): void {
	
	Papa.parse(url, {
		download: true,
		header: true,
		complete: function(results) {
		  var data = results.data
		  console.log(data)
		  generateTable(divname, data, conf)
		}
	  });


	// const millisecondsUntilLunchTime = millisecondsUntil(lunchtime(hours, minutes));
	// return ms(millisecondsUntilLunchTime, { long: true });
}