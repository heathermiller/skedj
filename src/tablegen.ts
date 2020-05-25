import marked from 'marked';
import * as Joi from '@hapi/joi';


export interface Config {
	columns_to_skip?: string[],
	markdown_parse?: boolean,
	color_by_week?: boolean,
	week_light?: string,
	week_dark?: string,
	special_row_colors?: RowColor[],
	table_css_class: string
}

export interface RowColor {
	sheet_row?: number,
	sheet_row_txt?: string,
	color?: string,
	tr_css_class?: string
}

const RowColorSchema = Joi.object().keys({
	sheet_row: Joi.number(),
	sheet_row_txt: Joi.string(),
	color: Joi.string(),
	tr_css_class: Joi.string()
}).xor('sheet_row', 'sheet_row_txt').xor('color', 'tr_css_class');

export const ConfigSchema = Joi.object().keys({
	columns_to_skip: Joi.array().items(Joi.string()).default([]),
	markdown_parse: Joi.boolean().default(true),
	color_by_week: Joi.boolean().default(true),
	week_light: Joi.string().default("#ffffff"),
	week_dark: Joi.string().default("#f7f8fa"),
	special_row_colors: Joi.array().items(RowColorSchema).default([]),
	table_css_class: Joi.string().default("table-skedj")
  });


export default function generateTable (divname: string, sheetData: object[], conf: Partial<Config> = {}): void {

	const result = ConfigSchema.validate(conf);
	if (result.error) {
	  throw result.error;
	}
	const config = result.value;


	// const columns_to_skip = ["Recitation Lead", "Teaching", "Travel Schedule"];
	let colskip_idx: number[] = [];
	
	// const week_light = "#ffffff";
	// const week_dark = "#f7f8fa";
	// const color_by_week = true;
	// const markdown_parse = true;
	// const table_css_class = "table-skedj";

	const rowcolors: RowColor[] = [
		{
			sheet_row_txt: "First Midterm Exam",
			color: "#ffe59a"
		},
		{
			// sheet_row: 26,
			sheet_row_txt: "Thanksgiving",
			color: "#d9ebd3"
		},		
		{
			sheet_row_txt: "Second Midterm Exam",
			color: "#ffe59a"
		}			
	];

	const container = document.getElementById(divname);

	const table = document.createElement("table");
	table.setAttribute("id", divname + "-table");
	table.setAttribute("class", conf.table_css_class!);
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

		if (conf.color_by_week) {
			let weeknum = Object(row)["Week"];
			if (weeknum & 1) {
				tr.style.backgroundColor = conf.week_light!;
			} else tr.style.backgroundColor = conf.week_dark!;
		}
		
		let adjusted_row_idx = row_idx + 2;
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
		if (conf.markdown_parse) return marked(value);
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

