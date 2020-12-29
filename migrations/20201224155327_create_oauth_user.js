
exports.up = function(knex) {
    return knex.schema.createTable('oauth_user', table => {
        table.increments('id')
        table.string('user_id')
        table.string('name')
        table.string('email')
        table.string('location')

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))        
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('oauth_user')
};
