export interface TrackDto {
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

export const isTrackDto = (data: unknown): data is TrackDto => {
  return (
    data &&
    typeof data === 'object' &&
    'name' in data &&
    'artistId' in data &&
    'albumId' in data &&
    'duration' in data &&
    !!data.name &&
    !!data.duration &&
    (!!data.artistId || data.artistId === null) &&
    (!!data.albumId || data.albumId === null)
  );
};
