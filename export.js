/* Client-side export for one ministry page.
   Callers pass rows that are already filtered to that page.
*/
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.Export = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var REPORT_COLUMNS = [
    "timestamp",
    "chat_id",
    "leader_name",
    "group_name",
    "attended",
    "attendance_count",
    "prayer_requests",
    "ministry",
  ];

  function dayKey(timestamp) {
    var match = String(timestamp || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? match[1] + "-" + match[2] + "-" + match[3] : "";
  }

  function inRange(timestamp, from, to) {
    var day = dayKey(timestamp);
    if (!day) return false;
    if (from && day < from) return false;
    if (to && day > to) return false;
    return true;
  }

  function reportsInRange(rows, from, to) {
    return (rows || []).filter(function (row) {
      return inRange(row && row.timestamp, from, to);
    });
  }

  function csvEscape(value) {
    var text = String(value == null ? "" : value);
    if (/[",\n\r]/.test(text)) return '"' + text.replace(/"/g, '""') + '"';
    return text;
  }

  function reportsCsv(rows) {
    var lines = [REPORT_COLUMNS.join(",")];
    (rows || []).forEach(function (row) {
      lines.push(REPORT_COLUMNS.map(function (key) {
        return csvEscape(row[key]);
      }).join(","));
    });
    return "\uFEFF" + lines.join("\r\n") + "\r\n";
  }

  function oneLine(value) {
    return String(value == null ? "" : value).replace(/\s+/g, " ").trim();
  }

  function summaryMarkdown(options) {
    var label = options.label || "SOL";
    var from = options.from || "";
    var to = options.to || "";
    var leaders = options.leaders || [];
    var reports = options.reports || [];
    var range = !from && !to
      ? "all dates"
      : (from || "…") + " to " + (to || "…");
    var lines = [
      "# " + label,
      "",
      "Range: " + range,
      "This file contains only " + label + " rows.",
      "Leaders are the current roster. Reports are the check-ins in the range.",
      "",
      "## Leaders (" + leaders.length + ")",
      "",
    ];
    if (!leaders.length) lines.push("_No leaders in this export._", "");
    leaders.forEach(function (leader) {
      lines.push("### " + (oneLine(leader.name) || "—"));
      lines.push("- user_id: " + oneLine(leader.user_id));
      lines.push("- members: " + (oneLine(leader.members) || "—"));
      lines.push("- friend_group: " + (oneLine(leader.friend_group) || "—"));
      lines.push("");
    });
    lines.push("## Reports (" + reports.length + ")", "");
    if (!reports.length) lines.push("_No reports in this date range._", "");
    reports.forEach(function (row) {
      var title = [
        oneLine(row.timestamp) || "—",
        oneLine(row.leader_name) || "—",
        oneLine(row.group_name) || "—",
      ].join(" — ");
      lines.push("### " + title);
      lines.push("- chat_id: " + oneLine(row.chat_id));
      lines.push("- attended: " + (oneLine(row.attended) || "—"));
      lines.push("- attendance_count: " + (oneLine(row.attendance_count) || "—"));
      lines.push("- prayer_requests: " + (oneLine(row.prayer_requests) || "—"));
      lines.push("");
    });
    return lines.join("\n");
  }

  return {
    dayKey: dayKey,
    inRange: inRange,
    reportsInRange: reportsInRange,
    reportsCsv: reportsCsv,
    summaryMarkdown: summaryMarkdown,
  };
});
