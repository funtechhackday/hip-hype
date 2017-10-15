class CreateHypeTracks < ActiveRecord::Migration[5.1]
  def change
    create_table :hype_tracks do |t|
      t.string :name
      t.text :theme

      t.timestamps
    end
  end
end
