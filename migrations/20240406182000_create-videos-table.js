exports.up = function (knex) {
  return knex.schema.createTable("videos", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("channel");
    table.text("description");
    table.string("views");
    table.integer("likes").defaultTo(0);
    table.string("url");
    table.bigInteger("timestamp");
    table
      .integer("user_id")
      .unsigned()
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("videos");
};
