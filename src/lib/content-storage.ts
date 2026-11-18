import { and, desc, eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import { contentAuditLogs, contentPages, contentTemplates, administrativeAuditLogs, users } from "@/lib/db/schema";
import {
  isContentTemplateSchema,
  isValidContentSlug,
  validateContentData,
  type ContentTemplateSchema,
  type ContentValidationError,
} from "@/lib/content-validation";

const DEFAULT_CONTENT_TEMPLATES = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "announcement-banner",
    name: "Announcement Banner",
    description: "A short site-wide banner, e.g. a delivery-area update or a scheduled pause notice.",
    isActive: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    schema: {
      fields: [
        { key: "headline", label: "Headline", type: "text" as const, required: true, maxLength: 120 },
        { key: "body", label: "Body", type: "richtext" as const, required: true, maxLength: 500 },
        { key: "ctaLabel", label: "CTA label", type: "text" as const, required: false, maxLength: 40 },
        { key: "ctaUrl", label: "CTA link", type: "url" as const, required: false },
      ],
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    slug: "simple-page",
    name: "Simple Page",
    description: "A single-column page with a title, body copy, and an optional image.",
    isActive: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    schema: {
      fields: [
        { key: "heading", label: "Heading", type: "text" as const, required: true, maxLength: 150 },
        { key: "body", label: "Body", type: "richtext" as const, required: true, maxLength: 5000 },
        { key: "imageUrl", label: "Image URL", type: "image_url" as const, required: false },
      ],
    },
  },
];

export class ContentValidationFailure extends Error {
  errors: ContentValidationError[];
  constructor(errors: ContentValidationError[]) {
    super("Content data failed template validation.");
    this.errors = errors;
  }
}

async function getTemplateSchemaOrThrow(templateId: string): Promise<ContentTemplateSchema> {
  const [template] = await db
    .select()
    .from(contentTemplates)
    .where(eq(contentTemplates.id, templateId))
    .limit(1);

  if (!template || !template.isActive) {
    throw new Error("Content template not found or inactive.");
  }
  if (!isContentTemplateSchema(template.schema)) {
    throw new Error("Content template schema is malformed.");
  }
  return template.schema;
}

export async function listActiveTemplates() {
  if (!isDatabaseConfigured()) {
    return DEFAULT_CONTENT_TEMPLATES;
  }
  return db
    .select()
    .from(contentTemplates)
    .where(eq(contentTemplates.isActive, true))
    .orderBy(contentTemplates.name);
}

export async function listContentPages() {
  if (!isDatabaseConfigured()) {
    return [];
  }
  return db
    .select({
      page: contentPages,
      templateName: contentTemplates.name,
      templateSlug: contentTemplates.slug,
    })
    .from(contentPages)
    .innerJoin(contentTemplates, eq(contentTemplates.id, contentPages.templateId))
    .orderBy(desc(contentPages.updatedAt));
}

export async function getContentPageById(id: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  const [row] = await db
    .select({ page: contentPages, template: contentTemplates })
    .from(contentPages)
    .innerJoin(contentTemplates, eq(contentTemplates.id, contentPages.templateId))
    .where(eq(contentPages.id, id))
    .limit(1);
  return row ?? null;
}

export async function getPublishedPageBySlug(slug: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  const [row] = await db
    .select({ page: contentPages, template: contentTemplates })
    .from(contentPages)
    .innerJoin(contentTemplates, eq(contentTemplates.id, contentPages.templateId))
    .where(and(eq(contentPages.slug, slug), eq(contentPages.status, "published")))
    .limit(1);

  return row ?? null;
}

export async function listAuditLogsForPage(pageId: string) {
  if (!isDatabaseConfigured()) {
    return [];
  }
  return db
    .select({
      id: contentAuditLogs.id,
      action: contentAuditLogs.action,
      createdAt: contentAuditLogs.createdAt,
      actorEmail: users.email,
    })
    .from(contentAuditLogs)
    .leftJoin(users, eq(users.id, contentAuditLogs.actorUserId))
    .where(eq(contentAuditLogs.pageId, pageId))
    .orderBy(desc(contentAuditLogs.createdAt));
}

async function recordAudit(pageId: string, actorUserId: string | null, action: string, snapshot: unknown) {
  await db.insert(contentAuditLogs).values({ pageId, actorUserId, action, snapshot });
  await db.insert(administrativeAuditLogs).values({
    actorUserId,
    action: `content.${action}`,
    resourceType: "content_page",
    resourceId: pageId,
    metadata: { snapshot },
  });
}

export async function createContentPage(params: {
  templateId: string;
  slug: string;
  title: string;
  data: Record<string, unknown>;
  actorUserId: string;
}) {
  if (!isValidContentSlug(params.slug)) {
    throw new ContentValidationFailure([
      { field: "slug", message: "Slug must be 3-80 lowercase letters, numbers, or hyphens." },
    ]);
  }
  if (!params.title || params.title.trim().length === 0) {
    throw new ContentValidationFailure([{ field: "title", message: "Title is required." }]);
  }

  const schema = await getTemplateSchemaOrThrow(params.templateId);
  const errors = validateContentData(schema, params.data);
  if (errors.length > 0) {
    throw new ContentValidationFailure(errors);
  }

  const [created] = await db
    .insert(contentPages)
    .values({
      templateId: params.templateId,
      slug: params.slug,
      title: params.title.trim(),
      data: params.data,
      status: "draft",
      createdByUserId: params.actorUserId,
    })
    .returning();

  await recordAudit(created.id, params.actorUserId, "created", { title: created.title, data: created.data });
  return created;
}

export async function updateContentPageDraft(params: {
  id: string;
  title: string;
  data: Record<string, unknown>;
  actorUserId: string;
}) {
  const existing = await getContentPageById(params.id);
  if (!existing) {
    throw new Error("Content page not found.");
  }
  if (!params.title || params.title.trim().length === 0) {
    throw new ContentValidationFailure([{ field: "title", message: "Title is required." }]);
  }

  const schema = await getTemplateSchemaOrThrow(existing.page.templateId);
  const errors = validateContentData(schema, params.data);
  if (errors.length > 0) {
    throw new ContentValidationFailure(errors);
  }

  const [updated] = await db
    .update(contentPages)
    .set({ title: params.title.trim(), data: params.data, updatedAt: new Date() })
    .where(eq(contentPages.id, params.id))
    .returning();
  if (!updated) throw new Error("Content page not found.");

  await recordAudit(updated.id, params.actorUserId, "updated", { title: updated.title, data: updated.data });
  return updated;
}

export async function publishContentPage(id: string, actorUserId: string) {
  const existing = await getContentPageById(id);
  if (!existing) throw new Error("Content page not found.");

  const [updated] = await db
    .update(contentPages)
    .set({
      status: "published",
      publishedAt: new Date(),
      publishedByUserId: actorUserId,
      updatedAt: new Date(),
    })
    .where(eq(contentPages.id, id))
    .returning();
  if (!updated) throw new Error("Content page not found.");

  await recordAudit(updated.id, actorUserId, "published", { title: updated.title });
  return updated;
}

export async function unpublishContentPage(id: string, actorUserId: string) {
  const existing = await getContentPageById(id);
  if (!existing) throw new Error("Content page not found.");

  const [updated] = await db
    .update(contentPages)
    .set({ status: "draft", updatedAt: new Date() })
    .where(eq(contentPages.id, id))
    .returning();
  if (!updated) throw new Error("Content page not found.");

  await recordAudit(updated.id, actorUserId, "unpublished", { title: updated.title });
  return updated;
}
