-- Predefined content templates for the template-driven CMS (RR-002).
-- These are structural field definitions only; no client copy is implied
-- or fabricated. Non-technical staff select a template, then fill in
-- fields through the admin editor.

INSERT INTO "content_templates" ("slug", "name", "description", "schema") VALUES
(
  'announcement-banner',
  'Announcement Banner',
  'A short site-wide banner, e.g. a delivery-area update or a scheduled pause notice.',
  '{
    "fields": [
      { "key": "headline", "label": "Headline", "type": "text", "required": true, "maxLength": 120 },
      { "key": "body", "label": "Body", "type": "richtext", "required": true, "maxLength": 500 },
      { "key": "ctaLabel", "label": "Call-to-action label", "type": "text", "required": false, "maxLength": 40 },
      { "key": "ctaUrl", "label": "Call-to-action link", "type": "url", "required": false }
    ]
  }'::jsonb
),
(
  'simple-page',
  'Simple Page',
  'A single-column page with a title, body copy, and an optional image.',
  '{
    "fields": [
      { "key": "heading", "label": "Heading", "type": "text", "required": true, "maxLength": 150 },
      { "key": "body", "label": "Body", "type": "richtext", "required": true, "maxLength": 5000 },
      { "key": "imageUrl", "label": "Image URL", "type": "image_url", "required": false }
    ]
  }'::jsonb
)
ON CONFLICT ("slug") DO NOTHING;
