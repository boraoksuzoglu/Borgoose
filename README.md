# Borgoose

Borgoose is great database management library for small projects. With Borgoose, you can easily store your data in a local JSON file, which makes it easy to access and use.

Borgoose takes functions from Mongoose. This will make it easy for you to migrate your project to MongoDB in the future.

[![npm version](https://badge.fury.io/js/borgoose.svg)](https://badge.fury.io/js/borgoose) [![CodeFactor](https://www.codefactor.io/repository/github/boraoksuzoglu/borgoose/badge)](https://www.codefactor.io/repository/github/boraoksuzoglu/borgoose)

![image](./.github/borgoose.png)

---

## Install

```node
npm i borgoose
```

## Functions

- [insertOne](#insert)
- [insertMany](#insert)
- [find](#find)
- [findById](#find)
- [findOne](#find)
- [findMany](#find)
- [updateOne](#update)
- [updateMany](#update)
- [deleteOne](#delete)
- [deleteMany](#delete)
- [write](#write)
- [shuffle](#shuffle)
- [sync](#sync)

---

# Usage

`new Borgoose(path, options)`

```js
const Borgoose = require('borgoose')
// default value of syncOnWrite is true
// I'm just writing you to see that such a setting exist :)
const bdb = new Borgoose('db.json', { syncOnWrite: true, createWithId: true })
```

## Options

| Option       | Type    | Description                                                   | Default |
| ------------ | ------- | ------------------------------------------------------------- | ------- |
| syncOnWrite  | Boolean | Automatically saves data to JSON file after each modification | true    |
| createWithId | Boolean | Automatically generate ID when you create new Object          | false   |

## Examples

### Insert (Create) <a id="insert"></a>

```js
// Create single data
bdb.insertOne({ name: 'Bora', age: 19 })

// Create multiple data
bdb.insertMany([
	{ name: 'Burak', age: 19 },
	{ name: 'Baris', age: 26 },
])
```

### Find (Read) <a id="find"></a>

```js
// Find single data
bdb.findOne({ age: 19 })

// Find by ID
bdb.findById('b0df200b-00f3-4a5b-8389-233e928e84e6')

// You can also use functions
bdb.findOne((o) => o.age > 25)

// Find multiple data
bdb.findMany({ age: 19 })

// Get all data
bdb.findMany()
```

### Update <a id="update"></a>

```js
// Update single data
// It will set the age value of the data whose 'name' key is 'Bora' to 20.
bdb.updateOne({ name: 'Bora' }, { age: 20 })

// Update multiple data
// This will set the age values ​​of all data less than 18 years old as 20.
bdb.updateMany((o) => o.age < 18, { age: 20 })
```

### Delete <a id="delete"></a>

```js
// Delete single data
bdb.deleteOne({ name: 'Bora' })

// You can also use functions
bdb.deleteOne((o) => o.age < 20)

// Delete multiple data
bdb.deleteMany((o) => o.age < 20)
```

### Write <a id="write"></a>

```js
// Replace all data with specified in parameter
bdb.write([{ name: 'Bora' }])
```

### Shuffle <a id="shuffle"></a>

```js
// Shuffle data
bdb.shuffle()
```

### Sync <a id="sync"></a>

```js
// If syncOnWrite setting is false you have to use it to print data to json file.
bdb.sync()
```

---

## Developer Notes

- Use MongoDB.
