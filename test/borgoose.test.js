const Borgoose = require('../src/index')
const fs = require('fs')
const data_file = './test/data.json'

function getJSON() {
	return JSON.parse(fs.readFileSync(data_file))
}

const test_array = require('./jsonplaceholder.json')

describe('BORGOOSE', () => {
	describe('Create JSON File', () => {
		describe('File Management', () => {
			beforeAll(() => {
				fs.unlinkSync(data_file)
				new Borgoose(data_file)
			})

			// Create JSON file
			test('Should create JSON file.', () => {
				expect(fs.existsSync(data_file)).toEqual(true)
			})
			// JSON file is empty array
			test('Content of JSON file must be an empty Array.', () => {
				expect(getJSON()).toEqual([])
			})
		})

		describe('Errors', () => {
			// Unkown option values
			test('Should create Error because entered unkown options values.', () => {
				const createInstance = () => new Borgoose(data_file, { bora: true })

				expect(createInstance).toThrow('Unkown option value')
			})
			// Options is not valid
			test('Should create Error when options is not an object.', () => {
				const createInstance = () => new Borgoose(data_file, [])

				expect(createInstance).toThrow('Options is not valid')
			})
			// Path is not provided
			test('Should create Error when path is not provided.', () => {
				const createInstance = () => new Borgoose()

				expect(createInstance).toThrow('Path is not valid')
			})
			// Path is not valid
			test('Should create Error when path is not a string.', () => {
				const createInstance = () => new Borgoose([1, 2, 3])

				expect(createInstance).toThrow('Path is not valid')
			})
		})
	})

	describe('Data Management', () => {
		const bdb = new Borgoose(data_file)
		beforeEach(() => {
			bdb.write(test_array) // We need some data
		})

		describe('Write', () => {
			// Replace all content of json file
			test('Should replace JSON file with data', () => {
				expect(getJSON()).toEqual(test_array)
			})
		})

		describe('Create', () => {
			beforeEach(() => {
				bdb.write([])
			})
			// Create single data
			test('Should create a single data.', () => {
				var single_data = { title: 'Create single data' }

				// MAIN FUNCTION
				bdb.insertOne(single_data)

				expect(getJSON()).toEqual([single_data])
			})

			// Create multiple data
			test('Should create multiple data.', () => {
				var multiple_data = [{ title: 'Create multiple data' }, { title: 'The second data' }]

				// MAIN FUNCTION
				bdb.insertMany(multiple_data)

				expect(getJSON()).toEqual(multiple_data)
			})
		})

		describe('Find', () => {
			// Find single data
			test('Should find a single data.', () => {
				// MAIN FUNCTION
				var single_data = bdb.findOne({ age: 19 })

				expect(single_data).toEqual({ id: 1, name: 'bora', age: 19 })
			})

			// Find multiple data
			test('Should find multiple data.', () => {
				// MAIN FUNCTION
				var multiple_data = bdb.find((o) => o.age < 20)

				expect(multiple_data).toEqual([
					{ id: 1, name: 'bora', age: 19 },
					{ id: 2, name: 'burak', age: 19 },
				])
			})
		})

		describe('Update', () => {
			beforeEach(() => {
				bdb.write(test_array)
			})

			// Update single data
			test('Should update a single data.', () => {
				// MAIN FUNCTION
				bdb.updateOne((user) => user.age < 20, { age: 20 })

				expect(getJSON()).toEqual([
					{ id: 1, name: 'bora', age: 20 },
					{ id: 2, name: 'burak', age: 19 },
					{ id: 3, name: 'baris', age: 26 },
					{ id: 4, name: 'sebnem', age: 50 },
				])
			})

			// Update multiple data
			test('Should update multiple data.', () => {
				// MAIN FUNCTION
				bdb.updateMany({}, { age: 5 })

				expect(getJSON()).toEqual([
					{ id: 1, name: 'bora', age: 5 },
					{ id: 2, name: 'burak', age: 5 },
					{ id: 3, name: 'baris', age: 5 },
					{ id: 4, name: 'sebnem', age: 5 },
				])
			})
		})

		describe('Delete', () => {
			beforeEach(() => {
				bdb.write(test_array)
			})
			// Delete single data
			test('Should delete a single data.', () => {
				// MAIN FUNCTION
				bdb.deleteOne({ name: 'sebnem' })

				expect(getJSON()).toEqual([
					{ id: 1, name: 'bora', age: 19 },
					{ id: 2, name: 'burak', age: 19 },
					{ id: 3, name: 'baris', age: 26 },
				])
			})

			// Delete multiple data
			test('Should delete multiple data.', () => {
				// MAIN FUNCTION
				bdb.deleteMany({ age: 19 })

				expect(getJSON()).toEqual([
					{ id: 3, name: 'baris', age: 26 },
					{ id: 4, name: 'sebnem', age: 50 },
				])
			})
		})
	})
})
