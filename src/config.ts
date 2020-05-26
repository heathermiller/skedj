import * as Joi from '@hapi/joi';

export interface Config {
	columns_to_skip: string[],
	markdown_parse: boolean,
	color_by_week: boolean,
	week_light: string,
	week_dark: string,
	special_row_colors: RowColor[],
	table_css_class: string
}

export interface RowColor {
	sheet_row: number,
	sheet_row_txt: string,
	color: string,
	tr_css_class: string
}

export const RowColorSchema = Joi.object().keys({
	sheet_row: Joi.number(),
	sheet_row_txt: Joi.string(),
	color: Joi.string(),
	tr_css_class: Joi.string()
})//.xor('sheet_row', 'sheet_row_txt').xor('color', 'tr_css_class');

export const ConfigSchema = Joi.object().keys({
	columns_to_skip: Joi.array().items(Joi.string()).default([]),
	markdown_parse: Joi.boolean().default(true),
	color_by_week: Joi.boolean().default(true),
	week_light: Joi.string().default("#ffffff"),
	week_dark: Joi.string().default("#f7f8fa"),
	special_row_colors: Joi.array().items(RowColorSchema).default([]),
	table_css_class: Joi.string().default("table-skedj")
  });