CREATE TABLE "deposit" (
	"id" text PRIMARY KEY NOT NULL,
	"warehouseReceiptId" text,
	"depositorId" text,
	"grossWeight" integer NOT NULL,
	"netWeight" integer NOT NULL,
	"moisture" integer NOT NULL,
	"deductions" integer NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "depositor" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"phone_number" text NOT NULL,
	"email" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dispatch" (
	"id" text PRIMARY KEY NOT NULL,
	"warehouseReceiptId" text,
	"drawDownId" text NOT NULL,
	"noOfBags" integer NOT NULL,
	"grossWeight" integer NOT NULL,
	"netWeight" integer NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "handling" (
	"id" text PRIMARY KEY NOT NULL,
	"warehouseReceiptId" text,
	"deductions" integer NOT NULL,
	"grossWeight" integer NOT NULL,
	"netWeight" integer NOT NULL,
	"noOfBags" integer NOT NULL,
	"moisture" integer,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"phone_number" text,
	"phone_number_verified" boolean,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "warehouse_receipt" (
	"id" text PRIMARY KEY NOT NULL,
	"warehouse_id" text,
	"holder" text NOT NULL,
	"commodityVariety" text NOT NULL,
	"commodityGroup" text NOT NULL,
	"commodityOutlier" text NOT NULL,
	"grade" text NOT NULL,
	"currency" text NOT NULL,
	"cropSeason" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warehouse" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deposit" ADD CONSTRAINT "deposit_warehouseReceiptId_warehouse_receipt_id_fk" FOREIGN KEY ("warehouseReceiptId") REFERENCES "public"."warehouse_receipt"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deposit" ADD CONSTRAINT "deposit_depositorId_depositor_id_fk" FOREIGN KEY ("depositorId") REFERENCES "public"."depositor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_warehouseReceiptId_warehouse_receipt_id_fk" FOREIGN KEY ("warehouseReceiptId") REFERENCES "public"."warehouse_receipt"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handling" ADD CONSTRAINT "handling_warehouseReceiptId_warehouse_receipt_id_fk" FOREIGN KEY ("warehouseReceiptId") REFERENCES "public"."warehouse_receipt"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_receipt" ADD CONSTRAINT "warehouse_receipt_warehouse_id_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouse"("id") ON DELETE no action ON UPDATE no action;