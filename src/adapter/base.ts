import { parse as urlparse } from 'url'
import { parse as qsparse } from 'querystring'
import { extname } from 'path'
import { padStart, trimStart } from 'lodash'
import cheerio from 'cheerio'
import Debug from 'debug'
import { RawSong, Song } from '../types/index'

const debug = Debug('yun:adapter:base')
const NOT_IMPLEMENTED = 'not NOT_IMPLEMENTED'

export default class BaseAdapter {
  constructor() {
  }

  /**
   * get title for a page
   */

  getTitle($: CheerioAPI) {
    throw new Error(NOT_IMPLEMENTED)
  }

  /**
   * get detail
   */

  getDetail($: CheerioAPI, url: string, quality: number): Promise<RawSong[]> {
    throw new Error(NOT_IMPLEMENTED)
  }

  getId(url: string): string {
    const parsedUrl = urlparse(url)
    const parsedQuery = qsparse(parsedUrl.query)
    const id = parsedQuery.id as string
    debug('id = %s', id)
    return id
  }

  /**
   * get songs detail
   *
   * @param {Array} [songs] songs
   */

  getSongs(songs: RawSong[]): Song[] {
    // e.g 100 songs -> len = 3
    const len = String(songs.length).length

    return songs.map(function (song, index) {
      return {
        // 歌手
        singer: song.ar[0].name,

        // 歌曲名
        songName: song.name,

        // url for download
        url: song.ajaxData.url,

        // extension
        ext: trimStart(extname(song.ajaxData.url), '.'),

        // index, first as 01
        index: padStart(String(index + 1), len, '0'),

        // rawIndex: 0,1 ...
        rawIndex: index,
      }
    })
  }
}
