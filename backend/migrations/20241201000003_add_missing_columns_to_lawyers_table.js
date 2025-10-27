exports.up = function(knex) {
  return knex.schema.alterTable('lawyers', table => {
    table.string('username');
    table.string('city');
    table.string('state');
    table.string('country');
    table.string('mobile_number', 20);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('lawyers', table => {
    table.dropColumn('username');
    table.dropColumn('city');
    table.dropColumn('state');
    table.dropColumn('country');
    table.dropColumn('mobile_number');
  });
};
