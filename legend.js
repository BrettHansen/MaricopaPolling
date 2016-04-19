var canvas = $('#canvas')[0];
var context = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;
var image = context.createImageData(w, h);
for(var i = 0; i < h; i++) {
	for(var j = 0; j < w; j++) {
		image.data.set([parseInt((1 - j / w) * 255), 0, parseInt(Math.pow(j / w, 3) * 255), Math.floor(i / h * 255)], 4 * (i * image.width + j));
	}
}

context.putImageData(image, 0, 0);