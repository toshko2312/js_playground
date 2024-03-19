export interface DetailedMovie {
	adult: boolean;
	backdrop_path: string;
	belongs_to_collection: string;
	budget: number;
	genres: [
		{
			id: number;
			name: string;
		}
	];
	homepage: string;
	id: number;
	imdb_id: string;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: [
		{
			id: number;
			logo_path: string;
			name: string;
			origin_country: string;
		}
	];
	production_countries: [
		{
			iso_3166_1: string;
			name: string;
		}
	];
	release_date: string;
	revenue: number;
	runtime: number;
	spoken_languages: [
		{
			english_name: string;
			iso_639_1: string;
			name: string;
		}
	];
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

interface Review {
	author: string
	author_details: {
		name: string
		username: string
		avatar_path: string
		rating: string
	}
	content: string
	created_at: string
	id: string
	updated_at: string
	url: string
}

export interface Reviews {
	id: number
	page: number
	results: [Review]
	total_pages: number
	total_results: number
}

export interface AlternativeTitles {
	id: number
	titles: [{
		iso_3166_1: string
		title: string
		type: string
	}]
}

interface Cast {
	adult: boolean
	gender: number
	id: number
	known_for_department: string
	name: string
	original_name: string
	popularity: number
	profile_path: string
	cast_id: number
	character: string
	credit_id: number
	order: number
}

interface Crew {
	adult: boolean
	gender: number
	id: number
	known_for_department: string
	name: string
	original_name: string
	popularity: number
	profile_path: string
	credit_id: number
	department: string
	job: string
}

export interface Credits {
	id: number
	cast: [Cast]
	crew: [Crew]
}

export interface UserRating {
	id: number
	favorite: boolean
	rated: {
		value: number
	}
	watchlist: boolean
}

export interface Video {
	id: number
	results: [{
		iso_639_1: string
		iso_3166_1: string
		name: string
		key: string
		site: string
		size: number
		type: string
		official: boolean
		published_at: string
		id: number
	}]
}

export interface SimilarMoviesData {
	results: [Partial<DetailedMovie>]
}