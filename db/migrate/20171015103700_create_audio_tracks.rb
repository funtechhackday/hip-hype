class CreateAudioTracks < ActiveRecord::Migration[5.1]
  def change
    create_table :audio_tracks do |t|
      t.string :audio_file_id, null: false
      t.string :audio_file_filename, null: false
      t.string :audio_file_size, null: false
      t.string :audio_file_content_type, null: false
      t.integer :delay
    end
  end
end
