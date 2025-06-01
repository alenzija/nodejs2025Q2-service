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
    typeof data.name === 'string' &&
    typeof data.duration === 'number' &&
    (typeof data.artistId === 'string' || data.artistId === null) &&
    (typeof data.albumId === 'string' || data.albumId === null)
  );
};
