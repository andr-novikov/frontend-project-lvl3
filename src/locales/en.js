export default {
  translation: {
    header: 'RSS Aggregator',
    paragraph: "Start reading RSS today! It's easy, it's beautiful.",
    label: 'RSS Link',
    example: 'Example: https://ru.hexlet.io/lessons.rss',
    btnSubmit: 'Add',
    lngBtn: 'ru',
    state: {
      form: {
        success: 'RSS has been successfully loaded',
        error: {
          invalidURL: 'Link must be a valid URL',
          notOneOf: 'RSS already exists',
          required: 'The field must not be empty',
          network: 'Network Error',
          invalidRSS: 'The resource does not contain valid RSS',
          unknown: 'Unknown error',
        },
      },
    },
    feeds: 'Feeds',
    posts: 'Posts',
    btnModal: 'Preview',
    modal: {
      readMore: 'Read more',
      close: 'Close',
    },
  },
};
