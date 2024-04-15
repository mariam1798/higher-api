exports.up = function (knex) {
  return knex.schema.createTable("comments", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("comment").notNullable();
    table.string("avatar");
    table.bigInteger("timestamp").notNullable();
    table
      .integer("user_id")
      .unsigned()
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .integer("video_id")
      .unsigned()
      .references("videos.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("comments");
};
