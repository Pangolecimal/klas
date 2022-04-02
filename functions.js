const translated = { x: 0, y: 0 }
const PI = Math.PI
let RECT_MODE = 'CENTER' // [CORNERS, CORNER, CENTER, RADIUS]

//#region // *** Drawing *** //
function translate(x, y, p = 'add') {
	if (p === 'add') {
		translated.x += x
		translated.y += y
	}
	if (p === 'set') {
		translated.x = x
		translated.y = y
	}
}

function rectMode(m) {
	RECT_MODE = m ?? 'CENTER'
}

function fill(c) {
	ctx.fillStyle = c ?? 'hsla(0, 0%, 0%, 0)'
}

function stroke(c) {
	ctx.strokeStyle = c ?? 'hsla(0, 0%, 0%, 0)'
}

function strokeWidth(w) {
	ctx.lineWidth = w ?? 1
}

function background(c) {
	ctx.fillStyle = c
	ctx.fillRect(0, 0, width, height)
}

function text(t, x, y) {
	strokeWidth(3)
	ctx.strokeText(t, x + translated.x, -y + translated.y)
	ctx.fillText(t, x + translated.x, -y + translated.y)
}

function rect(x1, y1, x2, y2) {
	ctx.beginPath()
	if (RECT_MODE == 'CORNERS')
		ctx.rect(x1 + translated.x, -y1 + translated.y, x2 - x1, -(y2 - y1))
	if (RECT_MODE == 'CORNER')
		ctx.rect(x1 + translated.x, -y1 + translated.y, x2, y2)
	if (RECT_MODE == 'CENTER')
		ctx.rect(
			x1 + translated.x - x2 / 2,
			-y1 + translated.y - y2 / 2,
			x2,
			y2,
		)
	if (RECT_MODE == 'RADIUS')
		ctx.rect(
			x1 + translated.x - x2,
			-y1 + translated.y - y2,
			x2 * 2,
			y2 * 2,
		)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}

function circle(x, y, r) {
	ctx.beginPath()
	ctx.ellipse(x + translated.x, -y + translated.y, r, r, 0, PI * 2, 0)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}

function point(x, y, r) {
	ctx.beginPath()
	ctx.ellipse(x + translated.x, -y + translated.y, r, r, 0, PI * 2, 0)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}

function ellipse(x, y, r1, r2, a = 0) {
	ctx.beginPath()
	ctx.ellipse(x + translated.x, -y + translated.y, r1, r2, a, PI * 2, 0)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}

function line(x1, y1, x2, y2) {
	ctx.beginPath()
	ctx.moveTo(x1 + translated.x, -y1 + translated.y)
	ctx.lineTo(x2 + translated.x, -y2 + translated.y)
	ctx.closePath()
	ctx.stroke()
}

function hexagon(x, y, r) {
	ctx.beginPath()
	ctx.moveTo(x + translated.x + r, -y + translated.y)
	for (let a = 0; a < PI * 2; a += PI / 3) {
		ctx.lineTo(
			x + translated.x + cos(a) * r,
			-y + translated.y + sin(a) * r,
		)
	}
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}
//#endregion

//#region // *** Math *** //
function Map(value, minIn, maxIn, minOut, maxOut) {
	return ((value - minIn) * (maxOut - minOut)) / (maxIn - minIn) + minOut
}

function min() {
	return Math.min(...arguments)
}

function max() {
	return Math.max(...arguments)
}

function sin(v) {
	return Math.sin(v)
}

function cos(v) {
	return Math.cos(v)
}

function abs(v) {
	return Math.abs(v)
}

function floor(v) {
	return Math.floor(v)
}

function ceil(v) {
	return Math.ceil(v)
}

function round(v, p = 0) {
	return Math.round(v * 10 ** p) / 10 ** p
}

function sqrt(v) {
	return Math.sqrt(v)
}

function dtr(d) {
	return (d * PI) / 180
}

function rtd(r) {
	return (r * 180) / PI
}

function atan2(x, y) {
	return Math.atan2(y, x)
}

function pow(x, p) {
	return Math.pow(x, p)
}
//#endregion

//#region // *** Utility *** //
/**
 * [ ] -> return random value from 0 to 1
 *
 * [ N ] -> returns random value from 0 to N
 *
 * [ N, M ] -> returns random value from N to M
 *
 * [ A ] -> returns a random entry of an Array A
 *
 * [ 'weights' or 'w', A ] -> returns an index of a random point inside weighted Array A
 */
function random() {
	const args = Array.from(arguments)
	if (args.length === 0) return Math.random()

	if (args.length === 1) {
		if (typeof args[0] === 'number') return Math.random() * args[0]
		if (Array.isArray(args[0]))
			return args[0][Math.floor(Math.random() * args[0].length)]
		return console.error('random function error: ', args)
	}

	if (args[0] === 'shuffle' || args[0] === 's') {
		const array = args[1]
		let currentIndex = array.length,
			randomIndex

		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex--
			;[array[currentIndex], array[randomIndex]] = [
				array[randomIndex],
				array[currentIndex],
			]
		}

		return array
	}

	if (args[0] === 'int' || args[0] === 'i') {
		return Math.floor(random(...args.slice(1)))
	}

	if (args[0] === 'weights' || args[0] === 'w') {
		const data = args[1]
		const sum = data.reduce((a, b) => a + b[1], 0)
		const value = random(sum)
		for (let i = 0, t = 0; i < data.length; i++) {
			if (value < t) return data[i - 1][0]
			t += data[i][1]
		}
		return data[data.length - 1][0]
	}

	if (args[0] === 'divide' || args[0] === 'd') {
		const num = args[2] ?? 1
		let value = (args[1] ?? 1) / num

		// const points = new Array(num - 1)
		// 	.fill()
		// 	.map((_) => random(value))
		// 	.sort()
		// const result = points.map((p, i) => (i == 0 ? p : p - points[i - 1]))
		// result[num - 1] = value - points[num - 2]

		const result = new Array(num).fill(-1)
		const n = getNoise(args[3])
		for (let i = 0; i < num; i++) {
			value -= result[i] = i === num - 1 ? value : value * n
		}

		return random('s', result)
	}

	if (args.length === 2) {
		if (typeof args[0] === 'number' && typeof args[1] === 'number')
			return args[0] + (args[1] - args[0]) * Math.random()
		return console.error('random function error: ', args)
	}

	return console.error('random function error: ', args)
}

function prng(v) {
	const x = Math.sin(v + 1e-9) * Math.cos(v + 1e-9) * 1000000
	return x - Math.floor(x)
}

function range(start, stop, step = 1) {
	if (arguments.length === 1) {
		stop = start
		start = 0
	}

	if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
		return []
	}

	const result = []
	for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
		result.push(i)
	}

	return result
}

function getNoise(x = 0, y = 0, z = 0) {
	let frq = 1,
		amp = 1,
		noiseValue = 0

	for (let i = 0; i < octaves; i++) {
		const sampleX = ((x + offset.x) / scale) * frq
		const sampleY = ((y + offset.y) / scale) * frq
		const sampleZ = ((z + offset.z) / scale) * frq
		noiseValue += noise.simplex3(sampleX, sampleY, sampleZ) * amp
		frq *= lac
		amp *= per
	}

	minMax.min = min(minMax.min, noiseValue)
	minMax.max = max(minMax.max, noiseValue)

	return Map(noiseValue, minMax.min, minMax.max, 0, 1)
}

function biased(x, b) {
	const k = (1 - b) ** 3
	return (x * k) / (x * (k - 1) + 1)
}

function easing_exp(x, a) {
	if (x < 0 || x > 1) return console.error('easing error', arguments)
	if (x === 0) return 0
	if (x === 1) return 1
	if (x <= 0.5) return (1 - pow(2, -2 * a * x)) / 2
	if (x > 0.5) return (1 + pow(2, 2 * a * (x - 1))) / 2
}

function easing_quad(x) {
	if (x < 0 || x > 1) return console.error('easing error', arguments)
	if (x <= 0.5) return (1 - (-2 * x + 1) * (-2 * x + 1)) / 2
	if (x > 0.5) return 0.5 + 2 * (x - 0.5) * (x - 0.5)
}

class Vector {
	constructor(x = 0, y = 0, z = 0) {
		this.x = x
		this.y = y
		this.z = z
	}

	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
	}

	magSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z
	}

	setMag(l) {
		this.normalize().mult(l)
		return this
	}

	normalize() {
		const l = this.mag()
		this.x /= l
		this.y /= l
		this.z /= l
		return this
	}

	mult(s) {
		this.x *= s
		this.y *= s
		this.z *= s
		return this
	}

	add(v) {
		this.x += v.x
		this.y += v.y
		this.z += v.z
		return this
	}

	sub(v) {
		this.x -= v.x
		this.y -= v.y
		this.z -= v.z
		return this
	}

	abs() {
		this.x = Math.abs(this.x)
		this.y = Math.abs(this.y)
		this.z = Math.abs(this.z)
		return this
	}

	max(...args) {
		if (args.length === 0) {
			return Math.max(this.x, this.y, this.z)
		}
		if (args.length === 1) {
			this.x = Math.max(this.x, args[0])
			this.y = Math.max(this.y, args[0])
			this.z = Math.max(this.z, args[0])
		}
		if (args.length === 3) {
			this.x = Math.max(this.x, args[0])
			this.y = Math.max(this.y, args[1])
			this.z = Math.max(this.z, args[2])
		}
		return this
	}

	min(...args) {
		if (args.length === 0) {
			return Math.min(this.x, this.y, this.z)
		}
		if (args.length === 1) {
			this.x = Math.min(this.x, args[0])
			this.y = Math.min(this.y, args[0])
			this.z = Math.min(this.z, args[0])
		}
		if (args.length === 3) {
			this.x = Math.min(this.x, args[0])
			this.y = Math.min(this.y, args[1])
			this.z = Math.min(this.z, args[2])
		}
		return this
	}

	limit(l) {
		if (this.magSq() <= l * l) return this
		this.normalize()
		this.mult(l)
		return this
	}

	copy() {
		return new Vector(this.x, this.y, this.z)
	}

	static random2() {
		const a = random(Math.PI * 2)
		return new Vector(cos(a), sin(a))
	}

	static random3() {
		const u = random()
		const v = random()
		const a = Math.acos(2 * u - 1) - Math.PI / 2
		const b = Math.PI * 2 * v
		return new Vector(cos(a) * cos(b), cos(a) * sin(b), sin(b))
	}
}
//#endregion
