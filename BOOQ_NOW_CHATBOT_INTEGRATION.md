# Booq Now API — Chatbot Integration Guide

This document describes how to integrate the Booq Now booking API into a chatbot so the bot can check real availability and create bookings on a host's calendar.

The integration uses two tools:

- `check_availability(date_range)` — returns actual free slots. The bot MUST call this; it must never invent times.
- `create_booking(email, slot, name, problem_summary)` — creates the booking on the calendar.

---

## Base

- **Base URL:** `https://booq.now`
- **Auth:** `Authorization: Bearer <api_key>` on every request
  - Generate keys in the dashboard → **Integrate**
  - Keys are prefixed `bkr_`
- **Identifier of "what is being booked":** every booking is tied to a **booking type slug** (e.g. `intro-call`). The chatbot needs to know which slug it's booking against — pass it on every call.

---

## Tool 1 — `check_availability(date_range)`

The availability endpoint has two modes. For a chatbot, use both:

1. First call the **month** mode to know which days have any slots.
2. Then call the **date** mode to fetch concrete times for the day the user picks.

### Days in a month

```
GET /api/v1/availability?slug=<slug>&month=YYYY-MM&timezone=Europe/London
Authorization: Bearer bkr_xxx
```

Response:

```json
{
  "month": "2026-05",
  "timezone": "Europe/London",
  "days": ["2026-05-19", "2026-05-20", "2026-05-22"]
}
```

### Slots on a specific day

```
GET /api/v1/availability?slug=<slug>&date=YYYY-MM-DD&timezone=Europe/London
Authorization: Bearer bkr_xxx
```

Response:

```json
{
  "date": "2026-05-19",
  "timezone": "Europe/London",
  "slots": [
    { "start": "2026-05-19T09:00:00.000Z", "end": "2026-05-19T09:30:00.000Z" },
    { "start": "2026-05-19T09:30:00.000Z", "end": "2026-05-19T10:00:00.000Z" }
  ]
}
```

Each `start` is a UTC ISO‑8601 timestamp. Pass it back verbatim to `create_booking`. Slot duration comes from the booking type configuration — the bot does not pick a length.

**Query parameters:**

| Param | Required | Notes |
|---|---|---|
| `slug` | yes | The booking type slug |
| `month` | one of | `YYYY-MM` — returns available days in the month |
| `date` | one of | `YYYY-MM-DD` — returns slots on a specific day |
| `timezone` | no | IANA tz (default `Europe/London`). Affects how days/slots are bucketed for the visitor |

**Rate limit:** 60 requests / minute per API key.

---

## Tool 2 — `create_booking(email, slot, name, problem_summary)`

```
POST /api/v1/bookings
Authorization: Bearer bkr_xxx
Content-Type: application/json
```

Body:

```json
{
  "slug": "intro-call",
  "startTime": "2026-05-19T09:00:00.000Z",
  "visitorName": "Jane Doe",
  "visitorEmail": "jane@example.com",
  "visitorTimezone": "Europe/London",
  "notes": "<problem_summary goes here>"
}
```

**Field notes:**

| Field | Required | Notes |
|---|---|---|
| `slug` | yes | Identifies the booking type (combined with the API key, identifies the host) |
| `startTime` | yes | Must be one of the `start` values returned by `/availability`. Server re-checks conflicts, buffers, min-notice and max-per-day in a transaction |
| `visitorName` | yes | 1–100 chars |
| `visitorEmail` | yes | Validated as an email |
| `visitorTimezone` | yes | IANA tz string (e.g. `Europe/London`) |
| `notes` | no | Up to 1000 chars. This is the right home for `problem_summary` — it's stored on the booking and surfaced to the host |

Success response (201):

```json
{
  "id": "ckxxx...",
  "startTime": "2026-05-19T09:00:00.000Z",
  "endTime": "2026-05-19T09:30:00.000Z",
  "status": "confirmed"
}
```

On success:

- The event is written to the host's connected calendar (Google Calendar today).
- Confirmation emails go to both the visitor and the host.

**Rate limit:** 30 requests / minute per API key.

---

## Errors to handle in the bot

| Status | Body | Meaning | Bot behaviour |
|---|---|---|---|
| 400 | `Slot no longer available` | Inside the booking type's min-notice window | Re-fetch availability and ask user to pick again |
| 400 | (validation messages) | Bad input shape | Fix and retry |
| 401 | `Missing API key` / `Invalid API key` | Auth header missing or wrong | Configuration issue — surface to operator |
| 403 | `Origin not allowed` | Browser request from a domain not on the key's allow-list | Configuration issue |
| 404 | `Booking type not found` | Wrong slug or it's inactive | Configuration issue |
| 409 | `Time slot unavailable` | Conflict — somebody else took it | Re-fetch availability, ask user to pick again |
| 409 | `Maximum bookings per day reached` | Host's per-day cap hit | Offer another day |
| 429 | `Rate limit exceeded` | Too many requests on this key | Back off |

---

## CORS / domain pinning

- CORS is open by default (`Access-Control-Allow-Origin: *`).
- If the chatbot calls from the browser and you want to lock the key to a domain, set **Allowed Domains** on the key in the dashboard. Requests whose `Origin` is not on the list get 403.
- Server-side calls (no `Origin` header) are always allowed.

---

## Recommended chatbot flow

1. User asks to book → bot calls `check_availability` with `month` to find candidate days.
2. Bot offers days → user picks one → bot calls `check_availability` with `date` to get exact slots.
3. Bot presents slots (rendered in the user's timezone, but pass the raw UTC `start` back unchanged).
4. Bot collects name, email and problem summary → calls `create_booking`.
5. On a 409, re-run step 2 and ask the user to pick again — **never retry with a different invented time**.

---

## Example: cURL

Check days in a month:

```bash
curl -H "Authorization: Bearer bkr_xxx" \
  "https://booq.now/api/v1/availability?slug=intro-call&month=2026-05&timezone=Europe/London"
```

Check slots on a day:

```bash
curl -H "Authorization: Bearer bkr_xxx" \
  "https://booq.now/api/v1/availability?slug=intro-call&date=2026-05-19&timezone=Europe/London"
```

Create a booking:

```bash
curl -X POST "https://booq.now/api/v1/bookings" \
  -H "Authorization: Bearer bkr_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "intro-call",
    "startTime": "2026-05-19T09:00:00.000Z",
    "visitorName": "Jane Doe",
    "visitorEmail": "jane@example.com",
    "visitorTimezone": "Europe/London",
    "notes": "Wants help wiring up the booking flow into their chatbot."
  }'
```
