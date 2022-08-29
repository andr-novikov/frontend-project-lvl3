// @ts-check

import i18next from 'i18next';
import onChange from 'on-change';
// import { string, setLocale } from 'yup';
import axios from 'axios';
import _ from 'lodash';
import resources from './locales/index.js';
import { render, stateRender } from './render.js';
import validate from './validate.js';
import parser from './parser.js';

const defaultLanguage = 'ru';

export default async () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    lngBtn: document.querySelector('.language-change'),
    header: document.querySelector('.main-header'),
    paragraph: document.querySelector('.main-paragraph'),
    label: document.querySelector('.main-label'),
    example: document.querySelector('.main-example'),
    feedback: document.querySelector('.feedback'),
    submitBtn: document.querySelector('.main-add-btn'),
    postsEl: document.querySelector('.posts'),
    feedsEl: document.querySelector('.feeds'),
    modal: document.querySelector('.modal'),
  };

  const state = {
    language: defaultLanguage,
    form: {
      valid: true,
      processState: 'filling',
      // filling  processing  error  success
      error: null,
      // error: null,
    },
    data: {
      feeds: [],
      // { id, url, title, description }
      posts: [],
      // { id, feedId, pubDate, title, url }
    },
    modalPostId: null,
    visitedPosts: [],
    // id
  };

  const i18nInstance = i18next.createInstance();
  await i18nInstance.init({
    lng: state.language,
    debug: false,
    resources,
  });

  const watchedState = onChange(state, stateRender(elements, i18nInstance, state));
  render(elements, i18nInstance, state);

const temp22 = `"<title>Новые уроки на Хекслете</title>
<description>Практические уроки по программированию</description>
<link>https://ru.hexlet.io/</link>
<webMaster>info@hexlet.io</webMaster>
<item>
  <title>XOR / Теория множеств</title>
  <guid isPermaLink=\"false\">2889</guid>
  <link>https://ru.hexlet.io/courses/set-theory/lessons/xor/theory_unit</link>
  <description>Цель: Одна из шестнадцати возможных бинарных операций над булевыми операндами</description>
  <pubDate>Wed, 24 Aug 2022 09:59:23 +0000</pubDate>
</item>
<item>
  <title>Закон Де Моргана / Теория множеств</title>
  <guid isPermaLink=\"false\">2887</guid>
  <link>https://ru.hexlet.io/courses/set-theory/lessons/de_morgan/theory_unit</link>
  <description>Цель: Изучим два условия, которые задаются в законе Де Моргана</description>
  <pubDate>Tue, 23 Aug 2022 07:55:53 +0000</pubDate>
</item>
<item>
  <title>Хуки useCallback и useMemo / JS: React Hooks</title>
  <guid isPermaLink=\"false\">2907</guid>
  <link>https://ru.hexlet.io/courses/js-react-hooks/lessons/use-callback/theory_unit</link>
  <description>Цель: Научиться создавать мемоизированные значения</description>
  <pubDate>Fri, 19 Aug 2022 14:26:14 +0000</pubDate>
</item>
<item>
  <title>Непересекающиеся множества / Теория множеств</title>
  <guid isPermaLink=\"false\">2886</guid>
  <link>https://ru.hexlet.io/courses/set-theory/lessons/disjoint/theory_unit</link>
  <description>Цель: Узнаем особенности работы с непересекающимися множествами</description>
  <pubDate>Thu, 18 Aug 2022 13:22:35 +0000</pubDate>
</item>
<item>
  <title>Разность множеств / Теория множеств</title>
  <guid isPermaLink=\"false\">2885</guid>
  <link>https://ru.hexlet.io/courses/set-theory/lessons/difference/theory_unit</link>
  <description>Цель: Разберемся, что такое разность множеств, и как ее использовать</description>
  <pubDate>Thu, 18 Aug 2022 13:01:24 +0000</pubDate>
</item>
<item>
  <title>Дополнение / Теория множеств</title>
  <guid isPermaLink=\"false\">2884</guid>
  <link>https://ru.hexlet.io/courses/set-theory/lessons/complement/theory_unit</link>
  <description>Цель: Что такое дополнение, и когда его использовать</description>
  <pubDate>Thu, 18 Aug 2022 08:19:21 +0000</pubDate>
</item>
<item>
  <title>Пересечение / Теория множеств</title>
  <guid isPermaLink=\"false\">2883</guid>
  <link>https://ru.hexlet.io/courses/set-theory/lessons/intesect/theory_unit</link>
  <description>Цель: Что такое пересечение, и когда его использовать</description>
  <pubDate>Thu, 18 Aug 2022 07:21:50 +0000</pubDate>
</item>
<item>
  <title>Объединение / Теория множеств</title>
  <guid isPermaLink=\"false\">2882</guid>
  <link>https://ru.hexlet.io/courses/set-theory/lessons/union/theory_unit</link>
  <description>Цель: Что такое объединение и как оно связано с союзом «или»</description>
  <pubDate>Thu, 18 Aug 2022 07:04:34 +0000</pubDate>
</item>
<item>
  <title>ПДНФ и ПКНФ / Введение в математическую логику</title>
  <guid isPermaLink=\"false\">2801</guid>
  <link>https://ru.hexlet.io/courses/logic/lessons/pdnf_and_pcnf/theory_unit</link>
  <description>Цель: Рассмотреть полную дизъюнктивную нормальную форму (ПДНФ) и полную конъюктивную нормальную форму (ПКНФ).</description>
  <pubDate>Thu, 18 Aug 2022 06:44:53 +0000</pubDate>
</item>
<item>
  <title>Нотации / Теория множеств</title>
  <guid isPermaLink=\"false\">2881</guid>
  <link>https://ru.hexlet.io/courses/set-theory/lessons/symbols/theory_unit</link>
  <description>Цель: Изучаем символы и основные формулы</description>
  <pubDate>Wed, 17 Aug 2022 17:57:40 +0000</pubDate>
</item>
</channel>
</rss>
"`;

  const getRss = async (url) => {
    try {
      const response = await axios.get(url);
      console.log(response);
      const { title, description, posts } = parser(response.data);
      // const { title, description, posts } = parser(temp22);
      const feedId = _.uniqueId('f');
      const feed = {
        title,
        description,
        id: feedId,
        url,
      };
      const postsNew = posts.map((post) => ({
        ...post,
        id: _.uniqueId('p'),
        feedId,
      }));
      watchedState.data.feeds.unshift(feed);
      watchedState.data.posts = [...postsNew, ...watchedState.data.posts]
        .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      watchedState.form.processState = 'success';
    } catch (err) {
      console.error(err);
      let error = 'unknown';
      if (err.name === 'AxiosError') error = 'network';
      if (err.name === 'ParserError') error = 'invalidRSS';
      watchedState.form.processState = 'error';
      watchedState.form.error = error;
    }
  };

  const changeLng = () => {
    const newLng = watchedState.language === 'ru' ? 'en' : 'ru';
    i18nInstance.changeLanguage(newLng).then(watchedState.language = newLng);
  };

  elements.lngBtn.addEventListener('click', changeLng);

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const feedUrls = watchedState.data.feeds.map((feed) => feed.url);
    watchedState.form.processState = 'processing';

    try {
      await validate(url, feedUrls);
      watchedState.form.valid = true;
      watchedState.form.error = null;
      getRss(url);
    } catch (err) {
      console.dir(err);
      watchedState.form.valid = false;
      watchedState.form.processState = 'error';
      watchedState.form.error = err.message;
    }
  });

  elements.form.addEventListener('input', () => {
    watchedState.form.processState = 'filling';
  });

  elements.feedsEl.addEventListener('click', (e) => {
    const { feedId } = e.target.dataset;
    if (e.target.tagName === 'BTN') {
      watchedState.data.feeds = watchedState.data.feeds.filter((feed) => feed.id !== feedId);
      watchedState.data.posts = watchedState.data.posts.filter((post) => post.feedId !== feedId);
    }
  });

  elements.postsEl.addEventListener('click', (e) => {
    const postId = e.target.dataset.id;
    if (e.target.tagName === 'BUTTON') {
      watchedState.modalPostId = postId;
    }
    if (!watchedState.visitedPosts.includes(postId)) {
      watchedState.visitedPosts.push(postId);
    }
  });
};
