import { string, setLocale } from 'yup';

export default async (url, feedUrls) => {
  setLocale({
    mixed: {
      required: () => 'required',
      notOneOf: () => 'notOneOf',
    },
    string: {
      url: () => 'invalidURL',
    },
  });

  const schema = string()
    .required()
    .url()
    .notOneOf(feedUrls);

  await schema.validate(url);
};
