// Trigger.dev Background Job
// Syncs e-commerce data from external API to database every 1 hour

import { task } from "@trigger.dev/sdk";
import {
  fetchProducts,
  fetchOrders,
  transformProduct,
  transformOrder,
} from "@/lib/api/ecommerce";
import { upsertProducts } from "@/lib/db/products";
import { upsertOrders } from "@/lib/db/orders";
import { createSyncLog } from "@/lib/db/syncLogs";

export const syncEcommerceData = task({
  id: "sync-ecommerce-data",
  // Run every 1 hour
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run: async (payload, { ctx }) => {
    const startTime = new Date();
    let productsCount = 0;
    let ordersCount = 0;
    let status: "success" | "failed" | "partial" = "success";
    let errorMessage: string | undefined;

    try {
      console.log("🚀 Starting e-commerce data sync...");

      // Step 1: Fetch and sync products
      try {
        console.log("📦 Fetching products from external API...");
        const externalProducts = await fetchProducts();
        console.log(`✅ Fetched ${externalProducts.length} products`);

        console.log("💾 Upserting products to database...");
        const transformedProducts = externalProducts.map(transformProduct);
        await upsertProducts(transformedProducts);
        productsCount = transformedProducts.length;
        console.log(`✅ Upserted ${productsCount} products`);
      } catch (error) {
        console.error("❌ Error syncing products:", error);
        status = "partial";
        errorMessage = `Products sync failed: ${error instanceof Error ? error.message : "Unknown error"}`;
      }

      // Step 2: Fetch and sync orders
      try {
        console.log("📋 Fetching orders from external API...");
        const externalOrders = await fetchOrders();
        console.log(`✅ Fetched ${externalOrders.length} orders`);

        console.log("💾 Upserting orders to database...");
        const transformedOrders = externalOrders.map(transformOrder);
        await upsertOrders(transformedOrders);
        ordersCount = transformedOrders.length;
        console.log(`✅ Upserted ${ordersCount} orders`);
      } catch (error) {
        console.error("❌ Error syncing orders:", error);
        status = status === "partial" ? "failed" : "partial";
        errorMessage = errorMessage
          ? `${errorMessage}; Orders sync failed: ${error instanceof Error ? error.message : "Unknown error"}`
          : `Orders sync failed: ${error instanceof Error ? error.message : "Unknown error"}`;
      }

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      // Step 3: Log sync result
      await createSyncLog({
        syncType: "all",
        status,
        recordsProcessed: productsCount + ordersCount,
        errorMessage,
        startedAt: startTime,
        completedAt: endTime,
      });

      console.log(`✨ Sync completed in ${duration}ms`);
      console.log(
        `📊 Summary: ${productsCount} products, ${ordersCount} orders`,
      );
      console.log(`Status: ${status}`);

      return {
        success: status !== "failed",
        status,
        productsCount,
        ordersCount,
        totalRecords: productsCount + ordersCount,
        duration,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        errorMessage,
      };
    } catch (error) {
      console.error("💥 Critical error during sync:", error);

      // Log failed sync
      await createSyncLog({
        syncType: "all",
        status: "failed",
        recordsProcessed: productsCount + ordersCount,
        errorMessage:
          error instanceof Error ? error.message : "Unknown critical error",
        startedAt: startTime,
        completedAt: new Date(),
      });

      throw error;
    }
  },
});
