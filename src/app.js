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
const monitoringInterval = 600000; // 10m

const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];

const createProxyUrl = (url) => {
  const proxyUrl = new URL('get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl;
};

const getRss = async (watchedState, url) => {
  const proxyUrl = createProxyUrl(url);
  try {
    const response = await axios.get(proxyUrl);
    const { title, description, posts } = parser(response.data.contents);
    watchedState.form.processState = 'success';
    const feedId = _.uniqueId('f');
    watchedState.data.feeds.unshift({
      title,
      description,
      id: feedId,
      url,
    });
    posts.forEach((post) => watchedState.data.posts.unshift({
      ...post,
      id: _.uniqueId('p'),
      feedId,
    }));
    watchedState.data.posts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    watchedState.form.processState = 'filling';
  } catch (err) {
    console.error(err);
    let error = 'unknown';
    if (err.name === 'AxiosError') error = 'network';
    if (err.name === 'ParserError') error = 'invalidRSS';
    watchedState.form.processState = 'error';
    watchedState.form.error = error;
  }
};

const feedsMonitoring = (watchedState) => {
  watchedState.data.feeds.forEach(async (feed) => {
    const proxyUrl = createProxyUrl(feed.url);
    try {
      const response = await axios.get(proxyUrl);
      const { posts } = parser(response.data.contents);
      const postsNew = posts.map((post) => ({
        ...post,
        id: _.uniqueId('p'),
        feedId: feed.id,
      }));
      const postsStateUrl = watchedState.data.posts
        .filter((post) => post.feedId === feed.id)
        .map((post) => post.link);
      postsNew.forEach((post) => {
        if (!postsStateUrl.includes(post.link)) {
          watchedState.data.posts.unshift(post);
        }
      });
    } catch (err) {
      console.error(err);
    }
  });
  setTimeout(() => feedsMonitoring(watchedState), monitoringInterval);
};

const changeLngHandler = (i18nInstance, watchedState) => () => {
  const newLng = watchedState.language === 'ru' ? 'en' : 'ru';
  i18nInstance.changeLanguage(newLng).then(watchedState.language = newLng);
};

const submitHandler = (watchedState) => async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');
  const feedUrls = watchedState.data.feeds.map((feed) => feed.url);
  watchedState.form.processState = 'processing';

  try {
    await validate(url, feedUrls);
    watchedState.form.valid = true;
    watchedState.form.error = null;
    getRss(watchedState, url);
  } catch (err) {
    watchedState.form.valid = false;
    watchedState.form.processState = 'error';
    watchedState.form.error = err.message;
  }
};

const feedHandler = (watchedState) => (e) => {
  const { feedId } = e.target.dataset;
  if (e.target.type === 'button') {
    watchedState.data.feeds = watchedState.data.feeds.filter((feed) => feed.id !== feedId);
    watchedState.data.posts = watchedState.data.posts.filter((post) => post.feedId !== feedId);
    const postsId = watchedState.data.posts.map((post) => post.id);
    watchedState.visitedPosts = watchedState.visitedPosts
      .filter((post) => postsId.includes(post));
  } else {
    watchedState.activeFeedId = watchedState.activeFeedId !== feedId ? feedId : null;
  }
};

const postHandler = (watchedState) => (e) => {
  const postId = e.target.dataset.id;
  if (e.target.type === 'button') {
    watchedState.modalPostId = postId;
  }
  if (!watchedState.visitedPosts.includes(postId)) {
    watchedState.visitedPosts.push(postId);
  }
};

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
    },
    data: {
      feeds: getLocalStorage('feeds'),
      // { id, url, title, description }
      posts: getLocalStorage('posts'),
      // { id, feedId, pubDate, title, link }
    },
    modalPostId: null,
    visitedPosts: getLocalStorage('visitedPosts'),
    activeFeedId: null,
    // id
  };

  const i18nInstance = i18next.createInstance();
  await i18nInstance.init({
    lng: state.language,
    debug: false,
    resources,
  });

  const watchedState = onChange(state, stateRender(elements, i18nInstance, state));

  elements.lngBtn.addEventListener('click', changeLngHandler(i18nInstance, watchedState));
  elements.form.addEventListener('submit', submitHandler(watchedState));
  elements.feedsEl.addEventListener('click', feedHandler(watchedState));
  elements.postsEl.addEventListener('click', postHandler(watchedState));

  render(elements, i18nInstance, state);
  feedsMonitoring(watchedState);
};
