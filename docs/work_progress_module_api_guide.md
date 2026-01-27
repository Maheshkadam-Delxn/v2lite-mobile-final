# Work Progress Module API Guide

Use this guide to integrate the Daily Progress Log feature on the mobile app.

## 📝 1. Create Daily Log (The "Feed")

**Endpoint:** `POST /api/work-progress`
**Role:** Admin, Manager, Engineer (Not Client)

### Request Body (Required Fields)

The error `Missing required fields` happens if ANY of these are missing or named incorrectly.

| Field | Type | Required? | Description |
| :--- | :--- | :--- | :--- |
| `projectId` | String | ✅ Yes | The Mongo ID of the project. |
| `date` | String | ✅ Yes | ISO Date string (e.g., "2024-01-23"). |
| `description` | String | ✅ Yes | What work was done today? |
| `progressPercent` | Number | ✅ Yes | Daily contribution (0-100). send 0 if no physical progress but work happened. |
| `photos` | Array | No | Array of image URLs (Cloudinary/S3 links). |
| `issues` | String | No | Any blockers or issues faced. |

### ❌ Common Mistakes (UI Checklist)
- Sending `progress` instead of `progressPercent`.
- Sending `date` as a Date object instead of a String.
- Sending `projectId` inside a nested object.

### Example Request
```json
{
  "projectId": "65b9f...",
  "date": "2024-01-23",
  "description": "Completed 50% of the wall plastering.",
  "progressPercent": 50,
  "photos": [
    "https://res.cloudinary.com/demo/image/upload/v1/work1.jpg"
  ]
}
```

## 📈 2. Get Progress Summary (The "Chart")

**Endpoint:** `GET /api/work-progress/summary`
**Use Case:** Displaying the weekly/monthly progress bars.

### Query Parameters
- `projectId`: (Required)
- `range`: `daily` | `weekly` | `monthly` (Default: `daily`)

### Response Structure
The API automatically caps `totalProgress` at 100%. Use `totalProgress` for your UI progress bars.

```json
{
  "success": true,
  "range": "weekly",
  "data": [
    {
      "_id": { "year": 2024, "week": 4 },
      "totalProgress": 45,  // <--- USE THIS FOR CHART
      "avgProgress": 12.5,
      "count": 4,           // Days worked this week
      "entries": [ ... ]    // Raw log entries if needed
    }
  ]
}
```

## 📜 3. List Daily Logs (The "History")

**Endpoint:** `GET /api/work-progress`
**Use Case:** Showing the scrollable list of past logs.

### Query Parameters
- `projectId`: (Required)

### Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "log_id_123",
      "date": "2024-01-23T00:00:00.000Z",
      "description": "Plastering work",
      "progressPercent": 50,
      "photos": ["url1"],
      "createdBy": {
        "name": "Site Engineer",
        "email": "eng@site.com"
      }
    }
  ]
}
```
