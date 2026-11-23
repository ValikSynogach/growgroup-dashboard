const assert = require("assert");
const { normalizeMinistry, isHsm, isYouth, belongsTo, ministryRaw, rosterText } = require("./ministry.js");

const youthValues = [
  "",
  "   ",
  null,
  undefined,
  "YOUTH",
  "youth",
  "SOL Youth",
  "sol youth",
  "SOL YOUTH",
  "sol_youth",
  "sol-youth",
  "ADULTS",
  "Adult",
];

for (const value of youthValues) {
  assert.strictEqual(normalizeMinistry(value), "YOUTH", `normalize ${value}`);
  assert.strictEqual(isYouth({ ministry: value }), true, `youth ${value}`);
  assert.strictEqual(isHsm({ ministry: value }), false, `not hsm ${value}`);
  assert.strictEqual(belongsTo({ ministry: value }, "youth"), true);
  assert.strictEqual(belongsTo({ ministry: value }, "hsm"), false);
}

const hsmValues = ["HSM", "hsm", " SOL HSM ", "sol-hsm", "sol_hsm", "SOL   HSM"];
for (const value of hsmValues) {
  assert.strictEqual(normalizeMinistry(value), "HSM", `normalize ${value}`);
  assert.strictEqual(isHsm({ ministry: value }), true, `hsm ${value}`);
  assert.strictEqual(isYouth({ ministry: value }), false, `not youth ${value}`);
  assert.strictEqual(belongsTo({ ministry: value }, "hsm"), true);
  assert.strictEqual(belongsTo({ ministry: value }, "youth"), false);
}

assert.strictEqual(isYouth({ timestamp: "2026-05-10", chat_id: "1" }), true);
assert.strictEqual(isHsm({}), false);
assert.strictEqual(belongsTo({ timestamp: "2026-05-10" }, "youth"), true);
assert.strictEqual(belongsTo({ timestamp: "2026-05-10" }, "hsm"), false);

assert.strictEqual(isHsm({ Ministry: "hsm" }), true);
assert.strictEqual(ministryRaw({ " ministry ": "SOL HSM" }), "SOL HSM");
assert.strictEqual(isYouth({ Ministry: "" }), true);

const legacyReport = { chat_id: "5", leader_name: "Moved", ministry: "" };
const movedLeader = { user_id: "5", full_name: "Moved", ministry: "HSM" };
assert.strictEqual(belongsTo(legacyReport, "youth"), true);
assert.strictEqual(belongsTo(legacyReport, "hsm"), false);
assert.strictEqual(belongsTo(movedLeader, "hsm"), true);
assert.strictEqual(belongsTo(movedLeader, "youth"), false);

const rows = [
  { chat_id: "1", ministry: "" },
  { chat_id: "2", ministry: "YOUTH" },
  { chat_id: "3", ministry: "SOL YOUTH" },
  { chat_id: "4", ministry: "HSM" },
  { chat_id: "5", ministry: "SOL HSM" },
  { chat_id: "6" },
];
const youthIds = rows.filter((row) => belongsTo(row, "youth")).map((row) => row.chat_id);
const hsmIds = rows.filter((row) => belongsTo(row, "hsm")).map((row) => row.chat_id);
assert.deepStrictEqual(youthIds, ["1", "2", "3", "6"]);
assert.deepStrictEqual(hsmIds, ["4", "5"]);

const hsmLeader = { members: "Ann, Bob", friend_group: "Cara and Dan" };
assert.strictEqual(rosterText(hsmLeader, "hsm"), "Cara and Dan");
assert.strictEqual(rosterText(hsmLeader, "youth"), "Ann, Bob");
assert.strictEqual(rosterText({ members: "Ann", friend_group: "   " }, "hsm"), "Ann");
assert.strictEqual(rosterText({ members: "Ann", " Friend_Group ": "Eve, Frank" }, "hsm"), "Eve, Frank");
assert.strictEqual(rosterText({ friend_group: "Only friends" }, "youth"), "");
assert.strictEqual(rosterText({ friend_group: "Only friends" }, "hsm"), "Only friends");

console.log("ministry.test.js ok");
