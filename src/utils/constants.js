const CACHE_TTL = {
  POST: 300,
  POST_LIST: 60,
  POST_DETAIL: 300,
  TRENDING: 120,
  SEARCH: 600,
  USER_PROFILE: 300,
  USER_STATS: 300,
  CATEGORY_LIST: 1800,
  TAG_LIST: 1800,
  COMMENTS: 180,
  NOTIFICATIONS: 60,
  FEED: 120,
  SESSION: 86400,
  USERNAME: 86400,
};

const RATE_LIMITS = {
  GENERAL: 100,
  AUTH: 5,
  POST_CREATE: 10,
  COMMENT_CREATE: 30,
};

const NOTIFICATION_TYPES = {
  LIKE: "like",
  COMMENT: "comment",
  FOLLOW: "follow",
  MENTION: "mention",
  REPLY: "reply",
  POST_PUBLISHED: "post_published",
};

const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

const USER_ROLES = {
  USER: "user",
  AUTHOR: "author",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

module.exports = {
  CACHE_TTL,
  RATE_LIMITS,
  NOTIFICATION_TYPES,
  POST_STATUS,
  USER_ROLES,
};
