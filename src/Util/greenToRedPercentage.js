// https://stackoverflow.com/questions/7128675/from-green-to-red-color-depend-on-percentage

const percentColors = [
	{ percentage: 0.0, color: { r: 0x00, g: 0xff, b: 0 } },
	{ percentage: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
	{ percentage: 1.0, color: { r: 0xff, g: 0x00, b: 0 } }
];

module.exports = (percentage) => {
	for (var i = 1; i < percentColors.length - 1; i++) {
		if (percentage < percentColors[i].percentage) {
			break;
		}
	}
	var lower = percentColors[i - 1];
	var upper = percentColors[i];
	var range = upper.percentage - lower.percentage;
	var rangePercentage = (percentage - lower.percentage) / range;
	var percentageLower = 1 - rangePercentage;
	var percentageUpper = rangePercentage;
	return rgbToHex(Math.floor(lower.color.r * percentageLower + upper.color.r * percentageUpper), Math.floor(lower.color.g * percentageLower + upper.color.g * percentageUpper), Math.floor(lower.color.b * percentageLower + upper.color.b * percentageUpper));
};

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

const componentToHex = (c) => {
	const hex = c.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
};

const rgbToHex = (r, g, b) => {
	return Number('0x' + componentToHex(r) + componentToHex(g) + componentToHex(b));
};