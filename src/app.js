// @ts-check

import i18next from 'i18next';
import onChange from 'on-change';
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

  const getRss = async (url) => {
    try {
      const response = await axios.get(url);
      console.log(response);
      const { title, description, posts } = parser(response.data);
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
