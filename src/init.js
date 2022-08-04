// @ts-check

import i18next from 'i18next';
import onChange from 'on-change';
import { string } from 'yup';
import resources from './locales/index.js';
import { render, renderForm } from './render.js';

export default async () => {
  const defaultLanguage = 'ru';

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    lngBtn: document.querySelector('.language-change'),
    textElements: {
      header: document.querySelector('.main-header'),
      paragraph: document.querySelector('.main-paragraph'),
      label: document.querySelector('.main-label'),
      example: document.querySelector('.main-example'),
      feedback: document.querySelector('.feedback'),
      mainBtn: document.querySelector('.main-add-btn'),
      lngBtn: document.querySelector('.language-change'),
    },
  };

  const state = {
    language: defaultLanguage,
    form: {
      valid: true,
      processState: 'filling',
      processError: null,
      errors: {},
      data: {
        url: '',
        feeds: [],
        content: [],
      },
    },
  };

  const i18nInstance = i18next.createInstance();
  await i18nInstance.init({
    lng: state.language,
    debug: false,
    resources,
  });

  const watchedState = onChange(state, async (path, value, previousValue) => {
    console.log('path =', path)
    console.log('value =', value)
    switch (path) {
      case 'language':
        console.log('language tut');
        i18nInstance.changeLanguage(value).then(() => render(watchedState, i18nInstance, elements));
        break;
      case 'form.data.url': {
        const schema = string().url();
        watchedState.form.valid = await schema.isValid(value);
        renderForm(watchedState, i18nInstance, elements);
        break;
      }
      default:
        break;
    }
  });

  render(watchedState, i18nInstance, elements);

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.form.data.url = url;
  });

  const changeLng = () => {
    const newLng = watchedState.language === 'ru' ? 'en' : 'ru';
    watchedState.language = newLng;
  };

  elements.lngBtn.addEventListener('click', changeLng);
};
