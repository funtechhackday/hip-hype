class AddRecordReferenceToHypeTrack < ActiveRecord::Migration[5.1]
  def change
    add_reference :hype_tracks, :record, foreign_key: true
  end
end
