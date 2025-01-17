// Filename: createNotionTable.js

// Import required libraries
const { Client } = require("@notionhq/client");
require("dotenv").config({ path: ".env.local" });

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY || "no key" });

console.log("api key: ", process.env.NOTION_API_KEY || "no key");

// Your Notion parent page ID
const PARENT_PAGE_ID = "14ea80717b3180a7afa8fcc99ff0afe7";

(async () => {
  try {
    // Create the database
    const response = await notion.databases.create({
      parent: { page_id: PARENT_PAGE_ID },
      title: [
        {
          type: "text",
          text: { content: "Orders Table" },
        },
      ],
      properties: {
        id: { title: {} },
        created_at: { date: {} },
        cart_items: { rich_text: {} },
        shipping_info: { rich_text: {} },
        selected_shipping: { rich_text: {} },
        shipping_cost: { number: { format: "number" } },
        grand_total: { number: { format: "number" } },
        currency: { select: { options: [{ name: "USD", color: "blue" }] } },
        status: { select: { options: [{ name: "pending", color: "red" }] } },
        notes: { rich_text: {} },
      },
    });

    console.log("Database created successfully:", response.url);
  } catch (error) {
    console.error("Error creating Notion table:", error.message);
  }
})();
