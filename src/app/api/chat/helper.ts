interface CleanupOptions {
  convertNumbers?: boolean
  addSSML?: boolean
  expandAbbreviations?: boolean
}

export class TextToSpeechCleaner {
  private abbreviations: Map<string, string> = new Map([
    ['AI', 'artificial intelligence'],
    ['API', 'application programming interface'],
    ['CEO', 'chief executive officer'],
    ['FAQ', 'frequently asked questions'],
    ['URL', 'web address'],
    ['etc.', 'et cetera'],
    ['e.g.', 'for example'],
    ['i.e.', 'that is']
    // Add more abbreviations as needed
  ])

  clean(text: string, options: CleanupOptions = {}): string {
    let cleanedText = text

    // 1. Remove markdown formatting
    cleanedText = this.removeMarkdown(cleanedText)

    // 2. Clean lists
    cleanedText = this.cleanLists(cleanedText)

    // 3. Handle links and URLs
    cleanedText = this.cleanLinks(cleanedText)

    // 4. Handle special characters (including dashes)
    cleanedText = this.cleanSpecialCharacters(cleanedText)

    // 5. Expand abbreviations if requested
    if (options.expandAbbreviations) {
      cleanedText = this.expandAbbreviations(cleanedText)
    }

    // 6. Clean whitespace
    cleanedText = this.cleanWhitespace(cleanedText)

    // 7. Add SSML tags if requested
    if (options.addSSML) {
      cleanedText = this.addSSMLTags(cleanedText)
    }

    return cleanedText.trim()
  }

  private removeMarkdown(text: string): string {
    // Remove bold
    text = text.replace(/\*\*(.+?)\*\*/g, '$1')

    // Remove italic
    text = text.replace(/\*(.+?)\*/g, '$1')
    text = text.replace(/_(.+?)_/g, '$1')

    // Remove headers
    text = text.replace(/^#{1,6}\s+/gm, '')

    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, '')

    // Remove inline code
    text = text.replace(/`(.+?)`/g, '$1')

    // Remove blockquotes
    text = text.replace(/^>\s+/gm, '')

    // Remove horizontal rules
    text = text.replace(/^[-*_]{3,}$/gm, '')

    return text
  }

  private cleanLists(text: string): string {
    // Remove unordered list markers (including dashes)
    text = text.replace(/^\s*[-*+]\s+/gm, '')

    // Remove ordered list markers
    text = text.replace(/^\s*\d+\.\s+/gm, '')

    // Remove task list markers
    text = text.replace(/^\s*\[[x\s]\]\s+/gim, '')

    return text
  }

  private cleanLinks(text: string): string {
    // Replace markdown links with just the text
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

    // Replace raw URLs with "web address" or remove them
    text = text.replace(/https?:\/\/[^\s]+/g, 'web address')

    // Remove email addresses
    text = text.replace(/[\w.-]+@[\w.-]+\.\w+/g, 'email address')

    return text
  }

  private cleanSpecialCharacters(text: string): string {
    // Remove or replace special characters
    text = text.replace(/[<>]/g, '')
    text = text.replace(/&/g, 'and')
    text = text.replace(/#/g, 'number')
    text = text.replace(/%/g, 'percent')
    text = text.replace(/\$/g, 'dollars')
    text = text.replace(/€/g, 'euros')
    text = text.replace(/£/g, 'pounds')

    // Remove dashes (multiple types)
    text = text.replace(/–/g, ' ') // en dash
    text = text.replace(/—/g, ' ') // em dash
    text = text.replace(/\s*-\s*/g, ' ') // hyphen with surrounding spaces
    text = text.replace(/^-\s*/gm, '') // dash at start of line

    // Handle hyphenated words (optional - you may want to keep these)
    // text = text.replace(/(\w+)-(\w+)/g, '$1 $2'); // Uncomment to split hyphenated words

    // Remove emoji (optional)
    text = text.replace(/[\u{1F600}-\u{1F6FF}]/gu, '')

    return text
  }

  private expandAbbreviations(text: string): string {
    // Sort by length (longest first) to avoid partial replacements
    const sortedAbbreviations = Array.from(this.abbreviations.entries()).sort(
      (a, b) => b[0].length - a[0].length
    )

    for (const [abbr, full] of sortedAbbreviations) {
      // Use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${abbr}\\b`, 'g')
      text = text.replace(regex, full)
    }

    return text
  }

  private cleanWhitespace(text: string): string {
    // Replace multiple newlines with double newline
    text = text.replace(/\n{3,}/g, '\n\n')

    // Replace multiple spaces with single space
    text = text.replace(/ {2,}/g, ' ')

    // Remove trailing spaces
    text = text.replace(/ +$/gm, '')

    return text
  }

  private addSSMLTags(text: string): string {
    // Add break tags for punctuation
    text = text.replace(/\./g, '.<break time="500ms"/>')
    text = text.replace(/,/g, ',<break time="300ms"/>')
    text = text.replace(/;/g, ';<break time="400ms"/>')
    text = text.replace(/:/g, ':<break time="400ms"/>')
    text = text.replace(/[!?]/g, '$&<break time="600ms"/>')

    // Add emphasis for quoted text
    text = text.replace(
      /"([^"]+)"/g,
      '<emphasis level="moderate">$1</emphasis>'
    )

    return text
  }

  // Stream processing for real-time applications
  cleanChunk(chunk: string): string {
    // Lightweight cleaning for streaming
    chunk = chunk.replace(/\*{1,2}/g, '')
    chunk = chunk.replace(/`/g, '')
    chunk = chunk.replace(/^#+\s*/gm, '')
    chunk = chunk.replace(/^\s*-\s*/gm, '') // Remove dash at start of line
    chunk = chunk.replace(/–|—/g, ' ') // Remove en/em dashes

    return chunk
  }
}
