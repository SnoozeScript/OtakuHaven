import { GraphQLClient, gql } from 'graphql-request';

const ANILIST_API = 'https://graphql.anilist.co';
const client = new GraphQLClient(ANILIST_API);

export async function searchAnime({
  query = '',
  page = 1,
  perPage = 24,
  genre = '',
  sort = 'POPULARITY_DESC',
  season = '',
  year = '',
  format = ''
}) {
  const SEARCH_QUERY = gql`
    query (
      $search: String,
      $page: Int,
      $perPage: Int,
      $genre: String,
      $sort: [MediaSort],
      $season: MediaSeason,
      $seasonYear: Int,
      $format: MediaFormat
    ) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(
          search: $search,
          type: ANIME,
          genre: $genre,
          sort: $sort,
          season: $season,
          seasonYear: $seasonYear,
          format: $format
        ) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            medium
          }
          description
          episodes
          duration
          genres
          meanScore
          popularity
          status
          season
          seasonYear
          format
          source
          studios {
            nodes {
              name
            }
          }
          nextAiringEpisode {
            episode
            timeUntilAiring
          }
          startDate {
            year
            month
            day
          }
        }
      }
    }
  `;

  const variables = {
    search: query,
    page,
    perPage,
    genre: genre || undefined,
    sort: [sort],
    season: season || undefined,
    seasonYear: year ? parseInt(year) : undefined,
    format: format || undefined
  };

  try {
    const response = await client.request(SEARCH_QUERY, variables);
    return {
      media: response.Page.media,
      pageInfo: response.Page.pageInfo
    };
  } catch (error) {
    console.error('Error in searchAnime:', error);
    throw new Error('Failed to fetch anime data');
  }
}

// Helper function to get trending anime
export async function getTrendingAnime(page = 1, perPage = 6) {
  return searchAnime({
    page,
    perPage,
    sort: 'TRENDING_DESC'
  });
}

// Helper function to get popular anime
export async function getPopularAnime(page = 1, perPage = 6) {
  return searchAnime({
    page,
    perPage,
    sort: 'POPULARITY_DESC'
  });
}

// Helper function to get top rated anime
export async function getTopRatedAnime(page = 1, perPage = 6) {
  return searchAnime({
    page,
    perPage,
    sort: 'SCORE_DESC'
  });
}

// Helper function to get seasonal anime
export async function getSeasonalAnime(season, year, page = 1, perPage = 6) {
  return searchAnime({
    page,
    perPage,
    season,
    year,
    sort: 'POPULARITY_DESC'
  });
}