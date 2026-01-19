# Backend Developer Task: Implement Risk Management Module

## Objective
Implement a new **Risk Management** module for the construction project management application. This module will function similarly to the existing **Milestones/Tasks** module, specifically regarding how users are allocated and assigned.

## 1. Database Schema (Risk Model)
Create a new `Risk` model (or collection) with the following fields:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier |
| `projectId` | ObjectId | Reference to the **Project** (Required) |
| `title` | String | Risk Title (Required) |
| `description` | String | Detailed description of the risk |
| `category` | String | E.g., 'Safety', 'Financial', 'Timeline', 'Quality' |
| `severity` | String | 'Low', 'Medium', 'High', 'Critical' |
| `likelihood` | Number | 1-5 Scale |
| `impact` | Number | 1-5 Scale |
| `score` | Number | Calculated: `likelihood * impact` (1-25) |
| `status` | String | Enum: `['Open', 'Mitigating', 'Pending Review', 'Resolved']` |
| `date` | Date | Date reported (Default: `Date.now`) |
| `assignedTo` | ObjectId | Reference to **User** (The person responsible for mitigating the risk) |
| `createdBy` | ObjectId | Reference to **User** (Who reported the risk) |
| `evidence` | String/Object | URL or Object for uploaded proof (image/doc) of resolution |
| `resolutionNotes` | String | Notes added during resolution/mitigation |

## 2. API Endpoints

### A. Fetch Risks
- **Endpoint**: `GET /api/risks/project/:projectId`
- **Logic**: Return all risks associated with the given `projectId`.

### B. Create Risk
- **Endpoint**: `POST /api/risks`
- **Body**: `{ projectId, title, category, severity, likelihood, impact, assignedTo, ... }`
- **Logic**: 
    1. Validate required fields.
    2. Calculate `score = likelihood * impact`.
    3. Save to database.

### C. Update Risk (Status & Workflow)
- **Endpoint**: `PUT /api/risks/:id`
- **Body**: `{ status, evidence, resolutionNotes, ... }`
- **Logic**:
    - Allow updating status to handle the workflow: `Open` -> `Mitigating` -> `Pending Review` -> `Resolved` (or `Open` if rejected).
    - If status is `Pending Review`, require `evidence` (optional enforcement, but UI checks it).

### D. Delete Risk
- **Endpoint**: `DELETE /api/risks/:id`

## 3. User Allocation Logic (Critical)
**Context**: The frontend currently fetches *all* users and filters them by `assignedProjects` to show the 'Assign To' dropdown in the Milestones tab.
- **Requirement**: Ensure the `assignedTo` field in the Risk model correctly references these existing User IDs.
- **Validation**: When creating/updating a risk, verify that the `assignedTo` user is indeed allocated to the `projectId`.

## 4. Frontend Integration Notes (For Context)
- The frontend has a **Risk Escalation Matrix** UI.
- High, Medium, and Low risks are color-coded based on the `score`.
- There is a specific workflow:
    1. **Assignee** marks as `Pending Review` and uploads proof.
    2. **Admin/Manager** reviews proof and marks as `Resolved` or rejects back to `Open`.

Please expose these endpoints and ensure the model supports this workflow.
