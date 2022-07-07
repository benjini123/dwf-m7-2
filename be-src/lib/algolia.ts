import algoliasearch from "algoliasearch";
import "dotenv/config";

// Connect and authenticate with your Algolia app
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_API_KEY as string
);

// Create a new index and add a record
const index = client.initIndex("products");
// const record = { objectID: 1, name: "test_record" };

export { index };
