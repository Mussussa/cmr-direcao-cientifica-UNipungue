import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url'; // <-- Alterado aqui

export const client = createClient({
  projectId: 'a5ayb18p',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-03-20',
});

const builder = createImageUrlBuilder(client); // <-- Alterado aqui

export function urlFor(source) {
  return builder.image(source);
}