// @ts-check

export default (state, i18nInstance, elements) => {
  console.log('render tut\'')
  console.log('elements =', elements)

  const {
    header,
    paragraph,
    label,
    example,
    mainBtn,
    lngBtn,
  } = elements.textElements;

  header.textContent = i18nInstance.t('header');
  paragraph.textContent = i18nInstance.t('paragraph');
  label.textContent = i18nInstance.t('label');
  example.textContent = i18nInstance.t('example');
  mainBtn.textContent = i18nInstance.t('btn');
  lngBtn.textContent = i18nInstance.t('lngBtn');
};
