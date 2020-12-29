
exports.up = function(knex) {
    return knex.schema.createTable('oauth_refresh_token', table => {
        table.increments('id')
        table.string('user_id')
        table.string('refresh_token')
        table.datetime('refresh_expiry_date')
        table.string('access_token')
        table.datetime('access_expiry_date')

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    });
  
};

exports.down = function(knex) {
    return knex.schema.dropTable('oauth_refresh_token')
  
};