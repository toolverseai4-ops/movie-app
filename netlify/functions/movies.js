exports.handler = async function(event) {

  const search = event.queryStringParameters.search;
  const API_KEY = process.env.TMDB_API_KEY;

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search}`
  );

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
