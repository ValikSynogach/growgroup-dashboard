const assert = require("assert");
const { normalizeMinistry, isHsm, isAdult, belongsTo, ministryRaw, rosterText } = require("./ministry.js");

const adultValues = [
  "",
  "   ",
  null,
  undefined,
  "ADULT",
  "adult",
  "SOL Adult",
  "SOL ADULT",
  "sol_adult",
  "sol-adult",
  "YOUTH",
  "SOL YOUTH",
  "ADULTS",
];

for (const value of adultValues) {
  assert.strictEqual(normalizeMinistry(value), "ADULT", `normalize ${value}`);
  assert.strictEqual(isAdult({ ministry: value }), true, `adult ${value}`);
  assert.strictEqual(isHsm({ ministry: value }), false, `not hsm ${value}`);
  assert.strictEqual(belongsTo({ ministry: value }, "adult"), true);
  assert.strictEqual(belongsTo({ ministry: value }, "hsm"), false);
}

const hsmValues = ["HSM", "hsm", " SOL HSM ", "sol-hsm", "sol_hsm", "SOL   HSM"];
for (const value of hsmValues) {
  assert.strictEqual(normalizeMinistry(value), "HSM", `normalize ${value}`);
  assert.strictEqual(isHsm({ ministry: value }), true, `hsm ${value}`);
  assert.strictEqual(isAdult({ ministry: value }), false, `not adult ${value}`);
  assert.strictEqual(belongsTo({ ministry: value }, "hsm"), true);
  assert.strictEqual(belongsTo({ ministry: value }, "adult"), false);
}

assert.strictEqual(isAdult({ timestamp: "2026-05-10", chat_id: "1" }), true);
assert.strictEqual(isHsm({}), false);
assert.strictEqual(belongsTo({ timestamp: "2026-05-10" }, "adult"), true);
assert.strictEqual(belongsTo({ timestamp: "2026-05-10" }, "hsm"), false);

assert.strictEqual(isHsm({ Ministry: "hsm" }), true);
assert.strictEqual(ministryRaw({ " ministry ": "SOL HSM" }), "SOL HSM");
assert.strictEqual(isAdult({ Ministry: "" }), true);
assert.strictEqual(normalizeMinistry("ADULT"), "ADULT");

const legacyReport = { chat_id: "5", leader_name: "Moved", ministry: "" };
const movedLeader = { user_id: "5", full_name: "Moved", ministry: "HSM" };
assert.strictEqual(belongsTo(legacyReport, "adult"), true);
assert.strictEqual(belongsTo(legacyReport, "hsm"), false);
assert.strictEqual(belongsTo(movedLeader, "hsm"), true);
assert.strictEqual(belongsTo(movedLeader, "adult"), false);

const rows = [
  { chat_id: "1", ministry: "" },
  { chat_id: "2", ministry: "ADULT" },
  { chat_id: "3", ministry: "SOL ADULT" },
  { chat_id: "4", ministry: "HSM" },
  { chat_id: "5", ministry: "SOL HSM" },
  { chat_id: "6" },
];
const adultIds = rows.filter((row) => belongsTo(row, "adult")).map((row) => row.chat_id);
const hsmIds = rows.filter((row) => belongsTo(row, "hsm")).map((row) => row.chat_id);
assert.deepStrictEqual(adultIds, ["1", "2", "3", "6"]);
assert.deepStrictEqual(hsmIds, ["4", "5"]);

const hsmLeader = { members: "Ann, Bob", friend_group: "Cara and Dan" };
assert.strictEqual(rosterText(hsmLeader, "hsm"), "Cara and Dan");
assert.strictEqual(rosterText(hsmLeader, "adult"), "Ann, Bob");
assert.strictEqual(rosterText({ members: "Ann", friend_group: "   " }, "hsm"), "Ann");
assert.strictEqual(rosterText({ members: "Ann", " Friend_Group ": "Eve, Frank" }, "hsm"), "Eve, Frank");
assert.strictEqual(rosterText({ friend_group: "Only friends" }, "adult"), "");
assert.strictEqual(rosterText({ friend_group: "Only friends" }, "hsm"), "Only friends");

console.log("ministry.test.js ok");
