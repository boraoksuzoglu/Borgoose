const fs = require('fs')
const _ = require('lodash')
const { v4: uuidv4 } = require('uuid')

const default_options = {
	syncOnWrite: true,
	createWithId: false,
}

class Borgoose {
	constructor(filePath, options = default_options) {
		if (!filePath || typeof filePath !== 'string') throw new Error('Path is not valid')
		this.path = filePath.slice(filePath.length - 5) != '.json' ? filePath + '.json' : filePath
		this.storage = new Array()

		if (!options || Array.isArray(options) || typeof options !== 'object')
			throw new Error('Options is not valid')
		if (_.difference(_.keys(options), _.keys(default_options)).length != 0)
			throw new Error('Unkown option value')

		this.options = _.merge(default_options, options)
		this.init()
	}

	init() {
		if (!fs.existsSync(this.path)) {
			fs.appendFileSync(this.path, '[]', (err) => {
				if (err) throw err
			})
		}
		this.storage = JSON.parse(fs.readFileSync(this.path))
	}

	sync() {
		fs.writeFileSync(this.path, JSON.stringify(this.storage))
	}

	write(array) {
		this.storage = _.cloneDeep(array)
		this.sync()
	}

	shuffle() {
		this.storage = _.shuffle(this.storage)
		if (this.options.syncOnWrite) this.sync()
	}

	// CREATE

	create(object) {
		if (this.options.createWithId) object = { _id: uuidv4(), ...object }
		this.storage.push(object)
		if (this.options.syncOnWrite) this.sync()
	}

	insertOne(object) {
		this.create(object)
	}

	insertMany(array) {
		for (let object of array) {
			this.create(object)
		}
	}

	// FIND

	find(filter) {
		return _.filter(this.storage, filter)
	}

	findOne(filter) {
		return _.find(this.storage, filter)
	}

	findMany(filter) {
		return this.find(filter)
	}

	findById(id) {
		return _.filter(this.storage, { _id: id })
	}

	// DELETE

	deleteOne(filter) {
		this.storage = _.reject(this.storage, _.find(this.storage, filter))
		if (this.options.syncOnWrite) this.sync()
	}

	deleteMany(filter) {
		this.storage = _.reject(this.storage, filter)
		if (this.options.syncOnWrite) this.sync()
	}

	// UPDATE

	updateMany(filter, object) {
		for (let obj of this.storage) {
			if (!_.isMatch(obj, filter)) continue
			for (let key in object) {
				obj[key] = object[key]
			}
		}
		if (this.options.syncOnWrite) this.sync()
	}

	updateOne(filter, object) {
		let data = this.findOne(filter)
		for (let key in object) {
			data[key] = object[key]
		}
		this.storage[data] = data
		if (this.options.syncOnWrite) this.sync()
	}
}

module.exports = Borgoose
