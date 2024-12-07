-- CreateTable
CREATE TABLE "public"."Posts" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);
