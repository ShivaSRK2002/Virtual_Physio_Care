import handler from "../api/submit-enquiry.js";

function mockRes() {
  const res = {
    _status: null,
    _json: null,
    _headers: {},
    setHeader(k, v) {
      this._headers[k] = v;
    },
    status(code) {
      this._status = code;
      return this;
    },
    json(payload) {
      this._json = payload;
      return this;
    },
  };
  return res;
}

async function run(name, req) {
  const res = mockRes();
  await handler(req, res);
  console.log(`\n--- ${name} ---`);
  console.log("status:", res._status);
  console.log("json:", res._json);
}

async function main() {
  await run("GET method rejected", { method: "GET", body: {} });

  await run("missing required fields -> 400", {
    method: "POST",
    body: { name: "", email: "", phone: "", message: "" },
  });

  await run("invalid email -> 400", {
    method: "POST",
    body: { name: "Test", email: "not-an-email", phone: "12345", message: "hi" },
  });

  await run("honeypot filled -> silently succeeds, no external calls", {
    method: "POST",
    body: {
      name: "Bot",
      email: "bot@example.com",
      phone: "0000000000",
      message: "spam",
      company: "I am a bot",
    },
  });

  await run("valid data, no env vars configured -> should fail gracefully (502), not crash", {
    method: "POST",
    body: {
      name: "Test Patient",
      email: "test@example.com",
      phone: "9999999999",
      type: "online",
      location: "Toronto",
      message: "Lower back pain for 2 weeks",
      preferredDate: "Weekday evenings",
    },
  });
}

main().catch((err) => {
  console.error("Test script crashed unexpectedly:", err);
  process.exit(1);
});
