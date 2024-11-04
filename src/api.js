// src/api.js
import { GraphQLClient, gql } from 'graphql-request';

const ANILIST_API = 'https://graphql.anilist.co';
const client = new GraphQLClient(ANILIST_API);

export async function searchAnime(query) {
  const SEARCH_QUERY = gql`
    query ($search: String) {
      Page(page: 1, perPage: 10) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
          description
          episodes
        }
      }
    }
  `;
  const variables = { search: query };
  const response = await client.request(SEARCH_QUERY, variables);
  return response.Page.media;
}
