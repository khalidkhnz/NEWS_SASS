import Constants from "@/lib/constants";
import { openConnection } from "@/lib/db";
import { categories } from "@/schema/categories";

async function main() {
  const { db, closeConnection } = await openConnection();

  await Promise.all(
    Constants.subHeaders.map(async (category) => {
      await db.insert(categories).values({ category: category.label });
      console.log("Created category " + category.label);
    })
  );

  await closeConnection();
}

main();
