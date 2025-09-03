export interface BaseMedia {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  rating: number;
  genres: string[];
  duration?: number;
  language: string;
  country: string;
  cast: CastMember[];
  crew: CrewMember[];
  trailerUrl?: string;
  isWatchlisted: boolean;
  watchProgress?: number;
}

export interface Movie extends BaseMedia {
  type: 'movie';
  budget?: number;
  revenue?: number;
  imdbId?: string;
  tmdbId?: number;
}

export interface TVShow extends BaseMedia {
  type: 'tv';
  numberOfSeasons: number;
  numberOfEpisodes: number;
  seasons: Season[];
  status: 'Returning Series' | 'Ended' | 'Canceled' | 'In Production';
  network: string;
  firstAirDate: string;
  lastAirDate?: string;
}

export interface Season {
  seasonNumber: number;
  episodeCount: number;
  airDate: string;
  overview: string;
  posterPath?: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  overview: string;
  airDate: string;
  runtime: number;
  stillPath?: string;
  voteAverage: number;
  watchProgress?: number;
}

export interface CastMember {
  id: string;
  name: string;
  character: string;
  profilePath?: string;
  order: number;
}

export interface CrewMember {
  id: string;
  name: string;
  job: string;
  department: string;
  profilePath?: string;
}

export type MediaType = 'movie' | 'tv';
export type Media = Movie | TVShow;
