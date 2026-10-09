import { integer, doublePrecision, pgTable, text } from "drizzle-orm/pg-core";
export const profiles = pgTable("orbit_profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().default(""),
  role: text("role").notNull().default("rider"),
  avatar: text("avatar").notNull().default(""),
});
export const rides = pgTable("orbit_rides", {
  id: text("id").primaryKey(),
  riderId: text("rider_id").notNull(),
  driverId: text("driver_id"),
  pickup: text("pickup").notNull(),
  destination: text("destination").notNull(),
  type: text("type").notNull(),
  fare: integer("fare").notNull(),
  distance: doublePrecision("distance").notNull(),
  status: text("status").notNull().default("requested"),
  created: text("created").notNull(),
  rating: integer("rating"),
  review: text("review"),
  payment: text("payment").notNull().default("cash"),
  paid: integer("paid").notNull().default(0),
});
