# G5-H Finding — Platform Admin Add School

## Real-world finding

During the Elevate Barber & Beauty Academy onboarding test, the platform admin discovered that a new school could only enter the certified provisioning pipeline by first submitting the public `/pilot` form.

That is unnecessary friction for an in-person or staff-assisted onboarding workflow.

## Repair

A platform-admin-only **Add School** action is now available from the Admin Dashboard and Pilot Inquiries.

The form captures:

- school name;
- school admin/contact name;
- school admin email;
- optional phone;
- Barbering pilot cohort size (1–30).

## Security and architecture

This does **not** create a second school provisioning implementation.

The server action:

1. verifies the caller is a platform admin (`role='admin'`, `school_id IS NULL`);
2. creates the same `pilot_inquiries` onboarding record used by the public flow;
3. calls the existing `approvePilotInquiry()` action;
4. calls the existing `createSchoolFromInquiry()` action;
5. therefore continues to use the certified school/settings/program creation and school-admin invitation path.

School admins do not receive this control.

## Current scope

The shortcut provisions Barbering pilot schools only, matching the current pilot provisioning boundary.

## Acceptance

This G5-H friction point is closed only after Engineering Verification and Vercel pass on the exact PR head and production is verified after merge.
