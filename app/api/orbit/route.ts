import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { profiles, rides } from "../../../db/schema";
import { eq, and, or, desc, isNull } from "drizzle-orm";
export async function GET() {
  const u = await getChatGPTUser();
  if (!u)
    return Response.json(
      { error: "Please sign in to continue." },
      { status: 401 },
    );
  const db = getDb();
  let p = (
    await db.select().from(profiles).where(eq(profiles.id, u.userId))
  )[0];
  if (!p) {
    p = {
      id: u.userId,
      name: u.fullName || "Orbit rider",
      phone: "",
      role: "rider",
      avatar: "",
    };
    await db.insert(profiles).values(p).onConflictDoNothing();
  }
  const list = await db
    .select()
    .from(rides)
    .where(
      p.role === "driver"
        ? or(
            eq(rides.driverId, u.userId),
            and(eq(rides.status, "requested"), isNull(rides.driverId)),
          )
        : eq(rides.riderId, u.userId),
    )
    .orderBy(desc(rides.created));
  const names = await db
    .select({ id: profiles.id, name: profiles.name, phone: profiles.phone })
    .from(profiles);
  return Response.json({
    profile: p,
    rides: list.map((r) => ({
      ...r,
      driver: names.find((n) => n.id === r.driverId),
      rider: names.find((n) => n.id === r.riderId),
    })),
  });
}
export async function POST(req: Request) {
  const u = await getChatGPTUser();
  if (!u) return Response.json({ error: "Please sign in." }, { status: 401 });
  const db = getDb();
  try {
    const b: any = await req.json();
    if (!b || typeof b !== "object") throw Error("Invalid request.");
    const p = (
      await db.select().from(profiles).where(eq(profiles.id, u.userId))
    )[0];
    if (!p)
      return Response.json(
        { error: "Load your profile first." },
        { status: 400 },
      );
    if (b.action === "profile") {
      if (
        typeof b.name !== "string" ||
        !b.name.trim() ||
        !["rider", "driver"].includes(b.role)
      )
        throw Error("Enter a name and valid role.");
      if (b.role !== p.role) {
        const existing = await db
          .select()
          .from(rides)
          .where(or(eq(rides.riderId, u.userId), eq(rides.driverId, u.userId)));
        if (
          existing.some((r) => !["completed", "cancelled"].includes(r.status))
        )
          throw Error(
            "Complete or cancel your active ride before switching modes.",
          );
      }
      await db
        .update(profiles)
        .set({
          name: b.name.trim().slice(0, 80),
          phone: String(b.phone || "").slice(0, 30),
          role: b.role,
          avatar: String(b.avatar || "").slice(0, 500),
        })
        .where(eq(profiles.id, u.userId));
    } else if (b.action === "book") {
      if (p.role !== "rider") throw Error("Switch to rider mode to book.");
      const loc = [
        "Indiranagar",
        "MG Road",
        "Koramangala",
        "Bengaluru Airport",
        "Whitefield",
        "Cubbon Park",
      ];
      if (
        !loc.includes(b.pickup) ||
        !loc.includes(b.destination) ||
        b.pickup === b.destination
      )
        throw Error("Choose different supported locations.");
      const active = await db
        .select()
        .from(rides)
        .where(eq(rides.riderId, u.userId));
      if (active.some((r) => !["completed", "cancelled"].includes(r.status)))
        throw Error("Finish or cancel your current ride first.");
      const types: any = { go: 14, comfort: 19, xl: 25 };
      if (!types[b.type]) throw Error("Choose a ride type.");
      const distance =
        Math.abs(loc.indexOf(b.pickup) - loc.indexOf(b.destination)) * 3.2 +
        2.4;
      await db
        .insert(rides)
        .values({
          id: crypto.randomUUID(),
          riderId: u.userId,
          pickup: b.pickup,
          destination: b.destination,
          type: b.type,
          fare: Math.round(45 + distance * types[b.type]),
          distance,
          status: "requested",
          created: new Date().toISOString(),
        });
    } else {
      const r = (
        await db
          .select()
          .from(rides)
          .where(eq(rides.id, String(b.id)))
      )[0];
      if (!r) throw Error("Ride not found.");
      if (b.action === "accept") {
        if (p.role !== "driver" || r.riderId === u.userId)
          throw Error("Another driver must accept this ride.");
        const busy = await db
          .select()
          .from(rides)
          .where(eq(rides.driverId, u.userId));
        if (busy.some((x) => !["completed", "cancelled"].includes(x.status)))
          throw Error("Complete your current ride first.");
        const result = await db
          .update(rides)
          .set({ driverId: u.userId, status: "accepted" })
          .where(
            and(
              eq(rides.id, r.id),
              eq(rides.status, "requested"),
              isNull(rides.driverId),
            ),
          )
          .returning();
        if (!result.length) throw Error("This ride has already been accepted.");
      } else if (b.action === "cancel") {
        if (
          r.riderId !== u.userId ||
          !["requested", "accepted", "arrived"].includes(r.status)
        )
          throw Error("This ride cannot be cancelled.");
        await db
          .update(rides)
          .set({ status: "cancelled" })
          .where(and(eq(rides.id, r.id), eq(rides.status, r.status)));
      } else if (b.action === "advance") {
        if (r.driverId !== u.userId || p.role !== "driver")
          throw Error("Only your assigned driver can update this ride.");
        const next: any = {
          accepted: "arrived",
          arrived: "in_progress",
          in_progress: "completed",
        };
        if (!next[r.status]) throw Error("Invalid ride transition.");
        await db
          .update(rides)
          .set({
            status: next[r.status],
            paid: next[r.status] === "completed" ? 1 : 0,
          })
          .where(and(eq(rides.id, r.id), eq(rides.status, r.status)));
      } else if (b.action === "review") {
        if (
          r.riderId !== u.userId ||
          r.status !== "completed" ||
          !Number.isInteger(b.rating) ||
          b.rating < 1 ||
          b.rating > 5
        )
          throw Error("Only completed rides can be rated from 1 to 5.");
        await db
          .update(rides)
          .set({
            rating: b.rating,
            review: String(b.review || "").slice(0, 500),
          })
          .where(eq(rides.id, r.id));
      } else throw Error("Unknown action.");
    }
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Request failed" },
      { status: 400 },
    );
  }
}
