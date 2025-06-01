/** * Generated TypeScript types for Directus Schema * Generated on: 2025-06-01T12:15:37.563Z */
export interface Address {
  id: string;
  uprn: string;
  status: string;
  property_id: string;
  full_address: string;
  property_description: string;
  property_number: string;
  street: string;
  town: string;
  postcode: string;
  ward: string;
  user_profiles: number[] | UserProfile[];
  location: string;
  processed_at: "datetime";
}

export interface Area {
  id: string;
  description: string;
}

export interface Article {
  id: number;
  status: string;
  user_created: string | DirectusUser;
  date_created: "datetime";
  user_updated: string | DirectusUser;
  date_updated: "datetime";
  title: string;
  image: string | DirectusFile;
  blocks: unknown;
  first_published_at: "datetime";
  tags: Record<string, unknown>;
  topic: string | Topic;
  related_businesses: number[] | ArticlesBusiness[];
}

export interface ArticlesBlock {
  id: number;
  articles_id: number | Article;
  item: string;
  collection: string;
}

export interface ArticlesBusiness {
  id: number;
  articles_id: number | Article;
  businesses_id: string | Business;
}

export interface ArticlesTopic {
  id: number;
  articles_id: number | Article;
  topics_slug: string | Topic;
}

export interface Association {
  id: string;
  founded: "datetime";
  mission_statement: string;
  how_it_works: string;
  benefits: string;
  aims_and_objectives: string;
  how_to_help: string;
}

export interface BlockHero {
  id: number;
  heading: string;
  secondary_heading: string;
  secondary_sub_heading: string;
  subheading: string;
  size: string;
  content_aligned: string;
  aligned: string;
}

export interface Block {
  id: string;
}

export interface BlocksContent {
  id: string;
  type: string;
  content: string;
}

export interface BlocksGallery {
  id: string;
  type: string;
  items: number[] | BlocksGalleryFile[];
  title: string;
}

export interface BlocksGalleryFile {
  id: number;
  blocks_gallery_id: string | BlocksGallery;
  directus_files_id: string | DirectusFile;
  sort: number;
}

export interface Business {
  id: string;
  status: string;
  sort: number;
  date_updated: "datetime";
  title: string;
  address: string | Address;
  category: string;
  content: string;
}

export interface Committee {
  id: string;
  status: string;
  sort: number;
  user_updated: string | DirectusUser;
  date_updated: "datetime";
  name: string;
  position: string;
  email: string;
  end: "datetime";
  start: "datetime";
}

export interface Event {
  id: string;
  status: string;
  user_created: string | DirectusUser;
  date_created: "datetime";
  user_updated: string | DirectusUser;
  date_updated: "datetime";
  name: string;
  start: "datetime";
  end: "datetime";
  association_official: boolean;
  location: string;
  description: string;
  category: string;
  links: Record<string, unknown>;
  meeting_place: string;
  group: string | Group;
}

export interface Group {
  id: string;
  status: string;
  sort: number;
  user_created: string | DirectusUser;
  date_created: "datetime";
  user_updated: string | DirectusUser;
  date_updated: "datetime";
  name: string;
  short_name: string;
  description: string;
  content: string;
  website: string;
  image: string | DirectusFile;
}

export interface PageFeedback {
  id: string;
  date_created: "datetime";
  comment: string;
  page_url: string;
  user_agent: string;
  ip_address: string;
}

export interface Page {
  id: string;
  status: string;
  sort: number;
  user_created: string | DirectusUser;
  date_created: "datetime";
  user_updated: string | DirectusUser;
  date_updated: "datetime";
  title: string;
  slug: string;
  blocks: unknown;
  nav: string[] | Page[];
  parent_page: string | Page;
  content: string;
}

export interface PagesBlock {
  id: number;
  pages_id: string | Page;
  item: string;
  sort: number;
  collection: string;
}

export interface Payment {
  id: string;
  received: "datetime";
  related_user: number | UserProfile;
  amount: number;
}

export interface Post {
  id: string;
  status: string;
  user_created: string | DirectusUser;
  date_created: "datetime";
  user_updated: string | DirectusUser;
  date_updated: "datetime";
  type: string;
  title: string;
  date: "datetime";
  content: string;
  slug: string;
  topics: Record<string, unknown>;
  /** External link to hosted email service */
  hosted_link: string;
  attachments: number[] | PostsFile[];
  image: string | DirectusFile;
}

export interface PostsFile {
  id: number;
  posts_id: string | Post;
  directus_files_id: string | DirectusFile;
}

export interface SiteSettings {
  id: number;
  user_updated: string | DirectusUser;
  date_updated: "datetime";
  name: string;
  short_name: string;
  footer_caption: string;
  nav_items: Record<string, unknown>;
  color: string;
}

export interface SiteUpdate {
  id: number;
  date_created: "datetime";
  date_updated: "datetime";
  title: string;
  content: string;
  date: "datetime";
  public: boolean;
}

export interface Topic {
  id: string;
  slug: string;
  status: string;
  sort: number;
  title: string;
}

export interface UserProfile {
  id: number;
  date_updated: "datetime";
  user: string | DirectusUser;
  address: string | Address;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  phone: string;
  contact_preferences: Record<string, unknown>;
  mailerlite_subscriber_id: string;
  is_member: boolean;
}

export interface UserProfilesAddress {
  id: number;
  user_profiles_id: number;
  addresses_uprn: string;
}

export interface DirectusUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  location: string;
  title: string;
  description: string;
  tags: string;
  avatar: string;
  language: string;
  tfa_secret: boolean;
  status: string;
  role: string;
  token: string;
  last_access: string;
  last_page: string;
  provider: string;
  external_identifier: string;
  auth_data: string;
  email_notifications: boolean;
  appearance: string;
  theme_dark: string;
  theme_light: string;
  theme_light_overrides: string;
  theme_dark_overrides: string;
  policies: string;
}

export interface DirectusFile {
  id: string;
  storage: string;
  filename_disk: string;
  filename_download: string;
  title: string;
  type: string;
  folder: string;
  uploaded_by: string;
  uploaded_on: string;
  modified_by: string;
  modified_on: string;
  charset: string;
  filesize: number;
  width: number;
  height: number;
  duration: number;
  embed: string;
  description: string;
  location: string;
  tags: string;
  metadata: string;
  created_on: string;
  focal_point_x: string;
  focal_point_y: string;
  tus_id: string;
  tus_data: string;
}

export interface DirectusFolder {
  id: string;
  name: string;
  parent: string;
}

export interface DirectusRole {
  id: string;
  name: string;
  icon: string;
  description: string;
  admin_access: boolean;
  app_access: boolean;
  children: string;
  users: string;
  parent: string;
  policies: string;
}

export interface DirectusSchema {
  addresses: Address[];
  area: Area;
  articles: Article[];
  articles_blocks: ArticlesBlock[];
  articles_businesses: ArticlesBusiness[];
  articles_topics: ArticlesTopic[];
  association: Association;
  block_hero: BlockHero[];
  blocks: Block[];
  blocks_content: BlocksContent[];
  blocks_gallery: BlocksGallery[];
  blocks_gallery_files: BlocksGalleryFile[];
  businesses: Business[];
  committee: Committee[];
  events: Event[];
  groups: Group[];
  page_feedback: PageFeedback[];
  pages: Page[];
  pages_blocks: PagesBlock[];
  payments: Payment[];
  posts: Post[];
  posts_files: PostsFile[];
  site_settings: SiteSettings;
  site_updates: SiteUpdate[];
  topics: Topic[];
  user_profiles: UserProfile[];
  user_profiles_addresses: UserProfilesAddress[];
  directus_users: DirectusUser[];
  directus_files: DirectusFile[];
  directus_folders: DirectusFolder[];
  directus_roles: DirectusRole[];
}

export interface DirectusSchema {
  addresses: Address[];
  area: Area;
  articles: Article[];
  articles_blocks: ArticlesBlock[];
  articles_businesses: ArticlesBusiness[];
  articles_topics: ArticlesTopic[];
  association: Association;
  block_hero: BlockHero[];
  blocks: Block[];
  blocks_content: BlocksContent[];
  blocks_gallery: BlocksGallery[];
  blocks_gallery_files: BlocksGalleryFile[];
  businesses: Business[];
  committee: Committee[];
  events: Event[];
  groups: Group[];
  page_feedback: PageFeedback[];
  pages: Page[];
  pages_blocks: PagesBlock[];
  payments: Payment[];
  posts: Post[];
  posts_files: PostsFile[];
  site_settings: SiteSettings;
  site_updates: SiteUpdate[];
  topics: Topic[];
  user_profiles: UserProfile[];
  user_profiles_addresses: UserProfilesAddress[];
  directus_users: DirectusUser[];
  directus_files: DirectusFile[];
  directus_folders: DirectusFolder[];
  directus_roles: DirectusRole[];
}
