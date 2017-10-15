class AddaudioTrackReferenceToHypeTrack < ActiveRecord::Migration[5.1]
  def change
    add_reference :hype_tracks, :audio_track, foreign_key: true
  end
end
