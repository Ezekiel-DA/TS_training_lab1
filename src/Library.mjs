import { writeFile, readFile } from 'fs/promises'

import { Media } from './media.mjs'

export default class Library {
  constructor() {
    this.medias = []
    this.dirty = false
  }

  addMedia(media) {
    this.medias.push(media)
    this.dirty = true
  }

  removeMedia(media) {
    const idx = this.medias.findIndex(entry => entry === media)
    if (idx === -1) {
      console.log(`[W] media ${JSON.stringify(media)} not found, nothing to remove}`)
      return
    }
    this.medias.splice(idx, 1)
    this.dirty = true
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

  async save(filepath) {
    if (!this.dirty) {
      console.log(`[I] Skipping save; library unchanged`)
    }
    const json = JSON.stringify(this.medias)
    this.dirty = false
    return writeFile(filepath, json)
  }

  async load(filepath) {
    const contents = await readFile(filepath, 'utf8')
    const libContents = JSON.parse(contents)
    this.medias = libContents
    this.dirty = false
  }
}
