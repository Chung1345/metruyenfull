const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = "https://metruyenfull.org";

// Lấy danh sách truyện (Discovery)
async function getDiscovery() {
    const response = await axios.get(BASE_URL);
    const $ = cheerio.load(response.data);
    const books = [];

    $('.list-truyen .truyen-item').each((index, element) => {
        books.push({
            title: $(element).find('.title a').text().trim(),
            url: BASE_URL + $(element).find('.title a').attr('href'),
            cover: $(element).find('.cover img').attr('data-src'),
            description: $(element).find('.description').text().trim(),
        });
    });

    return books;
}

// Lấy chi tiết thông tin truyện
async function getDetails(bookUrl) {
    const response = await axios.get(bookUrl);
    const $ = cheerio.load(response.data);

    return {
        title: $('.truyen-title').text().trim(),
        author: $('.info .author').text().trim(),
        genres: $('.info .genre').text().trim(),
        summary: $('.summary .content').text().trim(),
    };
}

// Lấy danh sách chương
async function getChapterList(bookUrl) {
    const response = await axios.get(`${bookUrl}/danh-sach-chuong`);
    const $ = cheerio.load(response.data);
    const chapters = [];

    $('.list-chapter .chapter-item').each((index, element) => {
        chapters.push({
            title: $(element).find('.chapter-title').text().trim(),
            url: BASE_URL + $(element).find('a').attr('href'),
        });
    });

    return chapters;
}

// Lấy nội dung chương
async function getChapterContent(chapterUrl) {
    const response = await axios.get(chapterUrl);
    const $ = cheerio.load(response.data);

    return {
        content: $('.chapter-content').html(),
    };
}

module.exports = {
    getDiscovery,
    getDetails,
    getChapterList,
    getChapterContent,
};
