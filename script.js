const board = document.querySelector(`.board`)
const cells = Array.from(board.children)
const scoreElement = document.querySelector('.score')

const Marks = { hidden: 'hidden', visible: 'visible' }
const Colors = ['r', 'y', 'g', 'b']
const Index = [1, 2, 3, 4]

const historyLength = 4
const history = []
let score = 0

;(function restart() {
	resetScore()
	updateGame()
})()

function updateGame() {
	cells.forEach((cell) => {
		unhideCell(cell)
		cell.classList.remove(...Colors)
		cell.removeEventListener('click', handleClick)
		cell.addEventListener('click', handleClick)
	})

	const gen = generateCells()
	gen.forEach((c) => {
		cells[c[0]].innerHTML = `${c[1]}`
		placeMark(cells[c[0]], c[2])
	})

	history.length = 0
}

function resetScore() {
	score = 0
}

function generateCells() {
	const amount = historyLength
	// random('w', [
	// 	[1, 1],
	// 	[2, 1],
	// 	[3, 2],
	// 	[4, 2],
	// ])
	const positions = random('s', [0, 1, 2, 3])
	const cells = new Array(amount)
		.fill()
		.map((_, i) => [positions[i], Index[i], Colors[i]])
	return cells
}

function handleClick(e) {
	const cell = e.target
	// cell.classList.remove(...Colors)
	// console.log(cell)
	console.log(history)

	if (
		(cell.innerHTML == 1 && history.length === 0) ||
		cell.innerHTML - history[0]?.innerHTML === 1
	) {
		history.unshift(cell)
		history.length =
			history.length > historyLength ? historyLength : history.length
		score += 1
		scoreElement.innerHTML = `${score}`
		hideCell(cell)
	} else if (
		(cell.innerHTML != 1 && history.length === 0) ||
		cell.innerHTML - history[0]?.innerHTML !== 1
	) {
		updateGame()
	}

	if (history.length === historyLength) {
		updateGame()
	}

	// console.log(score)
}

function placeMark(element, mark) {
	element.classList.toggle(mark, true)
}

function eraseMark(element, mark) {
	element.classList.toggle(mark, false)
}

function hideCell(cell) {
	placeMark(cell, Marks.hidden)
	eraseMark(cell, Marks.visible)
	cell.removeEventListener('click', handleClick)
}

function unhideCell(cell) {
	placeMark(cell, Marks.visible)
	eraseMark(cell, Marks.hidden)
	cell.removeEventListener('click', handleClick)
}
