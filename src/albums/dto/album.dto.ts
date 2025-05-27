export interface AlbumDto {
  name: string;
  year: number;
  artistId: string | null;
}

export const isAlbumDto = (data: unknown): data is AlbumDto => {
  return (
    data &&
    typeof data === 'object' &&
    'name' in data &&
    'year' in data &&
    'artistId' in data &&
    typeof data.name === 'string' &&
    typeof data.year === 'number' &&
    (typeof data.artistId === 'string' || data.artistId === null)
  );
};
