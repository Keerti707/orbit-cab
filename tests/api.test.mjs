import { DatabaseSync } from "node:sqlite";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import ts from "typescript";
import { readFileSync, writeFileSync, unlinkSync, readdirSync } from "node:fs";
import assert from "node:assert/strict";
const sqlite = new DatabaseSync(":memory:");
for (const f of readdirSync("drizzle")
  .filter((x) => x.endsWith(".sql"))
  .sort())
  sqlite.exec(readFileSync("drizzle/" + f, "utf8"));
const db = drizzle(async (sql, params, method) => {
  const stmt = sqlite.prepare(sql);
  if (method === "run") {
    stmt.run(...params);
    return { rows: [] };
  }
  stmt.setReturnArrays(true);
  return { rows: stmt.all(...params) };
});
let identity = {
  userId: "rider-1",
  email: "rider@example.test",
  fullName: "Test rider",
};
globalThis.__orbitTest = { db, user: () => identity };
let source = readFileSync("app/api/orbit/route.ts", "utf8")
  .replace(
    /import \{\s*getChatGPTUser\s*\} from ['"]\.\.\/\.\.\/chatgpt-auth['"];?/,
    "const getChatGPTUser=async()=>globalThis.__orbitTest.user();",
  )
  .replace(
    /import \{\s*getDb\s*\} from ['"]\.\.\/\.\.\/\.\.\/db['"];?/,
    "const getDb=()=>globalThis.__orbitTest.db;",
  )
  .replace(
    /import \{\s*profiles,\s*rides\s*\} from ['"]\.\.\/\.\.\/\.\.\/db\/schema['"];?/,
    "import {profiles,rides} from './schema.test.tmp.mjs';",
  );
writeFileSync(
  "tests/schema.test.tmp.mjs",
  ts.transpile(readFileSync("db/schema.ts", "utf8"), {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  }),
);
writeFileSync(
  "tests/route.test.tmp.mjs",
  ts.transpile(source, {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  }),
);
try {
  const { GET, POST } = await import("./route.test.tmp.mjs");
  const post = (b) =>
    POST(
      new Request("https://orbit.test/api/orbit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      }),
    );
  identity = null;
  assert.equal((await GET()).status, 401);
  identity = {
    userId: "rider-1",
    email: "rider@example.test",
    fullName: "Test rider",
  };
  assert.equal((await GET()).status, 200);
  assert.equal(
    (
      await post({
        action: "book",
        pickup: "MG Road",
        destination: "MG Road",
        type: "go",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await post({
        action: "book",
        pickup: "Indiranagar",
        destination: "MG Road",
        type: "go",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await post({
        action: "book",
        pickup: "Indiranagar",
        destination: "MG Road",
        type: "go",
      })
    ).status,
    400,
  );
  let r = (await (await GET()).json()).rides[0];
  assert.equal(r.fare, 123);
  assert.equal((await post({ action: "advance", id: r.id })).status, 400);
  identity = {
    userId: "driver-1",
    email: "driver@example.test",
    fullName: "Test driver",
  };
  await GET();
  await post({ action: "profile", name: "Test driver", role: "driver" });
  assert.equal((await post({ action: "accept", id: r.id })).status, 200);
  assert.equal((await post({ action: "accept", id: r.id })).status, 400);
  assert.equal(
    (await post({ action: "profile", name: "Test driver", role: "rider" }))
      .status,
    400,
  );
  for (let i = 0; i < 3; i++)
    assert.equal((await post({ action: "advance", id: r.id })).status, 200);
  assert.equal((await post({ action: "advance", id: r.id })).status, 400);
  identity = {
    userId: "rider-1",
    email: "rider@example.test",
    fullName: "Test rider",
  };
  r = (await (await GET()).json()).rides[0];
  assert.equal(r.status, "completed");
  assert.equal(r.paid, 1);
  assert.equal(
    (await post({ action: "review", id: r.id, rating: 6 })).status,
    400,
  );
  assert.equal(
    (
      await post({
        action: "review",
        id: r.id,
        rating: 5,
        review: "Great ride",
      })
    ).status,
    200,
  );
  identity = {
    userId: "stranger",
    email: "stranger@example.test",
    fullName: "Stranger",
  };
  assert.equal((await (await GET()).json()).rides.length, 0);
  assert.equal((await post({ action: "cancel", id: r.id })).status, 400);
  console.log(
    "PASS: authentication, ownership, booking validation, fare, duplicate booking, driver matching, state transitions, cash completion and ratings.",
  );
} finally {
  unlinkSync("tests/route.test.tmp.mjs");
  unlinkSync("tests/schema.test.tmp.mjs");
  sqlite.close();
}
