import { confirm, input, select } from '@inquirer/prompts'

import { Book, Movie, Magazine } from './src/Media.mjs'
import Library from './src/Library.mjs'

const LIBRARY_FILE = './lab1_library_file.json'

async function promptForNewBook(library) {
  const title = await input({ message: 'Title?' })
  const author = await input({ message: 'Author?' })
  const date = await input({ message: 'Publication year?' })
  const pages = await input({ message: 'Number of pages?' })

  return library.addMedia(new Book(title, author, date, pages))
}

async function promptForNewMovie(library) {
  const title = await input({ message: 'Title?' })
  const author = await input({ message: 'Director?' })
  const date = await input({ message: 'Release year?' })
  const runtime = await input({ message: 'Runtime?' })

  return library.addMedia(new Movie(title, author, date, runtime))
}

async function promptForMediaToFind(library) {
  const findBy = await select({
    message: 'Find by:',
    choices: [ { name: 'Title', value: 'title', description: 'Title'}, { name: 'Author', value: 'author', description: 'Author / Director'} ]
  })

  const query = await input({ message: 'search term?' })

  const res = library.findMedia({
    title: findBy === 'title' ? query : undefined,
    author: findBy === 'author' ? query : undefined
  })

  return res
}

async function promptForMediaToDelete(library) {
  const mediaToDelete = await promptForMediaToFind(library)
  console.log(`Deleting ${JSON.stringify(mediaToDelete)}`)
  const confirmDeletion = await confirm({ message: 'Delete?' })
  if (confirmDeletion) {
    await library.removeMedia(mediaToDelete)
  }
}

async function main() {
  const lib = new Library(LIBRARY_FILE)
  await lib.load()

  let action

  while (action !== 'quit') {
    action = await select({
      message: 'Select an action',
      choices: [
        { name: 'Add book', value: 'addBook', description: 'Add a new book to your library' },
        { name: 'Add movie', value: 'addMovie', description: 'Add a new movie to your library' },
        { name: 'Find media', value: 'findMedia', description: 'Find library entry by title or author' },
        { name: 'Remove media', value: 'delMedia', description: 'Remove library entry by title or author' },
        { name: 'Show library', value: 'show', description: 'List the contents of your library' },
        { name: 'Quit', value: 'quit', description: 'Exit application' }
      ]
    })
  
    switch (action) {
      case 'addBook':
        await promptForNewBook(lib)
        break
      case 'addMovie':
        await promptForNewMovie(lib)
        break
      case 'findMedia':
        const foundMedia = await promptForMediaToFind(lib)
        console.log(foundMedia)
        break
      case 'delMedia':
        await promptForMediaToDelete(lib)
      case 'show':
        console.log(lib)
        break
      default:
        // noop
    }
  }
}

await main()
