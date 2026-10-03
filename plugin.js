"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("@libs/fetch");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var cheerio_1 = require("cheerio");
var SadsTranslatesForbiddenMaster = /** @class */ (function () {
    function SadsTranslatesForbiddenMaster() {
        this.id = 'sadsTranslatesForbiddenMaster';
        this.name = 'Sads Translates — Forbidden Master';
        this.site = 'https://sadstranslates.page';
        this.version = '1.0.0';
        this.icon = 'src/en/sadsTranslatesForbiddenMaster/icon.png';
        this.novelPath = '/projects/forbidden-master/';
    }
    SadsTranslatesForbiddenMaster.prototype.normalizePath = function (path) {
        return path
            .replace(/^https?:\/\/(?:sadstranslates\.page|sads07\.wordpress\.com)(?=\/|$)/i, '')
            .split(/[?#]/)[0];
    };
    SadsTranslatesForbiddenMaster.prototype.resolveUrl = function (path) {
        var relative = this.normalizePath(path);
        if (!relative.startsWith('/') || relative.startsWith('//')) {
            throw new Error('Unsupported Sads Translates URL');
        }
        return this.site + relative;
    };
    SadsTranslatesForbiddenMaster.prototype.document = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var response, $, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(path))];
                    case 1:
                        response = _b.sent();
                        if (!response.ok) {
                            throw new Error("Sads Translates returned HTTP ".concat(response.status));
                        }
                        _a = cheerio_1.load;
                        return [4 /*yield*/, response.text()];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        if (!$('article .entry-content').length) {
                            throw new Error('Sads Translates content was not found');
                        }
                        return [2 /*return*/, $];
                }
            });
        });
    };
    SadsTranslatesForbiddenMaster.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.parseNovel(this.novelPath)];
                    case 1:
                        novel = _a.sent();
                        return [2 /*return*/, [{ name: novel.name, path: novel.path, cover: novel.cover }]];
                }
            });
        });
    };
    SadsTranslatesForbiddenMaster.prototype.searchNovels = function (term, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, searchable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.popularNovels(1)];
                    case 1:
                        novels = _a.sent();
                        searchable = "".concat(novels[0].name, " Breakthrough with the Forbidden Master Kindan shitei de bureikusuruu Kindan shitei de bureikusur\u016B");
                        return [2 /*return*/, searchable.toLowerCase().includes(term.trim().toLowerCase())
                                ? novels
                                : []];
                }
            });
        });
    };
    SadsTranslatesForbiddenMaster.prototype.parseNovel = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var $, content, chapters, seen, lastNumber, paragraphs, author, genres, summary;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.normalizePath(path).replace(/\/$/, '') !==
                            this.novelPath.replace(/\/$/, '')) {
                            throw new Error('This plugin supports the Forbidden Master project');
                        }
                        return [4 /*yield*/, this.document(this.novelPath)];
                    case 1:
                        $ = _a.sent();
                        content = $('article .entry-content').first();
                        chapters = [];
                        seen = new Set();
                        lastNumber = 0;
                        content.find('a[href]').each(function (_, el) {
                            var link = $(el);
                            var chapterPath = _this.normalizePath(link.attr('href') || '');
                            var name = link.text().trim();
                            if (!/^\/\d{4}\/\d{2}\/\d{2}\/(?:forbidden-master-[^/]+|prologue)\/$/.test(chapterPath) ||
                                !name ||
                                seen.has(chapterPath))
                                return;
                            seen.add(chapterPath);
                            var number = name.match(/^Chapter\s+(\d+(?:\.\d+)?)/i);
                            // Keep extras between the main chapters, in the site's reading order.
                            lastNumber = number
                                ? Number(number[1])
                                : chapters.length
                                    ? lastNumber + 0.1
                                    : 0;
                            chapters.push({
                                name: name,
                                path: chapterPath,
                                chapterNumber: Math.round(lastNumber * 100) / 100,
                                releaseTime: chapterPath.slice(1, 11).replace(/\//g, '-'),
                            });
                        });
                        if (!chapters.length)
                            throw new Error('Forbidden Master chapter list was not found');
                        paragraphs = content.children('p');
                        author = paragraphs
                            .filter(function (_, el) { return /^Author:/.test($(el).text().trim()); })
                            .first()
                            .text()
                            .replace(/^Author:\s*/, '')
                            .trim();
                        genres = paragraphs
                            .filter(function (_, el) { return /^Tags:/.test($(el).text().trim()); })
                            .first()
                            .text()
                            .replace(/^Tags:\s*/, '')
                            .replace(/,\s*$/, '')
                            .trim();
                        summary = content.find('p.has-drop-cap').first().clone();
                        summary.find('br').replaceWith('\n');
                        return [2 /*return*/, {
                                path: this.novelPath,
                                name: $('h1.entry-title').first().text().trim() || 'Forbidden Master',
                                cover: content.find('figure img').first().attr('src') || defaultCover_1.defaultCover,
                                author: author,
                                genres: genres,
                                summary: summary.text().trim(),
                                status: novelStatus_1.NovelStatus.Unknown,
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    SadsTranslatesForbiddenMaster.prototype.parseChapter = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var $, content;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.document(path)];
                    case 1:
                        $ = _a.sent();
                        content = $('article .entry-content').first();
                        content
                            .find('script, style, iframe, noscript, form, .sharedaddy, #jp-post-flair, #wordads-inline-marker, .wordads-ad-wrapper, .wpcnt, .wp-block-buttons, .wp-block-jetpack-subscriptions')
                            .remove();
                        content.find('p').each(function (_, el) {
                            var paragraph = $(el);
                            var navigation = paragraph
                                .find('a')
                                .toArray()
                                .some(function (a) { return /^(?:TOC|Table of Contents)$/i.test($(a).text().trim()); });
                            if (navigation &&
                                /^(?:(?:Previous|Prev|Next|TOC|Table of Contents|Preview|Chapter)\s*[|«»←→-]*\s*)+$/i.test(paragraph.text().trim())) {
                                paragraph.remove();
                            }
                        });
                        content.find('img').each(function (_, el) {
                            var img = $(el);
                            var src = img.attr('data-src') || img.attr('src');
                            if (src)
                                img.attr('src', src.startsWith('//')
                                    ? 'https:' + src
                                    : src.startsWith('/')
                                        ? _this.site + src
                                        : src);
                            img.removeAttr('srcset').removeAttr('sizes').removeAttr('loading');
                        });
                        if (content.text().trim().length < 100) {
                            throw new Error('Sads Translates chapter text was empty or unavailable');
                        }
                        return [2 /*return*/, content.html() || ''];
                }
            });
        });
    };
    return SadsTranslatesForbiddenMaster;
}());
exports.default = new SadsTranslatesForbiddenMaster();
