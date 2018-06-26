class DescriptionBuilder {
	constructor() {
		this.items = [];
	}

	addField(name, text, icon) {
		this.items.push((icon || ':white_small_square:') + '\t**' + name + '**: ' + text);
		return this;
	}

	addFields(items) {
		this.items.push(...items.map((item) => item.length > 2 ? item[0] + '\t**' + item[1] + '**: ' + item[2] : ':white_small_square:\t**' + item[0] + '**: ' + item[1]));
		return this;
	}

	addListField(name, items) {
		this.items.push(':white_small_square:\t**' + name + '**:' + items.map((item) => item.length > 2 ? '\t' + item[0] + '\t**' + item[1] + '**: ' + item[2] : '\t:small_blue_diamond:\t**' + item[0] + '**: ' + item[1]));
	}

	build(lineSpacing) {
		return this.items.join(Array((lineSpacing || 1) + 1).join('\n'));
	}
}

module.exports = DescriptionBuilder;