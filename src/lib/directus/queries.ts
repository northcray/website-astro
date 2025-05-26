import { readItem, readItems } from "@directus/sdk";
import directus from "./index";

export const getTopic = async (topicSlug: string) => {
  return await directus.request(
    readItem("topics", topicSlug, { fields: ["*"] }),
  );
};

export const getTopics = async () => {
  return await directus.request(readItems("topics", { fields: ["*"] }));
};

export const getArticles = async (topicSlug?: string) => {
  const status = { _eq: "published" };
  return await directus.request(
    readItems("articles", {
      fields: ["id", "title", "image", "topic.*", "first_published_at"],
      sort: ["-first_published_at"],
      filter: topicSlug ? { topic: { slug: { _eq: topicSlug } } } : { status },
      limit: 10,
    }),
  );
};

export const getPosts = async (type?: string) =>
  await directus.request(
    readItems("posts", {
      fields: ["slug", "date", "title", "type", "topics", "image"],
      filter: type ? { type: { _eq: type } } : {},
      sort: ["-date"],
      limit: 10,
    }),
  );

export type Posts = Awaited<ReturnType<typeof getPosts>>;

export const getGroups = async () =>
  await directus.request(
    readItems("groups", {
      fields: ["sort", "name", "short_name", "description", "website", "image"],
      sort: ["sort"],
    }),
  );

export const getEvents = async () =>
  await directus.request(
    readItems("events", {
      fields: [
        "id",
        "name",
        "start",
        "end",
        "category",
        "association_official",
        "location",
        "description",
      ],
      filter: { status: { _eq: "published" }, end: { _gt: "$NOW(+2 hours)" } },
      sort: ["start"],
    }),
  );

export const getAllEvents = async () =>
  await directus.request(
    readItems("events", {
      fields: [
        "*",
        "group.name",
        "group.image",
        "group.website",
        "meeting_place.*",
      ],
      sort: ["start"],
    }),
  );

export const getAssociation = async () =>
  await directus.request(
    readItem("association", "ncra", {
      fields: ["*"],
    }),
  );

export const getCommittee = async () =>
  await directus.request(
    readItems("committee", {
      fields: ["*"],
      filter: { end: { _null: true } },
      sort: ["sort"],
    }),
  );
