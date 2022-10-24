#! /usr/bin/env node

// utilisation de module debug
// https://docs.google.com/document/d/1PWQJCSq2Nm2rpnaeoe3bOVtLhfoCWbsEJc6GA_r2qew/edit?usp=sharing
// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Book = require('./models/book')
const Author = require('./models/author')
const mongoose = require('mongoose');
const printAuthor = require('debug')('populate:author')
         ,printBook = require('debug')('populate:book');

const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const authors = []
, books = [];

async function authorCreate(first_name, family_name, d_birth, d_death) {
  authordetail = {first_name:first_name , family_name: family_name }
  if (d_birth != false) authordetail.date_of_birth = d_birth
  if (d_death != false) authordetail.date_of_death = d_death
  
  try {
    const author = new Author(authordetail);
    let saveAuthor = await author.save(); //when fail its goes to catch
    printAuthor(saveAuthor); //when success it print.
    authors.push(author)
  } catch (err) {
    console.log('err' + err);
  }
}

async function bookCreate(title, summary, isbn, author) {
  bookdetail = { 
    title: title,
    summary: summary,
    author: author,
    isbn: isbn
  }
  try {
    const book = new Book(bookdetail);   
    let saveBook = await book.save(); //when fail its goes to catch
    printBook(saveBook); //when success it print.
    books.push(saveBook);
  } catch (err) {
    console.log('err' + err);
  }
}

async function createAuthors(){
  return Promise.all([
    authorCreate('Denis', 'Dupont', '02-09-1965', false),
    authorCreate('BoB', 'Synclair', '12-12-1963', '12-12-2022')
]) 
}

async function createBooks(){
  return Promise.all([
          bookCreate('Le CSS en action', 'GRID / FLEX en action', '111111111111', authors[0]),
          bookCreate('Le Rock ', 'Devenez danceur de saloom', '222222222222', authors[1]),
          bookCreate('Le JS en action', "Les closures n'ont plus de secret", '333333333333', authors[1])
  ])
}

async function createDB() {
  await createAuthors();
  await createBooks();
  mongoose.connection.close();
}

createDB();