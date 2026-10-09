import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().default(""),
  role: text("role").notNull().default("rider"),
  avatar: text("avatar").notNull().default(""),
});
export const rides = sqliteTable("rides", {
  id: text("id").primaryKey(),
  riderId: text("rider_id").notNull(),
  driverId: text("driver_id"),
  pickup: text("pickup").notNull(),
  destination: text("destination").notNull(),
  type: text("type").notNull(),
  fare: integer("fare").notNull(),
  distance: real("distance").notNull(),
  status: text("status").notNull().default("requested"),
  created: text("created").notNull(),
  rating: integer("rating"),
  review: text("review"),
  payment: text("payment").notNull().default("cash"),
  paid: integer("paid").notNull().default(0),
});
