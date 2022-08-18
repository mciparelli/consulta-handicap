import { createClient } from "redis";

if (!global.client) {
  global.client = createClient({
       url:
      `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  }); 
  global.client.connect();
}

const json = {
  get: async (key) => {
    const unparsedValue = await global.client.get(key);
    return JSON.parse(unparsedValue);
  },
  set: (key, value) => global.client.set(key, JSON.stringify(value)),
  setex: (key, expSeconds, value) =>
    global.client.setEx(key, expSeconds, JSON.stringify(value)),
};
export default { json, db: global.client };
