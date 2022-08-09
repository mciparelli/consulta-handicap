import { createClient } from "redis";
const client = createClient({
  url:
    `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
client.connect();

const json = {
  get: async (key) => {
    const unparsedValue = await client.get(key);
    return JSON.parse(unparsedValue);
  },
  set: (key, value) => client.set(key, JSON.stringify(value)),
  setex: (key, expSeconds, value) =>
    client.setEx(key, expSeconds, JSON.stringify(value)),
};
export default { json, db: client };
