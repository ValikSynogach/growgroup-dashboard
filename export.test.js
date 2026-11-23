const assert = require("assert");
const { inRange, reportsInRange, reportsCsv, summaryMarkdown } = require("./export.js");

assert.strictEqual(inRange("2026-05-10 19:30", "2026-05-01", "2026-05-10"), true);
assert.strictEqual(inRange("2026-05-10 19:30", "2026-05-11", "2026-05-20"), false);
assert.strictEqual(inRange("2026-05-10 19:30", "", ""), true);
assert.strictEqual(inRange("", "2026-05-01", "2026-05-10"), false);

const rows = [
  { timestamp: "2026-05-01 10:00", chat_id: "1", leader_name: "Adult", group_name: "A", attended: "yes", attendance_count: "4", prayer_requests: "keep", ministry: "ADULT" },
  { timestamp: "2026-06-01 10:00", chat_id: "2", leader_name: "Later", group_name: "B", attended: "no", attendance_count: "", prayer_requests: "drop", ministry: "ADULT" },
];
const ranged = reportsInRange(rows, "2026-05-01", "2026-05-31");
assert.strictEqual(ranged.length, 1);
assert.strictEqual(ranged[0].leader_name, "Adult");

const csv = reportsCsv(ranged);
assert.ok(csv.includes("timestamp,chat_id,leader_name,group_name,attended,attendance_count,prayer_requests,ministry"));
assert.ok(csv.includes("Adult"));
assert.ok(!csv.includes("Later"));
assert.ok(csv.includes("keep"));

const quoted = reportsCsv([{
  timestamp: "2026-05-01 10:00",
  chat_id: "1",
  leader_name: "A, B",
  group_name: "G",
  attended: "yes",
  attendance_count: "2",
  prayer_requests: 'line "one"\nline two',
  ministry: "ADULT",
}]);
assert.ok(quoted.includes('"A, B"'));
assert.ok(quoted.includes('"line ""one""'));

const md = summaryMarkdown({
  label: "SOL Adult",
  from: "2026-05-01",
  to: "2026-05-31",
  leaders: [{ name: "Adult", user_id: "1", members: "Ann", friend_group: "" }],
  reports: ranged,
});
assert.ok(md.includes("# SOL Adult"));
assert.ok(md.includes("only SOL Adult"));
assert.ok(md.includes("- members: Ann"));
assert.ok(md.includes("- friend_group: —"));
assert.ok(md.includes("prayer_requests: keep"));
assert.ok(!md.includes("Later"));
assert.ok(!md.includes("HSM"));

const hsm = summaryMarkdown({
  label: "SOL HSM",
  from: "",
  to: "",
  leaders: [{ name: "Hsm", user_id: "2", members: "Parsed", friend_group: "Cara and Dan" }],
  reports: [{ timestamp: "2026-05-10 19:40", chat_id: "2", leader_name: "Hsm", group_name: "B", attended: "yes", attendance_count: "9", prayer_requests: "Hsm prayer" }],
});
assert.ok(hsm.includes("Range: all dates"));
assert.ok(hsm.includes("- friend_group: Cara and Dan"));
assert.ok(hsm.includes("only SOL HSM"));
assert.ok(!hsm.includes("Ann"));

console.log("export.test.js ok");
