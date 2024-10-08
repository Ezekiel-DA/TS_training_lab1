import { writeFile, readFile } from 'fs/promises'

import { Media } from './media.mjs'

async function saveLibrary(library) {
  const json = JSON.stringify(library.medias)
  return writeFile(library.filepath, json)
}

async function loadLibrary(library) {
  const contents = await readFile(library.filepath, 'utf8')
  const libContents = JSON.parse(contents)
  library.medias = libContents
}

export default class Library {
  constructor(libraryFilePath) {
    this.medias = []
    this.filepath = libraryFilePath
  }

  async load() {
    return loadLibrary(this)
  }

  async addMedia(media) {
    this.medias.push(media)
    return saveLibrary(this)
  }

  async removeMedia(media) {
    const idx = this.medias.findIndex(entry => entry === media)
    if (idx === -1) {
      console.log(`[W] media ${JSON.stringify(media)} not found, nothing to remove}`)
      return
    }
    this.medias.splice(idx, 1)
    return saveLibrary(this)
  }

  findMedia(query) {
    if (!query.title && !query.author) {
      throw new Error('Invalid argument: expected media query object with author or title property')
    }

    return this.medias.find(media => {
      if (query.title) {
        return media.title === query.title
      } else {
        return media.author === query.author
      }
    })
  }
}
