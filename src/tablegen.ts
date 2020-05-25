import marked from 'marked';

export default function generateTable (divname: string, sheetData: object[]): void {

	const colskip = ["Recitation Lead", "Teaching", "Travel Schedule"];
	let colskip_idx: number[] = [];

	interface RowColor {
		sheet_row?: number,
		sheet_row_txt?: string,
		color: string
	}
	
	const week_light = "#ffffff";
	const week_dark = "#f7f8fa";
	const color_by_week = true;
	const markdown_parse = true;

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
	table.setAttribute("class", "table-skedj");
	container?.appendChild(table);

	let header = sheetData[0];
	let body = sheetData.slice(0);


	function generateTableHead(table: HTMLTableElement, firstrow: object) {
		let thead = table.createTHead();
		let row = thead.insertRow();
		let keys = Object.keys(firstrow);
		keys.forEach((key, index) => {
			if (colskip.includes(key)) {
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

		if (color_by_week) {
			let weeknum = Object(row)["Week"];
			if (weeknum & 1) {
				tr.style.backgroundColor = week_light;
			} else tr.style.backgroundColor = week_dark;
		}
		
		let adjusted_row_idx = row_idx + 2;
		rowcolors.forEach(rowcolor => {
			if (!!rowcolor.sheet_row && rowcolor.sheet_row === adjusted_row_idx) {
				tr.style.backgroundColor = rowcolor.color;
			} else if (!!rowcolor.sheet_row_txt && objectContains(row, rowcolor.sheet_row_txt)) {
				tr.style.backgroundColor = rowcolor.color;
			}
		});
	}

	function markdown(value: string) {
		if (markdown_parse) return marked(value);
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

