SELECT * FROM (
            SELECT "Posts".*, u.id "user.id", u.name "user.name"
            FROM "Friends"
                    LEFT JOIN "Users"
                            ON ("Friends"."sendBy" <> :userId AND "Users".id = "Friends"."sendBy")
                                OR ("Friends"."sendTo" <> :userId AND "Users".id = "Friends"."sendTo")
                    INNER JOIN "Posts" ON "Posts"."userId" = "Users".id
                    LEFT JOIN "Users" u ON u.id = "Posts"."userId"
            WHERE "sendBy" = :userId
            OR "sendTo" = :userId
            UNION ALL
            SELECT "Posts".*,  "Users".id "user.id", "Users".name "user.name" FROM "Posts"
            LEFT JOIN "Users" on "Users".id = "Posts"."userId"
            WHERE "userId" = :userId
        ) as "t" ORDER BY t."createdAt" DESC;