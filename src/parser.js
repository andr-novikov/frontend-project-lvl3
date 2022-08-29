export default (data) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, 'text/xml');
  const channel = xmlDoc.querySelector('channel');
  if (xmlDoc.querySelector('parsererror') !== null || !channel) {
    const error = new Error();
    error.name = 'ParserError';
    throw error;
  }

  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;

  const posts = [];
  const items = channel.querySelectorAll('item');
  items.forEach((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const pubDate = item.querySelector('pubDate').textContent;

    posts.push({
      title: postTitle,
      description: postDescription,
      link,
      pubDate,
    });
  });

  return { title, description, posts };
};
