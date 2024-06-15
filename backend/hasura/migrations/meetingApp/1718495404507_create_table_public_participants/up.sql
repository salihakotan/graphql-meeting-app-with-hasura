CREATE TABLE "public"."participants" ("id" serial NOT NULL, "user_id" integer NOT NULL, "meeting_id" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON UPDATE restrict ON DELETE cascade, FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE cascade);
