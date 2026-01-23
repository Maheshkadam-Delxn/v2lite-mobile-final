# Snag Module - Testing Guide (Integration v2)

This document outlines the testing flow and validation rules for the Snag Module in the v2Lite Mobile application. 

## 🏗️ 1. Overview
The Snag Module allows users (Clients, Contractors, Managers) to report and track quality issues. It follows a strict state machine to ensure issues are assigned, fixed, verified, and closed.

## 👥 2. User Personas & Roles
| Role | Capabilities |
| :--- | :--- |
| **Admin / PM** | Report Snag, Assign to User, Verify Fix, Close Snag |
| **Manager** | Report Snag, Assign to User, Verify Fix |
| **Contractor (Assignee)** | View Assigned Snags, Mark as Fixed (with photo proof) |
| **Client** | Report Snag, View Progress |

## 🛡️ 3. Handover Gate (Quality Guard)
A project **cannot** be marked as "Completed" or handed over if there are any outstanding **High** or **Critical** snags. 
- Even if all milestones are 100%, quality acts as the final gate.
- Testers must verify that handover is blocked until all severe snags are "Closed".

---

## 🚦 4. The Happy Path (Standard Flow)

### Step 1: Reporting an Issue
1.  **Actor**: Admin, Manager, or Client.
2.  **Action**: 
    - Go to **Project Details** -> **Snags** tab.
    - Tap the **"+" (FAB)** button.
    - Enter Title, Description, Category, and Location.
    - (Optional) Take/Upload Photos of the issue.
    - Tap **"Report Snag"**.
3.  **Expected Result**: Snag appears in the list with status **"open"**.

### Step 2: Assignment
1.  **Actor**: Admin or Manager.
2.  **Action**:
    - Open the newly created snag.
    - Tap **"Assign Snag"**.
    - Select a user from the dropdown.
    - Tap **"Confirm Assignment"**.
3.  **Expected Result**: Status changes to **"assigned"**. The assignee's name is displayed.

### Step 3: Resolution (Fixing)
1.  **Actor**: The Assignee (or Admin/Manager).
2.  **Action**:
    - Open the assigned snag.
    - Tap **"Mark as Fixed"**.
    - **Crucial**: You must upload at least one **Proof of Fix** photo.
    - Tap **"Submit Fix"**.
3.  **Expected Result**: Status changes to **"fixed"**. Resolution photo appears in the details view.

### Step 4: Verification
1.  **Actor**: Admin or Manager.
2.  **Action**:
    - Open the fixed snag.
    - Tap **"Verify Fix"**.
3.  **Expected Result**: Status changes to **"verified"**.

### Step 5: Closing
1.  **Actor**: Admin.
2.  **Action**:
    - Open the verified snag.
    - Tap **"Close Snag"**.
3.  **Expected Result**: Status changes to **"closed"**. Snag is now finalized.

---

## ⚠️ 4. Validation & Edge Cases

### A. Photo Requirements
- **Creation**: Photos are optional but recommended.
- **Fixing**: Status **"fixed"** REQUIRES resolution photos. The "Submit Fix" button is disabled until a photo is provided.
- **Locking**: Once a snag is marked as "Fixed", its original details (Title, Description, etc.) are locked and cannot be edited.

### B. Role Restrictions (RBAC)
- **Assigning**: Only visible/allowed for Admin/Manager.
- **Verifying**: Only visible/allowed for Admin/Manager.
- **Closing**: Only visible/allowed for Admin/Manager (Strictly Admin in backend).
- **Client Access**: Clients can report but should NOT see action buttons for Assign, Fix, or Verify.

### C. Status Logic
- A snag cannot skip states (e.g., you cannot "Close" an "Open" snag directly; it must go through the lifecycle).

## 🔗 5. API Reference Summary

| Action | Method | Endpoint |
| :--- | :--- | :--- |
| **Create** | POST | `/api/snags` |
| **List** | GET | `/api/snags?projectId={id}` |
| **Update** | PATCH | `/api/snags/{id}` |

---

## 🛠️ 6. Troubleshooting for Testers
- **No Users in Assignment List?**: Ensure you have a working internet connection and that the `/api/admin/users` endpoint is accessible for your account.
- **FAB (+) button missing?**: Check if you are correctly inside a Project context.
- **Photos not showing?**: Ensure you have granted Camera/Gallery permissions to the app.
