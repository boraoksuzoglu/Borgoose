const fs = require("fs")
const _ = require("lodash")

const default_options = {
    syncOnWrite: true,
}

class Borgoose {
    constructor(filePath, options = default_options) {
        if (!filePath || !filePath.length) throw new Error('Path is not defined')
        this.path = filePath.slice(filePath.length - 5) != ".json" ? filePath + ".json" : filePath
        this.storage =  new Array()
        if (!_.isMatch(default_options, options)) throw new Error('Unkown option value')
        this.options = options
        this.init()
    }

    init() {
        if (!fs.existsSync(this.path)) {
            fs.appendFileSync(this.path, "[]", (err) => {
                if (err) throw err
            })
        }
        this.storage = JSON.parse(fs.readFileSync(this.path))
    }

    sync() {
        this.write(this.storage)
    }

    write(array) {
        fs.writeFileSync(this.path, JSON.stringify(array))
        this.storage = array
    }

    shuffle() {
        this.storage = _.shuffle(this.storage)
        if (this.options.syncOnWrite) this.sync()
    }
    
    // NEW OBJECT

    create(object) {
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