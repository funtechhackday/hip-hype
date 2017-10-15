class CreateUserAuthorizations < ActiveRecord::Migration[5.1]
  def change
    create_table :user_authorizations do |t|
      t.string :uid
      t.references :user, index: true, foreign_key: true
      t.string :provider

      t.timestamps null: false
    end
  end
end
