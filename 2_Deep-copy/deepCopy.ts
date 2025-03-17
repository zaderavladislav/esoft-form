// TS 5.7.3

//
// За основу взят мой небольшой код глубокой замены null на undefined
// *** В качестве вспомогательного инструмента использовался ИИ Claude 3.7 Sonnet (только в этой задаче)
//

/** Функция копирования объекта с учетом специальных объектов, массивов и обычных объектов
 *
 * @param {T} data - исходный объект для копирования
 * @returns копию исходного объекта с учетом специальных объектов, массивов и обычных объектов
 */
const deepCopy = <T,>(data: T): T => {
	// *** По условию входной параметр 1. ИИ предложил так же добавить параметр hash как WeekMap для защиты от циклических ссылок
	// Проверка на null или примитивы
	if (data === null || typeof data !== 'object') {
		return data
	}

	// Обработка специальных объектов
	if (data instanceof Date) {
		return new Date(data) as T
	}
	if (data instanceof RegExp) {
		return new RegExp(data.source, data.flags) as T
		// *** С явным копированием помог ИИ
		// *** Мой вариант
		// return new RegExp(data) as T
	}
	if (data instanceof Map) {
		const mapCopy = new Map()
		data.forEach((value, key) => mapCopy.set(deepCopy(key), deepCopy(value)))
		// *** ИИ подсказал, что ключ и значение лучше тоже копировать глубоко из-за того, что они так же могут быть сложными объектами
		// *** Ниже в коде где необходимо уже использовал вспомогательный deepCopy
		// *** Мой вариант
		// data.forEach((value, key) => mapCopy.set(key, value))
		return mapCopy as T
	}
	if (data instanceof Set) {
		const setCopy = new Set()
		data.forEach(value => setCopy.add(deepCopy(value)))
		return setCopy as T
	}

	// Добавляем поддержку ArrayBuffer и типизированных массивов
	// *** Этот кусок полностью от ИИ. Про ArrayBuffer и особенности глубокого копирования типизированных массивов не знал
	if (data instanceof ArrayBuffer) {
		return data.slice(0) as T
	}
	if (ArrayBuffer.isView(data)) {
		return new (data.constructor as any)(data) as T
	}

	// Обработка массивов
	if (Array.isArray(data)) {
		return data.map(item => deepCopy(item)) as T
	}

	// Обработка обычных объектов
	const objCopy = Object.create(Object.getPrototypeOf(data))

	// Копирование всех свойств (обычных и символьных)
	// *** `Reflect.ownKeys` подсказан ИИ (что использование моего варианта с `Object.keys` не является безопасным)
	Reflect.ownKeys(data as object).forEach(key => {
		objCopy[key as string | symbol] = deepCopy((data as any)[key as string | symbol])
	})

	return objCopy as T
}

const complexObject = {
	// Примитивы
	number: 42,
	string: 'тестовая строка',
	boolean: true,
	nullValue: null,
	undefinedValue: undefined,

	// Вложенные объекты
	nested: {
		a: 1,
		b: { c: 3, d: [4, 5, 6] },
		e: new Date(),
	},

	// Массивы разных типов
	simpleArray: [1, 2, 3],
	mixedArray: [1, 'два', { три: 3 }, [4, 5]],

	// Специальные объекты
	date: new Date('2023-05-15'),
	regexp: /test-pattern/gi,
	map: new Map([
		['key1', 'value1'],
		[{ complex: 'key' }, { nested: 'value' }],
		[42, new Set([1, 2, 3])],
	]),
	set: new Set([1, { a: 2 }, [3, 4], new Map([['k', 'v']])]),

	// Типизированные массивы
	typedArray: new Uint8Array([1, 2, 3, 4]),
	arrayBuffer: new ArrayBuffer(8),

	// Символьные ключи
	[Symbol('symbolKey')]: 'значение с символьным ключом',

	// Метод
	method: function () {
		return this.number
	},

	// Геттер и сеттер
	get computed() {
		return this.number * 2
	},
	set value(val: number) {
		this.number = val
	},
}

// Циклические ссылки
// complexObject.circular = complexObject;
// complexObject.nested.parent = complexObject;

// Тестирование
console.log(complexObject)
const copied = deepCopy(complexObject)
console.log(copied.value)
// console.log(copied === complexObject); // Должно быть false
// console.log(copied.nested === complexObject.nested); // Должно быть false