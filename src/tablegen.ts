import marked from 'marked';
import {Config, ConfigSchema, RowColor, RowColorSchema} from './config';

export default function generateTable (divname: string, sheetData: object[], conf: Config): void {

	const validation_config = ConfigSchema.validate(conf);
	if (validation_config.error) {
	  console.log(validation_config.error.message);
	  console.log(validation_config.error.details);
	  throw validation_config.error;
	}
	const config = validation_config.value;

	const rowcolors: RowColor[] = config.special_row_colors;

	let colskip_idx: number[] = [];

	const container = document.getElementById(divname);

	const table = document.createElement("table");
	table.setAttribute("id", divname + "-table");
	table.setAttribute("class", config.table_css_class!);
	container?.appendChild(table);

	let header = sheetData[0];
	let body = sheetData.slice(0);


	function generateTableHead(table: HTMLTableElement, firstrow: object) {
		let thead = table.createTHead();
		let row = thead.insertRow();
		let keys = Object.keys(firstrow);
		keys.forEach((key, index) => {
			if (config.columns_to_skip?.includes(key)) {
				colskip_idx.push(index);
			} 
			else {
				let th = document.createElement("th");
				th.innerHTML = markdown(key);
				row.appendChild(th);
			}
		});
	}

	generateTableHead(table, header)  

	function generateTableBody(table: HTMLTableElement, data: object[]) {
		let tbody = table.createTBody();
		data.forEach((row, row_idx) => {
			let tr = tbody.insertRow();
			colorRow(row_idx, row, tr);
			let values = Object.values(row);
			values.forEach((value, col_idx) => {
				if (colskip_idx.includes(col_idx)) { 
					// do nothing, skip this column because it's in the skip list
				} else {
					let td = document.createElement("td");
					td.innerHTML = markdown(value);
					tr.appendChild(td);
				}
			});
		});
	}

	function colorRow(row_idx: number, row: object, tr: HTMLTableRowElement) {

		if (config.color_by_week) {
			let weeknum = Object(row)["Week"];
			if (weeknum & 1) {
				tr.style.backgroundColor = config.week_light!;
			} else tr.style.backgroundColor = config.week_dark!;
		}
		
		let adjusted_row_idx = row_idx + 2;
		if (typeof rowcolors === 'undefined') return;
		rowcolors.forEach(rowcolor => {
			if (!!rowcolor.sheet_row && rowcolor.sheet_row === adjusted_row_idx) {
				if (!!rowcolor.color) tr.style.backgroundColor = rowcolor.color;
				else if (!!rowcolor.tr_css_class) tr.setAttribute("class", rowcolor.tr_css_class);
			} else if (!!rowcolor.sheet_row_txt && objectContains(row, rowcolor.sheet_row_txt)) {
				if (!!rowcolor.color) tr.style.backgroundColor = rowcolor.color;
				else if (!!rowcolor.tr_css_class) tr.setAttribute("class", rowcolor.tr_css_class);
			}
		});
	}

	function markdown(value: string) {
		if (config.markdown_parse) return marked(value);
		else return value;
	}

	function objectContains(obj: object, term: string): boolean {
		let verdict = false;
		Object.entries(obj).forEach(
			([key, value]) => {
				if (value.indexOf(term) != -1) verdict = true
			});
		return verdict;
	}

	generateTableBody(table, body)

}

