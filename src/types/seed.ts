export interface SeedDetail {
    id: number;
    title: string;
    originalTitle: string;
    year: string;
    region: string;
    actors: string[];
    genres: string[];
    quality: string;
    resolution: string;
    subtitles: string;
    publisher: string;
    publisherLevel: string;
    size: string;
    repliesViews: string;
    publishTime: string;
    lastSeedTime: string;
    seedId: string;
    files: number;
    seeds: number;
    downloads: number;
    completions: number;
    attachments: number;
    description?: string;
    otherVersions?: string[];
    rating?: number;
    ratingCount?: number;
}