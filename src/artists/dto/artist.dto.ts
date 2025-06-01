export interface ArtistDto {
  name: string;
  grammy: boolean;
}

export const isArtistDto = (data: unknown): data is ArtistDto => {
  return (
    data &&
    typeof data === 'object' &&
    'name' in data &&
    'grammy' in data &&
    typeof data.name === 'string' &&
    typeof data.grammy === 'boolean'
  );
};
