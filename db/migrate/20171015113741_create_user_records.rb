class CreateUserRecords < ActiveRecord::Migration[5.1]
  def change
    create_table :user_records do |t|
      t.references :record, foreign_key: true
      t.references :hype_track, foreign_key: true
      t.string :track_string
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
