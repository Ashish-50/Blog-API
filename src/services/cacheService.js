const { getRedisClient } = require("../config/redis");
const { CACHE_TTL } = require("../utils/constants");

class CacheService {
  constructor() {
    this.client = null;
  }

  getClient() {
    if (!this.client) {
      this.client = getRedisClient() || "redis://127.0.0.1:6379";
    }
    return this.client;
  }

  async get(key) {
    try {
      const data = await this.getClient().get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async set(key, value, ttl = CACHE_TTL.POST) {
    try {
      await this.getClient().setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Cache set error:", error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.getClient().del(key);
      return true;
    } catch (error) {
      console.error("Cache delete error:", error);
      return false;
    }
  }

  // Session management
  async setSession(token, userData) {
    return this.set(`session:${token}`, userData, CACHE_TTL.SESSION);
  }

  async getSession(token) {
    return this.get(`session:${token}`);
  }

  async deleteSession(token) {
    return this.del(`session:${token}`);
  }

  async flushAll() {
    try {
      await this.getClient().flushDb();
      return true;
    } catch (error) {
      console.error("Cache flush error:", error);
      return false;
    }
  }

  addUsernameToCache = async (username) => {
    try {
      const key = `username:${username.toLowerCase()}`;
      await this.getClient().setEx(key, CACHE_TTL.USERNAME, "1");
      return true;
    } catch (error) {
      console.error("Add username cache error:", error);
      return false;
    }
  };

  isUsernameTaken = async (username) => {
    try {
      const key = `username:${username.toLowerCase()}`;
      const exists = await this.getClient().exists(key);
      return exists === 1;
    } catch (error) {
      console.error("Check username cache error:", error);
      return false;
    }
  };
}

module.exports = new CacheService();
