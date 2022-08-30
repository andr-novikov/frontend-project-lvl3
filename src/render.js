// @ts-check

const handleProcessState = (elements, i18nInstance, processState) => {
  const {
    input, form, submitBtn, feedback,
  } = elements;

  submitBtn.disabled = false;
  input.disabled = false;
  input.focus();

  switch (processState) {
    case 'success':
      feedback.classList.add('text-success');
      feedback.classList.remove('text-danger');
      feedback.textContent = i18nInstance.t('state.form.success');
      break;
    case 'error':
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      break;

    case 'processing':
      submitBtn.disabled = true;
      input.disabled = true;
      break;

    case 'filling':
      form.reset();
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const renderModal = (elements, i18nInstance, post) => {
  const { modal } = elements;
  const closeBtn = modal.querySelector('.close-btn');
  const readMoreBtn = modal.querySelector('.read-more-btn');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');

  closeBtn.textContent = i18nInstance.t('modal.close');
  readMoreBtn.textContent = i18nInstance.t('modal.readMore');
  readMoreBtn.href = post.link;
  modalTitle.textContent = post.title;
  modalBody.innerHTML = post.description;
};

const renderPosts = (elements, i18nInstance, posts) => {
  const { postsEl } = elements;
  postsEl.innerHTML = '';
  if (posts.length === 0) {
    return;
  }

  const postsCard = document.createElement('div');
  postsCard.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nInstance.t('posts');
  cardBody.appendChild(cardTitle);

  const postList = document.createElement('ul');
  postList.classList.add('list-group', 'border-0');

  posts.forEach((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    const postTitle = document.createElement('a');
    postTitle.classList.add('fw-bold');
    postTitle.setAttribute('href', post.link);
    postTitle.setAttribute('data-id', post.id);
    postTitle.setAttribute('target', '_blank');
    postTitle.setAttribute('rel', 'noopener noreferrer');
    postTitle.textContent = post.title;

    const btnModal = document.createElement('button');
    btnModal.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btnModal.setAttribute('type', 'button');
    btnModal.setAttribute('data-id', post.id);
    btnModal.setAttribute('data-bs-toggle', 'modal');
    btnModal.setAttribute('data-bs-target', '#modal');
    btnModal.textContent = i18nInstance.t('btnModal');
    postItem.append(postTitle, btnModal);
    postList.append(postItem);
  });

  postsCard.append(cardBody, postList);
  postsEl.append(postsCard);
};

const renderVisitedPosts = (elements, visitedPosts) => {
  const { postsEl } = elements;
  const posts = postsEl.querySelectorAll('ul li a');
  posts.forEach((post) => {
    if (visitedPosts.includes(post.dataset.id)) {
      post.classList.remove('fw-bold');
      post.classList.add('fw-normal', 'text-muted');
    }
  });
};

const renderFeeds = (elements, i18nInstance, feeds) => {
  const { feedsEl } = elements;
  feedsEl.innerHTML = '';
  if (feeds.length === 0) {
    return;
  }

  const feedsCard = document.createElement('div');
  feedsCard.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nInstance.t('feeds');
  cardBody.appendChild(cardTitle);

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0');

  feeds.forEach((feed) => {
    const feedItem = document.createElement('li');
    feedItem.classList.add('list-group-item', 'list-group-item-action', 'py-3', 'border-0');
    feedItem.setAttribute('data-feed-id', feed.id);

    const feedElGroup = document.createElement('div');
    feedElGroup.classList.add('pe-none');
    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.title;
    const feedDescription = document.createElement('p');
    feedDescription.classList.add('small', 'm-0');
    feedDescription.textContent = feed.description;
    const btnClose = document.createElement('button');
    btnClose.classList.add('btn-close', 'ms-auto', 'd-block');
    btnClose.setAttribute('type', 'button');
    btnClose.setAttribute('aria-label', 'Close');
    btnClose.setAttribute('data-feed-id', feed.id);
    feedElGroup.append(feedTitle, feedDescription);
    feedItem.append(btnClose, feedElGroup);
    feedsList.append(feedItem);
  });

  feedsCard.append(cardBody, feedsList);
  feedsEl.append(feedsCard);
};

const renderActiveFeed = (elements, activeFeedId) => {
  const feeds = elements.feedsEl.querySelectorAll('li[data-feed-id]');
  feeds.forEach((feed) => {
    if (feed.dataset.feedId === activeFeedId) {
      feed.classList.add('active');
    } else {
      feed.classList.remove('active');
    }
  });
};

export const render = (elements, i18nInstance, state) => {
  const {
    header,
    paragraph,
    label,
    example,
    submitBtn,
    lngBtn,
    feedback,
  } = elements;

  header.textContent = i18nInstance.t('header');
  paragraph.textContent = i18nInstance.t('paragraph');
  label.textContent = i18nInstance.t('label');
  example.textContent = i18nInstance.t('example');
  submitBtn.textContent = i18nInstance.t('btnSubmit');
  lngBtn.textContent = i18nInstance.t('lngBtn');

  let feedbackText = '';
  if (state.form.processState === 'success') feedbackText = i18nInstance.t('state.form.success');
  if (state.form.processState === 'error') feedbackText = i18nInstance.t(`state.form.error.${state.form.error}`);
  feedback.textContent = feedbackText;
  renderFeeds(elements, i18nInstance, state.data.feeds);
  let posts = [...state.data.posts];
  if (state.activeFeedId !== null) {
    renderActiveFeed(elements, state.activeFeedId);
    posts = posts.filter((post) => post.feedId === state.activeFeedId);
  }
  renderPosts(elements, i18nInstance, posts);
  renderVisitedPosts(elements, state.visitedPosts);
};

export const stateRender = (elements, i18nInstance, state) => (path, value) => {
  const { feedback } = elements;

  switch (path) {
    case 'language':
      render(elements, i18nInstance, state);
      break;
    case 'form.processState':
      handleProcessState(elements, i18nInstance, value);
      break;
    case 'form.error':
      feedback.textContent = value ? i18nInstance.t(`state.form.error.${value}`) : '';
      break;
    case 'form.valid':
      if (value) {
        elements.input.classList.remove('is-invalid');
      } else {
        elements.input.classList.add('is-invalid');
      }
      break;
    case 'data.posts':
      renderPosts(elements, i18nInstance, value);
      renderVisitedPosts(elements, state.visitedPosts);
      break;
    case 'data.feeds':
      renderFeeds(elements, i18nInstance, value);
      break;
    case 'modalPostId':
      renderModal(elements, i18nInstance, state.data.posts.find((post) => post.id === value));
      break;
    case 'visitedPosts':
      renderVisitedPosts(elements, value);
      break;
    case 'activeFeedId': {
      renderActiveFeed(elements, value);
      const postsByFeed = value
        ? state.data.posts.filter((post) => post.feedId === value)
        : state.data.posts;
      renderPosts(elements, i18nInstance, postsByFeed);
      renderVisitedPosts(elements, state.visitedPosts);
    }
      break;
    default:
      break;
  }
};
