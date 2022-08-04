// @ts-check

export const render = (state, i18nInstance, elements) => {
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

export const renderForm = (state, i18nInstance, elements) => {
  const { input } = elements;
  const { feedback } = elements.textElements;

  if (!state.form.valid) {
    feedback.textContent = 'Ресурс не содержит валидный RSS';
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
    input.focus();
  } else {
    feedback.textContent = 'RSS успешно загружен';
    feedback.classList.add('text-success');
    feedback.classList.remove('text-danger');
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
  }
};
