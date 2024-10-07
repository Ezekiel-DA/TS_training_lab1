export class Media {
  constructor(title, author, year) {
    this.title = title
    this.author = author
    this.year = year
  }
}

export class Book extends Media {
  constructor(title, author, year, pages) {
    super(title, author, year)
    this.pages = pages
  }
}

export class Movie extends Media {
  constructor(title, author, year, duration) {
    super(title, author, year)
    this.duration = duration
  }
}

export class Magazine extends Media {
  constructor(title, author, year, issueNumber) {
    super(title, author, year)
    this.issueNumber = issueNumber
  }
}
