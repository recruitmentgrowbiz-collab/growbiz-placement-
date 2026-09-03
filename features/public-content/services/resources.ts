import { careerResources } from "@/features/public-content/mock/content";

export async function getCareerResources() {
  return careerResources;
}

export async function getFeaturedCareerResources() {
  return careerResources.filter((resource) => resource.featured);
}

export async function getCareerResourceBySlug(slug: string) {
  return careerResources.find((resource) => resource.slug === slug) ?? null;
}
