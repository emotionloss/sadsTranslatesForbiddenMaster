import { Plugin } from '@/types/plugin';
import { fetchApi } from '@libs/fetch';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';
import { load } from 'cheerio';

class SadsTranslatesForbiddenMaster implements Plugin.PluginBase {
  id = 'sadsTranslatesForbiddenMaster';
  name = 'Sads Translates — Forbidden Master';
  site = 'https://sadstranslates.page';
  version = '1.0.0';
  icon = 'src/en/sadsTranslatesForbiddenMaster/icon.png';
  private novelPath = '/projects/forbidden-master/';

  private normalizePath(path: string): string {
    return path
      .replace(
        /^https?:\/\/(?:sadstranslates\.page|sads07\.wordpress\.com)(?=\/|$)/i,
        '',
      )
      .split(/[?#]/)[0];
  }

  resolveUrl(path: string): string {
    const relative = this.normalizePath(path);
    if (!relative.startsWith('/') || relative.startsWith('//')) {
      throw new Error('Unsupported Sads Translates URL');
    }
    return this.site + relative;
  }

  private async document(path: string) {
    const response = await fetchApi(this.resolveUrl(path));
    if (!response.ok) {
      throw new Error(`Sads Translates returned HTTP ${response.status}`);
    }
    const $ = load(await response.text());
    if (!$('article .entry-content').length) {
      throw new Error('Sads Translates content was not found');
    }
    return $;
  }

  async popularNovels(pageNo: number): Promise<Plugin.NovelItem[]> {
    if (pageNo > 1) return [];
    const novel = await this.parseNovel(this.novelPath);
    return [{ name: novel.name, path: novel.path, cover: novel.cover }];
  }

  async searchNovels(
    term: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    if (pageNo > 1) return [];
    const novels = await this.popularNovels(1);
    const searchable = `${novels[0].name} Breakthrough with the Forbidden Master Kindan shitei de bureikusuruu Kindan shitei de bureikusurū`;
    return searchable.toLowerCase().includes(term.trim().toLowerCase())
      ? novels
      : [];
  }

  async parseNovel(path: string): Promise<Plugin.SourceNovel> {
    if (
      this.normalizePath(path).replace(/\/$/, '') !==
      this.novelPath.replace(/\/$/, '')
    ) {
      throw new Error('This plugin supports the Forbidden Master project');
    }
    const $ = await this.document(this.novelPath);
    const content = $('article .entry-content').first();
    const chapters: Plugin.ChapterItem[] = [];
    const seen = new Set<string>();
    let lastNumber = 0;
    content.find('a[href]').each((_, el) => {
      const link = $(el);
      const chapterPath = this.normalizePath(link.attr('href') || '');
      const name = link.text().trim();
      if (
        !/^\/\d{4}\/\d{2}\/\d{2}\/(?:forbidden-master-[^/]+|prologue)\/$/.test(
          chapterPath,
        ) ||
        !name ||
        seen.has(chapterPath)
      )
        return;
      seen.add(chapterPath);
      const number = name.match(/^Chapter\s+(\d+(?:\.\d+)?)/i);
      // Keep extras between the main chapters, in the site's reading order.
      lastNumber = number
        ? Number(number[1])
        : chapters.length
          ? lastNumber + 0.1
          : 0;
      chapters.push({
        name,
        path: chapterPath,
        chapterNumber: Math.round(lastNumber * 100) / 100,
        releaseTime: chapterPath.slice(1, 11).replace(/\//g, '-'),
      });
    });
    if (!chapters.length)
      throw new Error('Forbidden Master chapter list was not found');
    const paragraphs = content.children('p');
    const author = paragraphs
      .filter((_, el) => /^Author:/.test($(el).text().trim()))
      .first()
      .text()
      .replace(/^Author:\s*/, '')
      .trim();
    const genres = paragraphs
      .filter((_, el) => /^Tags:/.test($(el).text().trim()))
      .first()
      .text()
      .replace(/^Tags:\s*/, '')
      .replace(/,\s*$/, '')
      .trim();
    const summary = content.find('p.has-drop-cap').first().clone();
    summary.find('br').replaceWith('\n');
    return {
      path: this.novelPath,
      name: $('h1.entry-title').first().text().trim() || 'Forbidden Master',
      cover: content.find('figure img').first().attr('src') || defaultCover,
      author,
      genres,
      summary: summary.text().trim(),
      status: NovelStatus.Unknown,
      chapters,
    };
  }

  async parseChapter(path: string): Promise<string> {
    const $ = await this.document(path);
    const content = $('article .entry-content').first();
    content
      .find(
        'script, style, iframe, noscript, form, .sharedaddy, #jp-post-flair, #wordads-inline-marker, .wordads-ad-wrapper, .wpcnt, .wp-block-buttons, .wp-block-jetpack-subscriptions',
      )
      .remove();
    content.find('p').each((_, el) => {
      const paragraph = $(el);
      const navigation = paragraph
        .find('a')
        .toArray()
        .some(a => /^(?:TOC|Table of Contents)$/i.test($(a).text().trim()));
      if (
        navigation &&
        /^(?:(?:Previous|Prev|Next|TOC|Table of Contents|Preview|Chapter)\s*[|«»←→-]*\s*)+$/i.test(
          paragraph.text().trim(),
        )
      ) {
        paragraph.remove();
      }
    });
    content.find('img').each((_, el) => {
      const img = $(el);
      const src = img.attr('data-src') || img.attr('src');
      if (src)
        img.attr(
          'src',
          src.startsWith('//')
            ? 'https:' + src
            : src.startsWith('/')
              ? this.site + src
              : src,
        );
      img.removeAttr('srcset').removeAttr('sizes').removeAttr('loading');
    });
    if (content.text().trim().length < 100) {
      throw new Error('Sads Translates chapter text was empty or unavailable');
    }
    return content.html() || '';
  }
}

export default new SadsTranslatesForbiddenMaster();
