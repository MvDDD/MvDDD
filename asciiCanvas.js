const radians = (deg) => deg * (Math.PI / 180);
class asciiCanvas {
	constructor(width, height, color, transx = 0, transy = 0) {
		this._width = width;
		this._height = height;
		this.trans = { tx:transx, ty:transy };
		this.color = {};
		try {
			color.forEach((color, index) => (this.color[index.toString()] = color));
		} catch {
			this.color = color;
		}
		this.image = Array.from({ length: height }, () => Array.from({ length: width }).fill("0"));
	}
	pixel(x, y, value) {
		x = Math.round(x);
		y = Math.round(y);
		x += this.trans.tx;
		y += this.trans.ty;
		if (value === "") {
			return this.image[y][x];
		} else {
			if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
				return "OOB";
			} else {
				this.image[y][x] = String(value);
				return { x: x, y: y, xy: x + " " + y, value: value };
			}
		}
	}
	translate(x, y) {
		this.trans.tx = Math.round(x);
		this.trans.ty = Math.round(y);
	}
	rect(x1, y1, x2, y2, color, fill = false) {
		if (fill) {
			for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
				for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
					this.pixel(x, y, color);
				}
			}
		} else {
			this.line(x1, y1, x2, y1, color);
			this.line(x2, y1, x2, y2, color);
			this.line(x2, y2, x1, y2, color);
			this.line(x1, y2, x1, y1, color);
		}
	}
	line(x1, y1, x2, y2, color) {
		const dx = x2 - x1;
		const dy = y2 - y1;
		const steps = Math.max(Math.abs(dx), Math.abs(dy));
		const xIncrement = dx / steps;
		const yIncrement = dy / steps;
		let x = x1;
		let y = y1;
		for (let i = 0; i <= steps; i++) {
			this.pixel(Math.round(x), Math.round(y), color);
			x += xIncrement;
			y += yIncrement;
		}
	}
	circle(x, y, r, color, fill = false) {
		const start = radians(0);
		const stop = radians(360);
		const step = 1; // Always draw in a clockwise direction
		if (fill) {
			for (let angle = start; angle <= stop; angle += step * (Math.PI / 180)) {
				const dx = Math.round(r * Math.cos(angle));
				const dy = Math.round(r * Math.sin(angle));
				const newX = Math.min(Math.max(x + dx, 0), this._width - 1);
				const newY = Math.min(Math.max(y + dy, 0), this._height - 1);
				if (newX >= 0 && newX < this._width && newY >= 0 && newY < this._height) {
					this.line(newX, newY, x, y, color);
				}
			}
		} else {
			for (let angle = start; angle <= stop; angle += step * (Math.PI / 180)) {
				const dx = Math.round(r * Math.cos(angle));
				const dy = Math.round(r * Math.sin(angle));
				const newX = Math.min(Math.max(x + dx, 0), this._width - 1);
				const newY = Math.min(Math.max(y + dy, 0), this._height - 1);
				if (newX >= 0 && newX < this._width && newY >= 0 && newY < this._height) {
					this.pixel(newX, newY, color);
				}
			}
		}
	}

	filledRectangle(x1, y1, x2, y2, color) {
		for (let y = y1; y <= y2; y++) {
			this.line(x1, y, x2, y, color);
		}
	}
	ellipse(x, y, rx, ry, color, fill = false) {
		if (fill){
			for (let dy = -ry; dy <= ry; dy++) {
				for (let dx = -rx; dx <= rx; dx++) {
					if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1) {
						this.pixel(x + dx, y + dy, color);
					}
				}
			}
		} else {
			const steps = Math.max(rx, ry);
			for (let i = 0; i < steps; i++) {
				const angle = (i / steps) * 2 * Math.PI;
				const dx = Math.round(rx * Math.cos(angle));
				const dy = Math.round(ry * Math.sin(angle));
				this.pixel(x + dx, y + dy, color);
			}
		}
	}
	getString() {
		return this.image
		.map((row) => row.map((item) => this.color[item]).slice(0, this._width).join("") + "\n")
		.join("")+"\n";
	}
	clear() {
		this.image = Array.from({ length: this._height }, () => Array.from({ length: this._width }).fill("0"));
	}
	get width() {
		return this._width
	}
	get  height() {
		return this._height
	}
}
module.exports = {asciiCanvas}