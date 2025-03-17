// TS 5.7.3

//
// Изначально предполагал делать не сравнение соседей, а сравнение с краев строки.
// Но в ручном переборе вариантов нашел необходимость довольно сложных проверок, или невозможностьность реализации подхода
//

/** Функция проверки скобочной последовательности
 * 
 * @param {string} str - входная строка скобочной последовательности
 * @returns true, если скобочная последовательность корректна, иначе false
 */
const bracketsValidate = (str: string): boolean => {
	// Удаляет все символы кроме скобок (может конфликтовать с контекстом бизнес-логики)
	str = str.replace(/[^\[\]{}()]/g, '')

	// Если нечетное количество скобок,или в строке нет скобок (может конфликтовать с контекстом бизнес-логики), сразу возвращает false
	if (str.length % 2 !== 0 || !str.length) {
		return false
	}

	/** Объект для сравнения */
	const brackets = {
		'(': ')',
		'{': '}',
		'[': ']',
	}

	/** Флаг для выхода из цикла */
	let prevLength = -1

	// Пока строка меняется (удаляются парные скобки)
	while(str.length > 0 && prevLength !== str.length) {
		// Сбрасывает предыдущее значение длины для того, чтобы не зацикливаться в бесконечном цикле
		prevLength = str.length

		// Цикл с конца, что бы не терять итерации, или не начинать цикл каждый раз заново
		for (let i = str.length - 1; i >= 0; i--) {
			// Если текущий символ является открывающей скобкой, и предыдущий символ закрывающей, они удаляются
			if (brackets[str[i - 1]] === str[i]) {
				// Удаляет текущие символы из строки
				str = `${str.slice(0, i - 1)}${str.slice(i + 1)}`
				break
			}
		}
	}

	// Если после прохода всех итераций нет непарных соседних скобок, возвращает true, иначе false
	return str.length === 0
}

console.log(bracketsValidate('([()[]]([{}]))()')) // true
console.log(bracketsValidate('([()[]]([{}]))()]')) // false
console.log(bracketsValidate('([()[]][([{}]))()]')) // false

console.log(bracketsValidate('()')) // true
console.log(bracketsValidate('()[]{}')) // true
console.log(bracketsValidate('(]')) // false
console.log(bracketsValidate('([)]')) // false
console.log(bracketsValidate('{[]}')) // true

