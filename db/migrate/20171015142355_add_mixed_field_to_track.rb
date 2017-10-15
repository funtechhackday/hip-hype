class AddMixedFieldToTrack < ActiveRecord::Migration[5.1]
  def change
    add_column :hype_tracks, :mixed, :boolean, default: false
  end
end
