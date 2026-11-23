/* Ministry split for the SOL Youth and SOL HSM dashboards.
   Mirrors the bot's normalize_ministry: a row is classified by its own
   ministry cell, never by the leader's current tag.

   SOL HSM: HSM, SOL HSM (any case; underscores and hyphens count as spaces).
   SOL Youth: blank, YOUTH, SOL YOUTH, a missing column, and anything else.
   Blank historical reports stay on the youth page after a leader moves to HSM.
*/
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.Ministry = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function cell(row, name) {
    if (!row || typeof row !== "object") return "";
    var target = String(name).trim().toLowerCase();
    var keys = Object.keys(row);
    for (var i = 0; i < keys.length; i++) {
      if (String(keys[i]).trim().toLowerCase() === target) {
        return row[keys[i]] == null ? "" : row[keys[i]];
      }
    }
    return "";
  }

  function ministryRaw(row) {
    return cell(row, "ministry");
  }

  // HSM cards show the friend-group answer. A blank answer falls back to
  // members. The youth page never reads friend_group.
  function rosterText(leader, page) {
    var members = String(cell(leader, "members") || "").trim();
    if (page === "hsm") {
      var friends = String(cell(leader, "friend_group") || "").trim();
      return friends || members;
    }
    return members;
  }

  function normalizeMinistry(value) {
    var text = String(value == null ? "" : value)
      .trim()
      .toUpperCase()
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .join(" ");
    return text === "HSM" || text === "SOL HSM" ? "HSM" : "YOUTH";
  }

  function isHsm(row) {
    return normalizeMinistry(ministryRaw(row)) === "HSM";
  }

  function isYouth(row) {
    return !isHsm(row);
  }

  function belongsTo(row, page) {
    return page === "hsm" ? isHsm(row) : isYouth(row);
  }

  return {
    cell: cell,
    ministryRaw: ministryRaw,
    normalizeMinistry: normalizeMinistry,
    isHsm: isHsm,
    isYouth: isYouth,
    belongsTo: belongsTo,
    rosterText: rosterText,
  };
});
